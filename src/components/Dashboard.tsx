import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../utils/Constants";
import {
  RevisionPlanInterface,
  WorkPackageInterface,
} from "../utils/Interfaces";

import styles from "./Dashboard.module.scss";
import LoadingSpinnerIcon from "../styles/icons/LoadindSpinnerIcon";
import RevisionPlanList from "./RevisionPlanList";
import RevisionPlan from "./RevisionPlan";
import WorkPackageList from "./WorkPackageList";
import PlanningTool from "planning-tool";

import "planning-tool/dist/PlanningTool.css";

const Dashboard = () => {
  const [workPackageList, setWorkPackageList] = useState<
    Array<WorkPackageInterface>
  >([]);
  const [revisionPlanList, setRevisionPlanList] = useState<Array<string>>([]);
  const [revisionPlanData, setRevisionPlanData] =
    useState<RevisionPlanInterface | null>(null);

  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [isRevisionLoading, setIsRevisionLoading] = useState<boolean>(false);

  const [listErrorMessage, setListErrorMessage] = useState<string>("");
  const [revisionErrorMessage, setRevisionErrorMessage] = useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    setListErrorMessage("");
  }, []);

  useEffect(() => {
    const fetchWorkPackages = async () => {
      setIsListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(
        Constants.CSAT_PLANNING_URL +
          Constants.API +
          Constants.CSAT_PLANNING_WORKPACKAGES_LIST_URL
      );
      setWorkPackageList([...data]);
    };
    fetchWorkPackages().then(() => {
      setIsListLoading(false);
    });
    fetchWorkPackages().catch((error) => {
      setListErrorMessage(error.toString());
    });
  }, [update]);

  useEffect(() => {
    const fetchRevisionPlanTitles = async () => {
      setIsListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(Constants.REVISION_LIST);
      setRevisionPlanList([...data]);
    };
    fetchRevisionPlanTitles().then(() => {
      setIsListLoading(false);
    });
    fetchRevisionPlanTitles().catch((error) => {
      setListErrorMessage(error.toString());
    });
  }, [update]);

  const handleRevisionPlanOnClick = (index: number) => {
    setIsRevisionLoading(true);
    setRevisionErrorMessage("");
    const fetchRevisionPlanData = async () => {
      const revisionTitle = revisionPlanList[index];
      const revisionId = revisionTitle.replace(" ", "%20").split(",")[0];
      const { data } = await axios.get(Constants.REVISION_ID + revisionId);
      setRevisionPlanData(data);
    };
    fetchRevisionPlanData().then(() => {
      setIsRevisionLoading(false);
    });
    fetchRevisionPlanData().catch((error) => {
      setRevisionErrorMessage(error.toString());
      setIsRevisionLoading(false);
    });
  };

  const handleUpdateClick = () => {
    setUpdate(true);
  };

  const renderWorkPackageList = () => {
    return (
      <React.Fragment>
        {isListLoading && listErrorMessage && <p>{listErrorMessage}</p>}
        {isListLoading && !listErrorMessage && <LoadingSpinnerIcon />}
        {!isListLoading && (
          <WorkPackageList workPackageList={workPackageList} />
        )}
      </React.Fragment>
    );
  };

  const renderRevisionList = () => {
    return (
      <React.Fragment>
        {isListLoading && listErrorMessage && <p>{listErrorMessage}</p>}
        {isListLoading && !listErrorMessage && <LoadingSpinnerIcon />}
        {!isListLoading && (
          <RevisionPlanList
            revisionPlanTitleList={revisionPlanList}
            handleRevisionPlanOnClick={handleRevisionPlanOnClick}
          />
        )}
      </React.Fragment>
    );
  };

  const renderRevisionPlan = () => {
    return (
      <React.Fragment>
        {revisionErrorMessage && <p>{revisionErrorMessage}</p>}
        {isRevisionLoading && !revisionErrorMessage && <LoadingSpinnerIcon />}
        {!isRevisionLoading && revisionPlanData && !revisionErrorMessage && (
          <RevisionPlan revisionPlanData={revisionPlanData} />
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
        {renderRevisionList()}
        <br />
        <br />
        <h2>Available Work Packages</h2>
        {renderWorkPackageList()}
        <button className={styles.button} onClick={handleUpdateClick}>
          Update
        </button>
      </div>
      <div className={styles.planning}>
        <PlanningTool />
      </div>
    </div>
  );
};

export default Dashboard;
