import { baseRoutes } from "../../../helpers/baseRoutes";

const accessRoute = {
  PRIVACY_POLICY: {
    path: `${baseRoutes.userBaseRoutes}privacy-policy`,
  },
  END_USER_AGREEMENT: {
    path: `${baseRoutes.userBaseRoutes}end-user-agreement`,
  },
  FAQS: {
    path: `${baseRoutes.userBaseRoutes}faq`,
  },
  COOKIES_POLICY: {
    path: `${baseRoutes.userBaseRoutes}cookies-policy`,
  },
};

export default accessRoute;
