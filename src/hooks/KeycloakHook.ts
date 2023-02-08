import { useEffect, useState } from "react";
import Keycloak from "keycloak-js";

const useKeycloak = (): {
  keycloak: Keycloak | null | undefined;
  initialized: boolean;
} => {
  const [keycloak, setKeycloak] = useState<Keycloak | null | undefined>(
    undefined
  );
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      const keycloak = new Keycloak();
      setKeycloak(keycloak);
      setInitialized(true);
    }
  }, []);

  return { keycloak, initialized };
};

export default useKeycloak;
