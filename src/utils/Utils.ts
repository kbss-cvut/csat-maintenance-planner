import moment from "moment";
import { Constants, LEGEND_ITEMS, PHASE_PLAN_TITLES } from "./Constants";
import { GroupInterface, PlanPartInterface } from "./Interfaces";


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

const getItemTitle = (items, item, itemParentId) => {
  if (item.applicationType === Constants.APPLICATION_TYPE.PHASE_PLAN) {
	let title = item.title;
	if(title == "unknown")
	  title = "Other";
    return PHASE_PLAN_TITLES.find((o) => o.id === item.title)?.title || title;
  }

  if (item.applicationType === Constants.APPLICATION_TYPE.SESSION_PLAN) {
    return items.find((i) => i.id === itemParentId)?.title;
  }

  if (item.taskType?.title) {
    return item.taskType?.title;
  }

  if (!item.title || item.title.toUpperCase() === "UNKNOWN") {
    return "Other";
  }

  return item.title;
};

const getAircraftModel = (items) => {
  return items.find((i) => i.taskType?.acmodel);
};

const pushItem = (
  items: Array<any>,
  itemId: string,
  resourceId: string,
  item: any,
  startDate,
  endDate,
  itemParentId: string | null,
  level: number
) => {
  items.push({
    id: itemId,
    group: resourceId,
    title: getItemTitle(items, item, itemParentId),
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
    taskType: item.taskType,
    duration: item.duration,
    startTime: item.startTime,
    endTime: item.endTime,
    removable: false,
    requiredPlans: item.requiringPlans?.length > 0 && item.requiringPlans,
  });
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
  groupParentId: string | null,
  itemParentId: string | null,
  groups: Array<GroupInterface>
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
	
	const groupsToUpdateHasChildren = groups
      .filter((g) => g.id === resourceId)
      .filter((g) => g.parent === groupParentId);
	  
	groupsToUpdateHasChildren.forEach((g) => {
		g.hasChildren = g.hasChildren || (item.planParts && item.planParts.length > 0);
    });
	
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

    pushItem(
      items,
      itemId,
      resourceId,
      item,
      startDate,
      endDate,
      itemParentId,
      level
    );

    const group = groups.find((i) => i.id === resourceId)?.id;

    if (group) {
      if (item.planParts && item.planParts.length > 0) {
        buildData(item.planParts, items, level + 1, group, itemId, groups);
      }
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
  getAircraftModel,
};
