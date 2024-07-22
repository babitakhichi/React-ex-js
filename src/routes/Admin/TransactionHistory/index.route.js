import { t } from "i18next";
import { TransactionHistory } from "../../../pages";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route() {
  return [
    {
      path: adminRoutesMap.TRANSACTION_HISTORY.path,
      name: t("text.transactionHistory.title"),
      key: adminRoutesMap.TRANSACTION_HISTORY.path,
      private: true,
      belongsToSidebar: true,
      icon: adminRoutesMap.TRANSACTION_HISTORY.icon,
      element: <TransactionHistory />,
    },
  ];
}
