import { useCsvDataStore } from "~/utils/csvDataStore";

const expectedColumns = [
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Subscribed",
    value: "subscribed",
  },
  {
    label: "Created At",
    value: "createdAt",
  },
];

// [ ] Daily  I don't love this way of handling this but it let's me abstract this to reuse in both pages for now. Ideally would've asked for input from other teammembers on how to handle this.
const CSVInputs = ({
  fileData,
  setFileData,
}: {
  fileData: string;
  setFileData: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { setParsedData } = useCsvDataStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === "string") {
        setFileData(text);
        setParsedData({ data: text, overrides: {} });
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      <div className="flex flex-col space-y-2">
        <OverwriteInputs csv={fileData} />
      </div>
    </>
  );
};

const OverwriteInputs = ({ csv }: { csv: string }) => {
  const { parsedData, overrides, setOverrides, setParsedData } =
    useCsvDataStore();

  const handleOverrideInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setOverrides(Object.assign({}, overrides, { [name]: value }));
    setParsedData({
      data: csv,
      overrides: Object.assign({}, overrides, { [name]: value }),
    });
  };

  return (
    <>
      {expectedColumns.map((column) => (
        <div className="flex gap-2" key={`input-wrapper-${column.value}`}>
          <label htmlFor={column.value}>{`${column.label}:`}</label>
          <select
            className="bg-slate-7 h-6"
            onChange={(e) => handleOverrideInputChange(e)}
            name={column.value}
            id={column.value}
            defaultValue={
              // TODO: Fuzzy match to a computed column
              ""
            }
          >
            <option value="">Select a column...</option>
            {parsedData.columns.map((parsedDataColumn) => (
              <option key={parsedDataColumn} value={parsedDataColumn}>
                {parsedDataColumn}
              </option>
            ))}
          </select>
        </div>
      ))}
    </>
  );
};

export { CSVInputs };
