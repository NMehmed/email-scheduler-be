import { ObjectID } from "mongodb";

export interface IMailSchedule {
  emailTo: string;
  subject: string;
  message: string;
  tickTime: string;
  dayOfMonth?: number;
  weekdays?: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[];
  whenToStopMails: {
    whenToStop: "never" | "onDate" | "afterSomeOccurency";
    stopDate?: string;
    occurrancy?: number;
  };
  occurrancy: number;
  _id: ObjectID;
  id: string;
}