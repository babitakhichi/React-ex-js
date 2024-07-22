import { Outlet } from "react-router-dom";
import {
  ContactUsReason,
  DocumentType,
  Headquarter,
  JitsiFeatures,
} from "../../../pages/Admin";
import adminRoutesMap from "../../../routeControl/adminRoutes";

export default function route(t) {
  return [
    {
      path: adminRoutesMap.MASTER.path,
      private: true,
      name: t("text.master.title"),
      key: adminRoutesMap.MASTER.path,
      belongsToSidebar: true,
      icon: adminRoutesMap.MASTER.icon,
      element: <Outlet />,
      children: [
        {
          path: adminRoutesMap.DOCUMENT_TYPE.path,
          private: true,
          name: t("text.master.documentTypeTitle"),
          key: adminRoutesMap.DOCUMENT_TYPE.path,
          belongsToSidebar: true,
          element: <DocumentType />,
        },
        {
          path: adminRoutesMap.CONTACT_US_REASON.path,
          private: true,
          name: t("text.master.contactUsReasonTitle"),
          key: adminRoutesMap.CONTACT_US_REASON.path,
          belongsToSidebar: true,
          element: <ContactUsReason />,
        },
        {
          path: adminRoutesMap.JITSI_FEATURES.path,
          private: true,
          name: t("text.master.jItsiFeatures"),
          key: adminRoutesMap.JITSI_FEATURES.path,
          belongsToSidebar: false,
          element: <JitsiFeatures />,
        },
        {
          path: adminRoutesMap.HEADQUARTER.path,
          private: true,
          name: t("text.master.headquarter"),
          key: adminRoutesMap.HEADQUARTER.path,
          belongsToSidebar: true,
          element: <Headquarter />,
        },
      ],
    },
  ];
}
