import { ManageTeamMembers } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";


export default function route() {
  return [
    {
      path: adminRoutesMap.MANAGE_TEAM_MEMBERS.path,
      private: true,
      name: "Manage Team Members",
      key: adminRoutesMap.MANAGE_TEAM_MEMBERS.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.MANAGE_TEAM_MEMBERS.icon,
      element: <ManageTeamMembers />,
   
    },
  ];
}
