
import { AdminChangePassword, AdminProfile } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route() {
  return [
    {
      path: adminRoutesMap.PROFILE.path,
      private: true,
      name: "Profile",
      key: adminRoutesMap.PROFILE.path,
      belongsToSidebar: false,
      element: <AdminProfile />,
    },
    {
      path: adminRoutesMap.CHANGE_PASSWORD.path,
      private: true,
      name: "Change Password",
      key: adminRoutesMap.CHANGE_PASSWORD.path,
      belongsToSidebar: false,
      element: <AdminChangePassword />,
    },
  ];
}
