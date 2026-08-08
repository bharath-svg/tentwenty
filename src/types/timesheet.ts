export type TimesheetStatus =
  | "completed"
  | "incomplete"
  | "missing";

export type TimesheetAction =
  | "view"
  | "update"
  | "create";

export type Timesheet = {
  id: string;
  week: number;
  startDate: string;
  endDate: string;
  status: TimesheetStatus;
  action: TimesheetAction;
};


export type TimesheetEntry = {
  id: string;
  title: string;
  hours: number;
  projectName: string;
  typeOfWork: string;
  description: string;
};

export type TimesheetDay = {
  id: string;
  label: string;
  date: string;
  entries: TimesheetEntry[];
};

export type WeeklyTimesheet = {
  id: string;
  week: number;
  startDate: string;
  endDate: string;
  loggedHours: number;
  targetHours: number;
  days: TimesheetDay[];
};

export type CreateTimesheetEntryInput = {
  dayId: string;
  projectName: string;
  typeOfWork: string;
  description: string;
  hours: number;
};

export type UpdateTimesheetEntryInput = {
  projectName: string;
  typeOfWork: string;
  description: string;
  hours: number;
};