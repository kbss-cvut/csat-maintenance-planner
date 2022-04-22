export interface WorkPackageInterface {
  endTime: string;
  identifier: string;
  objectIdentifier: string;
  progressStatus: string;
  scheduledEndTime: string;
  scheduledStartTime: string;
  startTime: string;
}

export interface RevisionPlanInterface {
  type: string | null;
  id: number;
  title: string | null;
  resource: {
    type: string | null;
    id: number;
    title: string | null;
  };
  duration: number;
  planParts: [
    {
      type: string | null;
      id: number;
      title: string | null;
      resource: {
        type: string | null;
        id: number;
        title: string | null;
      };
    }
  ];
}
