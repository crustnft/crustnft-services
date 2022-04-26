import { ColumnType, DatastoreEntitySchema } from './types';

export function mappingDtoToColumns(
  dto,
  schema: DatastoreEntitySchema,
  isUpdate = false
) {
  const columns = schema.columns.map((column) => {
    const columName = column.name;
    const excludeFromIndexes = column.excludeFromIndexes ?? false;
    let fieldData = {};
    if (columName in dto) {
      const value = dto[columName];
      fieldData = {
        name: columName,
        value: getColumnValue(column, value),
      };
    } else if (column.defaultValue !== undefined) {
      fieldData = {
        name: columName,
        value: getColumnValue(column),
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

function getColumnValue(column: ColumnType, value?: any) {
  if (value !== undefined) {
    return column.lowercase ? value.toLowerCase() : value;
  }

  return typeof column.defaultValue === 'function'
    ? column.defaultValue()
    : column.defaultValue;
}
