import React from "react";

import { Col, Row } from "react-bootstrap";
import { Radio } from "antd";
import { Form, Formik } from "formik";

import {
  AntRadio,
  AffirmativeAction,
  ImageElement,
  PaymentModeFrom,
  AntSelect,
} from "../../..";
import validation from "./validation";

function InternetBankingForm({
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
  let bank = [
    { id: 1, label: "Axis Bank", icon: "axis-bank.png" },
    { id: 2, label: "SBI Bank", icon: "sbi-bank.png" },
    { id: 3, label: "Kotak Bank", icon: "kotak-bank.png" },
    { id: 4, label: "Icici Bank", icon: "icici-bank.png" },
    { id: 5, label: "HDFC Bank", icon: "hdfc-bank.png" },
    { id: 6, label: "Union Bank", icon: "union-bank.png" },
  ];
  const arrayOfData = [
    // { id: "all", name: "All" },
    {
      id: "axis",
      name: "Axis Bank",
    },
    {
      id: "union",
      name: "Union Bank",
    },
  ];

  // const [otherBank, setBank] = useState("axis");
  const initialValues = {
    internet_bank: 1,
    other_bank: "axis",
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
              <div className="internetBanking">
                <Radio.Group value={values?.internet_bank}>
                  <Row>
                    {bank.map((data, key) => {
                      return (
                        <Col xs="6">
                          <div className="internetBanking_select d-flex align-items-center">
                            <AntRadio
                              value={data.id}
                              id="internet_bank"
                              name="internet_bank"
                              key={key}
                              onChange={props.handleChange}
                            >
                              <ImageElement
                                source={data.icon}
                                alt="axis-bank"
                                className="img-fluid"
                              />
                              <span className="font-sb txt">{data.label}</span>
                            </AntRadio>
                          </div>
                        </Col>
                      );
                    })}
                    <Col sm="10 selectBank">
                      <AntSelect
                        placeholder="Other Banks"
                        id="other_bank"
                        name="other_bank"
                        setFieldValue={props.handleChange}
                        arrayOfData={arrayOfData}
                      />
                    </Col>
                  </Row>
                </Radio.Group>
              </div>
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

export default React.memo(InternetBankingForm);
