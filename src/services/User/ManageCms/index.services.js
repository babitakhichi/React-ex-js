import { ManageCmsUser } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const ManageCmsServices = {
  userFaqService: async () => {
    try {
      const payload = {
        ...ManageCmsUser.faq,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  commonServices: async ({ queryParams }) => {
    try {
      const payload = {
        ...ManageCmsUser.commonCms,
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
