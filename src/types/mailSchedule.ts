export interface MailSchedule {
  emailTo: string;
  subject: string;
  message: string;
  dayOfMonth?: number;
  weekdays?: ("Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday")[];
  whenToStopMails: {
    whenToStop: "never" | "onDate" | "afterSomeOccurency";

    stopDate?: string;
    occurrancy?: number;
  };
  occurrancy: number;
  _id: string;
}