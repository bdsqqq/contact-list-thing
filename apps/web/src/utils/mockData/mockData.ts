export const mockData = {
  expected: `
   name,email,subscribed,created_at
   John Doe,johndoe@redacted.com,true,2022-01-01
   Jane Smith,janesmith@redacted.com,false,2022-02-15
   Bob Johnson,bobjohnson@redacted.com,true,2022-03-20
   Alice Lee,alicelee@redacted.com,true,2022-04-05
   Tom Brown,tombrown@redacted.com,false,2022-05-10
   Sara Kim,sarakim@redacted.com,true,2022-06-01
   Chris Lee,chrislee@redacted.com,false,2022-07-15
   Zeno,zeno@redacted.com,true,2022-08-01
   Bu,bu@redacted.com,true,2022-09-05
   Jonni,jonni@redacted.com,false,2022-10-20
   `,
  // Should ignore empty lines
  expectedWithALotOfExtraLines: `
   
   
   name,email,subscribed,created_at
   John Doe,johndoe@redacted.com,true,2022-01-01
   Jane Smith,janesmith@redacted.com,false,2022-02-15
   Bob Johnson,bobjohnson@redacted.com,true,2022-03-20
   Alice Lee,alicelee@redacted.com,true,2022-04-05
   Tom Brown,tombrown@redacted.com,false,2022-05-10
   
   Sara Kim,sarakim@redacted.com,true,2022-06-01
   
   
   
   Chris Lee,chrislee@redacted.com,false,2022-07-15
   Zeno,zeno@redacted.com,true,2022-08-01
   Bu,bu@redacted.com,true,2022-09-05
   Jonni,jonni@redacted.com,false,2022-10-20
   
   
   
   `,
  // In this case, the first entry would be the header. No way to valdiate it so at upload should be validated by the user. This fits in the `map` case as we're going to ask them if the headers are correct anyways. see linear CLT-4
  withoutHeaders: `
   John Doe,johndoe@redacted.com,true,2022-01-01
   Jane Smith,janesmith@redacted.com,false,2022-02-15
   Bob Johnson,bobjohnson@redacted.com,true,2022-03-20
   Alice Lee,alicelee@redacted.com,true,2022-04-05
   Tom Brown,tombrown@redacted.com,false,2022-05-10
   Sara Kim,sarakim@redacted.com,true,2022-06-01
   Chris Lee,chrislee@redacted.com,false,2022-07-15
   Zeno,zeno@redacted.com,true,2022-08-01
   Bu,bu@redacted.com,true,2022-09-05
   Jonni,jonni@redacted.com,false,2022-10-20
   `,
  withHeadersThatDontMatchOurSchema: `
   first_name,email,subscribed,created_at,last_name
   John,johndoe@redacted.com,true,2022-01-01,Doe
   Jane,janesmith@redacted.com,false,2022-02-15,Smith
   Bob,bobjohnson@redacted.com,true,2022-03-20,Johnson
   Alice,alicelee@redacted.com,true,2022-04-05,Lee
   Tom,tombrown@redacted.com,false,2022-05-10,Brown
   Sara,sarakim@redacted.com,true,2022-06-01,Kim
   Chris,chrislee@redacted.com,false,2022-07-15,Lee
   Zeno,zeno@redacted.com,true,2022-08-01,Zeno
   Bu,bu@redacted.com,true,2022-09-05,Bu
   Jonni,jonni@redacted.com,false,2022-10-20,Jonni
   `,
  withHeadersThatDontMatchOurSchemaAndEmptyValues: `
   first_name,email,subscribed,created_at,last_name
   John,johndoe@redacted.com,true,2022-01-01,Doe
   Jane,janesmith@redacted.com,false,2022-02-15,Smith
   Bob,bobjohnson@redacted.com,true,2022-03-20,Johnson
   Alice,alicelee@redacted.com,true,2022-04-05,Lee
   Tom,tombrown@redacted.com,false,2022-05-10,Brown
   Sara,sarakim@redacted.com,true,2022-06-01,Kim
   Chris,chrislee@redacted.com,false,2022-07-15,Lee
   Zeno,zeno@redacted.com,true,2022-08-01,
   Bu,bu@redacted.com,true,2022-09-05,
   Jonni,jonni@redacted.com,false,2022-10-20,
   `,
  withoutData: `
   name,email,subscribed,created_at
   `,
};

export const overrides: {
  key: string;
  description: string;
  overrides: {
    // TODO: this should come from the schema but it's mock data so it's fine
    name?: string | string[];
    email?: string | string[];
    subscribed?: string | string[];
    created_at?: string | string[];
  };
}[] = [
  {
    key: "none",
    description: "None",
    overrides: {},
  },
  {
    key: "first_name",
    description: "first_name -> name",
    overrides: {
      // [x] DAILY: this is the structure of the "overrides". 1 to n > 0 allows the consumer to do something like `first_name` -> `name` or `first_name` + `last_name` -> `name`
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
