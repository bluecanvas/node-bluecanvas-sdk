
# Class: ArchivesClient

## Hierarchy

* **ArchivesClient**

## Index

### Methods

* [getTarGzipBlob](_client_.archivesclient.md#gettargzipblob)

## Methods

###  getTarGzipBlob

▸ **getTarGzipBlob**(`__namedParameters`: object): *Promise‹[ArchivesGetTarGzipBlobResponse](../interfaces/_types_requests_.archivesgettargzipblobresponse.md)›*

*Defined in [client.ts:182](https://github.com/bluecanvas/node-bluecanvas-sdk/blob/6e3a4c7/src/client.ts#L182)*

Fetches a repository snapshot for the specified git revision as a gzipped tarball.

**`see`** https://docs.bluecanvas.io/reference/checks-api#get-archive

**Parameters:**

▪ **__namedParameters**: *object*

Name | Type |
------ | ------ |
`revision` | string |

**Returns:** *Promise‹[ArchivesGetTarGzipBlobResponse](../interfaces/_types_requests_.archivesgettargzipblobresponse.md)›*
