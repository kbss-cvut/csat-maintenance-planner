import React from "react";
import { Cell } from "rsuite-table";

interface EditableCellProps {
  rowData: any;
  dataKey: string;
  onChange: (dataId: string | number, dataKey: string, value: string) => void;
}

interface ActionCellProps {
  rowData: any;
  dataKey: string;
  onClick: (dataId: string) => void | any;
}

const EditableCell = ({
  rowData,
  dataKey,
  onChange,
  ...props
}: EditableCellProps) => {
  const editing = rowData.status === "EDIT";
  return (
    <Cell {...props} className={editing ? "table-content-editing" : ""}>
      {editing ? (
        <input
          className="rs-input"
          defaultValue={rowData[dataKey]}
          onChange={(event) => {
            onChange && onChange(rowData.id, dataKey, event.target.value);
          }}
        />
      ) : (
        <span className="table-content-edit-span">{rowData[dataKey]}</span>
      )}
    </Cell>
  );
};

const ActionCell = ({
  rowData,
  dataKey,
  onClick,
  ...props
}: ActionCellProps) => {
  return (
    <Cell {...props}>
      <a
        onClick={() => {
          onClick && onClick(rowData.id);
        }}
      >
        {rowData.status === "EDIT" ? "Save" : "Edit"}
      </a>
    </Cell>
  );
};

export { EditableCell, ActionCell };
