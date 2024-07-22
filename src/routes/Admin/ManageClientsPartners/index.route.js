import { ManageClientsPartners } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route() {
  return [
    {
      path: adminRoutesMap.MANAGE_CLIENTS_PARTNERS.path,
      private: true,
      name: "Manage Clients & Partners",
      key: adminRoutesMap.MANAGE_CLIENTS_PARTNERS.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.MANAGE_CLIENTS_PARTNERS.icon,
      element: <ManageClientsPartners />,
   
    },
  ];
}
