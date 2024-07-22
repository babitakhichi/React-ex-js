import { t } from "i18next";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  PageHeader,
  AcountSidebar,
  AdminChangePasswordForm,
} from "../../../../components/index";
import { AdminAuthServices } from "../../../../services";
import { logger, modalNotification } from "../../../../utils";

function ChangePassword() {
  const [asideView, setAsideView] = useState(false);
  const [loading, setLoading] = useState(false);
  const asideToggle = () => {
    setAsideView(!asideView);
  };
  if (asideView) {
    document.querySelector("body").classList.add("toggle-shown");
  } else {
    document.querySelector("body").classList.remove("toggle-shown");
  }
  const onSubmit = async (values, resetForm) => {
    setLoading(true);
    try {
      let bodyData = { ...values };
      const response = await AdminAuthServices.changePasswordService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        resetForm();
        // navigate(adminRoutesMap.OTP_VERIFICATION.path);
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
    setLoading(true);
    try {
      setLoading(false);
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  return (
    <>
      <div className="nk-block">
        <div className="card">
          <div className="card-aside-wrap">
            <div className="card-inner card-inner-lg">
              <div className="nk-block-head nk-block-head-lg">
                <div className="nk-block-between">
                  <PageHeader heading={t("text.changePassword.title")}>
                    <p>{t("text.changePassword.description")}</p>
                  </PageHeader>
                  <div className="nk-block-head-content align-self-start d-lg-none">
                    <Link
                      to="#"
                      onClick={() => asideToggle()}
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${
                        asideView ? "active" : ""
                      }`}
                    >
                      <em className="icon ni ni-menu-alt-r" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="nk-block wide-xs">
                <AdminChangePasswordForm
                  t={t}
                  loading={loading}
                  onSubmit={onSubmit}
                />
              </div>
            </div>
            <AcountSidebar asideView={asideView} asideToggle={asideToggle} />
          </div>
        </div>
      </div>
    </>
  );
}
export default ChangePassword;
