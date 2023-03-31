// TODO: don't love the name of this file but I'm a bit too tired to think about it.

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
  const [rerenderForcer, setRerenderForcer] = useState(0);
  const forceRerender = () => setRerenderForcer((prev) => prev + 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    forceRerender();
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
    forceRerender();
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      {fileData && (
        <div className="flex flex-col space-y-2">
          {/* // TODO: THIS ISN'T WORKING CORRECTLY, the autocomplete only responds on odd number of uploads */}
          <OverwriteInputs key={rerenderForcer} csv={fileData} />
        </div>
      )}
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
        <div
          className="flex items-center gap-2"
          key={`input-wrapper-${column.value}`}
        >
          <label
            className="whitespace-nowrap"
            htmlFor={column.value}
          >{`${column.label}`}</label>
          <ArrowLeftIcon />
          <MapInput mappingTo={column.value} columns={parsedData.columns} />
        </div>
      ))}
    </>
  );
};

import { useComboboxState } from "ariakit/combobox";
import {
  Combobox,
  ComboboxItem,
  ComboboxPopover,
} from "~/components/ui/ComboBox";
import { useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/Button";

const normalizeText = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .trim();

const compareNormalized = (a: string, b: string) =>
  normalizeText(a) === normalizeText(b);

const MapInput = ({
  mappingTo,
  columns,
  ...props
}: {
  mappingTo: string;
  columns: string[];
}) => {
  const initialOverrides = columns.filter((column) =>
    compareNormalized(column, mappingTo)
  );
  const normalizedColumns = columns.map(normalizeText);
  const [selectedOverrides, setSelectedOverrides] = useState<string[]>(
    initialOverrides || []
  );

  const comboboxState = useComboboxState({
    setItems: (value) => {
      if (!value) return columns;
      return columns;
    },
    focusLoop: true,
    sameWidth: true,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddOverride = (value: string) => {
    console.log("init add override", value);
    if (value && normalizedColumns.includes(normalizeText(value))) {
      comboboxState.setValue("");
      console.log("adding override", value);
      setSelectedOverrides((prev) => [...prev, value]);
      comboboxState.setValue("");
    }
  };

  const { overrides, setOverrides } = useCsvDataStore();
  useEffect(() => {
    setOverrides(
      Object.assign({}, overrides, { [mappingTo]: selectedOverrides })
    );
  }, [selectedOverrides]);

  const filteredOptions = columns
    .filter(
      (column) =>
        !selectedOverrides.map(normalizeText).includes(normalizeText(column))
    )
    .filter((column) =>
      normalizeText(column).includes(normalizeText(comboboxState.value))
    );

  useEffect(() => {
    console.log("selectedOverrides", selectedOverrides);
    console.log("columns", columns);
    console.log("filteredOptions", filteredOptions);
    console.log("comboboxState.value", comboboxState.value);
    console.log("normalizedColumns", normalizedColumns);
  }, [selectedOverrides]);

  return (
    <>
      <div className="border-slate-6 bg-slate-4 text-slate-12 focus-within:ring-slate-7 flex w-full gap-1 rounded-md px-1">
        {selectedOverrides.map((item) => (
          <div
            className="bg-slate-7 my-1 flex items-center gap-1 rounded px-1"
            key={item}
          >
            {item}
            <Button
              onClick={() => {
                setSelectedOverrides((prev) => prev.filter((i) => i !== item));
              }}
              variant={"ghost"}
              size="sm"
              className="flex h-4 w-4 px-0"
            >
              <Cross1Icon className="h-3 w-3" />
            </Button>
          </div>
        ))}
        <Combobox
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (
                !comboboxState.value ||
                comboboxState.items[0]?.value ||
                filteredOptions.length < 1
              ) {
                e.stopPropagation();
                e.preventDefault();
              }
              if (filteredOptions.length > 0) {
                console.log("Combobox enter");
                console.log(
                  "virtual focus combobox",
                  comboboxState.virtualFocus
                );
                handleAddOverride(comboboxState.value);
              }
            }

            if (e.key === "Tab") {
              if (comboboxState.value && comboboxState.items[0]?.value) {
                e.stopPropagation();
                e.preventDefault();
                handleAddOverride(comboboxState.items[0]?.value || "");
              }
            }

            if (
              e.key === "Backspace" &&
              inputRef.current?.selectionStart === 0
            ) {
              setSelectedOverrides((prev) => prev.slice(0, -1));
            }
          }}
          ref={inputRef}
          variant={"ghost"}
          autoComplete="none"
          state={comboboxState}
          {...props}
        />
      </div>
      {filteredOptions.length > 0 && (
        <ComboboxPopover state={comboboxState}>
          {filteredOptions.map((column) => (
            <ComboboxItem
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  console.log("option enter");
                  console.log(
                    "virtual focus option",
                    comboboxState.virtualFocus
                  );
                  e.preventDefault();
                  handleAddOverride(column);
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                handleAddOverride(column);
              }}
              key={column}
              value={column}
            />
          ))}
        </ComboboxPopover>
      )}
    </>
  );
};

export { CSVInputs };
