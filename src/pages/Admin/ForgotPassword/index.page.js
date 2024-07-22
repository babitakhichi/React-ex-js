import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useDispatch } from "react-redux";
import adminRoutesMap from "../../../routeControl/adminRoutes";
import { logger, modalNotification } from "../../../utils";
import { AdminAuthServices } from "../../../services/Admin";
import { forgetPassword } from "../../../redux/AuthSlice/index.slice";
import { AdminForgotPasswordForm } from "../../../components";

function ForgotPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      let bodyData = { ...values };
      const response = await AdminAuthServices.forgetPasswordService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        dispatch(forgetPassword(bodyData));
        navigate(adminRoutesMap.OTP_VERIFICATION.path);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };
  return (
    <>
      <AdminForgotPasswordForm onSubmit={onSubmit} t={t} loading={loading} />
    </>
  );
}

export default ForgotPassword;
