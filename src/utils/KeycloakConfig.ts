import Keycloak from "keycloak-js";
import { Constants } from "./Constants";
const keycloakConfig = {
  url: Constants.KEYCLOAK_CONFIG.PROD.URL,
  realm: Constants.KEYCLOAK_CONFIG.PROD.REALM,
  clientId: Constants.KEYCLOAK_CONFIG.PROD.CLIENT_ID,
};
const keycloak = new Keycloak(keycloakConfig);
export default keycloak;
