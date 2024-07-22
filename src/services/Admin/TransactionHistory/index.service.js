import { TransactionHistory } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const TransactionHistoryServices = {
  getTransactionHistoryListService: async ({ queryParams }) => {
    try {
      const payload = {
        ...TransactionHistory.getTransactionHistory,
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
