import { Formik, Form } from "formik";
import moment from "moment";
import React, { useState } from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { classicDateFormat, dateFormateYearMonth } from "../../../../helpers";
import {
  disableEndDateFutureDays,
  disableStartDateFutureDays,
} from "../../../../utils";
import {
  DatePicker,
  CommonButton,
  AntSelect,
  textFormatter,
} from "../../../index";
// import { DatePicker, CommonButton, Select } from "../../..";
// import { classicDateFormat } from "../../../../helpers";
// import { disabledFutureDate } from "../../../../utils";

function TransactionHistoryFilter({
  onSubmit,
  t,
  loading,
  filterData,
  onReset,
  planData,
}) {
  // const arrayOfData = [
  //   { id: "all", name: "All" },
  //   {
  //     id: "active",
  //     name: "Active",
  //   },
  //   {
  //     id: "inactive",
  //     name: "Inactive",
  //   },
  // ];

  const initialValues = {
    startDate: filterData?.startDate || "",
    endDate: filterData?.endDate || "",
    subscription: filterData?.subscription || undefined,
    // status: filterData?.status || undefined,
  };

  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (
      filterData?.startDate ||
      filterData?.endDate ||
      // filterData?.status ||
      filterData?.subscription
    )
      onReset();
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      enableReinitialize
      validate={(e) => {
        if (
          e.startDate ||
          e.endDate ||
          //  || e.status
          e.subscription
        ) {
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
                      {/* {t("text.manageSellers.country")} */}
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
                <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {t("text.pendingQueries.subscriptionPlan")}
                    </label>
                    <AntSelect
                      size="medium"
                      id="subscription"
                      extraClassName="form-control"
                      name="subscription"
                      disabled={false}
                      variant="standard"
                      placeholder={t(
                        "text.manageSubscription.selectPlaceholder"
                      )}
                      showSearch
                      // arrayOfData={subscriptionData}
                      setFieldValue={props.handleChange}
                      // value={values.subscription}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    >
                      {planData.length > 0 &&
                        planData.map((item, key) => {
                          return (
                            <option key={key} value={item?.name}>
                              {textFormatter(item?.name)}
                            </option>
                          );
                        })}
                    </AntSelect>
                  </div>
                </div>
                {/* <div className="col-md-6">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {t("text.pendingApproval.status")}
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
                </div> */}
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

export default withTranslation()(TransactionHistoryFilter);
