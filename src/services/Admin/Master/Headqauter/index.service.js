import { Headqauter } from "../../../../apiEndPoints";
import { logger } from "../../../../utils";
import APIrequest from "../../../axios";

export const AdminHeadquaterServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getHeadquaterService: async () => {
    try {
      const payload = {
        ...Headqauter.getHeadquater,
        // queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateHeadqauterService: async (bodyData) => {
    try {
      const payload = {
        ...Headqauter.putHeadquater,
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
