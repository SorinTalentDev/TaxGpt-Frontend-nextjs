import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { useState } from 'react';

export default function DataTable({ columns, data }) {
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const table = useReactTable({
        columns,
        data,
        pageCount: Math.ceil(data.length / pageSize),
        state: { pagination: { pageIndex, pageSize } },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        manualPagination: true,
        onPaginationChange: (updater) => {
            const { pageIndex: newPageIndex, pageSize: newPageSize } = typeof updater === 'function' 
                ? updater({ pageIndex, pageSize }) 
                : updater;

            setPageIndex(newPageIndex);
            setPageSize(newPageSize);
        },
    });

    return (
        <div>
            <table className="w-full border-2 bg-white">
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className="border-2 text-center p-2 ">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="hover:bg-gray-100">
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className="border-2 p-2 text-center">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination mt-4 flex justify-between">
                <button
                    onClick={() => setPageIndex(prev => Math.max(0, prev - 1))}
                    disabled={!table.getCanPreviousPage()}
                    className='bg-regal-blue p-3 text-white rounded-xl'
                >
                    Previous
                </button>
                <span>
                    Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{' '}
                    <strong>{table.getPageCount()}</strong>
                </span>
                <button
                    onClick={() => setPageIndex(prev => Math.min(table.getPageCount() - 1, prev + 1))}
                    disabled={!table.getCanNextPage()}
                    className='bg-regal-blue p-3 text-white rounded-xl'
                >
                    Next
                </button>
            </div>
        </div>
    );
}
