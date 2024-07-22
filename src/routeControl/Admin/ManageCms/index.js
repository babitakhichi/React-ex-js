const accessRoute = {
  MANAGE_CMS: {
    path: "/admin",
    icon: (
      <span className="nk-menu-icon">
        <em className="icon ni ni-file-docs" />
      </span>
    ),
  },
  END_USER_AGREEMENT: {
    path: "/admin/end-user-agreement",
  },
  PRIVACY_POLICY: {
    path: "/admin/privacy-policy",
  },
  COOKIES_POLICY: {
    path: "/admin/cookies-policy",
  },
  FAQs: {
    path: "/admin/faqs",
  },
};

export default accessRoute;
