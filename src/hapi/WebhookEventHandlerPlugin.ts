import Joi from "@hapi/joi";
import * as Boom from "@hapi/boom";
import * as Hoek from "@hapi/hoek";
import {
  Lifecycle,
  Request,
  ResponseToolkit,
  Server,
  ServerRoute,
} from "@hapi/hapi";

import { verifyHMac } from "../utils";
import { NotificationMessage } from "../types";

interface Options {
  /**
   * Webhook secret obtained from the settings in Blue Canvas.
   */
  webhookSecret: string;

  /**
   * Overrides for the default route configuration. (default: `{ path: '/'}`)
   */
  route?: Partial<ServerRoute>;

  /**
   * Required. A handler function for event notifications.
   */
  onNotification: NotificationHandler;

  /**
   * For debugging only. Disables the cryptographic and logical validation
   * of the message payloads. This option disables important security checks.
   * @internal
   */
  UNSAFE_disableMessageValidation?: boolean;
}

type NotificationHandler = (
  request: Request,
  h: ResponseToolkit,
  message: NotificationMessage,
) => Lifecycle.ReturnValue;

const schema = Joi.object({
  webhookSecret: Joi.string().required(),
  route: Joi.object().optional(),
  onNotification: Joi.func().required(),
  UNSAFE_disableMessageValidation: Joi.boolean().default(false).optional(),
});

class WebhookEventHandlerPlugin {
  private options: Options;

  private constructor(options: Options) {
    this.options = options;
  }

  static async register(server: Server, options: Options) {
    const results = schema.validate(options);
    const config: Options = results.value;

    if (results.error) {
      throw new Error(
        `Invalid WebhookEventHandlerPlugin options: ${results.error.message}`,
      );
    }

    const plugin = new WebhookEventHandlerPlugin(config);
    const route: ServerRoute = Hoek.applyToDefaults<ServerRoute>(
      {
        method: "POST",
        path: "/",
        options: {
          auth: false,
          payload: {
            output: "data",
            parse: false,
          },
        },
        handler: plugin.handle,
      },
      config.route || {},
      { nullOverride: false },
    ) as ServerRoute;

    server.route(route);
  }

  handle = async (
    request: Request,
    h: ResponseToolkit,
  ): Promise<Lifecycle.ReturnValue> => {
    if (!request.payload) {
      throw Boom.badRequest("Empty request payload");
    }

    if (!this.options.UNSAFE_disableMessageValidation) {
      this.validateSignature(request);
    }

    return this.handleNotification(request, h);
  };

  private handleNotification = (
    request: Request,
    h: ResponseToolkit,
  ): Lifecycle.ReturnValue => {
    let message: NotificationMessage;

    try {
      message = JSON.parse(request.payload.toString("utf-8"));
    } catch (error) {
      return Boom.badRequest(`Malformed body: ${error.message}`);
    }

    switch (message["Type"]) {
      case "Notification":
        return this.options.onNotification(request, h, message);
      default:
        throw Boom.badImplementation("Unexpected Type");
    }
  };

  private validateSignature(request: Request) {
    if (
      !(request.payload instanceof Buffer) &&
      typeof request.payload !== "string"
    ) {
      throw Boom.serverUnavailable("Misconfigured route, needs to be unparsed");
    }

    if (
      !verifyHMac(
        this.options.webhookSecret,
        request.payload,
        request.headers["x-bluecanvas-signature-hs256"],
      )
    ) {
      throw Boom.badRequest("Invalid request signature");
    }
  }
}

export default {
  name: "@bluecanvas/sdk/hapi/WebhookEventHandler",
  register: WebhookEventHandlerPlugin.register,
};
