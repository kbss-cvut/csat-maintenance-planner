import React, { useEffect, useState } from "react";
import PlanningTool from "react-maintenance-planner";
import { LEGEND_ITEMS } from "../utils/Constants";
import TasksTable from "./table/TasksTable";
import {
  buildData,
  pushResourcesToTaskList,
  getRestrictedTasks,
  pushRestrictionsToTaskList,
  getAircraftModel,
  calculateNumberOfMechanics,
} from "../utils/Utils";
import Legend from "./Legend";
import Tooltip from "./Tooltip";
import Badge from "./Badge";
import {
  GroupInterface,
  PlanPartInterface,
  RevisionPlanInterface,
} from "../utils/Interfaces";

import classNames from "classnames";
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
  const [filteredTaskTypes, setFilteredTaskTypes] = useState<Array<string>>([]);
  const [unplannedTasksCount, setUnplannedTasksCount] = useState<number>(0);
  const [aircraftModel, setAircraftModel] = useState<string | null>();

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
    setUnplannedTasksCount(taskList.filter((i) => !i.start || !i.end).length);
  }, [taskList]);

  dataWithoutRevisionPlan?.forEach(item => calculateNumberOfMechanics(item));
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

  useEffect(() => {
    const acmodel = getAircraftModel(taskList);
    if (acmodel) {
      setAircraftModel(acmodel.taskType.acmodel);
    }
  }, [taskList]);

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
    taskList.forEach((i) => {
      if(i.taskType?.["task-category"]) {
        i.isHidden = !taskTypes.some((selected) =>
            i.taskType?.["task-category"]?.includes(selected)
        );
      } else if(i.applicationType) {
        i.isHidden = !taskTypes.some((selected) =>
            i.applicationType?.includes(selected)
        );
      }
    });
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
            <Badge count={unplannedTasksCount} />
          </button>
        </div>
      </div>

      {isActive.planEditor && taskList.length > 0 && taskList && (
        <>
          <h3>{workPackageTitle}</h3>
          {aircraftModel && <h4>Aircraft Model: {aircraftModel}</h4>}
          <div className={styles["editor-container"]}>
            <div className={styles["editor"]}>
              <PlanningTool
                key={taskList}
                items={taskList}
                groups={groups}
                tooltip={<Tooltip />}
              />
            </div>

            <div
              className={classNames([
                styles["fixed-legend"],
                isFullScreen ? null : styles["hidden"],
              ])}
            >
              <Legend
                items={LEGEND_ITEMS}
                onSelectLegendItem={handleOnLabelClick}
              />
            </div>
          </div>
        </>
      )}
      {isActive.table && taskList.length > 0 && (
        <div
          className={classNames([
            styles["table"],
            isFullScreen && styles["table-full-screen"],
          ])}
        >
          <TasksTable
            taskList={taskList}
            groups={groups}
            handleEdit={setTaskList}
          />
        </div>
      )}
    </div>
  );
};

export default PlanEditor;
