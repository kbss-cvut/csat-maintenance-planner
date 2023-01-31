import React from "react";
import { GroupInterface, PlanPartInterface } from "../utils/Interfaces";
import { Constants } from "../utils/Constants";

import styles from "./Tooltip.module.scss";

interface Props {
  item?: PlanPartInterface;
  group?: GroupInterface;
}
const Tooltip = ({ item, group }: Props) => {
  return (
    <div className={styles.container}>
      {item?.applicationType !== Constants.APPLICATION_TYPE.SESSION_PLAN &&
        !item?.taskType && (
          <div>
            <p>{item?.title}</p>
          </div>
        )}

      {item?.applicationType === Constants.APPLICATION_TYPE.SESSION_PLAN && (
        <>
          <div className={styles.section}>
            <h3>Mechanic: </h3>
            <p>{group?.title}</p>
          </div>
          <div className={styles["description-section"]}>
            <h3>Description: </h3>
            <p>{item?.title}</p>
          </div>
        </>
      )}

      {item?.taskType && (
        <>
          <div className={styles.section}>
            <h3>Scope:</h3>
            <p>{item?.taskType?.scope}</p>
          </div>
          <div className={styles.section}>
            <h3>Code:</h3>
            <p>{item?.taskType?.code}</p>
          </div>
          <div className={styles["description-section"]}>
            <h3>Description:</h3>
            <p>{item?.title}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Tooltip;
