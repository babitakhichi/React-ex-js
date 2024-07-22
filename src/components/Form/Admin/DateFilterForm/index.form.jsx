import { Form, Formik } from "formik";
import React from "react";

import { AntSelect, DatePicker } from "../../../index";

function DateFilterForm({
  dateFilter,
  planFilterData,
  dateFilterData,
  handleChange,
  handleFilter,
}) {
  const initialValues = {
    dateFilter: "year",
    planFilter: "All",
    fromDate: null,
    toDate: null,
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validate={(e) => {
        let values = {
          dateFilter: e?.dateFilter,
          planFilter: e?.planFilter,
          customRange: { fromDate: e.fromDate, toDate: e.toDate },
        };
        handleFilter(values);
      }}
      enableReinitialize
    >
      {() => {
        return (
          <div className="card-tools graphFilter">
            <Form className="d-flex flex-wrap flex-lg-nowrap w-100 justify-content-end">
              {dateFilter === "custom" ? (
                <div className="me-0 me-lg-2 customDate">
                  <label className="form-label mb-0">Select date</label>
                  <div className="d-flex flex-column justify-content-end flex-sm-row">
                    <div className="form-control-wrap">
                      <DatePicker
                        id="fromDate"
                        name="fromDate"
                        className="form-control date-picker shadow-none"
                        placeholder="DD/MM/YY"
                      />
                    </div>
                    <div className="align-self-center mx-0 mx-sm-1 my-sm-0 my-1">
                      To
                    </div>
                    <div className="form-control-wrap">
                      <DatePicker
                        id="toDate"
                        name="toDate"
                        className="form-control date-picker shadow-none"
                        placeholder="DD/MM/YY"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
              <div className="form-group mb-0">
                <label className="form-label mb-0">Date Range</label>
                <AntSelect
                  size="medium"
                  id="dateFilter"
                  name="dateFilter"
                  disabled={false}
                  variant="standard"
                  placeholder="Select"
                  arrayOfData={dateFilterData}
                  onChange={handleChange}
                  defaultValue="year"
                />
              </div>
              <div className="form-group mb-0">
                <label className="form-label mb-0">Plan</label>
                <AntSelect
                  size="medium"
                  id="planFilter"
                  name="planFilter"
                  disabled={false}
                  variant="standard"
                  placeholder="Select"
                  arrayOfData={planFilterData}
                  defaultValue="all"
                />
              </div>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default DateFilterForm;
