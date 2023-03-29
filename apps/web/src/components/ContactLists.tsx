import { api } from "~/utils/api";
import type { List } from "@prisma/client";

export const ContactLists = () => {
  const { data: lists, error, isLoading } = api.list.getAll.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (lists) {
    if (lists.length === 0) return <p>No lists</p>;
    return <ListsTable listsData={lists} />;
  }

  return <>Unreachable (I think)</>;
};

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";

const columnHelper = createColumnHelper<List>();

const columns = [
  columnHelper.accessor((row) => row.name, {
    id: "name",
    cell: (props) => (
      <Link href={`/contact-lists/${props.row.original.id}`}>
        <span className="border-gray-9 hover:border-blue-9 cursor-pointer border-b border-dashed transition duration-300 ease-in-out">
          {props.getValue()}
        </span>
      </Link>
    ),
  }),
  // columnHelper.accessor("createdAt", {
  //  cell: (info) => info.getValue(),
  // }),
  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <button
        onClick={() => {
          console.log(props.row.original);
        }}
      >
        ...
      </button>
    ),
  }),
];

const headerWidths = {
  name: "500px",
  actions: "0px",
};

const ListsTable = ({ listsData }: { listsData: List[] }) => {
  const table = useReactTable({
    data: listsData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="min-w-full border-separate border-spacing-0 border-none text-left">
      <thead className="bg-slate-3 h-8 rounded-md">
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                className="border-slate-6 text-slate-11 h-8 border-t border-b px-3 text-xs font-semibold capitalize first:rounded-l-md first:border-l last:rounded-r-md last:border-r"
                style={{
                  width:
                    headerWidths[
                      header.column.columnDef.id as keyof typeof headerWidths
                    ],
                }}
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td
                className="border-slate-6 h-10 whitespace-nowrap border-b px-3 text-sm"
                key={cell.id}
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        {table.getFooterGroups().map((footerGroup) => (
          <tr key={footerGroup.id}>
            {footerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
              </th>
            ))}
          </tr>
        ))}
      </tfoot>
    </table>
  );
};
