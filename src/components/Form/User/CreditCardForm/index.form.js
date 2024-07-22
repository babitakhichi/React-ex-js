import { Form, Formik } from "formik";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { t } from "i18next";
import { Input as TextInput, Checkbox } from "../../../index";
import { validation } from "./validation";
import { AffirmativeAction, PaymentModeFrom } from "..";
import { phoneNumberField } from "../../../../utils";

function CreditCardForm({
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
  setCategory,
}) {
  const initialValues = {
    card_holder_name: "",
    card_number: "",
    expireDate: "",
    card_cvv: "",
    description: "",
    category: "sc/st",
    refund_type: "coin",
    document_type: undefined,
    auto_recurring: false,
    save_instrument: false,
    coin: false,
  };

  const formatString = (e) => {
    let code = e.keyCode;
    let allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
      return;
    }

    e.target.value = e.target.value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        "0$1/" // 3 > 03/
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        "$1/" // 11 > 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        "0$1/$2" // 13 > 01/3
      )
      .replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
        "$1/$2" // 141 > 01/41
      )
      .replace(
        /^([0]+)\/|[0]+$/g,
        "0" // 0/ > 0 and 00 > 0
      )
      .replace(
        /[^\d\/]|^[\/]*$/g,
        "" // To allow only digits and `/`
      )
      .replace(
        /\/\//g,
        "/" // Prevent entering more than 1 `/`
      );
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
        setCategory(e.category);
      }}
    >
      {(props) => {
        let { values } = props;
        return (
          <Form className="d-xl-flex">
            <div className="paymentMode_cnt_details">
              <Row className="gx-3">
                <Col sm="12">
                  <div className="form-group">
                    <label className="form-label font-sb">
                      {t("text.userPayment.cardHolder")}
                    </label>
                    <TextInput
                      id="card_holder_name"
                      className="form-control"
                      name="card_holder_name"
                      disabled={false}
                      variant="standard"
                      type="text"
                      placeholder={t("text.userPayment.cardHolder")}
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </Col>
                <Col sm="12">
                  <div className="form-group">
                    <label className="form-label font-sb">
                      {" "}
                      {t("text.userPayment.cardNumber")}
                    </label>
                    <TextInput
                      id="card_number"
                      className="form-control"
                      name="card_number"
                      disabled={false}
                      variant="standard"
                      type="text"
                      placeholder={t("text.userPayment.cardNumber")}
                      setFieldValue={props.handleChange}
                      onKeyPress={(e) => phoneNumberField(e)}
                    />
                  </div>
                </Col>
                <Col xs="7" sm="8">
                  <div className="form-group">
                    <label className="form-label font-sb">
                      {t("text.userPayment.expDate")}
                    </label>
                    <TextInput
                      className="form-control"
                      name="expireDate"
                      id="expireDate"
                      disabled={false}
                      variant="standard"
                      type="text"
                      placeholder="MM/YY"
                      maxLength="5"
                      setFieldValue={props.handleChange}
                      onKeyUp={(e) => {
                        formatString(e);
                      }}
                    />
                  </div>
                </Col>
                <Col xs="5" sm="4">
                  <div className="form-group">
                    <label className="form-label font-sb">
                      {t("text.userPayment.cvv")}
                    </label>
                    <TextInput
                      id="card_cvv"
                      className="form-control"
                      name="card_cvv"
                      disabled={false}
                      variant="standard"
                      type="text"
                      placeholder={t("text.userPayment.cvv")}
                      setFieldValue={props.handleChange}
                      onKeyPress={(e) => phoneNumberField(e)}
                    />
                  </div>
                </Col>
                <Col sm="12">
                  <div className="form-group mb-0">
                    <Checkbox
                      name="save_instrument"
                      onChange={props?.handleChange}
                      checked={values?.save_instrument}
                    >
                      {t("text.userPayment.saveCard")}
                    </Checkbox>
                  </div>
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

export default CreditCardForm;
