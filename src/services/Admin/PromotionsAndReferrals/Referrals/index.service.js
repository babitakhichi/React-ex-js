import { Referrals } from "../../../../apiEndPoints";
import { logger } from "../../../../utils";
import APIrequest from "../../../axios";

export const AdminReferralsServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getReferralList: async ({ queryParams }) => {
    try {
      const payload = {
        ...Referrals.getReferralList,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getReferralDetails: async () => {
    try {
      const payload = {
        ...Referrals.getReferralDetails,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateReferral: async (bodyData) => {
    try {
      const payload = {
        ...Referrals.updateReferral,
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
