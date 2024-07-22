import { ManageForPpTc } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";
// PpTc privacy and terms conditons
export const AdminManagePpTcServices = {
  getService: async (id) => {
    try {
      const payload = {
        ...ManageForPpTc.get(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  updateService: async (id, bodyData) => {
    try {
      const payload = {
        ...ManageForPpTc.update(id),
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
