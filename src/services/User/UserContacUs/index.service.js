import { UserContactUs } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const UserContactUsService = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  userContactUsService: async (bodyData) => {
    try {
      const payload = {
        ...UserContactUs.userContactUs,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  userGetContactReasonService: async ({ queryParams }) => {
    try {
      const payload = {
        ...UserContactUs.getContactReason,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
