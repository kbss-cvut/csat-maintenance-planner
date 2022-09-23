import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PlanManager from "./components/PlanManager";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./utils/KeycloakConfig";

import "./styles/global.scss";

/**
 * React Router v6 with relative path deployment
 * https://stackoverflow.com/questions/57572259/react-router-with-relative-path-deployment/67064651#67064651
 */
const basename = window.location.pathname.replace(/(\/[^/]+)$/, "");

const eventLogger = (event: unknown, error: unknown) => {
  console.log("onKeycloakEvent", event, error);
};

const tokenLogger = (tokens: unknown) => {
  console.log("onKeycloakTokens", tokens);
};

const AppRouter = () => {
  return (
    <React.Fragment>
      <ReactKeycloakProvider
        authClient={keycloak}
        onEvent={eventLogger}
        onTokens={tokenLogger}
        initOptions={{ checkLoginIframe: false }}
      >
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/*" element={<PlanManager basename={basename} />} />
          </Routes>
        </BrowserRouter>
      </ReactKeycloakProvider>
    </React.Fragment>
  );
};

export default AppRouter;
