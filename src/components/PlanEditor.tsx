import React, { useEffect, useState } from "react";
import PlanningTool from "react-maintenance-planner";
import { LEGEND_ITEMS } from "../utils/Constants";
import TasksTable from "./table/TasksTable";
import {
  buildData,
  pushResourcesToTaskList,
  getRestrictedTasks,
  pushRestrictionsToTaskList,
} from "../utils/Utils";
import classNames from "classnames";
import Legend from "./Legend";

import {
  GroupInterface,
  PlanPartInterface,
  RevisionPlanInterface,
} from "../utils/Interfaces";

import "react-maintenance-planner/dist/react-maintenance-planner.css";
import * as styles from "./PlanEditor.module.scss";
import Tooltip from "./Tooltip";

interface Props {
  workPackage: RevisionPlanInterface;
  workPackageTitle: string;
  isFullScreen?: boolean;
}

const PlanEditor = ({
  workPackage,
  isFullScreen = false,
  workPackageTitle,
}: Props) => {
  const [isActive, setIsActive] = useState({
    planEditor: true,
    table: false,
    taskList: false,
  });
  const [taskList, setTaskList] = useState<Array<PlanPartInterface>>([]);
  const [filteredTaskList, setFilteredTaskList] = useState<
    Array<PlanPartInterface>
  >([]);
  const [filteredTaskTypes, setFilteredTaskTypes] = useState<Array<string>>([]);

  const workPackageItems: Array<PlanPartInterface> = [];
  const taskListWithResources: Array<PlanPartInterface> = [];
  const taskListWithRestrictions: Array<PlanPartInterface> = [];
  const groups: Array<GroupInterface> = [];

  const dataWithoutRevisionPlan = workPackage[0].planParts;

  useEffect(() => {
    updateData();
    setTaskList([...taskListWithRestrictions]);
  }, []);

  useEffect(() => {
    const filteredTaskList = taskList.filter((i) => {
      if (i.taskType?.["task-category"]) {
        return i.taskType?.["task-category"]
          ? filteredTaskTypes.some((selected) =>
              i.taskType?.["task-category"]?.includes(selected)
            )
          : false;
      }
      if (i.applicationType) {
        return i.applicationType
          ? filteredTaskTypes.some((selected) =>
              i.applicationType?.includes(selected)
            )
          : false;
      }
    });
    setFilteredTaskList(filteredTaskList);
  }, [filteredTaskTypes]);

  buildData(dataWithoutRevisionPlan, workPackageItems, 0, null, null, groups);

  const updateData = () => {
    pushResourcesToTaskList(workPackageItems, taskListWithResources, groups);
    const restrictedItems = getRestrictedTasks(taskList);
    pushRestrictionsToTaskList(
      taskListWithResources,
      taskListWithRestrictions,
      restrictedItems
    );
  };

  const showPopUp = () => {
    if (!isFullScreen) {
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

  const viewTableOnClick = () => {
    setIsActive({
      planEditor: false,
      table: true,
      taskList: false,
    });
  };

  const handleOnLabelClick = (taskTypes: Array<string>) => {
    setFilteredTaskTypes(taskTypes);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <div className={styles["editor-view"]}>
          <button
            className={isActive.planEditor && styles["active"]}
            onClick={viewPlanEditorOnClick}
          >
            Plan Editor
          </button>
          <button
            className={isActive.table && styles["active"]}
            onClick={viewTableOnClick}
          >
            Table
          </button>
        </div>
      </div>

      {isActive.planEditor && taskList.length > 0 && taskList && (
        <div style={showPopUp()}>
          <h4>{workPackageTitle}</h4>
          <div className={styles["editor-container"]}>
            <div className={styles["editor"]}>
              <PlanningTool
                key={filteredTaskList}
                items={
                  filteredTaskList.length > 0 ? filteredTaskList : taskList
                }
                groups={groups}
                tooltip={<Tooltip />}
              />
            </div>
            <div className={styles["fixed-legend"]}>
              <Legend
                title={"Legend"}
                items={LEGEND_ITEMS}
                onSelectLegendItem={handleOnLabelClick}
              />
            </div>
          </div>
        </div>
      )}
      {isActive.table && taskList.length > 0 && (
        <div
          className={classNames([
            styles["table"],
            isFullScreen && styles["table-full-screen"],
          ])}
        >
          <TasksTable taskList={taskList} groups={groups} />
        </div>
      )}
    </div>
  );
};

export default PlanEditor;
