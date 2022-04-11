import { Schema } from 'joi';

export default function testSchema(schema: Schema, object: unknown) {
  return schema.validate(object, {
    allowUnknown: false,
    abortEarly: false,
  });
}
