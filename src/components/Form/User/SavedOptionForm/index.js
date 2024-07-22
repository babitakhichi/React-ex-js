import { Radio } from "antd";
import { Form, Formik } from "formik";
import React from "react";
import { Link } from "react-router-dom";
import { AffirmativeAction, PaymentModeFrom } from "..";
import { AntRadio } from "../../../Antd";

import validation from "./validation";

function SaveOptionForm({
  onFormSubmit,
  loading,
  formRef,
  planDetails,
  setCheckCoin,
  getPrice,
  availableCoin,
  pageData,
  userData,
  documentType,
}) {
  const selectCreditCardData = [
    { id: 1, value: "A" },
    { id: 2, value: "B" },
    { id: 3, value: "C" },
    { id: 4, value: "D" },
  ];
  const initialValues = {
    selectCreditCard: 1,
    coin: false,
    description: "",
    category: "sc/st",
    refund_type: "coin",
    document_type: undefined,
    auto_recurring: false,
  };

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation()}
      onSubmit={onFormSubmit}
      innerRef={formRef}
      enableReinitialize
      validate={(e) => {
        setCheckCoin(e.coin);
      }}
    >
      {(props) => {
        let { values } = props;
        return (
          <Form className="d-xl-flex">
            <div className="paymentMode_cnt_details">
              <Radio.Group value={values?.selectCreditCard}>
                <div className="d-flex align-items-center flex-wrap">
                  {selectCreditCardData.map((item) => {
                    return (
                      <div className="d-flex paymentCards align-items-center">
                        <AntRadio
                          name="selectCreditCard"
                          id="selectCreditCard"
                          value={item?.id}
                          className="d-flex align-items-center"
                          onChange={props.handleChange}
                        >
                          <p className="mb-0">
                            HDFC Credit Card{item?.value} <br />{" "}
                            <span> visa****4242 </span>
                          </p>
                        </AntRadio>
                        <Link to="#" className="">
                          <em className="icon-trash" />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </Radio.Group>
              <AffirmativeAction formData={props} documentType={documentType} />
            </div>
            <PaymentModeFrom
              formData={props}
              loading={loading}
              planDetails={planDetails}
              getPrice={getPrice}
              availableCoin={availableCoin}
              pageData={pageData}
              userData={userData}
            />
          </Form>
        );
      }}
    </Formik>
  );
}

export default React.memo(SaveOptionForm);
