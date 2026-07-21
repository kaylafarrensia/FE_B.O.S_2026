import { isValidElement, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import Loader from '@/components/ui/loader';

export default function Table({
  columns,
  data,
  loading = false,
  className = '',
  tableFooter,
  striped = false,
  bordered = false,
}) {
  const tanstackColumns = useMemo(() => {
    const cols = [];

    columns.forEach((column, index) => {
      const dataIndex =
        column._index !== undefined ? column._index : index;

      cols.push({
        accessorFn: (row) => {
          const keys = Object.keys(row);
          return row[keys[dataIndex]] ?? row[keys[index]];
        },

        header:
          typeof column.title === 'string'
            ? column.title
            : 'Column',

        cell: ({ getValue }) => {
          const value = getValue();
          let content;

          if (column.itemWrapper) {
            content = column.itemWrapper(value);
          } else if (
            typeof value === 'string' ||
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            value === null ||
            value === undefined
          ) {
            content = value ?? '-';
          } else if (isValidElement(value)) {
            content = value;
          } else {
            content = '-';
          }

          return (
            <div
              className={`p-2 text-sm ${
                column.itemAlign === 'center'
                  ? 'text-center'
                  : column.itemAlign === 'right'
                    ? 'text-right'
                    : 'text-left'
              }`}
              style={{
                verticalAlign:
                  column.itemVerticalAlign || 'baseline',
              }}
            >
              {content}
            </div>
          );
        },

        enableSorting: false,

        size: column.width
          ? Number.parseInt(
              column.width.replace('px', '')
            )
          : 120,
      });
    });

    return cols;
  }, [columns, data.length]);

  const table = useReactTable({
    data,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1">
        <table
          className={`w-full border-collapse ${
            bordered
              ? 'border border-[#E9ECEF]'
              : ''
          }`}
        >
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, idx) => {
                  const colDef = columns[idx] || {};

                  return (
                    <th
                      key={header.id}
                      className={`p-2 text-sm font-medium uppercase tracking-wider border-b border-[#E9ECEF] ${
                        colDef.headerAlign === 'center'
                          ? 'text-center'
                          : colDef.headerAlign === 'right'
                            ? 'text-right'
                            : 'text-left'
                      } text-gray-500`}
                      style={{
                        width: header.getSize(),
                        minWidth: header.getSize(),
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="p-8 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <Loader />
                    <span className="block mt-2">
                      Loading...
                    </span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="p-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`${
                    striped
                      ? idx % 2 === 0
                        ? 'bg-gray-50'
                        : 'bg-white'
                      : ''
                  } ${
                    striped
                      ? 'hover:bg-gray-200'
                      : 'hover:bg-gray-50'
                  } ${
                    bordered
                      ? 'border-b border-[#E9ECEF]'
                      : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell, cellIdx) => {
                    const colDef =
                      columns[cellIdx] || {};

                    return (
                      <td
                        key={cell.id}
                        className={`p-2 text-sm align-middle ${
                          colDef.itemAlign === 'center'
                            ? 'text-center'
                            : colDef.itemAlign === 'right'
                              ? 'text-right'
                              : 'text-left'
                        } ${
                          bordered
                            ? 'border border-[#E9ECEF]'
                            : ''
                        } text-gray-800`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {tableFooter && <>{tableFooter}</>}
    </div>
  );
}