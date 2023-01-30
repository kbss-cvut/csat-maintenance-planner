import React from "react";
import { GroupInterface, PlanPartInterface } from "../utils/Interfaces";
import { Constants } from "../utils/Constants";

interface Props {
  item?: PlanPartInterface;
  group?: GroupInterface;
}
const Tooltip = ({ item, group }: Props) => {
  return (
    <div>
      {item?.applicationType !== Constants.APPLICATION_TYPE.SESSION_PLAN &&
        !item?.taskType && (
          <div>
            <p>{item?.title}</p>
          </div>
        )}

      {item?.applicationType === Constants.APPLICATION_TYPE.SESSION_PLAN && (
        <div>
          <p>Description: {item?.title}</p>
          <p>Mechanic: {group?.title}</p>
        </div>
      )}

      {item?.taskType && (
        <>
          <p>Scope: {item?.taskType?.scope}</p>
          <p>Code: {item?.taskType?.code}</p>
          <br />
          <p>Description:</p>
          <p>{item?.title}</p>
        </>
      )}
    </div>
  );
};

export default Tooltip;
