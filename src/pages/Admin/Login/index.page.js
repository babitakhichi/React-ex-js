import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";
import { useDispatch } from "react-redux";

import adminRoutesMap from "../../../routeControl/adminRoutes";
import {
  logger,
  modalNotification,
  setLocalStorageToken,
} from "../../../utils";
import { AdminAuthServices } from "../../../services/Admin";
import { login } from "../../../redux/AuthSlice/index.slice";
import { AdminLoginForm } from "../../../components";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      let bodyData = { ...values };
      const response = await AdminAuthServices.userLogin(bodyData);
      const { success, data, message } = response;
      if (success === 1) {
        const resData = data;
        resData.userRole = "admin";
        dispatch(login(resData));
        setLocalStorageToken(data?.jwt);
        modalNotification({
          type: "success",
          message,
        });
        navigate(adminRoutesMap.DASHBOARD.path);
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
      <AdminLoginForm onSubmit={onSubmit} t={t} loading={loading} />
    </>
  );
}

export default Login;
