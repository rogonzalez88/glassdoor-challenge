import {QueryAdapter} from './query-adapter';

/**
 * QueryTranslator is a class that translates queries between different query languages.
 * It uses two adapters: one for the source query language and one for the target query language.
 *
 * @class QueryTranslator
 *
 * @property {QueryAdapter} sourceAdapter - The adapter for the source query language.
 * @property {QueryAdapter} outputAdapter - The adapter for the target query language.
 */
export class QueryTranslator {
  /**
   * Creates an instance of QueryTranslator.
   *
   * @param {QueryAdapter} sourceAdapter - The adapter for the source query language.
   * @param {QueryAdapter} outputAdapter - The adapter for the target query language.
   */
  constructor(
    private sourceAdapter: QueryAdapter,
    private outputAdapter: QueryAdapter
  ) {}

  /**
   * Translates a query string from the source query language to the target query language.
   *
   * @param {string} query - The query string to translate.
   * @returns {string} - The translated query string.
   *
   * @example
   * const translator = new QueryTranslator(sourceAdapter, outputAdapter);
   * const translatedQuery = translator.translate("SELECT * FROM users WHERE age > 30");
   * console.log(translatedQuery); // Outputs the translated query string in the target language.
   */
  translate(query: string): string {
    const parsed = this.sourceAdapter.parse(query);
    return this.outputAdapter.translate(parsed);
  }
}
