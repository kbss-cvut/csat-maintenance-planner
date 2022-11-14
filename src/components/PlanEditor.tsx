import React, { useState } from "react";
import PlanningTool from "react-maintenance-planner";
import moment from "moment";
import Constants from "../utils/Constants";
import { Cell, Column, HeaderCell, SortType, Table } from "rsuite-table";

import "rsuite-table/dist/css/rsuite-table.css";
import "react-maintenance-planner/dist/react-maintenance-planner.css";
import * as styles from "./PlanEditor.module.scss";
import { PlanPartInterface } from "../utils/Interfaces";

interface Props {
  workPackage: any;
  hidePopup?: boolean;
}

const PlanEditor = ({ workPackage, hidePopup = false }: Props) => {
  const [isActive, setIsActive] = useState({
    planEditor: true,
    table: false,
    taskList: false,
  });
  // const [popup, setPopup] = useState({
  //   open: false,
  //   item: null,
  //   group: null,
  // });
  const [sortColumn, setSortColumn] = useState("id");
  const [sortType, setSortType] = useState<SortType | undefined | never>("asc");
  const [isLoading, setIsLoading] = useState(false);

  const items: any = [];
  // const unknownItems = [];
  const taskList: Array<PlanPartInterface> = [];

  const groupsMap = new Map();
  // const unknownGroupsMaps = new Map();

  const getTaskBackground = (task) => {
    if (!task.taskType) {
      return "#2196F3";
    }
    switch (task.taskType["task-category"]) {
      case "scheduled-wo":
        return "#aa0000";
      case "task-card":
        return "#00aa00";
      case "maintenance-wo":
        return "#0000aa";
      default:
        return "#2196F3";
    }
  };

  const getItemTitle = (item) => {
    if (!item.title) {
      return "";
    }
    return item.title;
  };

  // const mapUnknownResources = (groupsMap, unknownGroupsMaps) => {
  //   for (const [key, value] of groupsMap.entries()) {
  //     if (value.title === "unknown") {
  //       unknownGroupsMaps.set(key, value);
  //       groupsMap.delete(key);
  //     }
  //
  //     for (const [key2, value2] of unknownGroupsMaps.entries()) {
  //       if (value.parent === value2.id) {
  //         unknownGroupsMaps.set(key, value);
  //         groupsMap.delete(key);
  //       }
  //     }
  //   }
  // };

  // const pushUnknownItems = (unknownGroupsMap, items, unknownItems) => {
  //   for (const item of items) {
  //     for (const [key, value] of unknownGroupsMap.entries()) {
  //       if (value.id === item.group) {
  //         unknownItems.push({
  //           label: item.title || "Unknown",
  //           ...item,
  //         });
  //       }
  //     }
  //   }
  // };

  const pushTaskList = (items, taskList) => {
    for (const item of items) {
      if (
        item.applicationType !== Constants.APPLICATION_TYPE.RESTRICTION_PLAN &&
        item.applicationType !== Constants.APPLICATION_TYPE.GENERAL_TASK_PLAN &&
        item.applicationType !== Constants.APPLICATION_TYPE.PHASE_PLAN
      ) {
        taskList.push({
          resource: groups.find((i) => i.id === item.group),
          ...item,
        });
      }
    }
  };

  const buildData = (data, items, level, groupParentId, itemParentId) => {
    if (!data) {
      return;
    }

    for (const item of data) {
      const resourceId =
        item.resource?.id + " - " + item.resource?.applicationType;

      if (!groupsMap.has(resourceId)) {
        groupsMap.set(resourceId, {
          id: groupsMap.size,
          title: item.resource?.title ? item.resource?.title : "-",
          hasChildren: item.planParts && item.planParts.length > 0,
          parent: groupParentId,
          open: level < 0,
          show: level < 1,
          level: level,
        });
      }

      const startDate = moment(
        item.applicationType === Constants.APPLICATION_TYPE.SESSION_PLAN
          ? item.startTime
          : item.plannedStartTime
      );
      const endDate = moment(
        item.applicationType === Constants.APPLICATION_TYPE.SESSION_PLAN
          ? item.endTime
          : item.plannedEndTime
      );
      const itemId = items.length + 1;

      items.push({
        id: itemId,
        group: groupsMap.get(resourceId)?.id,
        title: getItemTitle(item),
        label: getItemTitle(item) || "Unknown",
        start: startDate,
        end: endDate,
        parent: itemParentId,
        className: "item",
        bgColor: getTaskBackground(item),
        color: "#fff",
        selectedBgColor: "#FFC107",
        selectedColor: "#000",
        draggingBgColor: "#f00",
        highlightBgColor: "#FFA500",
        highlight: false,
        canMove: level > 1 && level !== 3,
        canResize: "both", //'left','right','both', false
        minimumDuration: 0, //minutes
        workTime: item.workTime,
        plannedWorkTime: item.plannedWorkTime,
        applicationType: item.applicationType,
        duration: item.duration,
        startTime: item.startTime,
        endTime: item.endTime,
      });

      if (item.planParts && item.planParts.length > 0) {
        buildData(
          item.planParts,
          items,
          level + 1,
          groupsMap.get(resourceId)?.id,
          itemId
        );
      }
    }
  };

  buildData(workPackage[0]?.planParts, items, 0, null, null);
  // mapUnknownResources(groupsMap, unknownGroupsMaps);
  // pushUnknownItems(unknownGroupsMaps, items, unknownItems);

  const groups = Array.from(groupsMap, ([key, values]) => values);
  pushTaskList(items, taskList);

  const getStyle = () => {
    if (hidePopup) {
      return { ["--display" as string]: "none" };
    }
    return {};
  };

  const viewPlanEditorOnClick = () => {
    setIsActive({
      planEditor: true,
      table: false,
      taskList: false,
    });
  };

  const viewUnknownTasksOnClick = () => {
    setIsActive({
      planEditor: false,
      table: true,
      taskList: false,
    });
  };

  const viewAllTasksOnClick = () => {
    setIsActive({
      planEditor: false,
      table: false,
      taskList: true,
    });
  };

  const getTaskProgress = (item) => {
    const plannedWorkedTime = item.plannedWorkTime;
    const workedTime = item.workTime;
    const taskProgress = workedTime / plannedWorkedTime;
    if (!taskProgress) return 0;
    return taskProgress;
  };

  // const onChange = (currentNode) => {
  //   setPopup({
  //     open: true,
  //     item: currentNode || null,
  //     group: groups.find((i) => i.id === currentNode.group),
  //   });
  // };

  const sortData = (data) => {
    if (sortColumn && sortType && taskList) {
      return data.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];

        if (!x) {
          x = a.resource.title;
        }
        if (!y) {
          y = b.resource.title;
        }

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

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <button
          className={isActive.planEditor && styles["active"]}
          onClick={viewPlanEditorOnClick}
        >
          Plan Editor
        </button>
        <button
          className={isActive.table && styles["active"]}
          onClick={viewUnknownTasksOnClick}
        >
          Table
        </button>
        {/*<button*/}
        {/*  className={isActive.taskList && styles["active"]}*/}
        {/*  onClick={viewAllTasksOnClick}*/}
        {/*>*/}
        {/*  Tasks*/}
        {/*</button>*/}
      </div>
      {isActive.planEditor && (
        <div style={getStyle()}>
          <PlanningTool items={items} groups={groups} />
        </div>
      )}
      {isActive.table && (
        <div className={styles["table"]}>
          <Table
            data={sortData(taskList)}
            sortColumn={sortColumn}
            sortType={sortType}
            onSortColumn={handleSortColumn}
            virtualized={true}
            fillHeight={true}
            loading={isLoading}
          >
            <Column flexGrow={1} sortable>
              <HeaderCell>ID</HeaderCell>
              <Cell dataKey="id" />
            </Column>

            <Column flexGrow={2} sortable>
              <HeaderCell>Resource</HeaderCell>
              <Cell dataKey="resource.title" />
            </Column>

            <Column flexGrow={1} sortable>
              <HeaderCell>Start</HeaderCell>
              <Cell dataKey="startTime">
                {(rowData, rowIndex) => {
                  return (
                    <div>
                      {new Date(rowData.startTime).toLocaleDateString("en-GB")}
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column flexGrow={1} sortable>
              <HeaderCell>End</HeaderCell>
              <Cell dataKey="endTime">
                {(rowData, rowIndex) => {
                  return (
                    <div>
                      {new Date(rowData.endTime).toLocaleDateString("en-GB")}
                    </div>
                  );
                }}
              </Cell>
            </Column>

            <Column flexGrow={5} sortable>
              <HeaderCell>Title / Description</HeaderCell>
              <Cell dataKey={"label" ? "label" : "title"} />
            </Column>
          </Table>
        </div>
      )}
      {/*{isActive.taskList && (*/}
      {/*  <div className={styles["tree-select-container"]}>*/}
      {/*    <DropdownTreeSelect*/}
      {/*      className={"mdl-demo"}*/}
      {/*      data={taskList}*/}
      {/*      showDropdown={"always"}*/}
      {/*      keepOpenOnSelect={true}*/}
      {/*      mode={"simpleSelect"}*/}
      {/*      onChange={onChange}*/}
      {/*    />*/}
      {/*    {popup.item && popup.group && (*/}
      {/*      <div className={styles["popup-container"]}>*/}
      {/*        /!*<Popup*!/*/}
      {/*        /!*  item={popup.item}*!/*/}
      {/*        /!*  group={popup.group}*!/*/}
      {/*        /!*  progress={getTaskProgress(popup.item)}*!/*/}
      {/*/>*/}
      {/*      </div>*/}
      {/*    )}*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default PlanEditor;
