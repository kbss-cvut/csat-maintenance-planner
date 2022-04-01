import React from "react";
import { WorkPackageInterface } from "../utils/Interfaces";
import Constants from "../Constants";

import styles from "./WorkPackageList.module.scss";

interface Props {
  workPackageList: Array<WorkPackageInterface>;
}

const WorkPackageList = ({ workPackageList }: Props) => {
  return (
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
  );
};

export default WorkPackageList;
