import {GenericMethod} from '../generic-methods';
import {GenericOperator, OperatorMap} from '../generic-operator';
import {FilterCondition, FilterMap, ParsedQuery} from '../parsed-query';
import {QueryAdapter} from '../query-adapter';

/**
 * MongoQueryAdapter is a class that implements the QueryAdapter interface.
 * It is responsible for parsing and translating MongoDB queries into a format
 * that can be understood by other query languages, such as SQL.
 */
export class MongoQueryAdapter implements QueryAdapter {
  private operatorMap: OperatorMap = {
    [GenericOperator.EQ]: '',
    [GenericOperator.NE]: '$ne',
    [GenericOperator.GT]: '$gt',
    [GenericOperator.GTE]: '$gte',
    [GenericOperator.LT]: '$lt',
    [GenericOperator.LTE]: '$lte',
    [GenericOperator.IN]: '$in',
    [GenericOperator.AND]: '$and',
    [GenericOperator.OR]: '$or'
  };

  /**
   * Parses a MongoDB query string and extracts the collection name, method,
   * filter, and projection.
   *
   * @param {string} query - The MongoDB query string to parse.
   * @returns {ParsedQuery} - An object containing the parsed components of the query.
   */
  parse(query: string): ParsedQuery {
    const match = query.match(/^db\.(\w+)\.(\w+)\((.*)\);?$/);
    if (!match) throw new Error('Invalid query format');

    const [, collection, methodRaw, args] = match;
    const parts = this.splitArguments(args);

    const rawFilter = parts[0] ? eval('(' + parts[0] + ')') : {};
    const projection = parts[1] ? eval('(' + parts[1] + ')') : undefined;

    const filter = this.convertToGenericOperators(rawFilter);

    return {
      collection,
      method: this.mapMethod(methodRaw),
      filter,
      fields: projection
    };
  }

  /**
   * Translates a parsed MongoDB query into a generic format.
   *
   * @param {ParsedQuery} parsed - The parsed MongoDB query.
   * @returns {string} - The translated query string in the target format.
   */
  translate(parsed: ParsedQuery): string {
    throw new Error('Translation from MongoDB to generic not implemented yet.');
  }

  /**
   * Maps MongoDB methods to generic methods.
   *
   * @param {string} method - The MongoDB method to map.
   * @returns {GenericMethod} - The mapped generic method.
   */
  private mapMethod(method: string): GenericMethod {
    switch (method.toLowerCase()) {
      case 'find':
        return GenericMethod.FIND;
      default:
        throw new Error(`Unsupported MongoDB method: ${method}`);
    }
  }

  /**
   * Splits the arguments string into an array of arguments.
   *
   * @param {string} args - The arguments string to split.
   * @returns {string[]} - An array of arguments.
   */
  private splitArguments(args: string): string[] {
    let depth = 0;
    let current = '';
    const result: string[] = [];

    for (let char of args) {
      if (char === ',' && depth === 0) {
        result.push(current.trim());
        current = '';
      } else {
        if (char === '{') depth++;
        if (char === '}') depth--;
        current += char;
      }
    }

    if (current) result.push(current.trim());
    return result;
  }

  /**
   * Converts MongoDB-specific operators to generic operators.
   *
   * @param {unknown} filter - The filter object to convert.
   * @returns {FilterMap} - The converted filter object with generic operators.
   */
  private convertToGenericOperators(filter: unknown): FilterMap {
    if (Array.isArray(filter)) {
      return filter.map(f => this.convertToGenericOperators(f)) as FilterMap;
    } else if (typeof filter === 'object' && filter !== null) {
      return Object.entries(filter).reduce((acc, [key, value]) => {
        if (key === '$and') {
          acc[GenericOperator.AND] = this.convertToGenericOperators(
            value
          ) as FilterMap[];
        } else if (key === '$or') {
          acc[GenericOperator.OR] = this.convertToGenericOperators(
            value
          ) as FilterMap[];
        } else if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value)
        ) {
          (acc as Record<string, FilterCondition>)[key] = Object.entries(
            value
          ).reduce((innerAcc, [op, val]) => {
            const genericKey =
              (Object.entries(this.operatorMap).find(
                ([, v]) => v === op
              )?.[0] as GenericOperator) ?? GenericOperator.EQ;
            innerAcc[genericKey] = val as
              | string
              | number
              | (string | number)[]
              | undefined;
            return innerAcc;
          }, {} as FilterCondition);
        } else {
          (acc as Record<string, FilterCondition>)[key] = {
            [GenericOperator.EQ]: value
          };
        }
        return acc;
      }, {} as FilterMap);
    } else {
      return filter as FilterMap;
    }
  }
}
