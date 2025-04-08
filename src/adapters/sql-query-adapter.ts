import {GenericOperator, OperatorMap} from '../generic-operator';
import {GenericMethod} from '../generic-methods';
import {QueryAdapter} from '../query-adapter';
import {FilterCondition, FilterMap, ParsedQuery} from '../parsed-query';

/**
 * SQLAdapter is a class that implements the QueryAdapter interface.
 * It is responsible for parsing and translating SQL queries into a format
 * that can be understood by other query languages, such as MongoDB.
 */
export class SQLAdapter implements QueryAdapter {
  private operatorMap: OperatorMap = {
    [GenericOperator.EQ]: '=',
    [GenericOperator.NE]: '!=',
    [GenericOperator.GT]: '>',
    [GenericOperator.GTE]: '>=',
    [GenericOperator.LT]: '<',
    [GenericOperator.LTE]: '<=',
    [GenericOperator.IN]: 'IN',
    [GenericOperator.AND]: 'AND',
    [GenericOperator.OR]: 'OR'
  };

  /**
   * Parses a SQL query string and extracts the collection name, method,
   * filter, and projection.
   *
   * @param {string} query - The SQL query string to parse.
   * @returns {ParsedQuery} - An object containing the parsed components of the query.
   */
  parse(query: string): ParsedQuery {
    throw new Error('Parsing SQL to generic not implemented yet.');
  }

  /**
   * Translates a parsed SQL query into a generic format.
   *
   * @param {ParsedQuery} parsed - The parsed SQL query.
   * @returns {string} - The translated query string in the target format.
   */
  translate(parsed: ParsedQuery): string {
    if (parsed.method !== GenericMethod.FIND) {
      throw new Error("Only 'find' method is supported.");
    }

    const fields = parsed.fields ? Object.keys(parsed.fields).join(', ') : '*';
    const table = parsed.collection;
    const whereClause = this.buildWhere(parsed.filter);
    return `SELECT ${fields} FROM ${table}${whereClause ? ' WHERE ' + whereClause : ''};`;
  }

  /**
   * Converts a MongoDB filter object to a generic SQL WHERE clause.
   *
   * @param {FilterMap} filter - The MongoDB filter object.
   * @returns {string} - The SQL WHERE clause.
   */
  private buildWhere(filter: FilterMap): string {
    if (GenericOperator.AND in filter || GenericOperator.OR in filter) {
      const expressions: string[] = [];

      if (GenericOperator.AND in filter) {
        const andConditions = (filter as FilterMap[])[
          GenericOperator.AND as keyof FilterMap as unknown as number
        ] as FilterMap[];
        const andExpr = andConditions
          .map(cond => this.buildWhere(cond))
          .filter(Boolean);
        if (andExpr.length) expressions.push(`(${andExpr.join(' AND ')})`);
      }

      if (GenericOperator.OR in filter) {
        const orConditions = (filter[GenericOperator.OR] as FilterMap[]) || [];
        const orExpr = orConditions
          .map(cond => this.buildWhere(cond))
          .filter(Boolean);
        if (orExpr.length) expressions.push(`(${orExpr.join(' OR ')})`);
      }

      return expressions.join(' AND ');
    }

    return Object.entries(filter)
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const parts = Object.entries(value as FilterCondition).map(
            ([op, val]) => {
              const sqlOp = this.operatorMap[op as GenericOperator];
              const formattedVal = Array.isArray(val)
                ? `(${val.map(v => (typeof v === 'number' ? v : `'${v}'`)).join(', ')})`
                : typeof val === 'number'
                  ? val
                  : `'${val}'`;
              return `${key} ${sqlOp} ${formattedVal}`;
            }
          );
          return parts.length > 1 ? `(${parts.join(' AND ')})` : parts[0];
        } else {
          const formattedVal = typeof value === 'number' ? value : `'${value}'`;
          return `${key} = ${formattedVal}`;
        }
      })
      .join(' AND ');
  }
}
