import { Outlet } from "react-router-dom";
import { CustomerDetails, ManageCustomers } from "../../../pages/Admin";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route(t) {
  return [
    {
      path: adminRoutesMap.USERS.path,
      private: true,
      name: t("text.userManagement.userManageTitle"),
      key: adminRoutesMap.USERS.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.USERS.icon,
      element: <Outlet />,
      children: [
        {
          path: adminRoutesMap.MANAGE_CUSTOMERS.path,
          private: true,
          name: t("text.userManagement.title"),
          key: adminRoutesMap.MANAGE_CUSTOMERS.path,
          belongsToSidebar: true,
          element: <ManageCustomers />,
        },
        {
          path: `${adminRoutesMap.CUSTOMERS_DETAILS.path}/:id`,
          private: true,
          name: t("text.userManagement.title"),
          key: `${adminRoutesMap.CUSTOMERS_DETAILS.path}/:id`,
          belongsToSidebar: false,
          element: <CustomerDetails />,
        },
      ],
    },
  ];
}
