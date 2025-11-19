# Database Standards

## Schema Design

- Normalisation preferred unless performance patterns require denormalisation.
- Foreign keys must enforce integrity.
- Avoid storing unnecessary or duplicate values.

## Naming Rules

- Table names must be plural: `customers`, `orders`.
- snake_case for tables and fields.
- Primary key column must be `id`.

## Migrations

- Schema changes must be executed using tracked migration scripts.
- No direct database manual edits allowed in production.
