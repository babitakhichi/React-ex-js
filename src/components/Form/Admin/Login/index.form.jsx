import { Form, Formik } from "formik";
import React, { useState } from "react";

import { Link } from "react-router-dom";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import {
  Input as TextInput,
  Password as TextPassword,
  CommonButton,
  AuthLogo,
} from "../../../index";
import validation from "./validation";

function LoginForm({ onSubmit, t, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const initialValues = {
    email: "",
    password: "",
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
                      {t("text.adminLogin.signin")}
                    </h4>
                    <div className="nk-block-des">
                      <p>{t("text.adminLogin.adminLoginDescription")}</p>
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
                        icon=""
                        setFieldValue={props.handleChange}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        {t("text.adminLogin.password")}
                      </label>
                      {/* {moduleRoutesMap.FORGOT_PASSWORD.path} */}
                      <Link
                        className="link link-primary link-sm"
                        to={adminRoutesMap.FORGOT_PASSWORD.path}
                      >
                        {t("text.adminLogin.forgotPasswordLink")}
                      </Link>
                    </div>
                    <div className="form-control-wrap">
                      <TextPassword
                        className="form-control form-control-lg"
                        name="password"
                        placeholder={t("text.adminLogin.passwordPlaceholder")}
                        setFieldValue={props.handleChange}
                        type={showPassword ? "text" : "password"}
                        toggleIcon={
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowPassword(!showPassword);
                            }}
                            className="form-icon lg form-icon-right passcode-switch"
                            data-target="password"
                          >
                            <em
                              className={`passcode-icon icon-show icon ni ni-eye${
                                showPassword ? "" : "-off"
                              } `}
                            />
                          </Link>
                        }
                        icon=""
                      />
                    </div>
                  </div>
                  {/* <div className="form-group">
                            <div className="d-flex justify-content-between">
                            <div className="custom-control custom-control-sm custom-checkbox">
                                <CustomCheckbox
                                className="custom-control-input"
                                id="checkbox"
                                name="rememberMe"
                                // checked={props.values?.rememberMe}
                                >
                                <label className="custom-control-label" htmlFor="checkbox">
                                    {t("text.adminLogin.rememberMe")}
                                </label>
                                </CustomCheckbox>
                            </div>
                            <Link
                                className="link link-primary link-sm"
                                to={moduleRoutesMap[user].FORGOT_PASSWORD.path}
                            >
                                {t("text.adminLogin.forgotPasswordLink")}
                            </Link>
                            </div>
                        </div> */}
                  <div className="form-group">
                    <CommonButton
                      extraClassName="btn btn-lg btn-primary btn-block"
                      loading={loading}
                      //   onClick={() => loginSuccessfully()}
                      htmltype="button"
                      type="submit"
                    >
                      {t("text.adminLogin.submit")}
                    </CommonButton>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default LoginForm;
