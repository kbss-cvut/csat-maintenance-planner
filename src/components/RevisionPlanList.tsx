import React from "react";

import styles from "./RevisonPlanList.module.scss";

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
        <li
          key={index}
          className={styles.revisionPlanItem}
          onClick={() => handleRevisionPlanOnClick(index)}
        >
          {revisionPlanTitle}
        </li>
      ))}
    </ul>
  );
};

export default RevisionPlanList;
