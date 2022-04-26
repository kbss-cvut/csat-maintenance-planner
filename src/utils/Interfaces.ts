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
  resource?: Resource;
  duration?: number;
  planParts?: PlanPart[];
  "planned-start-time"?: number;
  "planned-end-time"?: number;
  "planned-duration"?: number;
  "planned-work-time"?: number;
  "start-time"?: number;
  "end-time"?: number;
  "work-time"?: number;
}

export interface PlanPart {
  type?: PlanPartType;
  id?: number;
  title?: null | string;
  resource?: Resource;
  duration?: number | null;
  planParts?: PlanPart[];
  "planned-start-time"?: number | null;
  "planned-end-time"?: number | null;
  "planned-duration"?: null;
  "planned-work-time"?: number | null;
  "start-time"?: number | null;
  "end-time"?: number | null;
  "work-time"?: number;
  "task-type"?: TaskType;
}

export interface Resource {
  type?: ResourceType;
  id?: number;
  title?: string;
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
