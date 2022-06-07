import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../utils/Constants";
import WorkPackage from "./WorkPackage";
import PlanEditor from "./PlanEditor";
import LoadingSpinnerIcon from "../assets/icons/LoadingSpinnerIcon";
import { CgChevronDoubleLeftO } from "react-icons/cg";
import { motion } from "framer-motion/dist/framer-motion";
import Animations from "../utils/Animations";

import dataTest from "../assets/data-test.json";
import styles from "./PlanManager.module.scss";

interface Props {
  basename: string;
}

const PlanManager = ({ basename }: Props) => {
  // const [workPackageList, setWorkPackageList] = useState<
  //   Array<WorkPackageInterface>
  // >([]);
  const [workPackageList, setWorkPackageList] = useState<Array<string>>([]);

  // TODO: Set work package interface
  const [workPackage, setWorkPackage] = useState<any>([dataTest]);

  const [isWorkPackageListLoading, setIsWorkPackageListLoading] =
    useState<boolean>(false);
  const [isWorkPackageLoading, setIsWorkPackageLoading] =
    useState<boolean>(false);

  const [workPackageListErrorMessage, setWorkPackageListErrorMessage] =
    useState<string>("");
  const [workPackageErrorMessage, setWorkPackageErrorMessage] =
    useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

  const [showWorkPackageList, setShowWorkPackageList] =
    useState<boolean>(false);

  useEffect(() => {
    setShowWorkPackageList(true);
  }, []);

  useEffect(() => {
    setWorkPackageListErrorMessage("");
  }, []);

  // useEffect(() => {
  //   const fetchWorkPackages = async () => {
  //     setIsListLoading(true);
  //     setUpdate(false);
  //     const { data } = await axios.get(Constants.SERVER_URL_WORKPACKAGE_LIST);
  //     setWorkPackageList([...data]);
  //   };
  //   fetchWorkPackages().then(() => {
  //     setIsListLoading(false);
  //   });
  //   fetchWorkPackages().catch((error) => {
  //     setListErrorMessage(error.toString());
  //   });
  // }, [update]);

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
      setWorkPackageListErrorMessage(error.toString());
    });
  }, [update]);

  useEffect(() => {
    const handleWorkPackageByURL = () => {
      setIsWorkPackageLoading(true);
      setWorkPackageErrorMessage("");

      const fetchWorkPackage = async () => {
        const workPackageId = window.location.pathname.split("/").pop();

        const { data } = await axios.get(
          Constants.SERVER_URL_WORKPACKAGE_ID + workPackageId
        );
        setWorkPackage([data]);
      };

      fetchWorkPackage().then(() => {
        setIsWorkPackageLoading(false);
      });

      fetchWorkPackage().catch((error) => {
        setWorkPackageErrorMessage(error.toString());
        setIsWorkPackageLoading(false);
      });
    };
    if (
      window.location.pathname === "/" &&
      window.location.pathname === basename
    )
      return;

    handleWorkPackageByURL();
  }, []);

  const handleWorkPackageOnClick = (index: number) => {
    setIsWorkPackageLoading(true);
    setWorkPackageErrorMessage("");

    const fetchWorkPackage = async () => {
      const workPackageTitle = workPackageList[index].split(",")[0];
      const workPackageId = encodeURIComponent(workPackageTitle);

      const { data } = await axios.get(
        Constants.SERVER_URL_WORKPACKAGE_ID + workPackageId
      );
      setWorkPackage([data]);
    };

    fetchWorkPackage().then(() => {
      setIsWorkPackageLoading(false);
    });

    fetchWorkPackage().catch((error) => {
      setWorkPackageErrorMessage(error.toString());
      setIsWorkPackageLoading(false);
    });

    console.log(workPackage);
  };

  const handleUpdateClick = () => {
    setUpdate(true);
  };

  // const renderWorkPackageList = () => {
  //   return (
  //     <React.Fragment>
  //       {isListLoading && listErrorMessage && <p>{listErrorMessage}</p>}
  //       {isListLoading && !listErrorMessage && <LoadingSpinnerIcon />}
  //       {!isListLoading && (
  //         <WorkPackageDashboardList workPackageList={workPackageList} />
  //       )}
  //     </React.Fragment>
  //   );
  // };

  const handleShowWorkPackageOnClick = () => {
    setShowWorkPackageList(!showWorkPackageList);
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
          <WorkPackage
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
          <PlanEditor workPackage={workPackage} />
        )}
      </React.Fragment>
    );
  };

  return (
    <div className={styles.container}>
      <motion.div
        className={styles["work-packages"]}
        variants={Animations.workPackageListAnimation}
        animate={showWorkPackageList ? "show" : "hide"}
      >
        <div className={styles.header}>
          <img
            alt="CSAT logo"
            src="https://www.csatechnics.com/img/lower-logo.png"
          />
          <motion.span
            whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
            onClick={() => setShowWorkPackageList(!showWorkPackageList)}
            variants={Animations.doubleArrowAnimation}
            animate={showWorkPackageList ? "show" : "hide"}
            className={styles["double-arrow-icon"]}
          >
            <CgChevronDoubleLeftO />
          </motion.span>
        </div>
        <br />
        <h2>Work Packages</h2>
        <br />
        {renderWorkPackageList()}
        {/*<br />*/}
        {/*<br />*/}
        {/*<h2>Available Work Packages</h2>*/}
        {/*{renderWorkPackageList()}*/}
        <button className={styles.button} onClick={handleUpdateClick}>
          Update
        </button>
      </motion.div>
      <motion.span
        variants={Animations.planEditorAnimation}
        animate={showWorkPackageList ? "show" : "hide"}
      >
        {renderPlanEditor()}
      </motion.span>
    </div>
  );
};

export default PlanManager;
