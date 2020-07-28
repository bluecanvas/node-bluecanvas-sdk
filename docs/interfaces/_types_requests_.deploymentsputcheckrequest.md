
# Interface: DeploymentsPutCheckRequest

## Hierarchy

* **DeploymentsPutCheckRequest**

## Index

### Properties

* [check](_types_requests_.deploymentsputcheckrequest.md#check)
* [deploymentNumber](_types_requests_.deploymentsputcheckrequest.md#deploymentnumber)
* [name](_types_requests_.deploymentsputcheckrequest.md#name)

## Properties

###  check

• **check**: *[DeploymentCheck](_types_schema_.deploymentcheck.md)*

*Defined in [types/requests.ts:19](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/types/requests.ts#L19)*

The properties of the check.

___

###  deploymentNumber

• **deploymentNumber**: *number*

*Defined in [types/requests.ts:8](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/types/requests.ts#L8)*

The numeric identifier of the Deployment Request for which you are
updating the check.

___

###  name

• **name**: *string*

*Defined in [types/requests.ts:14](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/types/requests.ts#L14)*

The canonical identifier of the status check, for example
`"code-coverage"`.
