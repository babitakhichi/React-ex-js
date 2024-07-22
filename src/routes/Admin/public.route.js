import { DesktopOutlined } from "@ant-design/icons";
import {
  AdminLogin,
  ForgotPassword,
  OtpVerification,
  ResetPassword,
} from "../../pages";

import adminRoutesMap from "../../routeControl/adminRoutes";

export default function route(t) {
  return [
    {
      path: adminRoutesMap.LOGIN.path,
      name: t("text.common.yes"),
      key: adminRoutesMap.LOGIN.path,
      private: false,
      belongsToSidebar: false,
      icon: <DesktopOutlined />,
      element: <AdminLogin />,
    },
    {
      path: adminRoutesMap.FORGOT_PASSWORD.path,
      name: "Admin Forgot Password",
      key: adminRoutesMap.FORGOT_PASSWORD.path,
      private: false,
      belongsToSidebar: false,
      icon: <DesktopOutlined />,
      element: <ForgotPassword />,
    },
    {
      path: adminRoutesMap.RESET_PASSWORD.path,
      name: "Admin Reset Password",
      key: adminRoutesMap.RESET_PASSWORD.path,
      private: false,
      belongsToSidebar: false,
      icon: <DesktopOutlined />,
      element: <ResetPassword />,
    },
    {
      path: adminRoutesMap.OTP_VERIFICATION.path,
      name: "Admin OTP Verification",
      key: adminRoutesMap.OTP_VERIFICATION.path,
      private: false,
      belongsToSidebar: false,
      icon: <DesktopOutlined />,
      element: <OtpVerification />,
    },
  ];
}
