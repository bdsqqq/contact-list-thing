import z from "zod";
export const createList = async (listName: string) => {
  z.string().parse(listName);

  const response = await fetch("/api/sdk/createList", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: listName }),
  });
};

export const createSubscribers = async (
  listid: number,
  csvData: string,
  overrides: {
    name?: string | string[];
    email?: string | string[];
    subscribed?: string | string[];
    created_at?: string | string[];
  }
) => {
  z.number().int().parse(listid);
  z.string().parse(csvData);

  const response = await fetch("/api/sdk/createSubscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ listid, csvData, overrides }),
  });
};
