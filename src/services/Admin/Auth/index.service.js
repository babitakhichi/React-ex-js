import { Auth } from "../../../apiEndPoints/Admin";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const AdminAuthServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  userLogin: async (values) => {
    try {
      const payload = {
        ...Auth.accountLogin,
        bodyData: values,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

  changePasswordService: async (bodyData) => {
    try {
      const payload = {
        ...Auth.changePassword,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  resetPasswordService: async (bodyData) => {
    try {
      const payload = {
        ...Auth.resetPassword,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  forgetPasswordService: async (bodyData) => {
    try {
      const payload = {
        ...Auth.forgetPassword,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateSocialLinkService: async (id, bodyData) => {
    try {
      const payload = {
        ...Auth.updateSocialLink(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  otpService: async (bodyData) => {
    try {
      const payload = {
        ...Auth.otp,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  resendOtpService: async (bodyData) => {
    try {
      const payload = {
        ...Auth.resendOtp,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  logoutService: async () => {
    try {
      const payload = {
        ...Auth.logout,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateProfileService: async (bodyData) => {
    try {
      const payload = {
        ...Auth.updateProflie,
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
