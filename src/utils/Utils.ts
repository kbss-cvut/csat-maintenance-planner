import moment from "moment";
import { Constants, LEGEND_ITEMS, PHASE_PLAN_TITLES } from "./Constants";
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

const getItemTitle = (item) => {
  const title = item.title;
  if (item.applicationType === Constants.APPLICATION_TYPE.PHASE_PLAN) {
    return PHASE_PLAN_TITLES.find((o) => o.id === item.title)?.title || "Other";
  }
  if (!title || title.toUpperCase() === "UNKNOWN") {
    return "Other";
  }

  return title;
};

const buildData = (
  data: Array<any>,
  items: Array<any>,
  level: number,
  groupParentId: number | null,
  itemParentId: number | null,
  groupsMap: Array<any>,
  showTCTypeCategory: boolean
) => {
  if (!data) {
    return;
  }

  const pushItem = (
    itemId: number,
    resourceId: string,
    item: PlanPartInterface,
    startDate,
    endDate,
    isHidden: boolean
  ) => {
    items.push({
      id: itemId,
      group: groupsMap.find((i) => i.id === resourceId).id,
      title: getItemTitle(item),
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
      isHidden: isHidden,
    });
  };

  for (const item of data) {
    const resourceId = item.resource?.entityURI;
    if (!groupsMap.find((i) => i.id === resourceId)) {
      groupsMap.push({
        id: resourceId,
        title:
          item.resource?.title !== "unknown" ? item.resource?.title : "Other",
        hasChildren: item.planParts && item.planParts.length > 0,
        parent: groupParentId,
        open: level < 0,
        show: level < 1,
        level: level,
      });
    }

    let startDate;
    if (!item.startTime && !item.plannedStartTime) {
      startDate = null;
    } else {
      startDate = moment(
        item.startTime ? item.startTime : item.plannedStartTime
      );
    }

    let endDate;
    if (!item.endTime && !item.plannedEndTime) {
      endDate = null;
    } else {
      endDate = moment(
        item.endTime ? item.plannedEndTime : item.plannedEndTime
      );
    }

    const itemId = item.entityURI;

    if (
      !showTCTypeCategory &&
      item.applicationType === Constants.APPLICATION_TYPE.TASK_CARD_TYPE_GROUP
    ) {
      pushItem(itemId, resourceId, item, startDate, endDate, true);
    }

    if (
      showTCTypeCategory ||
      (!showTCTypeCategory &&
        item.applicationType !==
          Constants.APPLICATION_TYPE.TASK_CARD_TYPE_GROUP)
    ) {
      pushItem(itemId, resourceId, item, startDate, endDate, false);
    }

    if (item.planParts && item.planParts.length > 0) {
      buildData(
        item.planParts,
        items,
        level + 1,
        groupsMap.find((i) => i.id === resourceId).id,
        itemId,
        groupsMap,
        showTCTypeCategory
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
