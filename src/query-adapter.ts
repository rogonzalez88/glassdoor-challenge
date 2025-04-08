import {ParsedQuery} from './parsed-query';

/**
 * Interface for a query adapter that can parse and translate queries.
 *
 * @interface QueryAdapter
 *
 * @property {function} parse - Parses a query string into a parsed query object.
 * @property {function} translate - Translates a parsed query object back into a query string.
 */
export interface QueryAdapter {
  parse(query: string): ParsedQuery;
  translate(parsed: ParsedQuery): string;
}
