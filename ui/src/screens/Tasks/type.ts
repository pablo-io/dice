export interface Tasks
  extends Array<{
    points: number;
    status: string;
    taskType: string;
    name: string;
    link: string;
    _id: string;
  }> {}
