import React, { useEffect, useState } from "react";
import PlanningTool from "react-maintenance-planner";
import { LEGEND_ITEMS } from "../utils/Constants";
import TasksTable from "./table/TasksTable";
import { buildData, pushResourcesToTaskList } from "../utils/Utils";
import { ToggleSlider } from "react-toggle-slider";
import classNames from "classnames";

import {
  PlanPartInterface,
  ResourceInterface,
  RevisionPlanInterface,
} from "../utils/Interfaces";

import "react-maintenance-planner/dist/react-maintenance-planner.css";
import * as styles from "./PlanEditor.module.scss";

interface Props {
  workPackage: RevisionPlanInterface;
  isFullScreen?: boolean;
}

const PlanEditor = ({ workPackage, isFullScreen = false }: Props) => {
  const [isActive, setIsActive] = useState({
    planEditor: true,
    table: false,
    taskList: false,
  });
  const [taskList, setTaskList] = useState<Array<PlanPartInterface>>([]);
  const [resources, setResources] = useState<Array<ResourceInterface>>([]);
  const [showTCTypeCategory, setShowTCTypeCategory] = useState<boolean>(false);

  const workPackageItems: Array<PlanPartInterface> = [];
  const taskListWithResources: Array<PlanPartInterface> = [];
  const groupsMap = new Map();

  const dataWithoutRevisionPlan = workPackage[0].planParts;

  useEffect(() => {
    setTaskList([...taskListWithResources]);
    setResources([...groups]);
  }, [showTCTypeCategory]);

  buildData(
    dataWithoutRevisionPlan,
    workPackageItems,
    0,
    null,
    null,
    groupsMap,
    showTCTypeCategory
  );

  const groups = Array.from(groupsMap, ([key, values]) => values);
  pushResourcesToTaskList(workPackageItems, taskListWithResources, groups);

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

  const viewUnknownTasksOnClick = () => {
    setIsActive({
      planEditor: false,
      table: true,
      taskList: false,
    });
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
            onClick={viewUnknownTasksOnClick}
          >
            Table
          </button>
        </div>
        <ToggleSlider onToggle={(state) => setShowTCTypeCategory(state)} />
        <h4>Toggle Task Card Type Group</h4>
      </div>
      {isActive.planEditor && taskList.length > 0 && (
        <div style={showPopUp()}>
          <div key={taskList.toString()}>
            <PlanningTool
              items={taskList}
              groups={resources}
              legendItems={LEGEND_ITEMS}
            />
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
          <TasksTable taskList={taskList} />
        </div>
      )}
    </div>
  );
};

export default PlanEditor;
