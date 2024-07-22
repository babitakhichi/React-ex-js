const UserAuth = {
  /**
   *Account
   */
  verifyUser: {
    url: "/v2.0/verify_user",
    method: "POST",
  },
  accountLogin: {
    url: "/v2.0/check_verify",
    method: "POST",
  },
  updateDetails: {
    url: "/v2.0/save_contact_detail",
    method: "POST",
  },
  updateProflie: {
    url: "/update-profile",
    method: "PUT",
  },
  resendOTP: {
    url: "/v2.0/resend_otp",
    method: "POST",
  },
  changePassword: {
    url: "/change-password",
    method: "PUT",
  },
  forgetPassword: {
    url: "/forgot-password",
    method: "POST",
  },
  resetPassword: {
    url: "/reset-password",
    method: "POST",
  },
  otp: {
    url: "/verify-otp",
    method: "POST",
  },
  logout: {
    url: "/v2.0/user_logout",
    method: "POST",
  },
};
export default UserAuth;
