import React from "react";

import styles from "./RevisonPlanList.module.scss";
import { Link } from "react-router-dom";
import Constants from "../utils/Constants";

interface Props {
  revisionPlanTitleList: any;
  handleRevisionPlanOnClick: (index: number) => void;
}

const RevisionPlanList = ({
  revisionPlanTitleList,
  handleRevisionPlanOnClick,
}: Props) => {
  return (
    <ul className={styles.revisionPlanItems}>
      {revisionPlanTitleList.map((revisionPlanTitle: string, index: number) => (
        <Link
          key={index}
          to={Constants.BASENAME + revisionPlanTitle.replaceAll("/", "%2F")}
        >
          <li
            className={styles.revisionPlanItem}
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
