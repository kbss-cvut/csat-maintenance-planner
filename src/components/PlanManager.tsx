import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../utils/Constants";

import styles from "./PlanManager.module.scss";
import LoadingSpinnerIcon from "../styles/icons/LoadingSpinnerIcon";
import RevisionPlanList from "./RevisionPlanList";
import PlanEditor from "./PlanEditor";

const PlanManager = () => {
  // const [workPackageList, setWorkPackageList] = useState<
  //   Array<WorkPackageInterface>
  // >([]);
  const [revisionPlanList, setRevisionPlanList] = useState<Array<string>>([]);

  // TODO: Set revision plan interface
  const [revisionPlan, setRevisionPlan] = useState<any>([]);

  const [isRevisionPlanListLoading, setIsRevisionPlanListLoading] =
    useState<boolean>(false);
  const [isRevisionPlanLoading, setIsRevisionPlanLoading] =
    useState<boolean>(false);

  const [revisionPlanListErrorMessage, setRevisionPlanListErrorMessage] =
    useState<string>("");
  const [revisionPlanErrorMessage, setRevisionPlanErrorMessage] =
    useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

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
        const revisionId = window.location.pathname
          .split(",")[0]
          .replaceAll(Constants.BASENAME, "");

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
      window.location.pathname !== "/" &&
      window.location.pathname !== Constants.BASENAME
    ) {
      handleRevisionPlanByURL();
    }
    return;
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
            <PlanEditor revisionPlan={revisionPlan} />
          )}
      </React.Fragment>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <img
            alt="CSAT logo"
            src="https://www.csatechnics.com/img/lower-logo.png"
          />
        </div>
        <br />
        <h2>Available Revision Plans</h2>
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
      <div className={styles.planning}>{renderPlanEditor()}</div>
    </div>
  );
};

export default PlanManager;
