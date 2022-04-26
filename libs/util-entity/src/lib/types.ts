export interface DatastoreEntitySchema {
  name: string;
  columns: ColumnType[];
}

export interface ColumnType {
  name: string;
  excludeFromIndexes?: boolean;
  defaultValue?: any;
  lowercase?: boolean;
}
