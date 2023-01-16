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

const pushItem = (
  items: Array<any>,
  itemId: number,
  resourceId: string,
  item: any,
  startDate,
  endDate,
  itemParentId: number | null,
  level: number,
  isHidden: boolean
) => {
  items.push({
    id: itemId,
    group: resourceId,
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
    requiredPlans: item.requiringPlans?.length > 0 && item.requiringPlans,
  });
};

const isItemHidden = (showTCTypeCategory: boolean, item) => {
  let isHidden: boolean = false;
  if (
    !showTCTypeCategory &&
    item.applicationType === Constants.APPLICATION_TYPE.TASK_CARD_TYPE_GROUP
  ) {
    isHidden = true;
  }

  if (
    showTCTypeCategory ||
    (!showTCTypeCategory &&
      item.applicationType !== Constants.APPLICATION_TYPE.TASK_CARD_TYPE_GROUP)
  ) {
    isHidden = false;
  }

  return isHidden;
};

const getStartAndEndDates = (item) => {
  let startDate;
  if (!item.startTime && !item.plannedStartTime) {
    startDate = null;
  } else {
    startDate = moment(item.startTime ? item.startTime : item.plannedStartTime);
  }

  let endDate;
  if (!item.endTime && !item.plannedEndTime) {
    endDate = null;
  } else {
    endDate = moment(item.endTime ? item.endTime : item.plannedEndTime);
  }
  return { startDate, endDate };
};

const buildData = (
  data: Array<any>,
  items: Array<any>,
  level: number,
  groupParentId: number | null,
  itemParentId: number | null,
  groups: Array<any>,
  showTCTypeCategory: boolean
) => {
  if (!data) {
    return;
  }

  let modifiedGroup;

  for (const item of data) {
    let resourceId;
    let resourceTitle;

    if (item.resource) {
      resourceId = item.resource.entityURI;
      resourceTitle =
        item.resource.title !== "unknown" ? item.resource.title : "Other";
    } else {
      resourceId = Math.random().toString(36).substring(2, 15);
      resourceTitle = resourceId;
    }

    if (!groups.find((i) => i.id === resourceId)) {
      groups.push({
        id: resourceId,
        title: resourceTitle,
        hasChildren: item.planParts && item.planParts.length > 0,
        parent: groupParentId,
        open: level < 0,
        show: level < 1,
        level: level,
      });
    }

    const alreadyExistingGroup = groups
      .filter((g) => g.id === resourceId)
      .filter((g) => g.parent !== groupParentId);

    if (alreadyExistingGroup.length > 0)
      resourceId = resourceId + level + groupParentId + itemParentId;

    modifiedGroup = alreadyExistingGroup.map(() => {
      return {
        id: resourceId,
        title: resourceTitle,
        hasChildren: item.planParts && item.planParts.length > 0,
        parent: groupParentId,
        open: level < 0,
        show: level < 1,
        level: level,
      };
    });

    let { startDate, endDate } = getStartAndEndDates(item);

    const itemId = item.entityURI;
    const isHidden = isItemHidden(showTCTypeCategory, item);

    pushItem(
      items,
      itemId,
      resourceId,
      item,
      startDate,
      endDate,
      itemParentId,
      level,
      isHidden
    );

    if (item.planParts && item.planParts.length > 0) {
      buildData(
        item.planParts,
        items,
        level + 1,
        groups.find((i) => i.id === resourceId).id,
        itemId,
        groups,
        showTCTypeCategory
      );
    }
  }
  groups.push(...modifiedGroup);
};

const pushResourcesToTaskList = (items, taskListWithResources, groups) => {
  for (const item of items) {
    taskListWithResources.push({
      resource: groups.find((i) => i.id === item.group),
      ...item,
    });
  }
};

const pushRestrictionsToTaskList = (
  taskList,
  taskListWithRestrictions,
  restrictedItems
) => {
  const tasksRestrictionsMap = {};
  for (const restrictedItem of restrictedItems) {
    tasksRestrictionsMap[restrictedItem.entityURI] =
      restrictedItem.linkedItemsIDs;
  }
  for (const task of taskList) {
    const updatedTask = { ...task };
    if (tasksRestrictionsMap[task.id]) {
      updatedTask.linkedItemsIDs = tasksRestrictionsMap[task.id];
    }
    taskListWithRestrictions.push(updatedTask);
  }
};

const getRestrictedTasks = (tasks) => {
  const restrictedItems: Array<PlanPartInterface> = [];

  for (const task of tasks) {
    if (task.applicationType === Constants.APPLICATION_TYPE.RESTRICTION_PLAN) {
      if (task.requiredPlans?.length > 0) {
        const requiredPlans = task.requiredPlans;
        for (const requiredPlan of requiredPlans) {
          if (requiredPlan.planParts?.length > 0) {
            const planParts = requiredPlan.planParts;
            for (const planPart of planParts) {
              restrictedItems.push({ ...planPart, linkedItemsIDs: task.id });
            }
          }
        }
      }
    }
  }

  const mergedRestrictedItems = {};
  for (const item of restrictedItems) {
    const { entityURI, linkedItemsIDs, ...otherProperties } = item;
    if (mergedRestrictedItems[entityURI]) {
      mergedRestrictedItems[entityURI].linkedItemsIDs.push(linkedItemsIDs);
    } else {
      mergedRestrictedItems[entityURI] = {
        entityURI,
        linkedItemsIDs: [linkedItemsIDs],
        ...otherProperties,
      };
    }
  }
  const mergedRestrictedItemsArray = Object.values(mergedRestrictedItems);
  return mergedRestrictedItemsArray;
};

export {
  buildData,
  pushResourcesToTaskList,
  getRestrictedTasks,
  pushRestrictionsToTaskList,
};
