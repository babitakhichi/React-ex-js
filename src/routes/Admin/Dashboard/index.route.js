import { Dashboard } from "../../../pages";

import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route(t) {
  return [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: t("text.dashboard.dashboard"),
      key: adminRoutesMap.DASHBOARD.path,
      private: true,
      belongsToSidebar: true,
      icon: adminRoutesMap.DASHBOARD.icon,
      element: <Dashboard />,
    },
  ];
}
