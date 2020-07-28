
# Interface: Options

## Hierarchy

* **Options**

## Index

### Properties

* [disableSubscriptionConfirmation](_hapi_eventhandlerplugin_.options.md#optional-disablesubscriptionconfirmation)
* [maxMessageDelaySeconds](_hapi_eventhandlerplugin_.options.md#optional-maxmessagedelayseconds)
* [onNotification](_hapi_eventhandlerplugin_.options.md#onnotification)
* [onSubscriptionConfirmation](_hapi_eventhandlerplugin_.options.md#optional-onsubscriptionconfirmation)
* [route](_hapi_eventhandlerplugin_.options.md#optional-route)
* [tenantId](_hapi_eventhandlerplugin_.options.md#tenantid)

## Properties

### `Optional` disableSubscriptionConfirmation

• **disableSubscriptionConfirmation**? : *boolean*

*Defined in [hapi/EventHandlerPlugin.ts:45](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L45)*

Disables the automatic processing of `SubscriptionConfirmation`
messages. If true, the URL will be logged to console instead.

___

### `Optional` maxMessageDelaySeconds

• **maxMessageDelaySeconds**? : *number*

*Defined in [hapi/EventHandlerPlugin.ts:53](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L53)*

The number of seconds after which a late notification message is
rejected. Late messages may appear due to redelivery attempts. Large
delays are a sign of outdated messages that can contain outdated
information. (default: `3600`)

___

###  onNotification

• **onNotification**: *[NotificationHandler](../modules/_hapi_eventhandlerplugin_.md#notificationhandler)*

*Defined in [hapi/EventHandlerPlugin.ts:33](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L33)*

Required. A handler function for event notifications.

___

### `Optional` onSubscriptionConfirmation

• **onSubscriptionConfirmation**? : *[SubscriptionConfirmationHandler](../modules/_hapi_eventhandlerplugin_.md#subscriptionconfirmationhandler)*

*Defined in [hapi/EventHandlerPlugin.ts:39](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L39)*

An optional handler function for subscription confirmation requests.
If empty, subscriptions are confirmed automatically.

___

### `Optional` route

• **route**? : *Partial‹ServerRoute›*

*Defined in [hapi/EventHandlerPlugin.ts:28](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L28)*

Overrides for the default route configuration. (default: `{ path: '/'}`)

___

###  tenantId

• **tenantId**: *string | string[]*

*Defined in [hapi/EventHandlerPlugin.ts:23](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/hapi/EventHandlerPlugin.ts#L23)*

Required. The Blue Canvas tenant ID.
For example `"td25c036d-6c12-4d17-aac6-c87babcaf8bf"`.
