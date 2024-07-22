import { Formik, Form } from "formik";
import { t } from "i18next";

import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { CommonButton, Input as TextInput } from "../../../index";

function ReferralsFilter({ onSubmit, onReset, loading, filterData }) {
  const initialValues = {
    referredBy: filterData?.referredBy || "",
    redeemedBy: filterData?.redeemedBy || "",
    referralCode: filterData?.referralCode || "",
  };

  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (
      filterData?.referredBy ||
      filterData?.redeemedBy ||
      filterData?.referralCode
    )
      onReset();
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      enableReinitialize
      validate={(e) => {
        if (e?.referredBy || e?.redeemedBy || e?.referralCode) {
          setDisableReset(false);
          setDisableSubmit(true);
        } else {
          setDisableReset(true);
          setDisableSubmit(false);
        }
      }}
    >
      {(props) => {
        return (
          <Form>
            <div className="dropdown-body dropdown-body-rg">
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      Referred by
                    </label>

                    <TextInput
                      className="form-control form-control-md"
                      placeholder="Referred by"
                      setFieldValue={props.handleChange}
                      name="referredBy"
                      disabled={false}
                      variant="standard"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      Redeemed by
                    </label>
                    <TextInput
                      className="form-control form-control-md"
                      placeholder="Redeemed by"
                      setFieldValue={props.handleChange}
                      name="redeemedBy"
                      disabled={false}
                      variant="standard"
                      type="text"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      Referral code
                    </label>

                    <TextInput
                      className="form-control form-control-md"
                      placeholder="Referral code"
                      setFieldValue={props.handleChange}
                      name="referralCode"
                      disabled={false}
                      variant="standard"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="dropdown-foot between">
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (!disableReset) {
                    onHandleReset(props.resetForm);
                  }
                }}
                type="button"
                className="clickable"
              >
                {t("text.common.reset")}
              </Link>

              <CommonButton
                extraClassName="btn btn-sm btn-primary"
                htmlType="submit"
                loading={loading}
                type="submit"
              >
                Filter
              </CommonButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default withTranslation()(ReferralsFilter);
