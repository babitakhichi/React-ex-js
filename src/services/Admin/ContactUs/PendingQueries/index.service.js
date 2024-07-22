import { PendingQueries } from "../../../../apiEndPoints/Admin";
import { logger } from "../../../../utils";
import APIrequest from "../../../axios";

export const AdminPendingQueriesServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getPendingQueriesList: async ({ queryParams }) => {
    try {
      const payload = {
        ...PendingQueries.getPendingQueries,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  sendReplyService: async (bodyData) => {
    try {
      const payload = {
        ...PendingQueries.sendReply,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteQueryService: async (bodyData) => {
    try {
      const payload = {
        ...PendingQueries.deleteQuery,
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
