export interface DatastoreEntitySchema {
  name: string;
  columns: ColumnType[];
}

interface ColumnType {
  name: string;
  excludeFromIndexes?: boolean;
  defaultValue?: any;
}
