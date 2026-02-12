[**@bluecanvas/sdk**](../README.md)

***

# Type Alias: DeploymentPhase

> **DeploymentPhase** = `"DRAFT"` \| `"NEW"` \| `"PLAN"` \| `"ADVICE"` \| `"CONFLICT"` \| `"VALIDATE"` \| `"APPLY"` \| `"RECONCILE"` \| `"CHECKLIST"` \| `"DONE"`

Defined in: [types/schema.ts:21](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/a5143205c4697be457571a9c87cb9ff311457b58/src/types/schema.ts#L21)

Phases describe the progressive steps of a deploy request. An earlier
phase must succeed for the run to progress to the next phase.
