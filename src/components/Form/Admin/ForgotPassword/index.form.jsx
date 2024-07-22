import { Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
// import i18next from "i18next";
import { Input as TextInput, CommonButton, AuthLogo } from "../../../index";
import validation from "./validation";

function ForgotPasswordForm({ onSubmit, t, loading }) {
  const initialValues = {
    email: "",
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={onSubmit}
      enableReinitialize
    >
      {(props) => {
        return (
          <div className="nk-block nk-block-middle nk-auth-body  wide-xs">
            <AuthLogo />
            <div className="card">
              <div className="card-inner card-inner-lg">
                <div className="nk-block-head">
                  <div className="nk-block-head-content">
                    <h4 className="nk-block-title">
                      {t("text.adminLogin.forgotPasswordLink")}
                    </h4>
                    <div className="nk-block-des">
                      <p>
                        {t(
                          "text.adminForgetPassword.forgotPasswordDescription"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <Form>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="email">
                        {t("text.adminLogin.email")}
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <TextInput
                        id="email"
                        className="form-control form-control-lg"
                        name="email"
                        disabled={false}
                        variant="standard"
                        type="email"
                        placeholder={t("text.adminLogin.emailPlaceholder")}
                        setFieldValue={props.handleChange}
                        icon=""
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <CommonButton
                      extraClassName="btn btn-lg btn-primary btn-block"
                      loading={loading}
                      // onClick={()=>navigate(adminRoutesMap.OTP_VERIFICATION.path)}
                      htmltype="button"
                      type="submit"
                    >
                      {t("text.adminForgetPassword.submit")}
                    </CommonButton>
                  </div>
                </Form>
                <div className="form-note-s2 text-center pt-4">
                  <Link to={adminRoutesMap.LOGIN.path}>
                    <strong>{t("text.adminForgetPassword.backTo")}</strong>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default ForgotPasswordForm;
