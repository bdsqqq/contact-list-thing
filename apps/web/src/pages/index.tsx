import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { z } from "zod";
import { subscriberSchema } from "~/utils/schemas";

import { api } from "~/utils/api";

const mockData = {
  expected: `
  name,email,subscribed,created_at
  John Doe,johndoe@resend.com,true,2022-01-01
  Jane Smith,janesmith@resend.com,false,2022-02-15
  Bob Johnson,bobjohnson@resend.com,true,2022-03-20
  Alice Lee,alicelee@resend.com,true,2022-04-05
  Tom Brown,tombrown@resend.com,false,2022-05-10
  Sara Kim,sarakim@resend.com,true,2022-06-01
  Chris Lee,chrislee@resend.com,false,2022-07-15
  Zeno,zeno@resend.com,true,2022-08-01
  Bu,bu@resend.com,true,2022-09-05
  Jonni,jonni@resend.com,false,2022-10-20
  `,
  // Should ignore empty lines
  expectedWithALotOfExtraLines: `
  
  
  name,email,subscribed,created_at
  John Doe,johndoe@resend.com,true,2022-01-01
  Jane Smith,janesmith@resend.com,false,2022-02-15
  Bob Johnson,bobjohnson@resend.com,true,2022-03-20
  Alice Lee,alicelee@resend.com,true,2022-04-05
  Tom Brown,tombrown@resend.com,false,2022-05-10
  
  Sara Kim,sarakim@resend.com,true,2022-06-01
  
  
  
  Chris Lee,chrislee@resend.com,false,2022-07-15
  Zeno,zeno@resend.com,true,2022-08-01
  Bu,bu@resend.com,true,2022-09-05
  Jonni,jonni@resend.com,false,2022-10-20
  
  
  
  `,
  // In this case, the first entry would be the header. No way to valdiate it so at upload should be validated by the user. This fits in the `map` case as we're going to ask them if the headers are correct anyways. see linear CLT-4
  withoutHeaders: `
  John Doe,johndoe@resend.com,true,2022-01-01
  Jane Smith,janesmith@resend.com,false,2022-02-15
  Bob Johnson,bobjohnson@resend.com,true,2022-03-20
  Alice Lee,alicelee@resend.com,true,2022-04-05
  Tom Brown,tombrown@resend.com,false,2022-05-10
  Sara Kim,sarakim@resend.com,true,2022-06-01
  Chris Lee,chrislee@resend.com,false,2022-07-15
  Zeno,zeno@resend.com,true,2022-08-01
  Bu,bu@resend.com,true,2022-09-05
  Jonni,jonni@resend.com,false,2022-10-20
  `,
  withHeadersThatDontMatchOurSchema: `
  first_name,email,subscribed,created_at,last_name
  John,johndoe@resend.com,true,2022-01-01,Doe
  Jane,janesmith@resend.com,false,2022-02-15,Smith
  Bob,bobjohnson@resend.com,true,2022-03-20,Johnson
  Alice,alicelee@resend.com,true,2022-04-05,Lee
  Tom,tombrown@resend.com,false,2022-05-10,Brown
  Sara,sarakim@resend.com,true,2022-06-01,Kim
  Chris,chrislee@resend.com,false,2022-07-15,Lee
  Zeno,zeno@resend.com,true,2022-08-01,Zeno
  Bu,bu@resend.com,true,2022-09-05,Bu
  Jonni,jonni@resend.com,false,2022-10-20,Jonni
  `,
  withHeadersThatDontMatchOurSchemaAndEmptyValues: `
  first_name,email,subscribed,created_at,last_name
  John,johndoe@resend.com,true,2022-01-01,Doe
  Jane,janesmith@resend.com,false,2022-02-15,Smith
  Bob,bobjohnson@resend.com,true,2022-03-20,Johnson
  Alice,alicelee@resend.com,true,2022-04-05,Lee
  Tom,tombrown@resend.com,false,2022-05-10,Brown
  Sara,sarakim@resend.com,true,2022-06-01,Kim
  Chris,chrislee@resend.com,false,2022-07-15,Lee
  Zeno,zeno@resend.com,true,2022-08-01,
  Bu,bu@resend.com,true,2022-09-05,
  Jonni,jonni@resend.com,false,2022-10-20,
  `,
  withoutData: `
  name,email,subscribed,created_at
  `,
};

const overrides = [
  {
    key: "none",
    description: "None",
    overrides: {},
  },
  {
    key: "first_name",
    description: "first_name -> name",
    overrides: {
      // [ ] DAILY: this is the structure of the "overrides". 1 to n > 0 allows the consumer to do something like `first_name` -> `name` or `first_name` + `last_name` -> `name`
      name: "first_name",
    },
  },
  {
    key: "first_and_last_name",
    description: "first_name + last_name -> name",
    overrides: {
      name: ["first_name", "last_name"],
    },
  },
];

const csvToJson = (csv: string) => {
  const lines = csv
    .trim()
    .split(/\n/)
    .map((line) => line.trim()); // could trim when assigning values to reduce iterations
  console.log({ lines });

  if (lines.length < 1 || !lines[0]) return { data: [], columns: [] };
  const columns = lines[0].split(",");

  if (lines.length < 2 || !lines[1])
    return { data: [], columns: lines[0].split(",") };

  console.log({ columns: columns });

  const data = lines
    .slice(1)
    .filter((line) => line) // Filters out the empty lines, needs trimming to happen before. Could instead return null if !line in the map bellow to reduce iterations
    .map((line) => {
      // if (!line) return;

      const values = line.split(",");

      return columns.reduce((acc, header, index) => {
        if (columns.length !== values.length) {
          // [ ] DAILY: Validate this in the backend too, but display it in the UI. Maybe even let the user "fix" these by adding the missing columns or removing the row?
          // TODO: keep track of these somewhere and display them. This should prevent the user from uploading to DB.
          console.error(
            `The number of columns (${columns.length}) does not match the number of values (${values.length})`
          );
        }
        acc.set(header, values[index] || "");
        return acc;
      }, new Map<any, string>());
    });

  console.log(data);
  return { data, columns };
};

// I know I'll always want a particular schema, so it's easier to start from there
const mapCsvProperties = (
  data: Map<string, string>[],
  columnOverrides?: {
    name?: string | string[];
    email?: string | string[];
    subscribed?: string | string[];
    createdAt?: string | string[];
  }
) => {
  const cols = Object.assign(
    {
      name: "name",
      email: "email",
      subscribed: "subscribed",
      createdAt: "created_at",
    },
    columnOverrides
  );

  const makeValueFromArrayOfKeys = (
    row: Map<string, string>,
    keys: string[]
  ) => {
    return keys.reduce((acc, key) => {
      if (row.get(key) === undefined) {
        // TODO: This should throw but I don't wanna try catch rn, logging instead
        // throw new Error(
        //   `The key ${key} does not exist in the row ${JSON.stringify(row)}`
        // );
        console.error(
          `The key ${key} does not exist in the row ${JSON.stringify(row)}`
        );
        return "";
      }

      acc += ` ${row.get(key)}`;
      return acc.trim();
    }, "");
  };

  const mapRowWithKeys = (
    row: Map<string, string>,
    keys: string | string[]
  ) => {
    if (Array.isArray(keys)) {
      return makeValueFromArrayOfKeys(row, keys);
    }
    return row.get(keys) || "";
  };

  return data.map((row: any) => ({
    name: mapRowWithKeys(row, cols.name),
    email: mapRowWithKeys(row, cols.email),
    subscribed: mapRowWithKeys(row, cols.subscribed),
    createdAt: mapRowWithKeys(row, cols.createdAt),
  }));
};

const ListSection = () => {
  return (
    <section>
      <h2>LISTS</h2>
      <Lists />
    </section>
  );
};

const Lists = () => {
  const { data: lists, error, isLoading } = api.list.getAll.useQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (lists) {
    if (lists.length === 0) return <p>No lists</p>;
    return <pre>{JSON.stringify(lists, null, 2)}</pre>;
  }

  return <>Unreachable (I think)</>;
};

const SubscriberSection = () => {
  return (
    <section>
      <h2>SUBSCRIBERS</h2>
      <Subscribers />
    </section>
  );
};

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

const UploadSection = () => {
  return (
    <section>
      <h2>UPLOAD</h2>
      <Upload />
    </section>
  );
};

const Upload = () => {
  const [fileData, setFileData] = useState<string>("");
  const [inputData, setInputData] = useState<string>("");
  const [columnOverrides, setColumnOverrides] = useState<{
    name?: string | string[];
    email?: string | string[];
    subscribed?: string | string[];
    createdAt?: string | string[];
  }>({});
  const createManySubscribers = api.subscriber.createMany.useMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setFileData(text);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />

      <div className="flex gap-4 [&>*]:bg-gray-200">
        <div>
          <h3>What csv to parse</h3>
          {Object.entries(mockData).map(([key, value]) => (
            <div key={key}>
              <input
                type="radio"
                id={key}
                name="mockData"
                value={value}
                onChange={(e) => {
                  setInputData(e.target.value);
                }}
              />
              <label htmlFor={key}>{key}</label>
            </div>
          ))}
          <div key={"file"}>
            <input
              type="radio"
              id={"file"}
              name="mockData"
              value={"file"}
              onChange={(e) => {
                setInputData(fileData);
              }}
            />
            <label htmlFor={"file"}>File data</label>
          </div>
        </div>
        <div>
          <h2>What override to use when mapping</h2>
          {overrides.map((override, i) => (
            <div key={override.key}>
              <input
                type="radio"
                id={override.key}
                name="columnOverrides"
                value={i}
                onChange={(e) => {
                  setColumnOverrides(
                    overrides[parseInt(e.target.value)]?.overrides || {}
                  );
                }}
              />
              <label htmlFor={override.key}>{override.description}</label>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          const data = mapCsvProperties(
            csvToJson(inputData || "").data,
            columnOverrides
          ).map((subscriber) => ({
            ...subscriber,
            subscribed: subscriber.subscribed === "true",
            createdAt: new Date(subscriber.createdAt),
            ListId: 2,
          }));

          if (data.length === 0) return;
          z.array(subscriberSchema).parse(data);

          createManySubscribers.mutate(data, {
            onSuccess: () => {
              console.log("Subscribers created");
            },
          });
        }}
      >
        UPLOAD CSV DATA
      </button>

      <PreviewInputAndOutput
        input={inputData}
        columnOverrides={columnOverrides}
      />
    </>
  );
};

const PreviewInputAndOutput = ({
  input,
  columnOverrides,
}: {
  input: string;
  columnOverrides: {
    name?: string | string[];
    email?: string | string[];
    subscribed?: string | string[];
    createdAt?: string | string[];
  };
}) => {
  return (
    <div className="flex gap-6 bg-gray-200">
      <div className="bg-gray-300">
        <h2>input</h2>
        <pre>
          <code>{input && input}</code>
        </pre>
      </div>
      <div className="bg-gray-300">
        <h2>output</h2>
        <pre>
          <code>
            {JSON.stringify(
              mapCsvProperties(csvToJson(input || "").data, columnOverrides),
              null,
              2
            )}
          </code>
        </pre>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-8 p-8">
        <ListSection />
        <SubscriberSection />
        <UploadSection />
      </main>
    </>
  );
};

export default Home;
