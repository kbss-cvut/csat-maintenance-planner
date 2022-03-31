import React, { useEffect, useState } from "react";
import axios from "axios";

const WorkPackage = () => {
  interface WorkPackageInterface {
    endTime: string;
    identifier: string;
    objectIdentifier: string;
    progressStatus: string;
    scheduledEndTime: string;
    scheduledStartTime: string;
    startTime: string;
  }

  const [workPackageList, setWorkPackageList] = useState<
    Array<WorkPackageInterface>
  >([]);

  useEffect(() => {
    const fetchWorkPackages = async () => {
      const { data } = await axios.get(
        "https://kbss.felk.cvut.cz/csat/api/workpackages/list"
      );
      setWorkPackageList([...data]);
    };
    fetchWorkPackages().catch(console.error);
  }, []);

  return (
    <React.Fragment>
      <h1>Work Packages: </h1>
      <div>
        {workPackageList.map((workPackage: WorkPackageInterface) => (
          <p key={workPackage.identifier}>{workPackage.identifier}</p>
        ))}
      </div>
    </React.Fragment>
  );
};

export default WorkPackage;
