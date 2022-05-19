import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Constants from "../utils/Constants";
import { WorkPackageInterface } from "../utils/Interfaces";

import styles from "./Dashboard.module.scss";
import LoadingSpinnerIcon from "../styles/icons/LoadingSpinnerIcon";
import RevisionPlanList from "./RevisionPlanList";
import WorkPackageList from "./WorkPackageList";
import PlanningTool from "react-maintenance-planner";

import "react-maintenance-planner/dist/PlanningTool.css";
import data from "../data.json";

const Dashboard = () => {
  const [workPackageList, setWorkPackageList] = useState<
    Array<WorkPackageInterface>
  >([]);
  const [revisionPlanList, setRevisionPlanList] = useState<Array<string>>([]);
  const [revisionPlan, setRevisionPlan] = useState<any>([data]);

  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [isRevisionLoading, setIsRevisionLoading] = useState<boolean>(false);

  const [listErrorMessage, setListErrorMessage] = useState<string>("");
  const [revisionErrorMessage, setRevisionErrorMessage] = useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

  useEffect(() => {
    setListErrorMessage("");
  }, []);

  useEffect(() => {
    const fetchWorkPackages = async () => {
      setIsListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(Constants.SERVER_URL_WORKPACKAGE_LIST);
      setWorkPackageList([...data]);
    };
    fetchWorkPackages().then(() => {
      setIsListLoading(false);
    });
    fetchWorkPackages().catch((error) => {
      setListErrorMessage(error.toString());
    });
  }, [update]);

  useEffect(() => {
    const fetchRevisionPlanTitles = async () => {
      setIsListLoading(true);
      setUpdate(false);
      const { data } = await axios.get(Constants.SERVER_URL_REVISION_LIST);
      setRevisionPlanList([...data]);
    };
    fetchRevisionPlanTitles().then(() => {
      setIsListLoading(false);
    });
    fetchRevisionPlanTitles().catch((error) => {
      setListErrorMessage(error.toString());
    });
  }, [update]);

  const handleRevisionPlanOnClick = (index: number) => {
    setIsRevisionLoading(true);
    setRevisionErrorMessage("");
    const fetchRevisionPlanData = async () => {
      const revisionTitle = revisionPlanList[index];
      const revisionId = revisionTitle
        .replaceAll(" ", "%20")
        .replaceAll("/", "%2F")
        .replaceAll("+", "%2B")
        .split(",")[0];
      const { data } = await axios.get(
        Constants.SERVER_URL_REVISION_ID + revisionId
      );
      setRevisionPlan([data]);
    };
    fetchRevisionPlanData().then(() => {
      setIsRevisionLoading(false);
    });
    fetchRevisionPlanData().catch((error) => {
      setRevisionErrorMessage(error.toString());
      setIsRevisionLoading(false);
    });
  };

  const handleUpdateClick = () => {
    setUpdate(true);
  };

  const renderWorkPackageList = () => {
    return (
      <React.Fragment>
        {isListLoading && listErrorMessage && <p>{listErrorMessage}</p>}
        {isListLoading && !listErrorMessage && <LoadingSpinnerIcon />}
        {!isListLoading && (
          <WorkPackageList workPackageList={workPackageList} />
        )}
      </React.Fragment>
    );
  };

  const renderRevisionList = () => {
    return (
      <React.Fragment>
        {isListLoading && listErrorMessage && <p>{listErrorMessage}</p>}
        {isListLoading && !listErrorMessage && <LoadingSpinnerIcon />}
        {!isListLoading && (
          <RevisionPlanList
            revisionPlanTitleList={revisionPlanList}
            handleRevisionPlanOnClick={handleRevisionPlanOnClick}
          />
        )}
      </React.Fragment>
    );
  };

  const renderPlanningTool = () => {
    return (
      <React.Fragment>
        {revisionErrorMessage && <p>{revisionErrorMessage}</p>}
        {isRevisionLoading && !revisionErrorMessage && <LoadingSpinnerIcon />}
        {!isRevisionLoading && revisionPlan && !revisionErrorMessage && (
          <PlanningTool items={items} groups={groups} />
        )}
      </React.Fragment>
    );
  };

  const items = [];
  const groupsMap = new Map();

  const getTaskBackground = (task) => {
    if (!task.taskType) {
      return "#2196F3";
    }
    console.log(task.taskType["task-category"]);
    switch (task.taskType["task-category"]) {
      case "scheduled-wo":
        return "#aa0000";
      case "task-card":
        return "#00aa00";
      case "maintenance-wo":
        return "#0000aa";
      default:
        return "#2196F3";
    }
  };

  const buildData = (
    data,
    groupsMap,
    items,
    level,
    groupParentId,
    itemParentId
  ) => {
    if (!data) {
      return;
    }

    for (const item of data) {
      const resourceId =
        item.resource?.id + " - " + item.resource?.applicationType;
      if (!groupsMap.has(resourceId)) {
        groupsMap.set(resourceId, {
          id: groupsMap.size,
          title: item.resource?.title ? item.resource?.title : "-",
          hasChildren: item.planParts && item.planParts.length > 0,
          parent: groupParentId,
          open: level < 1,
          show: level < 2,
          level: level,
        });
      }

      const date = moment(
        item.applicationType === "SessionPlan"
          ? item.startTime
          : item.plannedStartTime
      )
        .add("1", "year")
        .add("2", "month")
        .add("27", "day");
      const endDate = moment(
        item.applicationType === "SessionPlan"
          ? item.endTime
          : item.plannedEndTime
      )
        .add("1", "year")
        .add("2", "month")
        .add("27", "day");
      const itemId = items.length + 1;

      items.push({
        id: itemId,
        group: groupsMap.get(resourceId).id,
        title: item.title ? item.title : "",
        start: date,
        end: endDate,
        parent: itemParentId,
        className: "item",
        bgColor: getTaskBackground(item),
        color: "#fff",
        selectedBgColor: "#FFC107",
        selectedColor: "#000",
        draggingBgColor: "#f00",
        highlightBgColor: "#FFA500",
        highlight: false,
        canMove: level > 1 && level !== 3,
        canResize: "both", //'left','right','both', false
        minimumDuration: 0, //minutes
      });

      if (item.planParts && item.planParts.length > 0) {
        buildData(
          item.planParts,
          groupsMap,
          items,
          level + 1,
          groupsMap.get(resourceId).id,
          itemId
        );
      }
    }
  };

  buildData(revisionPlan, groupsMap, items, 0, null, null);
  const groups = Array.from(groupsMap, ([key, values]) => values);

  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <div className={styles.header}>
          <img
            alt="CSAT logo"
            src="https://www.csatechnics.com/img/lower-logo.png"
          />
        </div>
        <br />
        <h2>Available Revision Plans</h2>
        {renderRevisionList()}
        <br />
        <br />
        <h2>Available Work Packages</h2>
        {renderWorkPackageList()}
        <button className={styles.button} onClick={handleUpdateClick}>
          Update
        </button>
      </div>
      <div className={styles.planning}>{renderPlanningTool()}</div>
    </div>
  );
};

export default Dashboard;
