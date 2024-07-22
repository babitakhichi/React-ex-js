import { t } from "i18next";
import moment from "moment";
import React
    , { useState } 
    from "react";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import { Input as TextInput,CommonButton, DatePicker } from "../../../index";
import { classicDateFormat, dateFormateYearMonth } from "../../../../helpers";
// import { DatePicker, CommonButton, Select } from "../../..";
// import { classicDateFormat } from "../../../../helpers";
// import { disabledFutureDate } from "../../../../utils";

function ConsumptionFilter({ onSubmit, onReset, loading, filterData }) {
    const initialValues = {
        name:"",
        mobile_no:"",
        applied_at:"",
        email:"",
        // promo_code:""
    }
    const [disableReset, setDisableReset] = useState(true);
    const [disableSubmit, setDisableSubmit] = useState(false);
  
    const onHandleReset = (resetForm) => {
      resetForm({});
      setDisableReset(true);
      if (filterData?.name || filterData?.mobile_no || filterData?.applied_at||filterData?.email)
        onReset();
    };
  
    return (
        <Formik
        initialValues={{ ...initialValues }}
        onSubmit={disableSubmit && onSubmit}
        enableReinitialize
        validate={(e) => {
          if (e?.name || e?.mobile_no || e?.applied_at||e?.email) {
            setDisableReset(false);
            setDisableSubmit(true);
          } else {
            setDisableReset(true);
            setDisableSubmit(false);
          }
        }}
        >
            {
                (props) => (
                    <Form>
                        <div className="dropdown-body dropdown-body-rg">
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="overline-title overline-title-alt">
                                                Date
                                            </label>
                                            <div className="dateRange d-flex flex-column flex-sm-row">
                                                <div className="form-control-wrap">
                                                    <DatePicker
                                                        name="applied_at"
                                                        placeholder={classicDateFormat}
                                                        format={classicDateFormat}
                                                        requiredDateTimeFormat={dateFormateYearMonth}
                                                        className="form-control date-picker shadow-none"
                                                        onChange={(_, dateString) =>
                                                            props.setFieldValue("startDate", dateString)
                                                          }
                                                          value={
                                                            props.values?.applied_at !== ""
                                                              ? moment(props.values?.applied_at)
                                                              : ""
                                                          }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="overline-title overline-title-alt">
                                                Promo code
                                            </label>
                                            <TextInput
                                            name="promo"
                                               setFieldValue={props.handleChange}   
                                                type="text"
                                                className="form-control form-control-md"
                                                placeholder="Promo code"
                                            />
                                        </div>
                                    </div> */}
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="overline-title overline-title-alt">
                                                Name
                                            </label>
                                            <TextInput
                                               setFieldValue={props.handleChange}   
                                                type="text"
                                                name="name"
                                                className="form-control form-control-md"
                                                placeholder="Name"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="overline-title overline-title-alt">
                                                Email
                                            </label>
                                            <TextInput
                                            name="email"
                                               setFieldValue={props.handleChange}    type="text"
                                                className="form-control form-control-md"
                                                placeholder="Email"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group ">
                                            <label className="overline-title overline-title-alt">
                                                Phone number
                                            </label>
                                            <TextInput
                                               setFieldValue={props.handleChange}    type="text"
                                               name="mobile_no"
                                                className="form-control form-control-md"
                                                placeholder="Phone number"
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
                                    {t("text.common.filter")}
                                </CommonButton>
                            </div>
                    </Form>
                )
            }
        </Formik>
    );
}

export default withTranslation()(ConsumptionFilter);
