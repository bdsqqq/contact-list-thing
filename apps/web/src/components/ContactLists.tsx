import { api } from "~/utils/api";
import type { List } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";

export const ContactLists = () => {
  const queryClient = useQueryClient();

  const {
    data: lists,
    error,
    isLoading,
  } = api.list.getAll.useQuery(undefined, {
    onSuccess: (data) => {
      data.forEach((list) => {
        queryClient.setQueryData(
          [["list", "getById"], { input: { id: list.id }, type: "query" }],
          list
        );
      });
    },
  });

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
import { formatDistance } from "date-fns";
import { Button } from "./ui/Button";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

const columnHelper = createColumnHelper<List>();
const now = new Date();

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
  columnHelper.accessor("createdAt", {
    id: "created",
    header: "Created",
    cell: (info) =>
      formatDistance(info.getValue(), now, {
        addSuffix: true,
      }),
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => (
      <Button
        variant={"ghost"}
        square
        size={"sm"}
        onClick={() => {
          console.log(props.row.original);
        }}
        aria-label="More actions"
      >
        <DotsHorizontalIcon />
      </Button>
    ),
  }),
];

const headerWidths = {
  name: "500px",
  created: "500px",
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
                className={`
                border-slate-6 text-slate-11 h-8 border-b border-t px-3 text-xs font-semibold capitalize first:rounded-l-md first:border-l last:rounded-r-md last:border-r 
                ${header.id === "created" ? " text-right" : ""}
                `}
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
                className={`border-slate-6 h-10 whitespace-nowrap border-b px-3 text-sm 
                ${cell.column.id === "created" ? " text-right" : ""}`}
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
