import { UserAuth } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const UserAuthServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */
  verifyUserService: async (bodyData) => {
    try {
      const payload = {
        ...UserAuth.verifyUser,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateDetailService: async (bodyData) => {
    try {
      const payload = {
        ...UserAuth.updateDetails,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  userLoginService: async (values) => {
    try {
      const payload = {
        ...UserAuth.accountLogin,
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
        ...UserAuth.changePassword,
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
        ...UserAuth.resetPassword,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  resendOTPService: async (bodyData) => {
    try {
      const payload = {
        ...UserAuth.resendOTP,
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
        ...UserAuth.forgetPassword,
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
        ...UserAuth.otp,
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
        ...UserAuth.logout,
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
        ...UserAuth.updateProflie,
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
