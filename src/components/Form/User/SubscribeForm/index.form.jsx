import { Form, Formik } from "formik";
import React from "react";
import { t } from "i18next";
import { Input as TextInput, CommonButton } from "../../../index";
import validation from "./validation";

function SubscribeForm({ onSubmit, loading }) {
  const initialValues = {
    email: "",
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={(e, { resetForm }) => onSubmit(e, resetForm)}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form>
            <div className="form-group">
              <TextInput
                className="form-control"
                placeholder={t("text.userFooter.emailPlaceholder")}
                name="email"
                type="email"
                setFieldValue={props.handleChange}
              />
              <CommonButton
                variant="light"
                extraClassName="rounded-pill"
                htmltype="button"
                type="submit"
                loading={loading}
              >
                {t("text.userFooter.subscribe")}
              </CommonButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default SubscribeForm;
