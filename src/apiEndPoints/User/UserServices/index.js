const User = {
  earlyAccess: {
    url: `/promotion/early-access`,
    method: "POST",
  },
  contactUs: {
    url: `/promotion/contact-us/enquiry`,
    method: "POST",
  },
  faq: {
    url: `/faq`,
    method: "GET",
  },
  video: {
    url: `/promotion/video`,
    method: "GET",
  },
  cms: {
    url: "/cms",
    method: "GET",
  },
  verifyUser: {
    url: "/cms",
    method: "GET",
  },
  corporatePlanList: {
    url: "/v2.0/corporate-subscription-plan-listing",
    method: "GET",
  },
};

export default User;
