import { type NextPage } from "next";
import Head from "next/head";

import { Subscribers } from "~/components/Subscribers";
import { ContactLists } from "~/components/ContactLists";
import { Shell } from "~/components/Shell";

const ContactListsPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Shell actions={<NewListDialog />}>
        <div className="flex flex-col gap-8">
          <section>
            <ContactLists />
          </section>
        </div>
      </Shell>
    </>
  );
};

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import { api } from "~/utils/api";
import { useCsvDataStore } from "~/utils/csvDataStore";
import { useState } from "react";
import { CSVInputs } from "~/components/Upload";
import { Button } from "~/components/ui/Button";
import { PlusIcon } from "@radix-ui/react-icons";
import { Input } from "~/components/ui/Input";

const NewListDialog = () => {
  const { clearStore } = useCsvDataStore();

  return (
    <Dialog
      onOpenChange={() => {
        clearStore();
      }}
    >
      <DialogTrigger>
        <Button>
          <span>
            <PlusIcon />
          </span>
          Add List
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add list</DialogTitle>
          <NewListForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const NewListForm = ({ initialFileData }: { initialFileData?: string }) => {
  const addSubscribers = api.subscriber.parseAndCreateMany.useMutation();
  const addList = api.list.create.useMutation();
  const queryClient = api.useContext();
  const { clearStore, overrides, columns } = useCsvDataStore();

  // TODO: this is here only because of initialFileData, maybe move this to CSV Inputs???
  const [fileData, setFileData] = useState<string>(initialFileData || "");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const listRes = addList.mutate(
          {
            name: e.currentTarget["list-name"].value,
          },
          {
            onSuccess: (data) => {
              queryClient.list.getAll.invalidate();
              if (columns && fileData && overrides) {
                addSubscribers.mutate(
                  {
                    listId: data.id,
                    csvData: fileData,
                    overrides: overrides,
                  },
                  {
                    onSuccess: () => {
                      queryClient.subscriber.getAllFromList.invalidate({
                        ListId: data.id,
                      });
                    },
                  }
                );
              }
            },
          }
        );
        clearStore();
      }}
      className="flex flex-col gap-6"
    >
      <div className="mt-6 flex flex-col space-y-2">
        <label
          htmlFor="list-name"
          className="text-slate-11 select-none text-sm"
        >
          Name
        </label>
        <Input
          type="text"
          required
          id="list-name"
          name="list-name"
          autoComplete="off"
        />
      </div>
      <div className="flex flex-col space-y-6">
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
