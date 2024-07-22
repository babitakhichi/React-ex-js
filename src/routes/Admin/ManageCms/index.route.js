import { Outlet } from "react-router-dom";
import {
  AdminCms,
  // CookiesPolicy,
  // EndUserAgreement,
  FAQs,
  // PrivacyPolicy,
} from "../../../pages/Admin";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route(t) {
  return [
    {
      path: adminRoutesMap.MANAGE_CMS.path,
      private: true,
      name: t("text.manageCms.pageTitle"),
      key: adminRoutesMap.MANAGE_CMS.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.MANAGE_CMS.icon,
      element: <Outlet />,
      children: [
        {
          path: adminRoutesMap.PRIVACY_POLICY.path,
          private: true,
          name: t("text.privacyPolicy.pageTitle"),
          key: adminRoutesMap.PRIVACY_POLICY.path,
          belongsToSidebar: true,
          element: <AdminCms />,
        },

        {
          path: adminRoutesMap.END_USER_AGREEMENT.path,
          private: true,
          name: t("text.termsAndCondition.pageTitle"),
          key: adminRoutesMap.END_USER_AGREEMENT.path,
          belongsToSidebar: true,
          element: <AdminCms />,
        },
        {
          path: adminRoutesMap.COOKIES_POLICY.path,
          private: true,
          name: t("text.cookiesPolicy.pageTitle"),
          key: adminRoutesMap.COOKIES_POLICY.path,
          belongsToSidebar: true,
          element: <AdminCms />,
        },
        {
          path: adminRoutesMap.FAQs.path,
          private: true,
          name: t("text.faqs.pageTitle"),
          key: adminRoutesMap.FAQs.path,
          belongsToSidebar: true,
          element: <FAQs />,
        },
      ],
    },
  ];
}
