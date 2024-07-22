import { Payment } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const PaymentServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  createOrderService: async (bodyData) => {
    try {
      const payload = {
        ...Payment.createOrder,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  orderCancelService: async (bodyData) => {
    try {
      const payload = {
        ...Payment.orderCancel,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  downloadInvoiceService: async (bodyData) => {
    try {
      const payload = {
        ...Payment.downloadInvoice,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  checkSwitchService: async (bodyData) => {
    try {
      const payload = {
        ...Payment.checkSwitch,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updatePaymentStatusService: async (bodyData) => {
    try {
      const payload = {
        ...Payment.updatePaymentStatus,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  autoRenewUpdateService: async (bodyData) => {
    try {
      const payload = {
        ...Payment.autoRenewUpdate,
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
