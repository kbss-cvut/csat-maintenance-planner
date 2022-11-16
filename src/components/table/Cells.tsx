import React from "react";
import { Cell } from "rsuite-table";

import styles from "./TasksTable.module.scss";

interface EditableCellProps {
  rowData: any;
  dataKey: string;
  onChange: (dataId: string | number, dataKey: string, value: string) => void;
}

interface NestedCellProps {
  rowData: any;
  dataKey1: string;
  dataKey2: string;
  onChange: (
    dataId: string | number,
    dataKey1: string,
    dataKey2: string,
    value: string
  ) => void;
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

const NestedEditableCell = ({
  rowData,
  dataKey1,
  dataKey2,
  onChange,
  ...props
}: NestedCellProps) => {
  const editing = rowData.status === "EDIT";
  return (
    <Cell {...props} className={editing ? "table-content-editing" : ""}>
      {editing ? (
        <input
          className="rs-input"
          defaultValue={rowData[dataKey1][dataKey2]}
          onChange={(event) => {
            onChange &&
              onChange(rowData.id, dataKey1, dataKey2, event.target.value);
          }}
        />
      ) : (
        <span className="table-content-edit-span">
          {rowData[dataKey1][dataKey2]}
        </span>
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
        className={styles["action-button"]}
        onClick={() => {
          onClick && onClick(rowData.id);
        }}
      >
        {rowData.status === "EDIT" ? "Save" : "Edit"}
      </a>
    </Cell>
  );
};

export { EditableCell, NestedEditableCell, ActionCell };
