import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../utils/Constants";
import RevisionPlanList from "./RevisionPlanList";
import PlanEditor from "./PlanEditor";
import LoadingSpinnerIcon from "../assets/icons/LoadingSpinnerIcon";
import DoubleArrowIcon from "../assets/icons/DoubleArrowIcon";

import dataTest from "../assets/data-test.json";
import styles from "./PlanManager.module.scss";

interface Props {
  basename: string;
}

const PlanManager = ({ basename }: Props) => {
  // const [workPackageList, setWorkPackageList] = useState<
  //   Array<WorkPackageInterface>
  // >([]);
  const [revisionPlanList, setRevisionPlanList] = useState<Array<string>>([]);

  // TODO: Set revision plan interface
  const [revisionPlan, setRevisionPlan] = useState<any>([dataTest]);

  const [isRevisionPlanListLoading, setIsRevisionPlanListLoading] =
    useState<boolean>(false);
  const [isRevisionPlanLoading, setIsRevisionPlanLoading] =
    useState<boolean>(false);

  const [revisionPlanListErrorMessage, setRevisionPlanListErrorMessage] =
    useState<string>("");
  const [revisionPlanErrorMessage, setRevisionPlanErrorMessage] =
    useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

  const [showRevisionPlanList, setShowRevisionPlanList] =
    useState<boolean>(true);

  useEffect(() => {
    setRevisionPlanListErrorMessage("");
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
    const fetchRevisionPlanTitles = async () => {
      setIsRevisionPlanListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(Constants.SERVER_URL_REVISION_LIST);
      setRevisionPlanList([...data]);
    };

    fetchRevisionPlanTitles().then(() => {
      setIsRevisionPlanListLoading(false);
    });

    fetchRevisionPlanTitles().catch((error) => {
      setRevisionPlanListErrorMessage(error.toString());
    });
  }, [update]);

  useEffect(() => {
    const handleRevisionPlanByURL = () => {
      setIsRevisionPlanLoading(true);
      setRevisionPlanErrorMessage("");

      const fetchRevisionPlanData = async () => {
        const revisionId = window.location.pathname.split("/").pop();

        const { data } = await axios.get(
          Constants.SERVER_URL_REVISION_ID + revisionId
        );
        setRevisionPlan([data]);
      };

      fetchRevisionPlanData().then(() => {
        setIsRevisionPlanLoading(false);
      });

      fetchRevisionPlanData().catch((error) => {
        setRevisionPlanErrorMessage(error.toString());
        setIsRevisionPlanLoading(false);
      });
    };
    if (
      window.location.pathname === "/" &&
      window.location.pathname === basename
    )
      return;

    handleRevisionPlanByURL();
  }, []);

  const handleRevisionPlanOnClick = (index: number) => {
    setIsRevisionPlanLoading(true);
    setRevisionPlanErrorMessage("");

    const fetchRevisionPlanData = async () => {
      const revisionTitle = revisionPlanList[index].split(",")[0];
      const revisionId = encodeURIComponent(revisionTitle);

      const { data } = await axios.get(
        Constants.SERVER_URL_REVISION_ID + revisionId
      );
      setRevisionPlan([data]);
    };

    fetchRevisionPlanData().then(() => {
      setIsRevisionPlanLoading(false);
    });

    fetchRevisionPlanData().catch((error) => {
      setRevisionPlanErrorMessage(error.toString());
      setIsRevisionPlanLoading(false);
    });
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
  //         <WorkPackageList workPackageList={workPackageList} />
  //       )}
  //     </React.Fragment>
  //   );
  // };

  const handleShowRevisionPlanOnClick = () => {
    setShowRevisionPlanList(!showRevisionPlanList);
  };

  const renderRevisionList = () => {
    return (
      <React.Fragment>
        {isRevisionPlanListLoading && revisionPlanListErrorMessage && (
          <p>{revisionPlanListErrorMessage}</p>
        )}
        {isRevisionPlanListLoading && !revisionPlanListErrorMessage && (
          <LoadingSpinnerIcon />
        )}
        {!isRevisionPlanListLoading && (
          <RevisionPlanList
            revisionPlanTitleList={revisionPlanList}
            handleRevisionPlanOnClick={handleRevisionPlanOnClick}
          />
        )}
      </React.Fragment>
    );
  };

  const renderPlanEditor = () => {
    return (
      <React.Fragment>
        {revisionPlanErrorMessage && <p>{revisionPlanErrorMessage}</p>}
        {isRevisionPlanLoading && !revisionPlanErrorMessage && (
          <LoadingSpinnerIcon />
        )}
        {!isRevisionPlanLoading &&
          revisionPlan &&
          !revisionPlanErrorMessage && (
            <PlanEditor
              revisionPlan={revisionPlan}
              extend={showRevisionPlanList}
            />
          )}
      </React.Fragment>
    );
  };

  const applyExtendedPlanningClassname = () => {
    if (showRevisionPlanList) {
      return "";
    }
    return "extended";
  };

  return (
    <div className={styles.container}>
      {showRevisionPlanList ? (
        <div className={styles["revision-plans"]}>
          <div className={styles.header}>
            <img
              alt="CSAT logo"
              src="https://www.csatechnics.com/img/lower-logo.png"
            />
            <span
              className={styles["double-arrow-icon"]}
              onClick={handleShowRevisionPlanOnClick}
            >
              <DoubleArrowIcon />
            </span>
          </div>
          <br />
          <h2>Work Packages</h2>
          <br />
          {renderRevisionList()}
          {/*<br />*/}
          {/*<br />*/}
          {/*<h2>Available Work Packages</h2>*/}
          {/*{renderWorkPackageList()}*/}
          <button className={styles.button} onClick={handleUpdateClick}>
            Update
          </button>
        </div>
      ) : (
        <span
          className={styles["double-arrow-icon-active"]}
          onClick={handleShowRevisionPlanOnClick}
        >
          <DoubleArrowIcon />
        </span>
      )}
      <div className={styles.planning}>{renderPlanEditor()}</div>
    </div>
  );
};

export default PlanManager;
