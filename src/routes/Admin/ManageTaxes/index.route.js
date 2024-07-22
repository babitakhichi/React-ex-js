import adminRoutesMap from "../../../routeControl/adminRoutes";
import { ManageTaxes } from "../../../pages";

export default function route() {
  return [
    {
      path: adminRoutesMap.MANAGE_TAXES.path,
      private: true,
      name: "Manage Taxes",
      key: adminRoutesMap.MANAGE_TAXES.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.MANAGE_TAXES.icon,
      element: <ManageTaxes />,
    },
  ];
}
