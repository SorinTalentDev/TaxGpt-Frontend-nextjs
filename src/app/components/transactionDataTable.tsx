import {
  ArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightToLine,
} from "lucide-react";
import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
  Column,
  TableInstance,
  TableState,
  UseTableOptions,
  HeaderGroup,
} from "react-table";

interface Transaction {
  transaction_id: string;
  userId: string;
  username: string;
  email: string;
  pay_date: string;
  amount: number;
}

interface TableStateWithPagination extends TableState<Transaction> {
  pageIndex: number;
  pageSize: number;
}

interface DataTableProps {
  columns: Column<Transaction>[];
  data: Transaction[];
}

// We define TableInstanceWithPagination type to include pagination
interface TableInstanceWithPagination extends TableInstance<Transaction> {
  state: TableStateWithPagination & {
    globalFilter: string;
  };
  page: any[]; // `page` is an array of rows on the current page
  nextPage: () => void;
  previousPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageOptions: number[];
  pageCount: number;
  setPageSize: (size: number) => void;
  gotoPage: (pageIndex: number) => void;
  setGlobalFilter: (filterValue: string) => void;
}

const DataTable: React.FC<DataTableProps> = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Page-specific rows
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex, pageSize, globalFilter },
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
  } = useTable<Transaction>(
    {
      columns: React.useMemo(
        () => [
          {
            Header: "No",
            Cell: ({ row }: { row: { index: number } }) => (
              <span>{row.index + 1 + pageIndex * pageSize}</span>
            ),
            id: "rowNumber",
            sortType: (rowA: { index: number }, rowB: { index: number }) => {
              const a = rowA.index;
              const b = rowB.index;
              return a < b ? -1 : a > b ? 1 : 0;
            },
          },
          ...columns,
        ],
        [columns]
      ),
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    } as UseTableOptions<Transaction> & {
      initialState: TableStateWithPagination;
    },
    useGlobalFilter, // Add global filter hook
    useSortBy, // Sorting plugin
    usePagination // Pagination plugin
  ) as TableInstanceWithPagination;

  return (
    <div className="overflow-x-auto">
      {/* Add Search Filter */}
      <div className="mb-4">
        <input
          type="text"
          value={globalFilter || ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search in all columns..."
          className="p-2 border rounded w-full dark:bg-[#111111] dark:border-[#111111] dark:text-white"
        />
      </div>

      {/* Table */}
      <table
        {...getTableProps()}
        className="table-auto border-collapse border border-gray-200 w-full text-sm text-gray-500 dark:text-white text-center dark:border-gray-800"
      >
        <thead>
          {headerGroups.map(
            (headerGroup: HeaderGroup<Transaction>, groupIndex) => (
              <tr
                {...headerGroup.getHeaderGroupProps()}
                key={headerGroup.id || `headerGroup-${groupIndex}`} // Use `id` or fallback to `groupIndex`
                className="bg-gray-100 dark:bg-[#1c1c1c]"
              >
                {headerGroup.headers.map((column: any, columnIndex) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={column.id || `column-${columnIndex}`}
                    className="px-4 py-2 border border-gray-200 cursor-pointer dark:border-[#111111]"
                  >
                    {column.render("Header")}
                    {/* Add sort indicator */}
                    <span className="ml-2">
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            )
          )}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-[#111111]"
              >
                {row.cells.map(
                  (cell: {
                    getCellProps: () => React.JSX.IntrinsicAttributes &
                      React.ClassAttributes<HTMLTableDataCellElement> &
                      React.TdHTMLAttributes<HTMLTableDataCellElement>;
                    column: { id: React.Key | null | undefined };
                    render: (
                      arg0: string
                    ) =>
                      | string
                      | number
                      | bigint
                      | boolean
                      | React.ReactElement<
                          any,
                          string | React.JSXElementConstructor<any>
                        >
                      | Iterable<React.ReactNode>
                      | React.ReactPortal
                      | Promise<React.AwaitedReactNode>
                      | null
                      | undefined;
                  }) => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="px-4 py-2 border border-gray-200 dark:border-[#111111]"
                    >
                      {cell.render("Cell")}
                    </td>
                  )
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center py-4">
        {/* Page Info */}
        <div className="flex items-center">
          <span className="mr-4 dark:text-gray-500">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <strong>{pageOptions.length}</strong>
          </span>
          <span className="dark:text-gray-500">
            | Go to page:
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="w-12 mx-2 text-center border px-2 dark:bg-[#111111] dark:border-[#111111] dark:text-white"
              min={1}
            />
          </span>
        </div>

        {/* Pagination buttons */}
        <div>
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-400"
          >
            <ArrowLeftToLine />
          </button>{" "}
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-400"
          >
            <ArrowLeft />
          </button>{" "}
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-400"
          >
            <ArrowRight />
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="rounded-full bg-blue-500 p-2 text-white hover:bg-blue-400"
          >
            <ArrowRightToLine />
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
