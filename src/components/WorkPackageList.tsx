import React from "react";

import styles from "./WorkPackageList.module.scss";
import { NavLink } from "react-router-dom";

interface Props {
  workPackageList: any;
  handleWorkPackageOnClick: (index: number) => void;
}

const WorkPackageList = ({
  workPackageList,
  handleWorkPackageOnClick,
}: Props) => {
  return (
    <ul className={styles["revision-plan-items"]}>
      {workPackageList.map((revisionPlanTitle: string, index: number) => (
        <li
          key={index}
          className={styles["revision-plan-item"]}
          onClick={() => handleWorkPackageOnClick(index)}
        >
          <NavLink
            to={encodeURIComponent(revisionPlanTitle.split(",")[0])}
            style={({ isActive }) => {
              return {
                fontWeight: isActive ? "bold" : "",
              };
            }}
          >
            {revisionPlanTitle}
          </NavLink>
        </li>
      ))}
    </ul>
  );
};

export default WorkPackageList;
