import React, { useEffect, useState } from "react";
import axios from "axios";
import Constants from "../Constants";

import styles from "../styles/WorkPackageList.module.scss";

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

  const [workPackageList, setWorkPackageList] = useState<
    Array<WorkPackageInterface>
  >([]);

  useEffect(() => {
    const fetchWorkPackages = async () => {
      const { data } = await axios.get(
        "https://kbss.felk.cvut.cz/csat/api/workpackages/list"
      );
      setWorkPackageList([...data]);
    };
    fetchWorkPackages().catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Czech Airlines Techniques</h1>
      </div>

      <h2>List work packages: </h2>
      <ul className={styles.workPackageItems}>
        {workPackageList.map((workPackage: WorkPackageInterface) => (
          <li className={styles.workPackageItem}>
            <a
              key={workPackage.identifier}
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
    </div>
  );
};

export default WorkPackage;
