import { ManageTaxes } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const AdminManageTaxes = {
  getTaxesListService: async () => {
    try {
      const payload = {
        ...ManageTaxes.getTaxesList,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateTaxesService: async (bodyData) => {
    try {
      const payload = {
        ...ManageTaxes.updateTaxes,
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
