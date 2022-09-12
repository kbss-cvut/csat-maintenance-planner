import React, { useState } from "react";
import PlanningTool from "react-maintenance-planner";
import moment from "moment";
import Constants from "../utils/Constants";

import "react-maintenance-planner/dist/react-maintenance-planner.css";
import * as styles from "./PlanEditor.module.scss";

interface Props {
  workPackage: any;
  hidePopup?: boolean;
}

const PlanEditor = ({ workPackage, hidePopup = false }: Props) => {
  const items = [];
  const groupsMap = new Map();

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

  const buildData = (
    data,
    groupsMap,
    items,
    level,
    groupParentId,
    itemParentId
  ) => {
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
        group: groupsMap.get(resourceId).id,
        title: getItemTitle(item),
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
      });

      if (item.planParts && item.planParts.length > 0) {
        buildData(
          item.planParts,
          groupsMap,
          items,
          level + 1,
          groupsMap.get(resourceId).id,
          itemId
        );
      }
    }
  };

  // buildData(workPackage[0].planParts, groupsMap, items, 0, null, null);
  const groups = Array.from(groupsMap, ([key, values]) => values);

  const getStyle = () => {
    if (hidePopup) {
      return { ["--display" as string]: "none" };
    }
    return {};
  };

  return (
    <div className={styles["container"]} style={getStyle()}>
      {/*<PlanningTool items={items} groups={groups} />*/}
    </div>
  );
};

export default PlanEditor;
