import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../Constants";
import { WorkPackageInterface } from "../utils/Interfaces";

import styles from "./WorkPackage.module.scss";
import LoadingSpinnerIcon from "../styles/icons/LoadindSpinnerIcon";
import WorkPackageList from "./WorkPackageList";

const WorkPackage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [workPackageList, setWorkPackageList] = useState<
    Array<WorkPackageInterface>
  >([]);

  useEffect(() => {
    const fetchWorkPackages = async () => {
      setIsLoading(true);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img
          alt="CSAT logo"
          src="https://www.csatechnics.com/img/lower-logo.png"
        />
      </div>
      <br />
      <h2>Available Dashboards</h2>
      {renderWorkPackageList()}
    </div>
  );
};

export default WorkPackage;
