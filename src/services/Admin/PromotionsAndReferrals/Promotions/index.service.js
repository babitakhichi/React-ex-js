import { Promotions } from "../../../../apiEndPoints";
import { logger } from "../../../../utils";
import APIrequest from "../../../axios";

export const AdminPromotionServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getPromoCodeList: async ({ queryParams }) => {
    try {
      const payload = {
        ...Promotions.getPromoCodeList,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  createPromoCode: async (bodyData) => {
    try {
      const payload = {
        ...Promotions.createPromoCode,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updatePromoCode: async (id,bodyData) => {
    try {
      const payload = {
        ...Promotions.updatePromoCode(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deletePromoCode: async (id) => {
    try {
      const payload = {
        ...Promotions.deletePromoCode(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updatePromoCodeStatus:async (id,bodyData) => {
    try {
      const payload = {
        ...Promotions.updatePromoCodeStatus(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  // editContactUsReason: async (id, bodyData) => {
  //   try {
  //     const payload = {
  //       ...ContactUsReason.editContactReason(id),
  //       bodyData,
  //     };
  //     const res = await APIrequest(payload);
  //     return res;
  //   } catch (error) {
  //     logger(error);
  //     throw error;
  //   }
  // },
  // updateContactUsReasonStatus: async (id, bodyData) => {
  //   try {
  //     const payload = {
  //       ...ContactUsReason.updateContactReasonStatus(id),
  //       bodyData,
  //     };
  //     const res = await APIrequest(payload);
  //     return res;
  //   } catch (error) {
  //     logger(error);
  //     throw error;
  //   }
  // },
  getConsumptionDataService: async ({ queryParams }) => {
    try {
      const payload = {
        ...Promotions.getConsumptionDashboard,
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
