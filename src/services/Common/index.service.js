import { Common } from "../../apiEndPoints";
import { logger } from "../../utils";
import APIrequest from "../axios";

export const CommonServices = {
  /**
   *
   * @returns
   * Function To handle Seller Register action
   */

  countries: async () => {
    try {
      const payload = {
        ...Common.countries,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  singleCountry: async (code) => {
    try {
      const payload = {
        ...Common.singleCountry(code),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getAllCmsService: async () => {
    try {
      const payload = {
        ...Common.getAllCms,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  userSubscribe: async (bodyData) => {
    try {
      const payload = {
        ...Common.subscribe,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  documentTypeList: async ({ queryParams }) => {
    try {
      const payload = {
        ...Common.documentType,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  genderList: async () => {
    try {
      const payload = {
        ...Common.gender,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  stateList: async ({ queryParams }) => {
    try {
      const payload = {
        ...Common.state,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  citiesList: async ({ queryParams }) => {
    try {
      const payload = {
        ...Common.cities,
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
