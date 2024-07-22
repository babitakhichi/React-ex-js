import { Dashboard } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const DashboardServices = {
  getAllTotalCounts: async () => {
    try {
      const payload = {
        ...Dashboard.totalCounts,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getDonutGraphData: async () => {
    try {
      const payload = {
        ...Dashboard.donutGraph,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getLineGraphData: async (plan, { queryParams }) => {
    try {
      const payload = {
        ...Dashboard.lineGraph(plan),
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
