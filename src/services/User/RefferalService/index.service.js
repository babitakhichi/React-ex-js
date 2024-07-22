import { Refferals } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const RefferalService = {
    getReffralsService : async ({ queryParams }) => {
        try {
          const payload = {
            ...Refferals.getRefferalHistory,
            queryParams,
          };
          const res = await APIrequest(payload);
          return res;
        } catch (error) {
          logger(error);
          throw error;
        }
      },
}