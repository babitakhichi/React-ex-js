import { ManageSubscription } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route(t) {
  return [
    {
      path: adminRoutesMap.MANAGE_SUBSCRIPTION.path,
      private: true,
      name: t("text.manageSubscription.title"),
      key: adminRoutesMap.MANAGE_SUBSCRIPTION.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.MANAGE_SUBSCRIPTION.icon,
      element: <ManageSubscription />,
      // children: [
      //   {
      //     path: adminRoutesMap.MANAGE_SUBSCRIPTION.path,
      //     private: true,
      //     name: "Subscription Plans",
      //     key: adminRoutesMap.MANAGE_SUBSCRIPTION.path,
      //     belongsToSidebar: true,
      //     element: <ManageSubscription />,
      //   }
      // ],
    },
  ];
}
