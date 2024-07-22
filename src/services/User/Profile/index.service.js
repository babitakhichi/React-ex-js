import { UserProfile } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const UserProfileServices = {
  /**
   *
   * @returns
   * Function To handle Login action
   */

  getDetailsService: async () => {
    try {
      const payload = {
        ...UserProfile.getDetails,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  resendOTPProfileService: async (bodyData) => {
    try {
      const payload = {
        ...UserProfile.resendOTPProfile,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  changeEmailPhoneService: async (bodyData) => {
    try {
      const payload = {
        ...UserProfile.changeEmailPhone,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  addEmailPhoneService: async (bodyData) => {
    try {
      const payload = {
        ...UserProfile.addPhoneEmail,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  verifyChangeEmailPhoneService: async (bodyData) => {
    try {
      const payload = {
        ...UserProfile.verifyChangeEmailPhone,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  verifyAddEmailPhoneService: async (bodyData) => {
    try {
      const payload = {
        ...UserProfile.verifyAddEmailPhone,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getlanguageService: async () => {
    try {
      const payload = {
        ...UserProfile.getLanguages,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  addBusinessAccountService: async (bodyData) => {
    try {
      const payload = {
        ...UserProfile.addBusinessAccount,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getAccountService: async () => {
    try {
      const payload = {
        ...UserProfile.getAccount,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  addStateService: async (bodyData) => {
    try {
      const payload = {
        ...UserProfile.addState,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateAccountStatusService:async ({bodyData})=>{
    try {
      const payload = {
        ...UserProfile.updateAccountStatus,
        bodyData
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  getCorporatePlans:async (queryParams)=>{
    try {
      const payload = {
        ...UserProfile.corporatePlans,
        queryParams
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  assignPlanService:async (bodyData)=>{
    try {
      const payload = {
        ...UserProfile.assignPlan,
        bodyData
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateCorporateStatus:async (bodyData)=>{
    try {
      const payload = {
        ...UserProfile.updateCorporateStatus,
        bodyData
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  }
};
