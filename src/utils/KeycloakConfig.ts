import Keycloak from "keycloak-js";
import Constants from "./Constants";

const keycloakConfig = {
  url: Constants.KEYCLOAK_CONFIG.URL,
  realm: Constants.KEYCLOAK_CONFIG.REALM,
  clientId: Constants.KEYCLOAK_CONFIG.CLIENT_ID,
};
const keycloak = new Keycloak(keycloakConfig);
export default keycloak;
