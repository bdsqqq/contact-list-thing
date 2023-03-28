import { api } from "~/utils/api";

const ContactLists = () => {
  const { data: lists, error, isLoading } = api.list.getAll.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (lists) {
    if (lists.length === 0) return <p>No lists</p>;
    return <pre>{JSON.stringify(lists, null, 2)}</pre>;
  }

  return <>Unreachable (I think)</>;
};

export { ContactLists };
