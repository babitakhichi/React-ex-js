import { Form, Formik } from "formik";
import React from "react";
import { Input as TextInput, CommonButton } from "../../../index";
import validation from "./validation";

function ForgotPasswordForm({
  onSubmit,
  t,
  closeSocialLinkModal,
  loading,
  userData,
}) {
  const initialValues = {
    facebook: userData?.facebook || "",
    twitter: userData?.twitter || "",
    instagram: userData?.instagram || "",
    linkedin: userData?.linkedin || "",
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={(values) => {
        onSubmit(values, "social");
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form className="w-100">
            <div className="form-group">
              <label className="form-label" htmlFor="facebook">
                {t("text.AdminUpdateSocialLink.facebook")}
              </label>
              <TextInput
                id="facebook"
                className="form-control form-control-lg"
                name="facebook"
                disabled={false}
                variant="standard"
                type="text"
                placeholder={t(
                  "text.AdminUpdateSocialLink.facebookPlaceholder"
                )}
                icon=""
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="twitter">
                {t("text.AdminUpdateSocialLink.twitter")}
              </label>
              <TextInput
                id="twitter"
                className="form-control form-control-lg"
                name="twitter"
                disabled={false}
                variant="standard"
                type="text"
                placeholder={t("text.AdminUpdateSocialLink.twitterPlaceholder")}
                icon=""
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="instagram">
                {t("text.AdminUpdateSocialLink.instagram")}
              </label>
              <TextInput
                id="instagram"
                className="form-control form-control-lg"
                name="instagram"
                disabled={false}
                variant="standard"
                type="text"
                placeholder={t(
                  "text.AdminUpdateSocialLink.instagramPlaceholder"
                )}
                icon=""
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="instagram">
                {t("text.AdminUpdateSocialLink.linkedin")}
              </label>
              <TextInput
                id="linkedin"
                className="form-control form-control-lg"
                name="linkedin"
                disabled={false}
                variant="standard"
                type="text"
                placeholder={t(
                  "text.AdminUpdateSocialLink.linkedinPlaceholder"
                )}
                icon=""
                setFieldValue={props.handleChange}
              />
            </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2">
              <div>
                <CommonButton
                  className="btn btn-lg btn-primary"
                  loading={loading}
                  htmltype="button"
                  type="submit"
                >
                  {t("text.AdminUpdateSocialLink.submit")}
                </CommonButton>
              </div>
              <div>
                <CommonButton
                  onClick={closeSocialLinkModal}
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

export default ForgotPasswordForm;
