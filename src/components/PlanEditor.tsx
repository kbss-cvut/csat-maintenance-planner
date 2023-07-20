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
  calculatePlannedWorkTimeSumFromParts,
  calculateEstSumFromParts
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
  showPlannedSchedule: boolean;
  setShowPlannedScheduled;
  calculatePlanView
}

const PlanEditor = ({
  workPackage,
  isFullScreen = false,
  workPackageTitle,
  showPlannedSchedule,
  setShowPlannedScheduled,
  calculatePlanView
}: Props) => {
  const [isActive, setIsActive] = useState({
    planEditor: true,
    table: false,
    taskList: false,
  });
  const [taskList, setTaskList] = useState<Array<PlanPartInterface>>([]);
  const [groups, setGroups] = useState<Array<GroupInterface>>([]);
  const [filteredTaskTypes, setFilteredTaskTypes] = useState<Array<string>>(LEGEND_ITEMS.filter(i => i.active).map(i => i.code));
  const [unplannedTasksCount, setUnplannedTasksCount] = useState<number>(0);
  const [aircraftModel, setAircraftModel] = useState<string | null>();

  useEffect(() => {
    const taskListWithRestrictions = calculatePlanView(workPackage);
    updateHiddenTasks(taskListWithRestrictions.taskListWithRestrictions, filteredTaskTypes);

    // setTaskList([...taskListWithRestrictions.taskListWithRestrictions.filter(t => t.applicationType?.includes("PhasePlan"))]);
    setTaskList([...taskListWithRestrictions.taskListWithRestrictions]);
    setGroups([...taskListWithRestrictions._groups]);
  }, [workPackage, showPlannedSchedule]);

  useEffect(() => {
    if(taskList.length == null && workPackage != null && workPackage.planParts != null && workPackage.planParts.length > 0){
      const taskListWithRestrictions = calculatePlanView(workPackage);
      // updateHiddenTasks(taskListWithRestrictions, filteredTaskTypes);
      setTaskList([...taskListWithRestrictions.taskListWithRestrictions]);
      setGroups([...taskListWithRestrictions._groups]);
    }
    setUnplannedTasksCount(taskList.filter((i) => !i.start || !i.end).length);
  }, [taskList]);

  useEffect(() => {
    const acmodel = getAircraftModel(taskList);
    if (acmodel) {
      setAircraftModel(acmodel.taskType.acmodel);
    }
  }, [taskList]);

  const handleChangeShowPlannedSchedule = (event) => {
    const val = event.target.checked;
    setShowPlannedScheduled(val);
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

  const updateHiddenTasks = (taskList, taskTypes: Array<string>) => {
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
  }

  const handleOnLabelClick = (taskTypes: Array<string>) => {
    updateHiddenTasks(taskList, taskTypes);
    setFilteredTaskTypes(taskTypes);
  };

  return (
    <div className={styles["container"]}>
      <div className={styles["header"]}>
        <label className={styles["schedule-selector-label"]}>
          <input className={styles["schedule-selector-checkbox"]}  type="checkbox" checked={showPlannedSchedule} onChange={handleChangeShowPlannedSchedule}/>
          {showPlannedSchedule ? "planned schedule" : "planned and session log schedule" }
        </label>
        <div className={styles["editor-view"]}>
          <button
            className={isActive.planEditor ? styles["active"] : ""}
            onClick={viewPlanEditorOnClick}
          >
            Plan Editor
          </button>
          <button
            className={isActive.table ? styles["active"] : ""}
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
            isFullScreen ? styles["table-full-screen"] : "",
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
