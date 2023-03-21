/**
 * Aggregated object of process.env and window.__config__ to allow dynamic configuration
 */
const ENV = {
  ...Object.keys(process.env).reduce<Record<string, string>>((acc, key) => {
    const strippedKey = key.replace("REACT_APP_", "");
    acc[strippedKey] = process.env[key]!;
    return acc;
  }, {}),
  ...(window as any).__config__,
};

/**
 * Helper to make sure that all envs are defined properly
 * @param name env variable name (without the REACT_APP prefix)
 * @param defaultValue Default variable name
 */
export function getEnv(name: string, defaultValue?: string): string {
  const value = ENV[name] || defaultValue;
  if (value !== undefined) {
    return value;
  }
  throw new Error(`Missing environment variable: ${name}`);
}

const Constants = {
  SERVER_URL_WORKPACKAGE_DASHBOARD_LIST: getEnv(
    "SERVER_URL_WORKPACKAGE_LIST",
    "https://kbss.felk.cvut.cz/csat/api/workpackages/list"
  ),
  SERVER_URL_WORKPACKAGE_DASHBOARD_ID: getEnv(
    "SERVER_URL_WORKPACKAGE_DASHBOARD",
    "https://kbss.felk.cvut.cz/csat/dashboard.html?wp="
  ),
  SERVER_URL_WORKPACKAGE_LIST: getEnv(
    "SERVER_URL_REVISION_LIST",
    "https://kbss.felk.cvut.cz/csat/api2/revisions/"
  ),
  SERVER_URL_WORKPACKAGE_ID: getEnv(
    "SERVER_URL_REVISION_ID",
    "https://kbss.felk.cvut.cz/csat/api2/plans/revision-plans-induced-by-revision-execution?revisionId="
  ),

  APPLICATION_TYPE: {
    PHASE_PLAN: "PhasePlan",
    TASK_CARD_TYPE_GROUP: "GeneralTaskPlan",
    SESSION_PLAN: "SessionPlan",
    TASK_PLAN: "TaskPlan",
    RESTRICTION_PLAN: "RestrictionPlan",
    AIRCRAFT: "Aircraft",
  },
  TASK_CATEGORY: {
    TASK_CARD: "task-card",
    MAINTENANCE_WO: "maintenance-work-order",
    SCHEDULED_WO: "scheduled-work-order",
  },

  KEYCLOAK_CONFIG: {
    URL: "https://kbss.felk.cvut.cz/csat/keycloak/",
    REALM: "csat-planning",
    CLIENT_ID: "csat-maintenance-planner",
  },
};

const PHASE_PLAN_TITLES = [
  {
    id: "0",
    title: "Phase 0",
  },
  {
    id: "1",
    title: "Incoming tests and inspections",
  },
  {
    id: "2",
    title: "Main inspection phase",
  },
  {
    id: "3",
    title: "Restoration/servicing and findings rectification",
  },
  {
    id: "4",
    title: "Final phase",
  },
];

const LEGEND_ITEMS = [
  {
    code: Constants.APPLICATION_TYPE.RESTRICTION_PLAN,
    name: "Restriction Plan",
    color: "#ff0000",
    active: true,
  },
  {
    code: Constants.APPLICATION_TYPE.PHASE_PLAN,
    name: "Phase Plan",
    color: "#00718F",
    active: true,
  },
  {
    code: Constants.APPLICATION_TYPE.TASK_CARD_TYPE_GROUP,
    name: "Task Card Type Group",
    color: "#0BA5BE",
    active: false,
  },
  {
    code: Constants.TASK_CATEGORY.TASK_CARD,
    name: "Task Card",
    color: "#00a900",
    active: true,
  },
  {
    code: Constants.TASK_CATEGORY.SCHEDULED_WO,
    name: "Scheduled Work Order",
    color: "#576319",
    active: true,
  },
  {
    code: Constants.TASK_CATEGORY.MAINTENANCE_WO,
    name: "Maintenance Work Order",
    color: "#a90000",
    active: true,
  },
  {
    code: Constants.APPLICATION_TYPE.SESSION_PLAN,
    name: "Session Plan",
    color: "#CFCBC8",
    active: true,
  },
];

export { ENV, Constants, LEGEND_ITEMS, PHASE_PLAN_TITLES };
