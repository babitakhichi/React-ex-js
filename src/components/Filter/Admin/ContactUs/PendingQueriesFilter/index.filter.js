import { Formik, Form } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  classicDateFormat,
  dateFormateYearMonth,
  // dateFormateYearMonthSlash,
} from "../../../../../helpers";
import {
  disableEndDateFutureDays,
  disableStartDateFutureDays,
} from "../../../../../utils";
// import
// disableEndDateFutureDays,
// // disableStartDateFutureDays,
// from
// "../../../../../utils";

import { DatePicker, CommonButton } from "../../../../index";

function PendingQueriesFilter({ onSubmit, loading, t, filterData, onReset }) {
  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  // const dateFormat = "YYYY/DD/MM";
  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (filterData?.startDate || filterData?.endDate) onReset();
  };

  const initialValues = {
    startDate: filterData?.startDate || "",
    endDate: filterData?.endDate || "",
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      enableReinitialize
      validate={(e) => {
        if (e.startDate || e.endDate) {
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
                      {t("text.common.date")}
                    </label>
                    <div className="dateRange d-flex flex-column flex-sm-row">
                      <div className="form-control-wrap">
                        <DatePicker
                          name="startDate"
                          id="startDate"
                          className="form-control date-picker shadow-none"
                          placeholder={classicDateFormat}
                          format={classicDateFormat}
                          requiredDateTimeFormat={dateFormateYearMonth}
                          onChange={(_, dateString) =>
                            props.setFieldValue("startDate", dateString)
                          }
                          value={
                            props.values?.startDate !== ""
                              ? moment(props.values?.startDate)
                              : ""
                          }
                          disabledDate={(current) =>
                            disableStartDateFutureDays(
                              current,
                              values,
                              dateFormateYearMonth,
                              initialValues
                            )
                          }
                        />
                      </div>
                      <div className="dateBetween align-self-center mx-0 mx-sm-1 my-sm-0 my-1">
                        {t("text.common.to")}
                      </div>
                      <div className="form-control-wrap">
                        <DatePicker
                          name="endDate"
                          id="endDate"
                          className="form-control date-picker shadow-none"
                          placeholder={classicDateFormat}
                          format={classicDateFormat}
                          requiredDateTimeFormat={dateFormateYearMonth}
                          onChange={(_, dateString) =>
                            props.setFieldValue("endDate", dateString)
                          }
                          value={
                            props.values?.endDate !== ""
                              ? moment(props.values?.endDate)
                              : ""
                          }
                          disabledDate={(d) =>
                            disableEndDateFutureDays(
                              d,
                              dateFormateYearMonth,
                              values.startDate
                            )
                          }
                        />
                      </div>
                    </div>
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

export default withTranslation()(PendingQueriesFilter);
