# MongoDB to SQL Query Translator

A TypeScript-based query translator that converts MongoDB queries into SQL (and vice versa in future versions) using a **generic intermediate representation**. It leverages an adapter pattern to support extensibility and separation of concerns.

---

## 🔧 Features

- Parses MongoDB queries into a generic format.
- Translates generic queries to SQL syntax.
- Supports logical and comparison operators.
- Built with extensibility in mind (e.g., PostgreSQL, MySQL, etc.).
- Jest unit tests for coverage.

---

## 🏗️ Architecture

**Core Components**:

- `GenericOperator`: Enum defining abstracted operators (e.g., `EQ`, `GT`, `IN`).
- `GenericMethod`: Enum for supported methods (`FIND`, `UPDATE`, etc.).
- `QueryAdapter`: Interface that adapters must implement (`parse` & `translate`).
- `ParsedQuery`: Intermediate format used to standardize query structure.
- `MongoQueryAdapter`: Converts MongoDB queries to/from the generic format.
- `SQLAdapter`: Converts the generic format into SQL queries.
- `QueryTranslator`: Bridges source and output adapters for translation.

---

## 🧪 Example

```ts
const translator = new QueryTranslator(
  new MongoQueryAdapter(),
  new SQLAdapter()
);

const result = translator.translate(
  "db.user.find({$or: [{age: {$gte: 21}}, {name: 'john'}], $and: [{age: {$lt: 30}}, {city: 'New York'}]});"
);

console.log(result);
// SELECT * FROM user WHERE ((age >= '21') OR (name = 'john')) AND ((age < '30') AND (city = 'New York'));
```

---

## ✍️ Supported Operators

| MongoDB Operator | Generic | SQL Equivalent |
| ---------------- | ------- | -------------- |
| `$eq` (default)  | `EQ`    | `=`            |
| `$ne`            | `NE`    | `!=`           |
| `$gt`            | `GT`    | `>`            |
| `$gte`           | `GTE`   | `>=`           |
| `$lt`            | `LT`    | `<`            |
| `$lte`           | `LTE`   | `<=`           |
| `$in`            | `IN`    | `IN (...)`     |
| `$and`           | `AND`   | `AND`          |
| `$or`            | `OR`    | `OR`           |

---

## ✅ Unit Testing

Tests are written using **Jest**.

```bash
npm test
```

### Tests include:

- Basic equality
- Projection fields
- Logical operators ($and, $or)
- Comparison operators ($gt, $in, etc.)
- Combined complex filters

---

## 💠 To Do / Improvements

- Implement `parse()` for `SQLAdapter` (SQL → MongoDB).
- Add support for `INSERT`, `UPDATE`, `DELETE`.
- Escape handling for values in SQL output.
- More advanced syntax parsing (e.g., nested documents).
