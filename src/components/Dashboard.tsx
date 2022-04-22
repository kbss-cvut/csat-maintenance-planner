import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../Constants";
import {
  RevisionPlanInterface,
  WorkPackageInterface,
} from "../utils/Interfaces";

import styles from "./Dashboard.module.scss";
import LoadingSpinnerIcon from "../styles/icons/LoadindSpinnerIcon";
import RevisionPlanList from "./RevisionPlanList";
import RevisionPlan from "./RevisionPlan";

const Dashboard = () => {
  const [workPackageList, setWorkPackageList] = useState<
    Array<WorkPackageInterface>
  >([]);
  const [revisionPlanList, setRevisionPlanList] = useState<Array<string>>([]);
  const [revisionPlanData, setRevisionPlanData] =
    useState<RevisionPlanInterface | null>(null);

  const [isRevisionListLoading, setIsRevisionListLoading] =
    useState<boolean>(false);
  const [isRevisionLoading, setIsRevisionLoading] = useState<boolean>(false);

  const [revisionListErrorMessage, setRevisionListErrorMessage] =
    useState<string>("");
  const [revisionErrorMessage, setRevisionErrorMessage] = useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    setRevisionListErrorMessage("");
  }, []);

  useEffect(() => {
    const fetchWorkPackages = async () => {
      setIsRevisionListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(
        Constants.CSAT_PLANNING_URL +
          Constants.API +
          Constants.CSAT_PLANNING_WORKPACKAGES_LIST_URL
      );
      setWorkPackageList([...data]);
    };
    fetchWorkPackages().then(() => {
      setIsRevisionListLoading(false);
    });
    fetchWorkPackages().catch((error) => {
      setRevisionListErrorMessage(error.toString());
    });
  }, [update]);

  useEffect(() => {
    const fetchRevisionPlanTitles = async () => {
      setIsRevisionListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(Constants.REVISION_LIST);
      setRevisionPlanList([...data]);
    };
    fetchRevisionPlanTitles().then(() => {
      setIsRevisionListLoading(false);
    });
    fetchRevisionPlanTitles().catch((error) => {
      setRevisionListErrorMessage(error.toString());
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

  const renderRevisionList = () => {
    return (
      <React.Fragment>
        {isRevisionListLoading && revisionListErrorMessage && (
          <p>{revisionListErrorMessage}</p>
        )}
        {isRevisionListLoading && !revisionListErrorMessage && (
          <LoadingSpinnerIcon />
        )}
        {!isRevisionListLoading && (
          <RevisionPlanList
            revisionPlanTitleList={revisionPlanList}
            handleRevisionPlanOnClick={handleRevisionPlanOnClick}
          />
        )}
      </React.Fragment>
    );
  };

  const handleUpdateClick = () => {
    setUpdate(true);
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
        <button className={styles.button} onClick={handleUpdateClick}>
          Update
        </button>
      </div>
      <div className={styles.planning}>
        <img
          height="100%"
          width="100%"
          alt="csat-planning"
          src="https://thumbs.dreamstime.com/z/infographic-timeline-diagram-calendar-gantt-chart-template-business-modern-presentation-vector-212774519.jpg"
        />
      </div>
    </div>
  );
};

export default Dashboard;
