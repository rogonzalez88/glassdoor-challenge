/**
 * Enum representing generic methods for data operations.
 *
 * @enum {string}
 * @property {string} FIND - Represents a find operation.
 * @property {string} UPDATE - Represents an update operation.
 * @property {string} INSERT - Represents an insert operation.
 * @property {string} DELETE - Represents a delete operation.
 */
export enum GenericMethod {
  FIND = 'FIND',
  UPDATE = 'UPDATE',
  INSERT = 'INSERT',
  DELETE = 'DELETE'
}

export type MethodMap = Record<string, GenericMethod>;
