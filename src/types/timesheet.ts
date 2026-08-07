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