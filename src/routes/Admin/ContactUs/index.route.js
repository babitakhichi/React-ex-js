import { t } from "i18next";
import { Outlet } from "react-router-dom";
import { PendingQueries, RepliedQueries } from "../../../pages/Admin";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route() {
  return [
    {
      path: adminRoutesMap.CONTACT_US.path,
      private: true,
      name: t("text.userContactUs.title"),
      key: adminRoutesMap.CONTACT_US.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.CONTACT_US.icon,
      element: <Outlet />,
      children: [
        {
          path: adminRoutesMap.PENDING_QUERIES.path,
          private: true,
          name: t("text.userContactUs.pendingQueries"),
          key: adminRoutesMap.PENDING_QUERIES.path,
          belongsToSidebar: true,
          element: <PendingQueries />,
        },
        {
          path: adminRoutesMap.REPLIED_QUERIES.path,
          private: true,
          name: t("text.userContactUs.repliedQueries"),
          key: adminRoutesMap.REPLIED_QUERIES.path,
          belongsToSidebar: true,
          element: <RepliedQueries />,
        },
      ],
    },
  ];
}
