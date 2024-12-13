import { useTable, useSortBy, usePagination } from "react-table";

const DataTable = ({ columns, data }) => {
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
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 }, // Default to first page, 5 rows per page
    },
    useSortBy, // Sorting plugin
    usePagination // Pagination plugin
  );

  return (
    <div className="overflow-x-auto">
      {/* Table */}
      <table
        {...getTableProps()}
        className="table-auto border-collapse border border-gray-200 w-full text-sm text-left text-gray-500"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              key={headerGroup.id}
              className="bg-gray-100"
            >
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={column.id} // Ensure each header cell has a unique key
                  className="px-4 py-2 border border-gray-200 cursor-pointer"
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? " 🔽"
                        : " 🔼"
                      : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                key={row.id || row.index}
                className="hover:bg-gray-50"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    key={cell.column.id} // Ensure each cell has a unique key
                    className="px-4 py-2 border border-gray-200"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
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
          {/* Page Size Selector */}
          <select
            className="border px-2 py-1 rounded"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            First
          </button>
          <button
            onClick={previousPage}
            disabled={!canPreviousPage}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={nextPage}
            disabled={!canNextPage}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
