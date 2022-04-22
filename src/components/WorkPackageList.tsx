import React from "react";
import { WorkPackageInterface } from "../utils/Interfaces";
import Constants from "../utils/Constants";
import classNames from "classnames/bind";

import styles from "./WorkPackageList.module.scss";

interface Props {
  workPackageList: Array<WorkPackageInterface>;
}

const WorkPackageList = ({ workPackageList }: Props) => {
  const applyProgressStatusClass = (workPackage: WorkPackageInterface) => {
    const progressStatus = workPackage.progressStatus.toUpperCase();
    return "wp-progress-status-" + progressStatus;
  };

  const cn = classNames.bind(styles);

  return (
    <ul className={styles.workPackageItems}>
      {workPackageList.map((workPackage: WorkPackageInterface) => (
        <li
          key={workPackage.objectIdentifier}
          className={cn(
            "workPackageItem",
            applyProgressStatusClass(workPackage)
          )}
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
