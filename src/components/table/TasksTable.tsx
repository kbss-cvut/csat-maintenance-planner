import React, { useState } from "react";
import { Cell, Column, HeaderCell, SortType, Table } from "rsuite-table";
import { GroupInterface, PlanPartInterface } from "../../utils/Interfaces";
import {
  ActionCell,
  DateCell,
  EditableCell,
  NestedEditableCell,
} from "./Cells";

import "rsuite-table/dist/css/rsuite-table.css";

interface Props {
  taskList: Array<PlanPartInterface>;
  groups: Array<GroupInterface>;
}

const TasksTable = ({ taskList, groups }: Props) => {
  const [sortColumn, setSortColumn] = useState<string>("id");
  const [sortType, setSortType] = useState<SortType | undefined | never>("asc");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<Array<PlanPartInterface>>(taskList);
  const nextData: Array<PlanPartInterface> = Object.assign([], data);

  const sortData = (data) => {
    if (sortColumn && sortType && taskList) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        if (typeof x === "string") {
          x = x.charCodeAt(0);
        }
        if (typeof y === "string") {
          y = y.charCodeAt(0);
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return data;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setIsLoading(true);
    setTimeout(() => {
      setSortColumn(sortColumn);
      setSortType(sortType);
      setIsLoading(false);
    }, 500);
  };

  const getTaskProgress = (task) => {
    const plannedWorkedTime = task.plannedWorkTime;
    const workedTime = task.workTime;
    const taskProgress = workedTime / plannedWorkedTime;
    if (!taskProgress) return 0;
    return taskProgress;
  };

  const handleChange = (id, key, value) => {
    // @ts-ignore
    nextData.find((item) => item.id === id)[key] = value;
  };

  const handleNestedChange = (id, key1, key2, value) => {
    // @ts-ignore
    nextData.find((item) => item.id === id)[key1][key2] = value;
  };

  const handleDateChange = (id, key, value) => {
    // @ts-ignore
    nextData.find((item) => item.id === id)[key] = value;
  };

  const handleEditState = (id) => {
    const activeItem: PlanPartInterface | any = nextData.find(
      (item) => item.id === id
    );
    activeItem.status = activeItem.status ? null : "EDIT";
    setData(nextData);
  };

  return (
    <Table
      data={sortData(taskList)}
      headerHeight={40}
      rowHeight={30}
      sortColumn={sortColumn}
      sortType={sortType}
      onSortColumn={handleSortColumn}
      virtualized={true}
      fillHeight={true}
      loading={isLoading}
    >
      <Column flexGrow={2} sortable>
        <HeaderCell>ID</HeaderCell>
        <Cell>{(rowData) => rowData.id.split("/").pop()}</Cell>
      </Column>

      <Column flexGrow={2}>
        <HeaderCell>Resource</HeaderCell>
        <NestedEditableCell
          rowData={taskList}
          dataKey1="resource"
          dataKey2="title"
          onChange={handleNestedChange}
          groups={groups}
        />
      </Column>

      <Column flexGrow={1.5} sortable>
        <HeaderCell>Start</HeaderCell>
        <DateCell
          dataKey="start"
          onChange={handleDateChange}
          rowData={taskList}
        />
      </Column>

      <Column flexGrow={1.5} sortable>
        <HeaderCell>End</HeaderCell>
        <DateCell
          dataKey="end"
          onChange={handleDateChange}
          rowData={taskList}
        />
      </Column>

      <Column flexGrow={5} sortable>
        <HeaderCell>Title / Description</HeaderCell>
        <EditableCell
          rowData={taskList}
          dataKey="title"
          onChange={handleChange}
        />
      </Column>

      <Column flexGrow={1} sortable>
        <HeaderCell>Type</HeaderCell>
        <Cell rowData={taskList} dataKey="applicationType" />
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Man Hours</HeaderCell>
        <Cell>
          {(rowData) => {
            return (
              <div>
                {rowData.workTime
                  ? new Date(rowData.workTime).getHours()
                  : "NaN"}
              </div>
            );
          }}
        </Cell>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Progress</HeaderCell>
        <Cell>
          {(rowData) => {
            return (
              <div>
                {rowData.workTime
                  ? getTaskProgress(rowData) * 100 + "%"
                  : "NaN"}
              </div>
            );
          }}
        </Cell>
      </Column>

      <Column flexGrow={1}>
        <HeaderCell>Actions</HeaderCell>
        <ActionCell dataKey="id" rowData={taskList} onClick={handleEditState} />
      </Column>
    </Table>
  );
};
export default TasksTable;
