const UserProfile = {
  /**
   *Account
   */
  getDetails: {
    url: "/v2.0/get_contact_detail",
    method: "GET",
  },
  getLanguages: {
    url: "/v2.0/languages",
    method: "GET",
  },
  changeEmailPhone: {
    url: "/v2.0/change_email_phone_number",
    method: "POST",
  },
  verifyChangeEmailPhone: {
    url: "/v2.0/change_verify_email_phone_number",
    method: "POST",
  },
  addPhoneEmail: {
    url: "/v2.0/add_phone_number_email",
    method: "POST",
  },
  verifyAddEmailPhone: {
    url: "/v2.0/add_verify_phone_number_email",
    method: "POST",
  },
  resendOTPProfile: {
    url: "/v2.0/resend_otp_profile",
    method: "POST",
  },
  addBusinessAccount: {
    url: "/v2.0/save_business_detail",
    method: "POST",
  },
  getAccount: {
    url: "/v2.0/get_business_account",
    method: "GET",
  },
  updateAccountStatus:{
    url:"/v2.0/update-status",
    method:"PUT"
  },
  addState: {
    url: "/v2.0/update-state",
    method: "POST",
  },
  corporatePlans:{
    url:`/v2.0/corporate-subscription-plan`,
    method:"GET"
    },
  assignPlan:{
    url:"/v2.0/assign-corporate-plan",
    method:"POST",
  },
  updateCorporateStatus:{
    url:"/v2.0/update-corporate-status",
    method:"PUT"
  }
};
export default UserProfile;
