import moment from "moment";
import { Constants, LEGEND_ITEMS } from "./Constants";
import { PlanPartInterface } from "./Interfaces";

const getItemBackground = (item) => {
  if (item.taskType) {
    return (
      LEGEND_ITEMS.find((o) => o.code === item.taskType["task-category"])
        ?.color || "#CFCBC8"
    );
  }

  if (item.applicationType) {
    return (
      LEGEND_ITEMS.find((o) => o.code === item.applicationType)?.color ||
      "#CFCBC8"
    );
  }
};

const buildData = (
  data: Array<PlanPartInterface>,
  items: Array<any>,
  level: number,
  groupParentId: number | null,
  itemParentId: number | null,
  groupsMap: Record<string, any>
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
        title:
          item.resource?.title !== "unknown" ? item.resource?.title : "Other",
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
      title: item.title ? item.title : "Other",
      start: startDate,
      end: endDate,
      parent: itemParentId,
      className: "item",
      bgColor: getItemBackground(item),
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
      removable: false,
    });

    if (item.planParts && item.planParts.length > 0) {
      buildData(
        item.planParts,
        items,
        level + 1,
        groupsMap.get(resourceId)?.id,
        itemId,
        groupsMap
      );
    }
  }
};

const pushResourcesToTaskList = (items, taskListWithResources, groups) => {
  for (const item of items) {
    taskListWithResources.push({
      resource: groups.find((i) => i.id === item.group),
      ...item,
    });
  }
};

export { buildData, pushResourcesToTaskList };
