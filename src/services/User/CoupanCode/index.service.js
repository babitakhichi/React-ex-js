import { CoupanCode } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const CoupanCodeServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getcoupanCodeListingService: async ({ queryParams }) => {
    try {
      const payload = {
        ...CoupanCode.coupanCodeListing,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  applyCoupanCodeService: async (bodyData) => {
    try {
      const payload = {
        ...CoupanCode.applyCoupanCode,
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
