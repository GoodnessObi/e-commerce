import { useMemo, useState } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
} from "@tanstack/react-table";
import type { TableProps } from "./_types";
import { getColumnsWithHeader, getServerPagination } from "./_data";
import TableFooter from "./table-footer";


const Table = <T extends object>({
  data,
  columns,
  loading,
  useHeader = true,
  headerTitle,
  emptyDataMessage,
  emptyDataMinHeight,
  tableProps,
}: TableProps<T>) => {
  const tableData = useMemo(() => data, [data]);
  const tableColumns = useMemo(() => columns, [columns]);

  const {
   search,
   columnFilter,
   columnVisibility,
   isPaginated,
   serverPagination,
   serverSorting,
   isSorted = true,
   sortedColumns,
  } = tableProps || {};

  const [sorting, setSorting] = useState<SortingState>(serverSorting?.sorting || []);

  const tableState = columnFilter
   ? {
       sorting,
       columnFilters: columnFilter || [],
       columnVisibility,
     }
   : {
       sorting,
       globalFilter: search,
       columnVisibility,
     };

  const totalData = isPaginated === "server" ? serverPagination.totalData : data.length;

  const tableInstance = useReactTable({
   data: tableData,
   columns: useHeader ? getColumnsWithHeader({ columns, totalData, headerTitle }) : tableColumns,
   getCoreRowModel: getCoreRowModel(),
   manualPagination: isPaginated === "server",
   manualSorting: isPaginated === "server",
   getPaginationRowModel: getPaginationRowModel(),
   getSortedRowModel: getSortedRowModel(),
   getFilteredRowModel: getFilteredRowModel(),
   onSortingChange: (updater) => {
     const newSorting = typeof updater === "function" ? updater(sorting) : updater;
     setSorting(newSorting);
     if (serverSorting?.setSorting) {
       serverSorting.setSorting(newSorting);
     }
   },
   state: tableState,
  });

  const {
   getHeaderGroups,
   getRowModel,
   getCanNextPage,
   getCanPreviousPage,
   nextPage,
   previousPage,
   setPageIndex,
   setPageSize,
   getPageCount,
   // getPageOptions,
   getState,
  } = tableInstance;

  const {
   pagination: { pageIndex, pageSize },
  } = getState();

  const {
   getCanPreviousPageServer,
   getCanNextPageServer,
   previousPageServer,
   nextPageServer,
   setPageIndexServer,
   pageIndexServer,
   pageSizeServer,
   setPageSizeServer,
   getPageCountServer,
  } = getServerPagination({ isPaginated, serverPagination });

  const isDataAvailable = !!tableInstance.getRowModel().rows?.length;

  return (
   <div>
     <div>
       {loading ? (
         <div>
           Loading...
         </div>
       ) : (
         <table >
           <thead>
             {getHeaderGroups().map((headerEl) => {
            //    const isTitleHeader = headerEl.headers[index].column.id === "Title";
               return (
                 <tr
                   key={headerEl.id}>
                   {headerEl.headers.map((columnEl) => {
                     const sortOrder = columnEl.column.getIsSorted();
                    //  const sortIcon =
                    //    sortOrder === "asc" ? (
                    //      <ArrowUpHi size={16} />
                    //    ) : sortOrder === "desc" ? (
                    //      <ArrowDownHi size={16} />
                    //    ) : (
                    //      <ArrowsExchangeV size={16} />
                    //    );

                     const isColumnSorted = sortedColumns?.length
                       ? isSorted &&
                         columnEl.column.columnDef.enableSorting !== false &&
                         sortedColumns.includes(columnEl.column.id)
                       : isSorted && columnEl.column.columnDef.enableSorting !== false;
                     return (
                       <th key={columnEl.id} colSpan={columnEl.colSpan}>
                         <div >
                           {columnEl.isPlaceholder
                             ? null
                             : flexRender(columnEl.column.columnDef.header, columnEl.getContext())}
                           {isColumnSorted && (
                             <span onClick={columnEl.column.getToggleSortingHandler()}>
                               {sortOrder}
                             </span>
                           )}
                         </div>
                       </th>
                     );
                   })}
                 </tr>
               );
             })}
           </thead>
           {isDataAvailable && (
             <tbody>
               {getRowModel().rows.map((rowEl) => {
                 return (
                   <tr key={rowEl.id} >
                     {rowEl.getVisibleCells().map((cellEl) => {
                       return (
                         <td key={cellEl.id} >
                           <span>
                             {flexRender(cellEl.column.columnDef.cell, cellEl.getContext())}
                           </span>
                         </td>
                       );
                     })}
                   </tr>
                 );
               })}
             </tbody>
           )}
         </table>
       )}
     </div>
     {isDataAvailable && isPaginated && (
       <TableFooter
         getCanPreviousPage={getCanPreviousPageServer || getCanPreviousPage}
         getCanNextPage={getCanNextPageServer || getCanNextPage}
         previousPage={previousPageServer || previousPage}
         nextPage={nextPageServer || nextPage}
         setPageIndex={setPageIndexServer || setPageIndex}
         pageIndex={pageIndexServer || pageIndex}
         setPageSize={setPageSizeServer || setPageSize}
         pageSize={pageSizeServer || pageSize}
         getPageCount={getPageCountServer || getPageCount}
       />
     )}
     {!isDataAvailable && !loading && (
       <div
         style={emptyDataMinHeight ? { minHeight: `${emptyDataMinHeight}px` } : undefined}
       >
         {emptyDataMessage || "No Data"}
       </div>
     )}
   </div>
  );
};

export default Table;
