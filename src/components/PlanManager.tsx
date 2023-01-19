import React, { useEffect, useState } from "react";
import axios from "axios";
import { Constants } from "../utils/Constants";
import WorkPackageList from "./WorkPackageList";
import PlanEditor from "./PlanEditor";
import LoadingSpinnerIcon from "../assets/icons/LoadingSpinnerIcon";
import { CgChevronDoubleLeftO } from "react-icons/cg";
import { motion } from "framer-motion/dist/framer-motion";
import Animations from "../utils/Animations";
import { useKeycloak } from "@react-keycloak/web";

import styles from "./PlanManager.module.scss";

interface Props {
  basename: string;
}

const PlanManager = ({ basename }: Props) => {
  const { keycloak, initialized } = useKeycloak();

  const [workPackageList, setWorkPackageList] = useState<Array<string>>([]);

  // TODO: Set work package interface
  const [workPackage, setWorkPackage] = useState<any>(null);

  const [isWorkPackageListLoading, setIsWorkPackageListLoading] =
    useState<boolean>(false);
  const [isWorkPackageLoading, setIsWorkPackageLoading] =
    useState<boolean>(false);

  const [workPackageListErrorMessage, setWorkPackageListErrorMessage] =
    useState<string>("");
  const [workPackageErrorMessage, setWorkPackageErrorMessage] =
    useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

  const [isPlanFullScreen, setIsPlanFullScreen] = useState<boolean>(false);

  const [documentTitle, setDocumentTitle] = useState<string>(
    "CSAT Maintenance Planner"
  );

  useEffect(() => {
    const initializeKeycloak = () => {
      if (initialized && !keycloak.authenticated) {
        keycloak.login();
      }
    };
    initializeKeycloak();
  }, [initialized]);

  useEffect(() => {
    setWorkPackageListErrorMessage("");
  }, []);

  useEffect(() => {
    const fetchWorkPackageTitles = async () => {
      setIsWorkPackageListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(Constants.SERVER_URL_WORKPACKAGE_LIST);
      setWorkPackageList([...data]);
    };

    fetchWorkPackageTitles().then(() => {
      setIsWorkPackageListLoading(false);
    });

    fetchWorkPackageTitles().catch((error) => {
      if (error.status === 500) {
        setWorkPackageListErrorMessage(
          "It takes longer, please wait a few seconds."
        );
        setTimeout(() => {
          fetchWorkPackageTitles();
        }, 3000);
      } else {
        setWorkPackageListErrorMessage(error.toString());
      }
    });
  }, [update]);

  useEffect(() => {
    const handleWorkPackageByURL = () => {
      setIsWorkPackageLoading(true);
      setWorkPackageErrorMessage("");

      const fetchWorkPackage = async () => {
        const workPackageId = window.location.pathname.split("/").pop();
        if (workPackageId) {
          const { data } = await axios.get(
            Constants.SERVER_URL_WORKPACKAGE_ID + workPackageId
          );
          setWorkPackage([data]);
          setDocumentTitle(workPackageId);
        }
      };

      fetchWorkPackage().then(() => {
        setIsWorkPackageLoading(false);
      });

      fetchWorkPackage().catch((error) => {
        if (error.status === 500) {
          setWorkPackageErrorMessage(
            "It takes longer, please wait a few seconds."
          );
          setTimeout(() => {
            fetchWorkPackage();
          }, 3000);
        } else {
          setWorkPackageErrorMessage(error.toString());
          setIsWorkPackageLoading(false);
        }
      });
    };
    if (
      window.location.pathname === "/" &&
      window.location.pathname === basename
    )
      return;

    handleWorkPackageByURL();
  }, []);

  useEffect(() => {
    const changeDocumentTitle = () => {
      document.title = documentTitle;
    };
    changeDocumentTitle();
  }, [documentTitle]);

  const handleWorkPackageOnClick = (index: number) => {
    setIsWorkPackageLoading(true);
    setWorkPackageErrorMessage("");
    setIsPlanFullScreen(true);

    const fetchWorkPackage = async () => {
      const workPackageTitle = workPackageList[index].split(",")[0];
      const workPackageId = encodeURIComponent(workPackageTitle);

      const { data } = await axios.get(
        Constants.SERVER_URL_WORKPACKAGE_ID + workPackageId
      );
      setWorkPackage([data]);
      setDocumentTitle(workPackageTitle);
    };

    fetchWorkPackage().then(() => {
      setIsWorkPackageLoading(false);
    });

    fetchWorkPackage().catch((error) => {
      if (error.status === 500) {
        setWorkPackageErrorMessage(
          "It takes longer, please wait a few seconds."
        );
        setTimeout(() => {
          fetchWorkPackage();
        }, 3000);
      } else {
        setWorkPackageErrorMessage(error.toString());
        setIsWorkPackageLoading(false);
      }
    });
  };

  const handleUpdateClick = () => {
    setUpdate(true);
  };

  const renderWorkPackageList = () => {
    return (
      <React.Fragment>
        {isWorkPackageListLoading && workPackageListErrorMessage && (
          <p>{workPackageListErrorMessage}</p>
        )}
        {isWorkPackageListLoading && !workPackageListErrorMessage && (
          <LoadingSpinnerIcon />
        )}
        {!isWorkPackageListLoading && (
          <WorkPackageList
            workPackageList={workPackageList}
            handleWorkPackageOnClick={handleWorkPackageOnClick}
          />
        )}
      </React.Fragment>
    );
  };

  const renderPlanEditor = () => {
    return (
      <React.Fragment>
        {workPackageErrorMessage && <p>{workPackageErrorMessage}</p>}
        {isWorkPackageLoading && !workPackageErrorMessage && (
          <LoadingSpinnerIcon />
        )}
        {!isWorkPackageLoading && workPackage && !workPackageErrorMessage && (
          <PlanEditor
            workPackage={workPackage}
            isFullScreen={isPlanFullScreen}
            workPackageTitle={documentTitle}
          />
        )}
      </React.Fragment>
    );
  };

  if (!initialized) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className={styles.container}>
      <motion.div
        className={styles["work-packages"]}
        variants={Animations.workPackageListAnimation}
        animate={isPlanFullScreen ? "hide" : "show"}
      >
        <div className={styles["header-container"]}>
          <div className={styles.header}>
            <img
              alt="CSAT logo"
              src="https://www.csatechnics.com/img/lower-logo.png"
            />
            <motion.span
              whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
              onClick={() => setIsPlanFullScreen(!isPlanFullScreen)}
              variants={Animations.doubleArrowAnimation}
              animate={isPlanFullScreen ? "hide" : "show"}
              className={styles["double-arrow-icon"]}
            >
              <CgChevronDoubleLeftO />
            </motion.span>
          </div>
          <h3>{documentTitle}</h3>
        </div>

        <h2>Work Packages</h2>
        {keycloak.authenticated && (
          <React.Fragment>
            {renderWorkPackageList()}
            <button className={styles.button} onClick={handleUpdateClick}>
              Update
            </button>
          </React.Fragment>
        )}
      </motion.div>
      <motion.span
        variants={Animations.planEditorAnimation}
        animate={isPlanFullScreen ? "hide" : "show"}
      >
        {renderPlanEditor()}
      </motion.span>
    </div>
  );
};

export default PlanManager;
