import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import { AdminResetPasswordForm } from "../../../components";
import { logger, modalNotification } from "../../../utils";
import { AdminAuthServices } from "../../../services/Admin/Auth/index.service";
import {
  forgetPasswordData,
  resetPassword,
} from "../../../redux/AuthSlice/index.slice";
import adminRoutesMap from "../../../routeControl/adminRoutes";

function ResetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  let dispatch = useDispatch();
  let otpData = useSelector(forgetPasswordData);
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      let bodyData = { ...values };
      bodyData.email = otpData.email;
      bodyData.otp = otpData.token;
      const response = await AdminAuthServices.resetPasswordService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        dispatch(resetPassword());
        navigate(adminRoutesMap.LOGIN.path);
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
      <AdminResetPasswordForm onSubmit={onSubmit} t={t} loading={loading} />
    </>
  );
}

export default ResetPassword;
