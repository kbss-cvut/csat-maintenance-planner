import React from "react";

import styles from "./WorkPackageList.module.scss";
import { Link } from "react-router-dom";

interface Props {
  workPackageList: any;
  handleWorkPackageOnClick: (index: number) => void;
}

const WorkPackage = ({ workPackageList, handleWorkPackageOnClick }: Props) => {
  return (
    <ul className={styles["revision-plan-items"]}>
      {workPackageList.map((revisionPlanTitle: string, index: number) => (
        <Link
          key={index}
          to={encodeURIComponent(revisionPlanTitle.split(",")[0])}
        >
          <li
            className={styles["revision-plan-item"]}
            onClick={() => handleWorkPackageOnClick(index)}
          >
            {revisionPlanTitle}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default WorkPackage;
