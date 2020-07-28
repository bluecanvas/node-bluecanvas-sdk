
# Module: "hapi/EventHandlerPlugin"

## Index

### Classes

* [EventHandlerPlugin](../classes/_hapi_eventhandlerplugin_.eventhandlerplugin.md)

### Interfaces

* [Options](../interfaces/_hapi_eventhandlerplugin_.options.md)

### Type aliases

* [NotificationHandler](_hapi_eventhandlerplugin_.md#notificationhandler)
* [SubscriptionConfirmationHandler](_hapi_eventhandlerplugin_.md#subscriptionconfirmationhandler)

### Variables

* [schema](_hapi_eventhandlerplugin_.md#const-schema)
* [snsValidate](_hapi_eventhandlerplugin_.md#const-snsvalidate)
* [snsValidator](_hapi_eventhandlerplugin_.md#const-snsvalidator)

## Type aliases

###  NotificationHandler

Ƭ **NotificationHandler**: *function*

*Defined in [hapi/EventHandlerPlugin.ts:69](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L69)*

#### Type declaration:

▸ (`request`: Request, `h`: ResponseToolkit, `message`: [NotificationMessage](_types_notifications_.md#notificationmessage), `payload?`: object): *Lifecycle.ReturnValue*

**Parameters:**

Name | Type |
------ | ------ |
`request` | Request |
`h` | ResponseToolkit |
`message` | [NotificationMessage](_types_notifications_.md#notificationmessage) |
`payload?` | object |

___

###  SubscriptionConfirmationHandler

Ƭ **SubscriptionConfirmationHandler**: *function*

*Defined in [hapi/EventHandlerPlugin.ts:63](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L63)*

#### Type declaration:

▸ (`request`: Request, `h`: ResponseToolkit, `payload?`: object): *Lifecycle.ReturnValue*

**Parameters:**

Name | Type |
------ | ------ |
`request` | Request |
`h` | ResponseToolkit |
`payload?` | object |

## Variables

### `Const` schema

• **schema**: *ObjectSchema‹any›* = Joi.object({
  tenantId: Joi
    .alt([Joi.string(), Joi.array().items(Joi.string())])
    .required(),
  route: Joi
    .object()
    .optional(),
  onNotification: Joi
    .func()
    .required(),
  onSubscriptionConfirmation: Joi
    .func()
    .optional(),
  disableSubscriptionConfirmation: Joi
    .boolean()
    .default(false)
    .optional(),
  maxMessageDelaySeconds: Joi
    .number()
    .default(3600)
    .optional(),
  UNSAFE_disableMessageValidation: Joi
    .boolean()
    .default(false)
    .optional(),
})

*Defined in [hapi/EventHandlerPlugin.ts:76](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L76)*

___

### `Const` snsValidate

• **snsValidate**: *function* = util.promisify(snsValidator.validate).bind(snsValidator)

*Defined in [hapi/EventHandlerPlugin.ts:104](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L104)*

#### Type declaration:

▸ (`hash`: string | object): *Promise‹object›*

**Parameters:**

Name | Type |
------ | ------ |
`hash` | string &#124; object |

___

### `Const` snsValidator

• **snsValidator**: *MessageValidator‹›* = new MessageValidator()

*Defined in [hapi/EventHandlerPlugin.ts:103](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L103)*
