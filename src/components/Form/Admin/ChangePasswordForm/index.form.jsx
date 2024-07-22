import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Password as TextPassword, CommonButton } from "../../../index";
import validation from "./validation";

function ChangePasswordForm({ onSubmit, t, loading }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [shownewPassword, setShowNewPassword] = useState(false);
  const [showconfirmPassword, setShowConfirmPassword] = useState(false);
  const [checkRegex, setCheckRegex] = useState({
    capital: false,
    number: false,
    length: false,
  });
  const initialValues = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

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

  const onFormSubmit = (value, resetForm) => {
    if (checkRegex.capital && checkRegex.length && checkRegex.number) {
      onSubmit(value, resetForm);
    }
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={(e, { resetForm }) => {
        onFormSubmit(e, resetForm);
        setShowConfirmPassword(false);
        setShowNewPassword(false);
        setShowCurrentPassword(false);
      }}
      validate={(e) => {
        onPasswordChange(e.newPassword);
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="password">
                  {t("text.changePassword.oldPassword")}
                </label>
              </div>
              <div className="form-control-wrap">
                <TextPassword
                  className="form-control form-control-lg"
                  name="oldPassword"
                  placeholder={t("text.changePassword.currentPlaceholder")}
                  setFieldValue={props.handleChange}
                  type={showCurrentPassword ? "text" : "password"}
                  toggleIcon={
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowCurrentPassword(!showCurrentPassword);
                      }}
                      className="form-icon lg form-icon-right passcode-switch"
                      data-target="password"
                    >
                      <em
                        className={`passcode-icon icon-show icon ni ni-eye${
                          showCurrentPassword ? "" : "-off"
                        } `}
                      />
                    </Link>
                  }
                  icon=""
                />
              </div>
            </div>
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
                  type={shownewPassword ? "text" : "password"}
                  toggleIcon={
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowNewPassword(!shownewPassword);
                      }}
                      className="form-icon lg form-icon-right passcode-switch"
                      data-target="password"
                    >
                      <em
                        className={`passcode-icon icon-show icon ni ni-eye${
                          shownewPassword ? "" : "-off"
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
                  type={showconfirmPassword ? "text" : "password"}
                  toggleIcon={
                    <Link
                      to="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowConfirmPassword(!showconfirmPassword);
                      }}
                      className="form-icon lg form-icon-right passcode-switch"
                      data-target="password"
                    >
                      <em
                        className={`passcode-icon icon-show icon ni ni-eye${
                          showconfirmPassword ? "" : "-off"
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
                htmltype="button"
                type="submit"
              >
                {t("text.changePassword.submit")}
              </CommonButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default ChangePasswordForm;
