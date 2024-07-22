import { DiscountRequest } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const AdminDiscountRequests = {
  getDiscountRequestsListService: async ({ queryParams }) => {
    try {
      const payload = {
        ...DiscountRequest.getDiscountRequest,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  discountRefundService: async (bodyData) => {
    try {
      const payload = {
        ...DiscountRequest.discountRefund,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateDiscountRequestsStatusService: async (id, bodyData) => {
    try {
      const payload = {
        ...DiscountRequest.updateDiscountRequestStatus(id),
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
