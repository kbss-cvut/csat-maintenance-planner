import React from "react";
import { RevisionPlanInterface } from "../utils/Interfaces";

interface Props {
  revisionPlanData: RevisionPlanInterface;
}

const RevisionPlan = ({ revisionPlanData }: Props) => {
  return <div>{revisionPlanData.title}</div>;
};

export default RevisionPlan;
