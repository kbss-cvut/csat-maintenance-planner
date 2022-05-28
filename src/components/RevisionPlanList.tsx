import React from "react";

import styles from "./RevisonPlanList.module.scss";
import { Link } from "react-router-dom";

interface Props {
  revisionPlanTitleList: any;
  handleRevisionPlanOnClick: (index: number) => void;
}

const RevisionPlanList = ({
  revisionPlanTitleList,
  handleRevisionPlanOnClick,
}: Props) => {
  return (
    <ul className={styles["revision-plan-items"]}>
      {revisionPlanTitleList.map((revisionPlanTitle: string, index: number) => (
        <Link
          key={index}
          to={encodeURIComponent(revisionPlanTitle.split(",")[0])}
        >
          <li
            className={styles["revision-plan-item"]}
            onClick={() => handleRevisionPlanOnClick(index)}
          >
            {revisionPlanTitle}
          </li>
        </Link>
      ))}
    </ul>
  );
};

export default RevisionPlanList;
