import {MongoQueryAdapter, SQLAdapter, QueryTranslator} from './../src';

const translator = new QueryTranslator(
  new MongoQueryAdapter(),
  new SQLAdapter()
);

describe('QueryTranslator', () => {
  describe('Mongo to SQL translation', () => {
    // happy path
    it('should translate simple equality', () => {
      const result = translator.translate("db.user.find({name: 'john'});");
      expect(result).toBe("SELECT * FROM user WHERE name = 'john';");
    });

    it('should translate with projection', () => {
      const result = translator.translate(
        'db.user.find({_id: 23113},{name: 1, age: 1});'
      );
      expect(result).toBe('SELECT name, age FROM user WHERE _id = 23113;');
    });

    it('should translate comparison operators', () => {
      const result = translator.translate(
        'db.user.find({age: {$gte: 21}},{name: 1, _id: 1});'
      );
      expect(result).toBe('SELECT name, _id FROM user WHERE age >= 21;');
    });

    it('should translate $or operator', () => {
      const result = translator.translate(
        "db.user.find({$or: [{age: {$gte: 21}}, {name: 'john'}]});"
      );
      expect(result).toBe(
        "SELECT * FROM user WHERE (age >= 21 OR name = 'john');"
      );
    });

    it('should translate $in operator', () => {
      const result = translator.translate(
        'db.user.find({age: {$in: [18, 21, 25]}});'
      );
      expect(result).toBe('SELECT * FROM user WHERE age IN (18, 21, 25);');
    });
    it('should translate $and operator', () => {
      const result = translator.translate(
        "db.user.find({$and: [{age: {$gte: 21}}, {name: 'john'}]});"
      );
      expect(result).toBe(
        "SELECT * FROM user WHERE (age >= 21 AND name = 'john');"
      );
    });
    it('should translate $ne operator', () => {
      const result = translator.translate(
        "db.user.find({name: {$ne: 'john'}});"
      );
      expect(result).toBe("SELECT * FROM user WHERE name != 'john';");
    });
    it('should translate $lt operator', () => {
      const result = translator.translate('db.user.find({age: {$lt: 21}});');
      expect(result).toBe('SELECT * FROM user WHERE age < 21;');
    });
    it('should translate $lte operator', () => {
      const result = translator.translate('db.user.find({age: {$lte: 21}});');
      expect(result).toBe('SELECT * FROM user WHERE age <= 21;');
    });
    it('should translate $gt operator', () => {
      const result = translator.translate('db.user.find({age: {$gt: 21}});');
      expect(result).toBe('SELECT * FROM user WHERE age > 21;');
    });
    it('should translate $gte operator', () => {
      const result = translator.translate('db.user.find({age: {$gte: 21}});');
      expect(result).toBe('SELECT * FROM user WHERE age >= 21;');
    });
    it('should translate all fields', () => {
      const result = translator.translate('db.user.find({});');
      expect(result).toBe('SELECT * FROM user;');
    });
    // multiple conditions
    it('should translate multiple conditions', () => {
      const result = translator.translate(
        "db.user.find({name: 'john', age: {$gte: 21}});"
      );
      expect(result).toBe(
        "SELECT * FROM user WHERE name = 'john' AND age >= 21;"
      );
    });
    it('should translate multiple conditions with $or', () => {
      const result = translator.translate(
        "db.user.find({$or: [{name: 'john'}, {age: {$gte: 21}}]});"
      );
      expect(result).toBe(
        "SELECT * FROM user WHERE (name = 'john' OR age >= 21);"
      );
    });
    it('should translate multiple conditions with $and', () => {
      const result = translator.translate(
        "db.user.find({$and: [{name: 'john'}, {age: {$gte: 21}}]});"
      );
      expect(result).toBe(
        "SELECT * FROM user WHERE (name = 'john' AND age >= 21);"
      );
    });
    it('should translate multiple conditions with $and and $or', () => {
      const result = translator.translate(
        "db.user.find({$or: [{age: {$gte: 21}}, {name: 'john'}], $and: [{age: {$lt: 30}}, {city: 'New York'}]});"
      );
      expect(result).toBe(
        "SELECT * FROM user WHERE (age < 30 AND city = 'New York') AND (age >= 21 OR name = 'john');"
      );
    });
    // errors
    it('should throw error for unsupported method', () => {
      expect(() => {
        translator.translate("db.user.update({name: 'john'});");
      }).toThrow('Unsupported MongoDB method: update');
    });
    it('should throw error for invalid query format', () => {
      expect(() => {
        translator.translate("db.user.find({name: 'john'}");
      }).toThrow('Invalid query format');
    });
    it('should throw error for invalid query format', () => {
      expect(() => {
        translator.translate("db.user.find({name: 'john'}");
      }).toThrow('Invalid query format');
    });
  });
});
