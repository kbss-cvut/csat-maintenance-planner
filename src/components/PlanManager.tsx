import React, { useEffect, useState } from "react";
import axios from "axios";
import { Constants } from "../utils/Constants";
import WorkPackageList from "./WorkPackageList";
import PlanEditor from "./PlanEditor";
import LoadingSpinnerIcon from "../assets/icons/LoadingSpinnerIcon";
import { CgChevronDoubleLeftO } from "react-icons/cg";
import { motion } from "framer-motion/dist/framer-motion";
import Animations from "../utils/Animations";
import { useKeycloak } from "@react-keycloak/web";

import styles from "./PlanManager.module.scss";
import {PlanPartInterface} from "../utils/Interfaces";
import {
	buildData,
	calculateEstSumFromParts,
	calculateNumberOfMechanics,
	calculatePlannedWorkTimeSumFromParts, getRestrictedTasks, pushResourcesToTaskList, pushRestrictionsToTaskList
} from "../utils/Utils";

import data from "../test/anonymized_data.json"

interface Props {
  basename: string;
}

const PlanManager = ({ basename }: Props) => {
  const { keycloak, initialized } = useKeycloak();

  const [workPackageList, setWorkPackageList] = useState<Array<string>>([]);

  // TODO: Set work package interface
  const [workPackage, setWorkPackage] = useState<any>([data]);

  const [isWorkPackageListLoading, setIsWorkPackageListLoading] =
	useState<boolean>(false);
  const [isWorkPackageLoading, setIsWorkPackageLoading] =
	useState<boolean>(false);

  const [workPackageListErrorMessage, setWorkPackageListErrorMessage] =
	useState<string>("");
  const [workPackageErrorMessage, setWorkPackageErrorMessage] =
	useState<string>("");

  const [update, setUpdate] = useState<boolean>(false);

  const [isPlanFullScreen, setIsPlanFullScreen] = useState<boolean>(false);

  const [documentTitle, setDocumentTitle] = useState<string>(
	"CSAT Maintenance Planner"
  );

  const [showPlannedSchedule, setShowPlannedScheduled] = useState(true);

  useEffect(() => {
	if (process.env.NODE_ENV === "production" &&
		process.env.REACT_APP_AUTHENTICATION === "true") {
  	  const initializeKeycloak = () => {
	    if (initialized && keycloak && !keycloak.authenticated) {
		  keycloak.login();
	    }
	  };
	  initializeKeycloak();
	}
  }, [initialized]);

  useEffect(() => {
	setWorkPackageListErrorMessage("");
  }, []);

  useEffect(() => {
	const fetchWorkPackageTitles = async () => {
	  setIsWorkPackageListLoading(true);
	  setUpdate(false);
	  const { data } = await axios.get(Constants.SERVER_URL_WORKPACKAGE_LIST);
	  setWorkPackageList([...data]);
	};

	fetchWorkPackageTitles().then(() => {
	  setIsWorkPackageListLoading(false);
	});

	fetchWorkPackageTitles().catch((error) => {
	  if (error.status === 500) {
		setIsWorkPackageListLoading(false);
		setWorkPackageListErrorMessage(
		  "It takes longer, please wait a few seconds."
		);
		setTimeout(() => {
		  fetchWorkPackageTitles();
		}, 3000);
	  } else {
		setWorkPackageListErrorMessage(error.toString());
	  }
	});
  }, [update]);

  const fetchWorkPackage = async (workPackageId) => {
	console.log("fetching workpackage with id = \"" + workPackageId +"\" from backend" )
	if (workPackageId) {
	  try {
        setIsWorkPackageLoading(true);
		setWorkPackageErrorMessage("");
		const { data } = await axios.get(
		  Constants.SERVER_URL_WORKPACKAGE_ID + workPackageId
		);
		setWorkPackage([data]);
		setDocumentTitle(decodeURIComponent(workPackageId));
	  } catch(error){
		// @ts-ignore
		if (error.response.status === 500) {

		  setWorkPackageErrorMessage(
			"It takes longer, please wait a few seconds."
		  );
		  setTimeout(() => {
			fetchWorkPackage(workPackageId);
		  }, 3000);
		// @ts-ignore
		} else if (error.response.status === 503) {
			setWorkPackageErrorMessage(
				"Planning service is busy precalculating cache. Try again later."
			);
			setWorkPackage([]);
			// setDocumentTitle("Planning service is busy precalculating cache. Try again later.");
		} else {
	      // @ts-ignore
		  setWorkPackageErrorMessage(error.toString());
		  setWorkPackage([]);
		  setDocumentTitle("");
		}
	  } finally {
		setIsWorkPackageLoading(false);
	  }
	}
  };


  useEffect(() => {
	const handleWorkPackageByURL = () => {
     if(isWorkPackageLoading)
			return;
	  const workPackageId = window.location.pathname.split("/").pop();
	  if(!workPackageId)
		  return;

	  fetchWorkPackage(workPackageId);
	};
	if (
	  window.location.pathname === "/" &&
	  window.location.pathname === basename
	)
	  return;

	handleWorkPackageByURL();
  }, []);

  useEffect(() => {
	const changeDocumentTitle = () => {
	  document.title = documentTitle;
	};
	changeDocumentTitle();
  }, [documentTitle]);

  const handleWorkPackageOnClick = (index: number) => {
	if(isWorkPackageLoading){
		return;
	}

	setIsPlanFullScreen(true);

	const workPackageTitle = workPackageList[index].split(",")[0];
	const workPackageId = encodeURIComponent(workPackageTitle);
	fetchWorkPackage(workPackageId);
  };

  const handleUpdateClick = () => {
	setUpdate(true);
  };

  const renderWorkPackageList = () => {
	return (
    <React.Fragment>
      {isWorkPackageListLoading && workPackageListErrorMessage && (
        <p>{workPackageListErrorMessage}</p>
      )}
      {isWorkPackageListLoading && !workPackageListErrorMessage && (
        <LoadingSpinnerIcon />
      )}
      {!isWorkPackageListLoading &&
        process.env.NODE_ENV === "production" &&
        process.env.REACT_APP_AUTHENTICATION === "true" && (
          <WorkPackageList
            workPackageList={workPackageList}
            handleWorkPackageOnClick={handleWorkPackageOnClick}
          />
        )}
    </React.Fragment>
  );
  };
  const updateData = (workPackage) => {
    const dataWithoutRevisionPlan = workPackage[0].planParts;
    const workPackageItems: Array<PlanPartInterface> = [];
    const taskListWithResources: Array<PlanPartInterface> = [];
    const taskListWithRestrictions: Array<PlanPartInterface> = [];
    const _groups = [];
    dataWithoutRevisionPlan?.forEach(item => calculateNumberOfMechanics(item));
    dataWithoutRevisionPlan?.forEach(item => calculatePlannedWorkTimeSumFromParts(item));
    dataWithoutRevisionPlan?.forEach(item => calculateEstSumFromParts(item));
    buildData(dataWithoutRevisionPlan, workPackageItems, 0, null, null, _groups, showPlannedSchedule);

    pushResourcesToTaskList(workPackageItems, taskListWithResources, _groups);
    const restrictedItems = getRestrictedTasks(taskListWithResources);
    pushRestrictionsToTaskList(
        taskListWithResources,
        taskListWithRestrictions,
        restrictedItems
    );
    return {taskListWithRestrictions, _groups};
  };

  const planedView = (workPackage) => {
      const ret = updateData(workPackage);
      // @ts-ignore
      ret.taskListWithRestrictions = ret.taskListWithRestrictions.filter(t => !t.applicationType.includes("SessionPlan"));
      return ret;
  }

  const mixedView = (workPackage) => {
      return updateData(workPackage);
  }
  const renderPlanEditor = () => {
	return (
	  <React.Fragment>
		{workPackageErrorMessage && <p>{workPackageErrorMessage}</p>}
		{isWorkPackageLoading && !workPackageErrorMessage && (
		  <LoadingSpinnerIcon />
		)}
		{!isWorkPackageLoading && workPackage && !workPackageErrorMessage && (
		  <PlanEditor
			workPackage={workPackage}
			isFullScreen={isPlanFullScreen}
			workPackageTitle={documentTitle}
			showPlannedSchedule={showPlannedSchedule}
			setShowPlannedScheduled={setShowPlannedScheduled}
			calculatePlanView={showPlannedSchedule ? planedView : mixedView}
		  />
		)}
	  </React.Fragment>
	);
  };

	if (
    !initialized &&
    process.env.NODE_ENV === "production" &&
    process.env.REACT_APP_AUTHENTICATION === "true"
  ) {
    return <h1>Loading...</h1>;
  }

  return (
	<div className={styles.container}>
	  <motion.div
		className={styles["work-packages"]}
		variants={Animations.workPackageListAnimation}
		animate={isPlanFullScreen ? "hide" : "show"}
	  >
		<div className={styles["header-container"]}>
		  <div className={styles.header}>
			<img
			  alt="CSAT logo"
			  src="https://www.csatechnics.com/img/lower-logo.png"
			/>
			<motion.span
			  whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
			  onClick={() => setIsPlanFullScreen(!isPlanFullScreen)}
			  variants={Animations.doubleArrowAnimation}
			  animate={isPlanFullScreen ? "hide" : "show"}
			  className={styles["double-arrow-icon"]}
			>
			  <CgChevronDoubleLeftO />
			</motion.span>
		  </div>
		  <h3>{documentTitle}</h3>
		</div>

		<h2>Work Packages</h2>
		{//keycloak.authenticated && (
		  <React.Fragment>
			{renderWorkPackageList()}
			<button className={styles.button} onClick={handleUpdateClick}>
			  Update
			</button>
		  </React.Fragment>
		// )
		}
	  </motion.div>
	  <motion.span
		variants={Animations.planEditorAnimation}
		animate={isPlanFullScreen ? "hide" : "show"}
	  >
		{renderPlanEditor()}
	  </motion.span>
	</div>
  );
};

export default PlanManager;
