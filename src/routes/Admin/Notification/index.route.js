import { NotificationAll } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route() {
  return [
    {
      path: adminRoutesMap.NOTIFICATIONS.path,
      private: true,
      name: "Notifications",
      key: adminRoutesMap.NOTIFICATIONS.path,
      belongsToSidebar: false,
      icon: adminRoutesMap.NOTIFICATIONS.icon,
      element: <NotificationAll />,
    },
  ];
}
