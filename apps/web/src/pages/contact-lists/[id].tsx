import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";

import { Subscribers } from "~/components/Subscribers";
import { Shell } from "~/components/Shell";

import { api } from "~/utils/api";
import { formatDistance } from "date-fns";
import { List } from "@prisma/client";

const now = new Date();

const ContactListsPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) return null;
  if (typeof id !== "string") return null;

  const { data, isLoading, error } = api.list.getById.useQuery({
    id: parseInt(id),
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell
        details={<Details data={data} isLoading={isLoading} />}
        title={data?.name}
        actions={<AddContacts />}
      >
        <div className="flex flex-col gap-8">
          <section>
            <Subscribers listid={parseInt(id)} />
          </section>
        </div>
      </Shell>
    </>
  );
};

const Details = ({
  data,
  isLoading,
}: {
  data: List | undefined | null;
  isLoading: boolean;
}) => {
  return (
    <div className="mt-8 flex w-full flex-wrap">
      <div className="flex basis-1/4 flex-col gap-1">
        <label className="text-slate-11 select-none text-sm uppercase">
          Created
        </label>
        <span>
          <CreatedAtData data={data} isLoading={isLoading} />
        </span>
      </div>
    </div>
  );
};

const CreatedAtData = ({
  data,
  isLoading,
}: {
  data: List | undefined | null;
  isLoading: boolean;
}) => {
  if (isLoading)
    return <div className="bg-slate-7 h-6 w-16 animate-pulse rounded-full" />;
  if (data)
    return (
      <span>
        {formatDistance(data?.createdAt, now, {
          addSuffix: true,
        })}
      </span>
    );

  return <span>N/A</span>;
};

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";

const AddContacts = () => {
  return (
    <Dialog>
      <DialogTrigger>+ Add contacts</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add contacts</DialogTitle>
          <AddContactsForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

import { useCsvDataStore } from "~/utils/csvDataStore";
import { type ChangeEvent, useState } from "react";

const expectedColumns = [
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Subscribed",
    value: "subscribed",
  },
  {
    label: "Created At",
    value: "createdAt",
  },
];

const AddContactsForm = () => {
  const addContacts = api.subscriber.createMany.useMutation();
  const {
    clearStore,
    inputtedColumns,
    overrides,
    setOverrides,
    parsedData,
    setParsedData,
  } = useCsvDataStore();

  const [fileData, setFileData] = useState<string>("");
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setFileData(text);
        setParsedData({ data: text, overrides: {} });
      }
    };
    reader.readAsText(file);
  };

  const handleOverrideInputChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setOverrides(Object.assign({}, overrides, { [name]: value }));
    setParsedData({
      data: fileData,
      overrides: Object.assign({}, overrides, { [name]: value }),
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const temp = parsedData.data.map((subscriber) => ({
          ...subscriber,
          subscribed: subscriber.subscribed === "true",
          createdAt:
            (subscriber.createdAt && new Date(subscriber.createdAt)) ||
            new Date(),
          ListId: 2,
        }));

        console.log(temp);

        addContacts.mutate(temp);
        clearStore();
      }}
      className="flex flex-col gap-6"
    >
      <div className="mt-6 flex flex-col space-y-2">
        <input type="file" onChange={handleFileChange} />
      </div>
      <div className="mt-6 flex flex-col space-y-2">
        {expectedColumns.map((column) => (
          <div className="flex gap-2" key={`input-wrapper-${column.value}`}>
            <label htmlFor={column.value}>{`${column.label}:`}</label>
            <select
              className="bg-slate-7 h-6"
              onChange={(e) => handleOverrideInputChange(e)}
              name={column.value}
              id={column.value}
            >
              {parsedData.columns.map((parsedDataColumn) => (
                <option key={parsedDataColumn} value={parsedDataColumn}>
                  {parsedDataColumn}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button type="submit">Add</button>
        <button type="button">Cancel</button>
      </div>
    </form>
  );
};

export default ContactListsPage;
