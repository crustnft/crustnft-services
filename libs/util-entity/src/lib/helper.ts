import { DatastoreEntitySchema } from './types';

export function mappingDtoToColumns(dto, schema: DatastoreEntitySchema) {
  return schema.columns.map((colum) => {
    const columName = colum.name;
    const excludeFromIndexes = colum.excludeFromIndexes ?? false;
    let fieldData = {};
    if (columName in dto) {
      fieldData = {
        name: columName,
        value: dto[columName],
      };
    } else if (colum.defaultValue !== undefined) {
      fieldData = {
        name: columName,
        value:
          typeof colum.defaultValue === 'function'
            ? colum.defaultValue()
            : colum.defaultValue,
      };
    } else {
      throw new Error(`Entity is missing ${columName} field`);
    }
    return {
      ...fieldData,
      excludeFromIndexes,
    };
  });
}