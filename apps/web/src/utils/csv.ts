export const csvToJson = (csv: string) => {
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
export const mapCsvProperties = (
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
