import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";

import { logger, modalNotification } from "../../../utils";
import adminRoutesMap from "../../../routeControl/adminRoutes";
import {
  forgetPasswordData,
  otpVerification,
} from "../../../redux/AuthSlice/index.slice";
import { AdminAuthServices } from "../../../services/Admin/Auth/index.service";
import { AdminOtpVerificationForm } from "../../../components";

function OtpVerification() {
  const navigate = useNavigate();
  let dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
  });
  const emailData = useSelector(forgetPasswordData);
  const onSubmit = async () => {
    setLoading(true);
    try {
      let otpValue = "";
      for (let key in otp) {
        if (key) {
          otpValue += otp[key];
        }
      }
      if (otpValue && otpValue.length === 4) {
        let bodyData = {
          otp: otpValue,
        };
        bodyData.email = emailData.email;

        const response = await AdminAuthServices.otpService(bodyData);
        const { success, data, message } = response;
        if (success === 1) {
          modalNotification({
            type: "success",
            message,
          });
          dispatch(otpVerification(data));
          navigate(adminRoutesMap.RESET_PASSWORD.path);
        } else {
          modalNotification({
            type: "error",
            message,
          });
        }
      } else {
        modalNotification({
          type: "error",
          message: t("validation.common.validOtp"),
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  const resendCode = async () => {
    try {
      let bodyData = {
        email: emailData.email,
      };
      const response = await AdminAuthServices.resendOtpService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  return (
    <>
      <AdminOtpVerificationForm
        onSubmit={onSubmit}
        otp={otp}
        loading={loading}
        setOtp={setOtp}
        t={t}
        resendCode={resendCode}
      />
    </>
  );
}

export default OtpVerification;
