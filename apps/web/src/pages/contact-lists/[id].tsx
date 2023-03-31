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
        actions={<AddContacts listId={parseInt(id)} />}
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
  DialogClose,
} from "~/components/ui/Dialog";

export const AddContacts = ({ listId }: { listId: number }) => {
  const { clearStore } = useCsvDataStore();

  return (
    <Dialog
      onOpenChange={() => {
        clearStore();
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <span>
            <PlusIcon />
          </span>
          Add contacts
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add contacts</DialogTitle>
          <AddContactsForm listId={listId} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

import { useCsvDataStore } from "~/utils/csvDataStore";
import { useState } from "react";
import { CSVInputs } from "~/components/Upload";
import { Button } from "~/components/ui/Button";
import { PlusIcon } from "@radix-ui/react-icons";

const AddContactsForm = ({
  listId,
  initialFileData,
}: {
  listId: number;
  initialFileData?: string;
}) => {
  const addSubscribers = api.subscriber.parseAndCreateMany.useMutation();
  const queryClient = api.useContext();

  const { clearStore, overrides } = useCsvDataStore();

  // TODO: this is here only because of initialFileData, maybe move this to CSV Inputs???
  const [fileData, setFileData] = useState<string>(initialFileData || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        addSubscribers.mutate(
          {
            listId,
            csvData: fileData,
            overrides: overrides,
          },
          {
            onSuccess: () => {
              queryClient.subscriber.getAllFromList.invalidate({
                ListId: listId,
              });
            },
          }
        );
        clearStore();
      }}
      className="flex flex-col gap-6"
    >
      <div className="mt-6 flex flex-col space-y-6">
        <CSVInputs fileData={fileData} setFileData={setFileData} />
      </div>
      <div className="flex items-center gap-2">
        <Button type="submit">Add</Button>
        <DialogClose asChild>
          <Button variant={"ghost"} type="button">
            Cancel
          </Button>
        </DialogClose>
      </div>
    </form>
  );
};

export default ContactListsPage;
