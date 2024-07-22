const Auth = {
  /**
   *Account
   */

  accountLogin: {
    url: "/v1.0/login",
    method: "POST",
  },
  resendOtp: {
    url: "/v2.0/admin/resend-otp",
    method: "POST",
  },
  updateProflie: {
    url: "/v1.0/update-profile",
    method: "PUT",
  },
  updateSocialLink: (id) => ({
    url: `/v1.0/admin/social-link/${id}`,
    method: "PUT",
  }),
  changePassword: {
    url: "/v1.0/change-password",
    method: "PUT",
  },
  forgetPassword: {
    url: "/v1.0/forgot-password",
    method: "POST",
  },
  resetPassword: {
    url: "/v1.0/reset-password",
    method: "POST",
  },
  otp: {
    url: "/v1.0/verify-otp",
    method: "POST",
  },
  logout: {
    url: "/v1.0/logout",
    method: "POST",
  },
};
export default Auth;
