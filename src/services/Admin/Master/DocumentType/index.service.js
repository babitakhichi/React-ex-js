import { DocumentType } from "../../../../apiEndPoints";
import { logger } from "../../../../utils";
import APIrequest from "../../../axios";

export const AdminDocumentTypeServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getDocumentTypeList: async ({ queryParams }) => {
    try {
      const payload = {
        ...DocumentType.documentType,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  addDocumentTypeList: async (bodyData) => {
    try {
      const payload = {
        ...DocumentType.addDocumentType,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  editDocumentTypeList: async (id, bodyData) => {
    try {
      const payload = {
        ...DocumentType.editDocumentType(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateDocumentTypeStatus: async (id, bodyData) => {
    try {
      const payload = {
        ...DocumentType.updateDocumentTypeStatus(id),
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
