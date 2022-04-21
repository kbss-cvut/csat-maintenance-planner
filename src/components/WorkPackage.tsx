import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../Constants";
import { WorkPackageInterface } from "../utils/Interfaces";

import styles from "./WorkPackage.module.scss";
import LoadingSpinnerIcon from "../styles/icons/LoadindSpinnerIcon";
import WorkPackageList from "./WorkPackageList";

import 'planning-tool/dist/PlanningTool.css'
import PlanningTool from 'planning-tool'

const WorkPackage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [workPackageList, setWorkPackageList] = useState<
    Array<WorkPackageInterface>
  >([]);
  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    const fetchWorkPackages = async () => {
      setIsLoading(true);
      setUpdate(false);
      const { data } = await axios.get(
        Constants.CSAT_PLANNING_URL +
          Constants.API +
          Constants.CSAT_PLANNING_WORKPACKAGES_LIST_URL
      );
      setWorkPackageList([...data]);
    };
    fetchWorkPackages().then(() => {
      setIsLoading(false);
    });
    fetchWorkPackages().catch((error) => {
      setErrorMessage(error.toString());
    });
  }, [update]);

  useEffect(() => {
    setErrorMessage("");
  }, []);

  const renderWorkPackageList = () => {
    return (
      <React.Fragment>
        {isLoading && errorMessage && <p>{errorMessage}</p>}
        {isLoading && !errorMessage && <LoadingSpinnerIcon />}
        {!isLoading && <WorkPackageList workPackageList={workPackageList} />}
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
        <h2>Available Dashboards</h2>
        {renderWorkPackageList()}
        <button className={styles.button} onClick={handleUpdateClick}>
          Update
        </button>
      </div>
      <div className={styles.planning}>
        <PlanningTool/>
        {/*<img
          height="100%"
          width="100%"
          alt="csat-planning"
          src="https://thumbs.dreamstime.com/z/infographic-timeline-diagram-calendar-gantt-chart-template-business-modern-presentation-vector-212774519.jpg"
        />*/}
      </div>
    </div>
  );
};

export default WorkPackage;
