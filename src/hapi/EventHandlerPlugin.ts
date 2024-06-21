import util from "util";
import MessageValidator from "sns-validator";
import Joi from "@hapi/joi";
import Wreck from "@hapi/wreck";
import * as Boom from "@hapi/boom";
import * as Hoek from "@hapi/hoek";
import {
  Lifecycle,
  Request,
  ResponseToolkit,
  Server,
  ServerRoute,
} from "@hapi/hapi";

import { BLUECANVAS_AWS_ACCOUNTS } from "../utils";
import { NotificationMessage } from "../types";

interface Options {
  /**
   * Required. The Blue Canvas tenant ID.
   * For example `"td25c036d-6c12-4d17-aac6-c87babcaf8bf"`.
   */
  tenantId: string | string[];

  /**
   * Overrides for the default route configuration. (default: `{ path: '/'}`)
   */
  route?: Partial<ServerRoute>;

  /**
   * Required. A handler function for event notifications.
   */
  onNotification: NotificationHandler;

  /**
   * An optional handler function for subscription confirmation requests.
   * If empty, subscriptions are confirmed automatically.
   */
  onSubscriptionConfirmation?: SubscriptionConfirmationHandler;

  /**
   * Disables the automatic processing of `SubscriptionConfirmation`
   * messages. If true, the URL will be logged to console instead.
   */
  disableSubscriptionConfirmation?: boolean;

  /**
   * The number of seconds after which a late notification message is
   * rejected. Late messages may appear due to redelivery attempts. Large
   * delays are a sign of outdated messages that can contain outdated
   * information. (default: `3600`)
   */
  maxMessageDelaySeconds?: number;

  /**
   * For debugging only. Disables the cryptographic and logical validation
   * of the message payloads. This option disables important security checks.
   * @internal
   */
  UNSAFE_disableMessageValidation?: boolean;
}

type SubscriptionConfirmationHandler = (
  request: Request,
  h: ResponseToolkit,
  payload?: object
) => Lifecycle.ReturnValue;

type NotificationHandler = (
  request: Request,
  h: ResponseToolkit,
  message: NotificationMessage,
  payload?: object
) => Lifecycle.ReturnValue;

const schema = Joi.object({
  tenantId: Joi.alt([Joi.string(), Joi.array().items(Joi.string())]).required(),
  route: Joi.object().optional(),
  onNotification: Joi.func().required(),
  onSubscriptionConfirmation: Joi.func().optional(),
  disableSubscriptionConfirmation: Joi.boolean().default(false).optional(),
  maxMessageDelaySeconds: Joi.number().default(3600).optional(),
  UNSAFE_disableMessageValidation: Joi.boolean().default(false).optional(),
});

const snsValidator = new MessageValidator();
const snsValidate: (hash: string | object) => Promise<object> = util
  .promisify(snsValidator.validate)
  .bind(snsValidator);

/**
 * @deprecated You are no longer able to configure SNS webhooks in Blue Canvas. Please use WebhookEventHandlerPlugin instead.
 */
class EventHandlerPlugin {
  private options: Options;

  private constructor(options: Options) {
    this.options = options;
  }

  static async register(server: Server, options: Options) {
    const results = schema.validate(options);
    const config: Options = results.value;

    if (results.error) {
      throw new Error(
        `Invalid EventHandlerPlugin options: ${results.error.message}`
      );
    }

    const plugin = new EventHandlerPlugin(config);
    const route: ServerRoute = Hoek.applyToDefaults<ServerRoute>(
      {
        method: "POST",
        path: "/",
        options: {
          auth: false,
          payload: {
            override: "application/json",
            parse: true,
          },
        },
        handler: plugin.handle,
      },
      config.route || {},
      { nullOverride: false }
    ) as ServerRoute;

    server.route(route);
  }

  handle = async (
    request: Request,
    h: ResponseToolkit
  ): Promise<Lifecycle.ReturnValue> => {
    if (!request.payload) {
      throw Boom.badRequest("Empty request payload");
    }

    const payload: any = request.payload;

    if (!this.options.UNSAFE_disableMessageValidation) {
      await this.validateSignature(payload);
      this.validateTimestamp(payload);
      this.validateTopic(payload);
    }

    switch (payload["Type"]) {
      case "SubscriptionConfirmation":
        return this.handleSubscriptionConfirmation(request, h, payload);
      case "Notification":
        return this.handleNotification(request, h, payload);
      default:
        throw Boom.badImplementation("Unexpected payload.Type");
    }
  };

  private handleSubscriptionConfirmation = async (
    request: Request,
    h: ResponseToolkit,
    payload: object
  ): Promise<Lifecycle.ReturnValue> => {
    if (this.options.onSubscriptionConfirmation) {
      return this.options.onSubscriptionConfirmation(request, h, payload);
    }

    if (this.options.disableSubscriptionConfirmation) {
      console.log(
        "Visit this URL to confirm the subscription: %s",
        payload["SubscribeURL"]
      );
      return;
    }

    try {
      await Wreck.get(payload["SubscribeURL"]);
    } catch (error) {
      throw Boom.badGateway(
        `Failed to confirm subscription for '${payload["TopicArn"]}':` +
          ` ${error.message}`
      );
    }

    request.log("info", `Subscription confirmed for "${payload["TopicArn"]}"`);

    return h.response().code(200);
  };

  private handleNotification = (
    request: Request,
    h: ResponseToolkit,
    payload: object
  ): Lifecycle.ReturnValue => {
    let message: NotificationMessage;

    try {
      message = JSON.parse(payload["Message"]);
    } catch (error) {
      return Boom.badRequest(`Malformed payload.Message: ${error.message}`);
    }

    return this.options.onNotification(request, h, message, payload);
  };

  private async validateSignature(payload: object) {
    try {
      await snsValidate(payload);
    } catch (err) {
      throw Boom.badRequest(err.message);
    }
  }

  private validateTimestamp(payload: object) {
    const now = new Date();
    const timestamp = new Date(payload["Timestamp"]);
    const delay = Math.round((now.getTime() - timestamp.getTime()) / 1000);

    if (delay > this.options.maxMessageDelaySeconds) {
      throw Boom.badRequest(
        `The message age of ${delay} seconds exceeds` +
          ` maxMessageDelaySeconds of ${this.options.maxMessageDelaySeconds}` +
          ` seconds.`
      );
    }
  }

  private validateTopic(payload: object) {
    const parts = payload["TopicArn"].split(":");
    const sourceAccountId = parts[4];
    const topic = parts[5];

    if (!this.isKnownAWSAccount(sourceAccountId)) {
      throw Boom.badRequest(
        "Message was sent from an unrecognized AWS account"
      );
    }

    if (!this.isTenantTopic(topic)) {
      throw Boom.badRequest(
        `Message was sent for '${topic}' but this server is` +
          ` configured for '${this.options.tenantId}'.`
      );
    }
  }

  private isKnownAWSAccount(sourceAccountId: string): boolean {
    return BLUECANVAS_AWS_ACCOUNTS.includes(sourceAccountId);
  }

  private isTenantTopic(topicName: string): boolean {
    if (Array.isArray(this.options.tenantId)) {
      return this.options.tenantId.includes(topicName);
    } else {
      return topicName === this.options.tenantId;
    }
  }
}

export default {
  name: "@bluecanvas/sdk/hapi/EventHandler",
  register: EventHandlerPlugin.register,
};
