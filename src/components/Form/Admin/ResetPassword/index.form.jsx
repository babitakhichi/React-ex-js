import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  Password as TextPassword,
  CommonButton,
  AuthLogo,
} from "../../../index";
import validation from "./validation";

function ResetPasswordForm({ onSubmit, t, loading }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkRegex, setCheckRegex] = useState({
    capital: false,
    number: false,
    length: false,
  });
  const onPasswordChange = (e) => {
    let data = e;
    // setNewPassword(e.target.value);
    let stateData = { ...checkRegex };
    let upperCasePattern = /[A-Z]/g;
    let specialCharacterPattern =
      /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{1,}$/;
    let lengthPattern = /^.{6,15}$/g;
    stateData.capital = upperCasePattern.test(data);
    stateData.number = specialCharacterPattern.test(data);
    stateData.length = lengthPattern.test(data);
    setCheckRegex(stateData);
  };
  const initialValues = {
    newPassword: "",
    confirmPassword: "",
  };
  const onFormSubmit = (value) => {
    if (checkRegex.capital && checkRegex.length && checkRegex.number) {
      onSubmit(value);
    }
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={(e, { resetForm }) => {
        onFormSubmit(e, resetForm);
      }}
      validate={(e) => {
        onPasswordChange(e.newPassword);
      }}
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
                      {t("text.adminResetPassword.title")}
                    </h4>
                    <div className="nk-block-des">
                      <p> {t("text.adminResetPassword.resetDescription")}</p>
                    </div>
                  </div>
                </div>
                <Form>
                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        {t("text.adminResetPassword.newPassword")}
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <TextPassword
                        className="form-control form-control-lg"
                        name="newPassword"
                        placeholder={t(
                          "text.adminResetPassword.newPasswordPlaceholder"
                        )}
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
                  <div className="form-group passwordInfo">
                    <h6>{t("text.adminResetPassword.passwordContain")}</h6>
                    <p
                      className={`text-${
                        checkRegex.capital ? "success" : "danger"
                      } mb-1`}
                    >
                      <em className="icon ni ni-check" />{" "}
                      {t("text.adminResetPassword.letter")}
                    </p>
                    <p
                      className={`text-${
                        checkRegex.number ? "success" : "danger"
                      } mb-1`}
                    >
                      <em className="icon ni ni-check" />
                      {t("text.adminResetPassword.number")}
                    </p>
                    <p
                      className={`text-${
                        checkRegex.length ? "success" : "danger"
                      } mb-1`}
                    >
                      <em className="icon ni ni-check" />{" "}
                      {t("text.adminResetPassword.long")}
                    </p>
                  </div>

                  <div className="form-group">
                    <div className="form-label-group">
                      <label className="form-label" htmlFor="password">
                        {t("text.adminResetPassword.confirmPassword")}
                      </label>
                    </div>
                    <div className="form-control-wrap">
                      <TextPassword
                        className="form-control form-control-lg"
                        name="confirmPassword"
                        placeholder={t(
                          "text.adminResetPassword.confirmPasswordPlaceholder"
                        )}
                        setFieldValue={props.handleChange}
                        type={showConfirmPassword ? "text" : "password"}
                        toggleIcon={
                          <Link
                            to="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowConfirmPassword(!showConfirmPassword);
                            }}
                            className="form-icon lg form-icon-right passcode-switch"
                            data-target="password"
                          >
                            <em
                              className={`passcode-icon icon-show icon ni ni-eye${
                                showConfirmPassword ? "" : "-off"
                              } `}
                            />
                          </Link>
                        }
                        icon=""
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <CommonButton
                      extraClassName="btn btn-lg btn-primary btn-block"
                      loading={loading}
                      // onClick={()=> passwordReset()}
                      htmltype="button"
                      type="submit"
                    >
                      {t("text.adminResetPassword.submit")}
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

export default ResetPasswordForm;
