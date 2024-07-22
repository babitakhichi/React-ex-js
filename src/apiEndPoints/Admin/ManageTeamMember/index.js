const ManageTeamMember = {
  getTeamMemberList: {
    url: "/v1.0/admin/team",
    method: "GET",
  },

  AddManageTeamMember: {
    url: "/v1.0/admin/add-team",
    method: "POST",
  },
  updateTeamMember: (id) => ({
    url: `/v1.0/admin/team/${id}`,
    method: "PUT",
  }),
  deleteTeamMember: (id) => ({
    url: `/v1.0/admin/team/${id}`,
    method: "DELETE",
  }),
};
export default ManageTeamMember;
