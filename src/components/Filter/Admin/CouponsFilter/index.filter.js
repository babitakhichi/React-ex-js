import { Formik, Form } from "formik";

import { t } from "i18next";
import moment from "moment";
import { useState } from "react";

import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { DatePicker, CommonButton, AntSelect } from "../../../index";

import { classicDateFormat, dateFormateYearMonth } from "../../../../helpers";
import { disabledPastDate } from "../../../../utils";

function CouponsFilter({ onSubmit, onReset, loading, filterData }) {
  const arrayOfData = [
    // { id: "", name: "All" },
    {
      id: "active",
      name: "Active",
    },
    {
      id: "inactive",
      name: "Inactive",
    },
  ];

  const initialValues = {
    startDate: filterData?.startDate || "",
    endDate: filterData?.endDate || "",
    status: filterData?.status || undefined,
  };

  const [disableReset, setDisableReset] = useState(true);
  const [disableSubmit, setDisableSubmit] = useState(false);

  const onHandleReset = (resetForm) => {
    resetForm({});
    setDisableReset(true);
    if (filterData?.startDate || filterData?.endDate || filterData?.status)
      onReset();
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={disableSubmit && onSubmit}
      enableReinitialize
      validate={(e) => {
        if (e?.startDate || e?.endDate || e?.status) {
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
                      Date
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
                        />
                      </div>
                      <div className="dateBetween align-self-center mx-0 mx-sm-1 my-sm-0 my-1">
                        To
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
                          disabledDate={(current) =>disabledPastDate(
                            current,props?.values?.startDate
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group ">
                    <label className="overline-title overline-title-alt">
                      Status
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

export default withTranslation()(CouponsFilter);
