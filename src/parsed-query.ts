import {GenericMethod} from './generic-methods';
import {GenericOperator} from './generic-operator';

/**
 * Represents a mapping of generic operators to their SQL equivalents.
 */
export type FieldMap = Record<string, 1 | 0>;

/**
 * Represents a mapping of generic operators to their SQL equivalents.
 */
export type FilterCondition = {
  [key in GenericOperator]?: string | number | (string | number)[];
};

/**
 * Represents a mapping of generic operators to their SQL equivalents.
 */
export type FilterMap =
  | Record<string, FilterCondition>
  | {[GenericOperator.AND]?: FilterMap[]; [GenericOperator.OR]?: FilterMap[]};

/**
 * Represents a parsed query object used to interact with a database.
 *
 * @interface ParsedQuery
 *
 * @property {string} collection - The name of the collection/table to query.
 * @property {FilterMap} filter - The filter criteria used to match documents in the collection.
 * @property {FieldMap} [fields] - Optional. Specifies the fields to include or exclude in the result set.
 * @property {string} method - The method or operation to perform (e.g., "find", "update", "delete").
 */
export interface ParsedQuery {
  collection: string;
  filter: FilterMap;
  fields?: FieldMap;
  method: GenericMethod;
}
