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

function DiscountRequestsFilter({
  onSubmit,
  t,
  loading,
  filterData,
  onReset,
  formRef,
  documentTypeList,
}) {
  const initialValues = {
    document_type: filterData?.document_type || "",
    startDate: filterData?.startDate || "",
    endDate: filterData?.endDate || "",
  };

  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);
  // const dateFormat = "DD/MM/YYYY";
  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (
      filterData?.startDate ||
      filterData?.endDate ||
      filterData?.document_type
    )
      onReset();
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      innerRef={formRef}
      enableReinitialize
      validate={(e) => {
        if (e.startDate || e.endDate || e.document_type) {
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
                          // name="startDate"
                          // id="startDate"
                          // className="form-control date-picker shadow-none"
                          // placeholder="DD/MM/YYYY"
                          // // onChange={(_, dateString) =>
                          // //   props.setFieldValue("fromDate", dateString)
                          // // }
                          // value={
                          //   values.startDate !== ""
                          //     ? moment(values.startDate, "DD/MM/YYYY")
                          //     : ""
                          // }
                          // dateFormate="DD/MM/YYYY"
                          // disabledDate={(current) =>
                          //   disableStartDateFutureDays(
                          //     current,
                          //     values,
                          //     dateFormat,
                          //     initialValues
                          //   )
                          // }
                          // disabledDate={disabledFutureDate}
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
                          // name="endDate"
                          // id="endDate"
                          // className="form-control date-picker shadow-none"
                          // placeholder="DD/MM/YYYY"
                          // // onChange={(_, dateString) =>
                          // //   props.setFieldValue("toDate", dateString)
                          // // }
                          // value={
                          //   values.endDate !== ""
                          //     ? moment(values.endDate, "DD/MM/YYYY")
                          //     : ""
                          // }
                          // dateFormate="DD/MM/YYYY"
                          // disabledDate={(d) =>
                          //   disableEndDateFutureDays(
                          //     d,
                          //     dateFormat,
                          //     initialValues?.startDate || values.startDate
                          //   )
                          // }
                          // disabledDate={disabledFutureDate}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      {t("text.discountRequest.documentTypeTitle")}
                    </label>
                    {/* <AntSelect
                      size="medium"
                      id="status"
                      extraClassName="form-control"
                      name="document_type"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      arrayOfData={subscriptionData}
                      setFieldValue={props.handleChange}
                      value={values.document_type}
                      // onSelect={(e) => onSelectCountry(props.setFieldValue, e)}
                      // loading={countryLoader}
                    /> */}

                    <AntSelect
                      placeholder="Select"
                      size="medium"
                      name="document_type"
                      extraClassName="form-control"
                      showSearch
                      setFieldValue={props.handleChange}
                    >
                      {documentTypeList.length > 0 &&
                        documentTypeList?.map((item, key) => {
                          return (
                            <option key={key} value={item?.id}>
                              {textFormatter(item?.document_type)}
                            </option>
                          );
                        })}
                    </AntSelect>
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
                {t("text.common.filter")}
              </CommonButton>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default withTranslation()(DiscountRequestsFilter);
