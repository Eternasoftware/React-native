import { NOTIFICATION_TYPE } from "@/utils/constants/notifications";

export type NotificationHistory = {
  date: Date;
  notifications: NOTIFICATION_TYPE[];
};

export type NotificationInterval = {
  enableDate: number;
  disableDate: number;
};
