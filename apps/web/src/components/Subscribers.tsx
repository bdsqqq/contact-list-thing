import { api } from "~/utils/api";

const Subscribers = () => {
  const {
    data: subscribers,
    error,
    isLoading,
  } = api.subscriber.getAll.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (subscribers) {
    if (subscribers.length === 0) return <p>No subscribers</p>;
    return <pre>{JSON.stringify(subscribers, null, 2)}</pre>;
  }

  return <>Unreachable (I think)</>;
};

export { Subscribers };
