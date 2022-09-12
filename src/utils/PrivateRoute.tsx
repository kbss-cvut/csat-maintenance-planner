import React, { ReactNode } from "react";
import { useKeycloak } from "@react-keycloak/web";

interface Props {
  children: ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const { keycloak } = useKeycloak();
  const isLoggedIn = keycloak.authenticated;

  return <React.Fragment>{isLoggedIn ? children : null}</React.Fragment>;
};

export default PrivateRoute;
