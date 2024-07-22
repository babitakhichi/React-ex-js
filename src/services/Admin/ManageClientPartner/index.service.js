import { ManageClientPartner } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const AdminManageClientPartner = {
  getClientPartnerListService: async ({ queryParams }) => {
    try {
      const payload = {
        ...ManageClientPartner.getClientPartnerList,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  AddClientPartnerService: async (bodyData) => {
    try {
      const payload = {
        ...ManageClientPartner.AddClientPartner,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateClientPartnerService: async (id, bodyData) => {
    try {
      const payload = {
        ...ManageClientPartner.updateClientPartner(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteClientPartnerService: async (id) => {
    try {
      const payload = {
        ...ManageClientPartner.deleteClientPartner(id),
       
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

};
