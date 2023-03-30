import fs from "node:fs";

const totalEntries = 10000;
const filename = `${totalEntries / 1000}k.csv`;
const header = "name,email,subscribed,created_at\n";

type RowData = {
  name: string;
  email: string;
  subscribed: boolean;
  created_at: string;
};

const generateData = (): string => {
  const data: RowData[] = [];
  const currentDate = new Date();

  for (let i = 0; i < totalEntries; i++) {
    const name = `User ${i + 1}`;
    const email = `user${i + 1}@example.com`;
    const subscribed = Math.random() < 0.5;
    const created_at = new Date(
      currentDate.getTime() - Math.floor(Math.random() * 10000000000)
    ).toISOString();
    data.push({ name, email, subscribed, created_at });
  }

  return data
    .map(
      (row) => `${row.name},${row.email},${row.subscribed},${row.created_at}\n`
    )
    .join("");
};

const createCSVFile = async (): Promise<void> => {
  const data = header + generateData();
  await fs.promises.writeFile(filename, data);
  console.log(
    `File ${filename} with ${totalEntries} entries was successfully created!`
  );
};

createCSVFile();
