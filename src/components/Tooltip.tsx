import React from "react";
import { GroupInterface, PlanPartInterface } from "../utils/Interfaces";
import { Constants } from "../utils/Constants";

import styles from "./Tooltip.module.scss";

interface Props {
  item?: PlanPartInterface;
  group?: GroupInterface;
}

const formatEstimate = (est: number | null | undefined, item: PlanPartInterface) => {
	const formatedEst = formatHours(est);
	if(est && item?.workTime){
		return formatedEst + "(" + formatPercent(item?.workTime/36000/est) + ")";
	}
	return formatedEst;
}

const formatHours = (est: number | null | undefined) => {
	return formatWithPostfix(est, " h");
}

const formatPercent = (est: number | null | undefined) => {
	return formatWithPostfix(est, " %");
}


const formatWithPostfix = (est: number | null | undefined, postfix: string) => {
	if(est)
		return est.toFixed(2) + postfix;
	else
		return "-";
}

const scale = (num: number | null | undefined, devider) => {
	if(num)
		return num/devider;
	return num;
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
		  <div className={styles.section}>
            <h3>averageTime:</h3>
            <p>{formatEstimate(item?.taskType?.averageTime, item)}</p>
          </div>
		  <div className={styles.section}>
            <h3>Estimated Min Worktime:</h3>
            <p>{formatEstimate(item?.estMin, item)}</p>
          </div>
		  <div className={styles.section}>
            <h3>Work time:</h3>
            <p>{formatHours(scale(item?.workTime, 3600000))}</p>
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
