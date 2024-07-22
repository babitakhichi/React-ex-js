import { NewsletterSubscribers } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const NewsletterSubscribersServices = {
  getNewsletterservice: async ({ queryParams }) => {
    try {
      const payload = {
        ...NewsletterSubscribers.getNewsletters,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  sendNewsletter: async (bodyData) => {
    try {
      const payload = {
        ...NewsletterSubscribers.sendNewsletter,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  // FaqDetail: async (id) => {
  //   try {
  //     const payload = {
  //       ...Faqs.faqDetail(id),
  //     };
  //     const res = await APIrequest(payload);
  //     return res;
  //   } catch (error) {
  //     logger(error);
  //     throw error;
  //   }
  // },
  // UpdateFaq: async (id, bodyData) => {
  //   try {
  //     const payload = {
  //       ...Faqs.updateFaq(id),
  //       bodyData,
  //     };
  //     const res = await APIrequest(payload);
  //     return res;
  //   } catch (error) {
  //     logger(error);
  //     throw error;
  //   }
  // },
  deleteNews: async (id) => {
    try {
      const payload = {
        ...NewsletterSubscribers.deleteNews(id),
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
};
