import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../Constants";

import styles from "../styles/WorkPackageList.module.scss";
import LoadingSpinnerIcon from "../styles/icons/LoadindSpinnerIcon";

const WorkPackage = () => {
  interface WorkPackageInterface {
    endTime: string;
    identifier: string;
    objectIdentifier: string;
    progressStatus: string;
    scheduledEndTime: string;
    scheduledStartTime: string;
    startTime: string;
  }

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    fetchWorkPackages().catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Czech Airlines Techniques</h1>
      </div>

      <h2>List work packages: </h2>
      {isLoading ? (
        <LoadingSpinnerIcon />
      ) : (
        <ul className={styles.workPackageItems}>
          {workPackageList.map((workPackage: WorkPackageInterface) => (
            <li
              key={workPackage.objectIdentifier}
              className={styles.workPackageItem}
            >
              <a
                target="_blank"
                href={
                  Constants.CSAT_PLANNING_URL +
                  Constants.CSAT_PLANNING_WORKPACKAGE_DASHBOARD +
                  workPackage.objectIdentifier
                }
              >
                {workPackage.identifier}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WorkPackage;
