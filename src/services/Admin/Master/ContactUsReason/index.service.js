import { ContactUsReason } from "../../../../apiEndPoints";
import { logger } from "../../../../utils";
import APIrequest from "../../../axios";

export const AdminContactUsReasonServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getContactUsReasonList: async ({ queryParams }) => {
    try {
      const payload = {
        ...ContactUsReason.contactReason,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  addContactUsReason: async (bodyData) => {
    try {
      const payload = {
        ...ContactUsReason.addContactReason,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  editContactUsReason: async (id, bodyData) => {
    try {
      const payload = {
        ...ContactUsReason.editContactReason(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateContactUsReasonStatus: async (id, bodyData) => {
    try {
      const payload = {
        ...ContactUsReason.updateContactReasonStatus(id),
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
