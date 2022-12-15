import React, { useEffect, useState } from "react";
import PlanningTool from "react-maintenance-planner";
import { LEGEND_ITEMS } from "../utils/Constants";
import TasksTable from "./table/TasksTable";
import { buildData, pushResourcesToTaskList } from "../utils/Utils";
import classNames from "classnames";

import {
  GroupInterface,
  PlanPartInterface,
  RevisionPlanInterface,
} from "../utils/Interfaces";

import "react-maintenance-planner/dist/react-maintenance-planner.css";
import * as styles from "./PlanEditor.module.scss";

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
  const [showTCTypeCategory, setShowTCTypeCategory] = useState<boolean>(false);

  const workPackageItems: Array<PlanPartInterface> = [];
  const taskListWithResources: Array<PlanPartInterface> = [];
  const groups: Array<GroupInterface> = [];

  const dataWithoutRevisionPlan = workPackage[0].planParts;

  useEffect(() => {
    setTaskList([...taskListWithResources]);
  }, [showTCTypeCategory]);

  useEffect(() => {
    setShowTCTypeCategory((prevState) => !prevState);
  }, []);

  buildData(
    dataWithoutRevisionPlan,
    workPackageItems,
    0,
    null,
    null,
    groups,
    showTCTypeCategory
  );

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

  const viewTableOnClick = () => {
    setIsActive({
      planEditor: false,
      table: true,
      taskList: false,
    });
  };

  console.log(groups);

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
        <button
          onClick={() => setShowTCTypeCategory((prevState) => !prevState)}
        >
          Toggle Task Card Type Group
        </button>
      </div>
      {isActive.planEditor && taskList.length > 0 && (
        <div style={showPopUp()}>
          <span key={showTCTypeCategory.toString()}>
            <h4>{workPackageTitle}</h4>
            <PlanningTool
              items={taskList}
              groups={groups}
              legendItems={LEGEND_ITEMS}
            />
          </span>
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
