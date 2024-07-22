import { Form, Formik } from "formik";
import React from "react";
import { Input as TextInput, CommonButton } from "../../../index";
import validation from "./validation";

function UpdateProfileForm({
  onSubmit,
  closeEditProfileModal,
  loading,
  t,
  userData,
}) {
  const initialValues = {
    full_name: userData?.full_name || "",
    // username: userData?.username || "",
    // email: "info@dakkia.com",
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={(values) => {
        onSubmit(values, "profile");
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form className="w-100">
            <div className="form-group">
              <label className="form-label" htmlFor="full-name">
                {t("text.adminUpdateProfile.fullName")}
              </label>
              <TextInput
                id="full-name"
                className="form-control form-control-lg"
                name="full_name"
                disabled={false}
                variant="standard"
                type="text"
                placeholder={t("text.adminUpdateProfile.fullNamePlaceholder")}
                icon=""
                setFieldValue={props.handleChange}
              />
            </div>
            {/* <div className="form-group">
              <label className="form-label" htmlFor="display-name">
                {t("text.adminUpdateProfile.displayName")}
              </label>
              <TextInput
                id="display-name"
                className="form-control form-control-lg"
                name="username"
                disabled={false}
                variant="standard"
                type="text"
                placeholder={t(
                  "text.adminUpdateProfile.displayNamePlaceholder"
                )}
                icon=""
                setFieldValue={props.handleChange}
              />
            </div> */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                {t("text.adminLogin.email")}
              </label>
              <TextInput
                id="email"
                className="form-control form-control-lg"
                name="email"
                disabled
                variant="standard"
                type="email"
                value={userData.email}
                placeholder={t("text.adminLogin.emailPlaceholder")}
                icon=""
                // setFieldValue={props.handleChange}
              />
            </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                <CommonButton
                  htmltype="button"
                  type="submit"
                  className="btn btn-lg btn-primary"
                  loading={loading}
                >
                  {t("text.adminUpdateProfile.title")}
                </CommonButton>
              </div>
              <div>
                <CommonButton
                  onClick={closeEditProfileModal}
                  className="link link-light"
                >
                  {t("text.common.cancel")}
                </CommonButton>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default UpdateProfileForm;
