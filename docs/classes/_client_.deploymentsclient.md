
# Class: DeploymentsClient

## Hierarchy

* **DeploymentsClient**

## Index

### Methods

* [putCheck](_client_.deploymentsclient.md#putcheck)

## Methods

###  putCheck

▸ **putCheck**(`__namedParameters`: object): *Promise‹[DeploymentsPutCheckResponse](../interfaces/_types_requests_.deploymentsputcheckresponse.md)›*

*Defined in [client.ts:162](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/client.ts#L162)*

Creates or updates the status of a check for a given deployment by its
canonical check name. The first time you invoke this action, a new
record for the check is created and will appear in the interface.
Successive calls to this action update the state of that record. This
allows you to update the status of a check as it progresses in your
external system.

**`see`** https://docs.bluecanvas.io/reference/checks-api#put-checks

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`check` | [DeploymentCheck](../interfaces/_types_schema_.deploymentcheck.md) |
`deploymentNumber` | number |
`name` | string |

**Returns:** *Promise‹[DeploymentsPutCheckResponse](../interfaces/_types_requests_.deploymentsputcheckresponse.md)›*
