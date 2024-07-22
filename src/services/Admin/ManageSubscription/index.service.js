import { ManageSubscription } from "../../../apiEndPoints/Admin";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const AdminManageSubscriptionServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  addSubscriptionService: async (bodyData) => {
    try {
      const payload = {
        ...ManageSubscription.addSubscription,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  editSubscriptionService: async (id, bodyData) => {
    try {
      const payload = {
        ...ManageSubscription.editSubscription(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateSubscriptionStatus: async (id, bodyData) => {
    try {
      const payload = {
        ...ManageSubscription.updateSubscriptionStatus(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  subscriptionListingService: async ({ queryParams }) => {
    try {
      const payload = {
        ...ManageSubscription.subscriptionListing,
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
