const Referrals = {
  getReferralList: {
    url: "/v1.0/admin/referral-users",
    method: "GET",
  },
  getReferralDetails: {
    url: "/v1.0/admin/get-referral",
    method: "GET",
  },
  updateReferral: {
    url: "/v1.0/admin/update-referral",
    method: "PUT",
  },
};
export default Referrals;
