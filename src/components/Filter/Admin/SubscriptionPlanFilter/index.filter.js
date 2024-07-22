import { Formik, Form } from "formik";

import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { AntSelect, CommonButton } from "../../../index";
import { categoryData } from "../../../../config/subscriptonData";
// import { DatePicker, CommonButton, Select } from "../../..";
// import { classicDateFormat } from "../../../../helpers";
// import { disabledFutureDate } from "../../../../utils";

function SubscriptionPlanFilter({ onSubmit, t, loading, filterData, onReset }) {
  const initialValues = {
    status: filterData?.status || undefined,
    plan: filterData?.plan || undefined,
    is_corporate: filterData?.is_corporate || undefined,
  };

  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const arrayOfData = [
    {
      id: "active",
      name: "Active",
    },
    {
      id: "inactive",
      name: "Inactive",
    },
  ];
  const planTypeData = [
    {
      id: "videoConferencing",
      name: "Video Conferencing",
    },
    {
      id: "translation",
      name: "Translation",
    },
    {
      id: "bundled",
      name: "Bundled",
    },
  ];

  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (filterData?.status || filterData?.plan || filterData.is_corporate)
      onReset();
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      enableReinitialize
      validate={(e) => {
        if (e.plan || e.status || e.is_corporate) {
          setDisableReset(false);
          setDisableSubmit(true);
        } else {
          setDisableReset(true);
          setDisableSubmit(false);
        }
      }}
    >
      {(props) => {
        const { values } = props;
        return (
          <Form>
            <div className="dropdown-body dropdown-body-rg">
              <div className="row g-3">
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {t("text.manageSubscription.subscriptionCategory")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="is_corporate"
                      extraClassName="form-control"
                      name="is_corporate"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      options={categoryData}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {t("text.common.status")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="status"
                      extraClassName="form-control"
                      name="status"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={arrayOfData}
                      setFieldValue={props.handleChange}
                      value={values.status}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {t("text.manageSubscription.planType")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="plan"
                      extraClassName="form-control"
                      name="plan"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={planTypeData}
                      setFieldValue={props.handleChange}
                      value={values.plan}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
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
                htmltype="submit"
                loading={loading}
                type="submit"
              >
                {t("text.common.filter")}
              </CommonButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default withTranslation()(SubscriptionPlanFilter);
