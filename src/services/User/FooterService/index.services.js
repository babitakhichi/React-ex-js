import { Footer } from "../../../apiEndPoints";
import logger from "../../../utils/logger";
import APIrequest from "../../axios";

export const FooterServices = {
  getSocialService: async () => {
    try {
      const payload = {
        ...Footer.socialLink,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
