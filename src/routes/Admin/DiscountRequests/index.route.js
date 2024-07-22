import { DiscountRequests } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route(t) {
  return [
    {
      path: adminRoutesMap.DISCOUNT_REQUESTS.path,
      name: t("text.discountRequest.title"),
      key: adminRoutesMap.DISCOUNT_REQUESTS.path,
      private: true,
      belongsToSidebar: true,
      icon: adminRoutesMap.DISCOUNT_REQUESTS.icon,
      element: <DiscountRequests />,
    },
  ];
}
