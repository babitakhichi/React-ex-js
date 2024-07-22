import { Form, Formik } from "formik";
import { t } from "i18next";
import React from "react";

import { Col, Row } from "react-bootstrap";
import {
  AffirmativeAction,
  AntSelect,
  //   AntTextArea,
  Input as TextInput,
  PaymentModeFrom,
} from "../../..";
import validation from "./validation";

export default function UPIForm({
  onFormSubmit,
  formRef,
  loading,
  planDetails,
  setCheckCoin,
  getPrice,
  availableCoin,
  pageData,
  userData,
  documentType,
}) {
  const UPIData = [
    {
      id: "@ynb",
      name: "@Ybl",
    },
    {
      id: "@pnb",
      name: "@PNB",
    },
  ];
  const initialValues = {
    upi_id: "",
    upi: "@ynb",
    description: "",
    category: "sc/st",
    refund_type: "coin",
    document_type: undefined,
    auto_recurring: false,
    coin: false,
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
        return (
          <Form className="d-xl-flex">
            <div className="paymentMode_cnt_details">
              <Row>
                <Col lg="10 selectupi">
                  <Row className="g-0">
                    <Col xs="7" sm="9">
                      <div className="form-group mb-0">
                        <TextInput
                          name="upi_id"
                          id="upi_id"
                          className="form-control"
                          type="text"
                          placeholder={t("text.userPayment.upiIdPlaceholder")}
                          setFieldValue={props.handleChange}
                        />
                      </div>
                    </Col>
                    <Col xs="5" sm="3">
                      <AntSelect
                        name="upi"
                        placeholder="@Ybl"
                        arrayOfData={UPIData}
                        setFieldValue={props.handleChange}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
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
