import React from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  Column,
  TableInstance,
  TableState,
  UseTableOptions,
  HeaderGroup,
} from "react-table";

interface Document {
  id: number;
  title: string;
  uploadDate: string;
  purpose: string;
}

interface TableStateWithPagination extends TableState<Document> {
  pageIndex: number;
  pageSize: number;
}

interface DataTableProps {
  columns: Column<Document>[];
  data: Document[];
}

// We define TableInstanceWithPagination type to include pagination
interface TableInstanceWithPagination extends TableInstance<Document> {
  state: TableStateWithPagination;
  page: any[]; // `page` is an array of rows on the current page
  nextPage: () => void;
  previousPage: () => void;
  canNextPage: boolean;
  canPreviousPage: boolean;
  pageOptions: number[];
  pageCount: number;
  setPageSize: (size: number) => void;
  gotoPage: (pageIndex: number) => void;
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
    state: { pageIndex, pageSize },
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable<Document>(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Default state: first page, 5 rows per page
    } as UseTableOptions<Document> & { initialState: TableStateWithPagination },
    useSortBy, // Sorting plugin
    usePagination // Pagination plugin
  ) as TableInstanceWithPagination;

  return (
    <div className="overflow-x-auto">
      {/* Table */}
      <table
        {...getTableProps()}
        className="table-auto border-collapse border border-gray-200 w-full text-sm text-left text-gray-500"
      >
        <thead>
          {headerGroups.map((headerGroup: HeaderGroup<Document>) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id}
              className="bg-gray-100"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getHeaderProps)} // Works due to `useSortBy` hook
                  key={column.id}
                  className="px-4 py-2 border border-gray-200 cursor-pointer"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, index) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={index}
                className="hover:bg-gray-50"
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
                      className="px-4 py-2 border border-gray-200"
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
          <span className="mr-4">
            Page <strong>{pageIndex + 1}</strong> of{" "}
            <strong>{pageOptions.length}</strong>
          </span>
          <span>
            | Go to page:
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
              className="w-12 mx-2 text-center border px-2"
            />
          </span>
        </div>

        {/* Pagination buttons */}
        <div>
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default DataTable;
