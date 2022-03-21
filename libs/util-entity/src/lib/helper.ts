import { DatastoreEntitySchema } from './types';

export function mappingDtoToColumns(
  dto,
  schema: DatastoreEntitySchema,
  isUpdate = false
) {
  const columns = schema.columns.map((colum) => {
    const columName = colum.name;
    const excludeFromIndexes = colum.excludeFromIndexes ?? false;
    let fieldData = {};
    if (columName in dto) {
      const value = dto[columName];
      fieldData = {
        name: columName,
        value:
          colum.lowercase && value !== undefined ? value.toLowerCase() : value,
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

  if (isUpdate) {
    return [...columns, { name: 'updatedAt', value: new Date().toISOString() }];
  }
  return columns;
}
