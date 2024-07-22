import { Outlet } from "react-router-dom";
import {
   CouponsHistory,
  Promotions,
  Referrals,
} from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route() {
  return [
    {
      path: adminRoutesMap.COUPONS_AND_REFERRALS.path,
      private: true,
      name: "Promotions & Referrals",
      key: adminRoutesMap.COUPONS_AND_REFERRALS.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.COUPONS_AND_REFERRALS.icon,
      element: <Outlet />,
      children: [
        {
          path: adminRoutesMap.COUPONS.path,
          private: true,
          name: "Promotions",
          key: adminRoutesMap.COUPONS.path,
          belongsToSidebar: true,
          element: <Promotions />,
        },
        {
          path: `${adminRoutesMap.COUPONS_HISTORY.path}/:id`,
          private: true,
          name: "Coupons History",
          key: `${adminRoutesMap.COUPONS_HISTORY.path}/:id`,
          belongsToSidebar: false,
          element: <CouponsHistory />,
        },
        {
          path: adminRoutesMap.REFERRALS.path,
          private: true,
          name: "Referrals",
          key: adminRoutesMap.REFERRALS.path,
          belongsToSidebar: true,
          element: <Referrals />,
        },
      ],
    },
  ];
}
