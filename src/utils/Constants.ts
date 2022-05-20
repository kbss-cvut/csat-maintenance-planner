/**
 * Aggregated object of process.env and window.__config__ to allow dynamic configuration
 */
export const ENV = {
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
  SERVER_URL_WORKPACKAGE_LIST: getEnv(
    "SERVER_URL_WORKPACKAGE_LIST",
    "https://kbss.felk.cvut.cz/csat/api/workpackages/list"
  ),
  SERVER_URL_WORKPACKAGE_DASHBOARD: getEnv(
    "SERVER_URL_WORKPACKAGE_DASHBOARD",
    "https://kbss.felk.cvut.cz/csat/dashboard.html?wp="
  ),
  SERVER_URL_REVISION_LIST: getEnv(
    "SERVER_URL_REVISION_LIST",
    "https://kbss.felk.cvut.cz/csat/api2/revisions/"
  ),
  SERVER_URL_REVISION_ID: getEnv(
    "SERVER_URL_REVISION_ID",
    "https://kbss.felk.cvut.cz/csat/api2/plans/revision-plans-induced-by-revision-execution?revisionId="
  ),
  BASENAME: "/plan-manager/",
};

export default Constants;
