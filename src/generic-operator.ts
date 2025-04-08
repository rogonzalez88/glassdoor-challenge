/**
 * Enumeration representing generic operators that can be used for comparisons
 * and logical operations in various contexts.
 *
 * @enum {string}
 * @property {string} EQ - Represents the equality operator ("equal to").
 * @property {string} NE - Represents the inequality operator ("not equal to").
 * @property {string} GT - Represents the greater than operator.
 * @property {string} GTE - Represents the greater than or equal to operator.
 * @property {string} LT - Represents the less than operator.
 * @property {string} LTE - Represents the less than or equal to operator.
 * @property {string} IN - Represents the inclusion operator (e.g., "in" a list or set).
 * @property {string} AND - Represents the logical AND operator.
 * @property {string} OR - Represents the logical OR operator.
 */
export enum GenericOperator {
  EQ = 'EQ',
  NE = 'NE',
  GT = 'GT',
  GTE = 'GTE',
  LT = 'LT',
  LTE = 'LTE',
  IN = 'IN',
  AND = 'AND',
  OR = 'OR'
}

export type OperatorMap = Record<GenericOperator, string>;
