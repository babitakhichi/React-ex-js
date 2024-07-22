import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";
import { Input as TextInput } from "../../../../Antd";
import { CommonButton } from "../../../../UiElement";

import validation from "./validation";

function DiscountAmountForm({ onSubmit, loading }) {
  const initialValues = {
    refund_amount: "",
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
          <Form>
            <div className="form-group">
              <TextInput
                className="form-control form-control-lg"
                placeholder={t("text.discountRequest.discountAmount")}
                name="refund_amount"
                disabled={false}
                variant="standard"
                setFieldValue={props.handleChange}
                type="number"
              />
            </div>
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2 mt-3">
              <div>
                {/* <Link
                href="#"
                className="btn btn-lg btn-primary"
                onClick={() => requestAccept()}
              >
                Submit
              </Link> */}
                <CommonButton
                  htmltype="button"
                  type="submit"
                  extraClassName="btn btn-lg btn-primary"
                  loading={loading}
                >
                  {t("text.userLogin.submit")}
                </CommonButton>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default DiscountAmountForm;
