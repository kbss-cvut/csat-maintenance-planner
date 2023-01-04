export interface WorkPackageInterface {
  endTime: string;
  identifier: string;
  objectIdentifier: string;
  progressStatus: string;
  scheduledEndTime: string;
  scheduledStartTime: string;
  startTime: string;
}

export interface RevisionPlanInterface {
  type?: string;
  id?: number;
  title?: string;
  resource?: ResourceInterface;
  duration?: number;
  planParts?: PlanPartInterface[];
  plannedStartTime?: number | null;
  plannedEndTime?: number | null;
  plannedDuration?: null;
  plannedWorkTime?: number | null;
  startTime?: number | null;
  endTime?: number | null;
  workTime?: number;
}

export interface PlanPartInterface {
  type?: PlanPartType;
  id?: number;
  entityURI: string;
  title?: null | string;
  resource?: ResourceInterface;
  duration?: number | null;
  planParts?: PlanPartInterface[];
  plannedStartTime?: number | null;
  plannedEndTime?: number | null;
  plannedDuration?: null;
  plannedWorkTime?: number | null;
  startTime?: number | null;
  endTime?: number | null;
  workTime?: number;
  taskType?: TaskType;
  applicationType?: string;
  group?: any;
  start?: any;
  end?: any;
  parent?: any;
  linkedItemsIDs?: Array<string>;
}

export interface ResourceInterface {
  types?: ResourceType;
  id?: number;
  title?: string;
  entityURI?: null | string;
  applicationType?: string;
}

export enum ResourceType {
  Aircraft = "Aircraft",
  AircraftArea = "AircraftArea",
  Empty = "",
  MaintenanceGroup = "MaintenanceGroup",
  Mechanic = "Mechanic",
}

export interface TaskType {
  type?: TaskTypeType;
  id?: string;
  label?: string;
  scope?: string;
  acmodel?: null;
  area?: string;
  mpdtask?: null;
  phase?: Title;
  taskType?: string;
  "task-category"?: TaskCategory;
}

export enum Title {
  Empty = "-",
  Phase1 = "phase 1",
  Phase3 = "phase 3",
}

export enum TaskCategory {
  MaintenanceWo = "maintenance_wo",
  ScheduledWo = "scheduled_wo",
  TaskCard = "task_card",
}

export enum TaskTypeType {
  TaskType = "TaskType",
}

export enum PlanPartType {
  SessionPlan = "SessionPlan",
  TaskPlan = "TaskPlan",
}

export interface GroupInterface {
  hasChildren: boolean;
  id: number;
  open: boolean;
  parent: number | null;
  show: boolean;
  title: string | null;
}
