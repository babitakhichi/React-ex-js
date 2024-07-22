import { Faqs } from "../../../../apiEndPoints";
import { logger } from "../../../../utils";
import APIrequest from "../../../axios";

export const FaqsServices = {
  getAllFaqs: async ({ queryParams }) => {
    try {
      const payload = {
        ...Faqs.getAllFaqs,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  addFaq: async (bodyData) => {
    try {
      const payload = {
        ...Faqs.addFaq,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  FaqDetail: async (id) => {
    try {
      const payload = {
        ...Faqs.faqDetail(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  UpdateFaq: async (id, bodyData) => {
    try {
      const payload = {
        ...Faqs.updateFaq(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteFaq: async (id) => {
    try {
      const payload = {
        ...Faqs.deleteFaq(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
