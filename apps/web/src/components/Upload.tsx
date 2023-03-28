import { useState } from "react";
import { z } from "zod";
import { api } from "~/utils/api";
import { csvToJson, mapCsvProperties } from "~/utils/csv";
import { mockData, overrides } from "~/utils/mockData";
import { subscriberSchema } from "~/utils/schemas";

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

export { Upload };
