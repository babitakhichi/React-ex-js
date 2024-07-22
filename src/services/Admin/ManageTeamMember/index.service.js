import { ManageTeamMember } from "../../../apiEndPoints";
import { logger } from "../../../utils";
import APIrequest from "../../axios";

export const AdminManageTeamMemberList = {
  getTeamMemberListService: async ({ queryParams }) => {
    try {
      const payload = {
        ...ManageTeamMember.getTeamMemberList,
        queryParams,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  AddTeamMemberService: async (bodyData) => {
    try {
      const payload = {
        ...ManageTeamMember.AddManageTeamMember,
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  updateTeamMemberService: async (id, bodyData) => {
    try {
      const payload = {
        ...ManageTeamMember.updateTeamMember(id),
        bodyData,
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },
  deleteTeamMemberService: async (id) => {
    try {
      const payload = {
        ...ManageTeamMember.deleteTeamMember(id),
       
      };
      const res = await APIrequest(payload);
      return res;
    } catch (error) {
      logger(error);
      throw error;
    }
  },

};
