import { Notification } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const NotificationServices = {
  getNotificationListService: async ({ queryParams }) => {
    try {
      const payload = {
        ...Notification.getNotificationList,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  unreadCountService: async ({ queryParams }) => {
    try {
      const payload = {
        ...Notification.unreadCount,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  readNotificationsService: async (bodyData) => {
    try {
      const payload = {
        ...Notification.readNotifications,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
