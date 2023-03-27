import React from "react";
import {GroupInterface, PlanPartInterface, TaskPlanStep} from "../utils/Interfaces";
import { Constants } from "../utils/Constants";

import styles from "./Tooltip.module.scss";

interface Props {
  item?: PlanPartInterface;
  group?: GroupInterface;
}

const timeSlots = [
	['m', 60, 60],
	['h', 60*60,24],
	['d',24*60*60,7],
	['w',7*24*60*60]
];

const formatEstimate = (est: number | null | undefined, item: PlanPartInterface) => {
	const formattedEst = formatDuration(est);
	if(est && item?.workTime){
		return formattedEst + " (" + formatPercent(Math.ceil(item?.workTime/est/10)) + ")";
	}
	return formattedEst;
}

const formatHours = (est: number | null | undefined) => {
	if(!est)
		return "-";
	const totalMinutes = Math.ceil(est/60.);
	const hours = Math.floor(totalMinutes/60.);
	const minutes = totalMinutes % 60;

	return hours + "h" + minutes;
}

const formatDuration = (est: number | null | undefined) => {
	if(!est)
		return "-";
	let formatted = "";
	let addHours = true;
	for(let i = timeSlots.length -1 ; i > -1; i --){
		let slot = timeSlots[i];
		//@ts-ignore
		let val = Math.floor(est/slot[1]);
		if(val == 0) {
			addHours = i > 2 ;
			continue;
		}

		if(slot.length > 2)
			//@ts-ignore
			val = val%slot[2];
		formatted = formatted + val + slot[0];
	}
	if(addHours)
		formatted = formatted + " (" + formatHours(est) + ")";
	return formatted;
}

const formatPercent = (est: number | null | undefined) => {
	if(!est)
		return "-";
	else
		return est + " %";
}

const scale = (num: number | null | undefined, devider) => {
	if(num)
		return num/devider;
	return num;
}

const commonPlanDescription = ( item ) =>{
	return <>
		<h3>Performance:</h3>
		<div className={styles.section}>
			<table className={styles.performance}>
				<tr><td style={{paddingRight:"10px"}}>Estimated work-time  </td><td>{formatEstimate(item?.estMin*3600, item)}</td></tr>
				<tr><td>Average work-time  </td><td>{formatEstimate(scale(item?.plannedWorkTime, 1000), item)}</td></tr>
				<tr><td>Work-time  </td><td>{formatDuration(scale(item?.workTime, 1000))}</td></tr>
				<tr><td>Duration  </td><td>{formatDuration(scale(item?.duration, 1000))}</td></tr>
				<tr><td>Mechanic count  </td><td>{item?.numberOfMechanics}</td></tr>
			</table>
		</div>
	</>
};

const renderSteps = (steps : Array<TaskPlanStep>) => {
  return (
    <>
	  <h3>Steps</h3>
      <table style={{width:"fit-content"}} className={styles.performance}>
		  <tr><th>#</th><th style={{width:"fit-content"}}>Work Order</th><th>Work Order Action</th><th>Component</th> <th>Failure</th></tr>
	    {
	      steps.sort((a,b) => {
			  //@ts-ignore
			  const aIndex = a.stepIndex || a.stepIndex >= 0 ? a.stepIndex : -1;
			  //@ts-ignore
			  const bIndex = b.stepIndex || b.stepIndex >= 0 ? b.stepIndex : -1;
			  //@ts-ignore
			  return aIndex > bIndex ? 1: -1;
		  }).map(s => {
		    const stepIndex = s.stepIndex;
		    const workOrderText = s.description;
		    const workOrderActionText = s.actionDescription;
		    const componentLabel = s?.failureAnnotation?.componentLabel;
		    const failureLabel = s?.failureAnnotation?.failureLabel;
			  return <tr><td>{stepIndex}</td><td>{workOrderText}</td><td>{workOrderActionText}</td><td>{componentLabel}</td><td>{failureLabel}</td></tr>
	      })
	    }
	  </table>
    </>)
}

const Tooltip = ({ item, group }: Props) => {
  return (
    <div style={{width: "fit-content"}} className={styles.container}>
      {item?.applicationType !== Constants.APPLICATION_TYPE.SESSION_PLAN &&
        !item?.taskType && (
			<>
			  <div>
				<p>{item?.title}</p>
			  </div>
			  {commonPlanDescription(item)}
			</>
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
          {commonPlanDescription(item)}
          <div className={styles["description-section"]}>
            <h3>Description:</h3>
            <p>{item?.title}</p>
          </div>
        </>
      )}
	  {item?.applicationType === Constants.APPLICATION_TYPE.TASK_PLAN &&  item?.taskStepPlans && item?.taskStepPlans.length > 0 &&
	    renderSteps(item.taskStepPlans)
	  }
    </div>
  );
};

export default Tooltip;
