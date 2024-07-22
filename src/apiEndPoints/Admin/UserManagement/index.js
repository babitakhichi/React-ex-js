const Users = {
  getUserList: {
    url: "/v1.0/get_users",
    method: "GET",
  },
  updateUserStatus: {
    url: "/v1.0/update_user_status",
    method: "POST",
  },
  addNotifications: {
    url: "/v1.0/send_user_mail",
    method: "POST",
  },
  getUserDetails: (id) => ({
    url: `/v1.0/get_user_detail/${id}`,
    method: "GET",
  }),
};
export default Users;
