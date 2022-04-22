import React from "react";
import { RevisionPlanInterface } from "../utils/Interfaces";

interface Props {
  revisionPlanData: RevisionPlanInterface;
}

const RevisionPlan = ({ revisionPlanData }: Props) => {
  return (
    <div>
      {revisionPlanData.title}
      <br />
      <br />
      {revisionPlanData.type}
      <br />
      <br />
      {revisionPlanData.id}
      <br />
      <br />
      {revisionPlanData.duration}
    </div>
  );
};

export default RevisionPlan;
