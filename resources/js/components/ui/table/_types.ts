import type { ColumnDef, ColumnFilter, ColumnFiltersState } from "@tanstack/react-table";

export interface TableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  useHeader?: boolean;
  headerTitle?: string;
  loading?: boolean;
  emptyDataMessage?: string;
  emptyDataMinHeight?: number;
  tableProps?:
    | {
        filters?: ColumnFiltersState;
        search?: string;
        columnFilter?: ColumnFilter[];
        columnVisibility?: { [key: string]: boolean };
        isSorted?: boolean;
        sortedColumns?: string[];
        isPaginated?: "local";
        serverPagination?: {
          totalData: number;
          pageIndex: number;
          pageSize: number;
          setPageIndex: (page: number) => void;
          setPageSize: (page: number) => void;
        };
        serverSorting?: {
          sorting: Array<{ id: string; desc: boolean }>;
          setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
        };
      }
    | {
        filters?: ColumnFiltersState;
        search?: string;
        columnFilter?: ColumnFilter[];
        columnVisibility?: { [key: string]: boolean };
        isSorted?: boolean;
        sortedColumns?: string[];
        isPaginated?: "server";
        serverPagination: {
          totalData: number;
          pageIndex: number;
          pageSize: number;
          setPageIndex: (page: number) => void;
          setPageSize: (page: number) => void;
        };
        serverSorting?: {
          sorting: Array<{ id: string; desc: boolean }>;
          setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
        };
      };
}
export type GetServerPaginationProps = {
  isPaginated?: "local" | "server";
  serverPagination?: {
    totalData: number;
    pageIndex: number;
    pageSize: number;
    setPageIndex: (page: number) => void;
    setPageSize: (page: number) => void;
  };
  serverSorting?: {
    sorting: Array<{ id: string; desc: boolean }>;
    setSorting: (sorting: Array<{ id: string; desc: boolean }>) => void;
  };
};

export type TableColumn<T extends Record<string, unknown>> = ColumnDef<T>;

export interface GetColumnsWithHeader<T> {
  columns: ColumnDef<T>[];
  totalData: number;
  headerTitle?: string;
}


