import { type NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

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
      return columns.reduce((obj: any, header, index) => {
        obj[header] = values[index];
        return obj;
      }, {});
    });

  console.log(data);
  return { data, columns };
};

// I know I'll always want a particular schema, so it's easier to start from there
const mapCsvProperties = (
  data: { [key: string]: string }[],
  columnOverrides?: {
    name?: string | string[];
    email?: string | string[];
    subscribed?: string | string[];
    created_at?: string | string[];
  }
) => {
  const cols = Object.assign(
    {
      name: "name",
      email: "email",
      subscribed: "subscribed",
      created_at: "created_at",
    },
    columnOverrides
  );

  const makeValueFromArrayOfKeys = (
    row: { [key: string]: string },
    keys: string[]
  ) => {
    return keys.reduce((acc, key) => {
      if (!row[key]) return acc;

      acc += ` ${row[key]}`;
      return acc;
    }, "");
  };

  const mapRowWithKeys = (
    row: { [key: string]: string },
    keys: string | string[]
  ) => {
    if (Array.isArray(keys)) {
      return makeValueFromArrayOfKeys(row, keys);
    }
    return row[keys];
  };

  return data.map((row: any) => ({
    name: mapRowWithKeys(row, cols.name),
    email: mapRowWithKeys(row, cols.email),
    subscribed: mapRowWithKeys(row, cols.subscribed),
    created_at: mapRowWithKeys(row, cols.created_at),
  }));
};

const Home: NextPage = () => {
  const hello = api.example.getAll.useQuery();
  const [fileData, setFileData] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (e) => {
              setFileData(e.target?.result as string);
            };
            reader.readAsText(file);
          }}
        />
        <pre>
          <code>
            {/* {fileData && fileData} */}
            {JSON.stringify(
              mapCsvProperties(
                csvToJson(
                  mockData.withHeadersThatDontMatchOurSchemaAndEmptyValues
                ).data,
                {
                  name: ["first_name", "last_name"],
                }
              ),
              null,
              2
            )}
          </code>
        </pre>
      </main>
    </>
  );
};

export default Home;
