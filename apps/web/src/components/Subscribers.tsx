import { api } from "~/utils/api";
import type { Subscriber } from "@prisma/client";
import type { ReactNode } from "react";

export const Subscribers = ({ listid }: { listid: number }) => {
  const {
    data: subscribers,
    error,
    isLoading,
  } = api.subscriber.getAllFromList.useQuery({ ListId: listid });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (subscribers) {
    if (subscribers.length === 0) return <p>No subscribers</p>;
    return <SubscribersTable subscribersData={subscribers} />;
  }

  return <>Unreachable (I think)</>;
};

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistance } from "date-fns";

const columnHelper = createColumnHelper<Subscriber>();
const now = new Date();

const columns = [
  columnHelper.accessor((row) => row.name, {
    header: "Name",
    id: "name",
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor((row) => row.email, {
    header: "Email",
    id: "email",
    cell: (props) => props.getValue(),
  }),
  columnHelper.accessor((row) => row.subscribed, {
    header: "Subscribed",
    id: "subscribed",
    cell: (props) => (
      <Tag type={props.getValue() ? "success" : "base"}>
        {props.getValue() ? "Yes" : "No"}
      </Tag>
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
  email: "500px",
  subscribed: "100px",
  created: "500px",
  actions: "0px",
};

const SubscribersTable = ({
  subscribersData,
}: {
  subscribersData: Subscriber[];
}) => {
  const table = useReactTable({
    data: subscribersData,
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
                ${
                  ["created", "subscribed"].includes(header.id)
                    ? " text-right"
                    : ""
                }
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
                ${
                  ["created", "subscribed"].includes(cell.column.id)
                    ? " text-right"
                    : ""
                }`}
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

const Tag = ({
  type = "base",
  children,
}: {
  type?: "base" | "success";
  children: ReactNode;
}) => {
  return (
    <span
      className={`
      bg-green-3 text-green-11 inline-flex h-6 cursor-default select-none items-center whitespace-nowrap rounded px-2 text-xs font-semibold
        ${
          type === "base"
            ? "bg-slate-2 text-slate-9"
            : "bg-green-3 text-green-11"
        }
      `}
    >
      {children}
    </span>
  );
};
