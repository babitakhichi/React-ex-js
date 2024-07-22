import { Form, Formik } from "formik";
import React, { useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import { t } from "i18next";
import { Input as TextInput, CommonButton } from "../../../index";

function ManageTaxesForm({ onSubmit, loading, taxData }) {
  const [addEditTaxes, setAddEditTaxes] = useState({
    igst: false,
    sgst: false,
    cgst: false,
  });

  const initialValues = {
    igst: taxData?.igst || "",
    sgst: taxData?.sgst || "",
    cgst: taxData?.cgst || "",
  };
  const handleTaxes = (e) => {
    let { name } = e.target;
    setAddEditTaxes((prevState) => ({
      ...prevState,
      [name]: !addEditTaxes[name],
    }));
  };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={(val) => {
        onSubmit(val);
        setAddEditTaxes({
          igst: false,
          sgst: false,
          cgst: false,
        });
      }}
      enableReinitialize
    >
      {(props) => {
        return (
          <Form>
            <Row className="g-3">
              <Col lg="6">
                <Card className="overflow-hidden py-1 py-xl-3">
                  <Card.Body className="px-2 px-xl-4">
                    <div className="card-title">
                      <h6 className="title">{t("text.manageTaxes.igst")}</h6>
                    </div>
                    <div className="form-group d-flex">
                      <div className="flex-grow-1 me-1 me-xl-2">
                        <TextInput
                          className="form-control"
                          placeholder="Enter IGST"
                          name="igst"
                          variant="standard"
                          type="text"
                          disabled={!addEditTaxes?.igst}
                          defaultValue="IGST"
                          setFieldValue={props.handleChange}
                        />
                      </div>
                      <div className="flex-shrink-0">
                        {addEditTaxes?.igst ? (
                          <div className="text-end">
                            <CommonButton
                              name="igst"
                              onClick={(e) => {
                                handleTaxes(e);
                                props.setFieldValue("igst", taxData?.igst);
                              }}
                              variant="light"
                              extraClassName="me-1 me-xl-2"
                            >
                              {t("text.common.cancel")}
                            </CommonButton>
                            <CommonButton
                              htmltype="button"
                              type="submit"
                              variant="primary"
                              loading={loading}
                            >
                              {t("text.common.update")}
                            </CommonButton>
                          </div>
                        ) : (
                          <div className="text-end">
                            <CommonButton
                              name="igst"
                              onClick={handleTaxes}
                              variant="primary"
                            >
                              {t("text.common.edit")}
                            </CommonButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="6">
                <Card className="overflow-hidden py-1 py-xl-3">
                  <Card.Body className="px-2 px-xl-4">
                    <div className="card-title">
                      <h6 className="title">{t("text.manageTaxes.cgst")}</h6>
                    </div>
                    <div className="form-group d-flex">
                      <div className="flex-grow-1 me-1 me-xl-2">
                        <TextInput
                          className="form-control"
                          placeholder="Enter CGST"
                          name="cgst"
                          variant="standard"
                          type="text"
                          disabled={!addEditTaxes?.cgst}
                          defaultValue="CGST"
                          setFieldValue={props.handleChange}
                        />
                      </div>
                      <div className="flex-shrink-0">
                        {addEditTaxes?.cgst ? (
                          <div className="text-end">
                            <CommonButton
                              name="cgst"
                              onClick={(e) => {
                                handleTaxes(e);
                                props.setFieldValue("cgst", taxData?.cgst);
                              }}
                              variant="light"
                              extraClassName="me-1 me-xl-2"
                            >
                              {t("text.common.cancel")}
                            </CommonButton>
                            <CommonButton
                              htmltype="button"
                              type="submit"
                              variant="primary"
                              loading={loading}
                            >
                              {t("text.common.update")}
                            </CommonButton>
                          </div>
                        ) : (
                          <div className="text-end">
                            <CommonButton
                              name="cgst"
                              onClick={handleTaxes}
                              variant="primary"
                            >
                              {t("text.common.edit")}
                            </CommonButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg="6">
                <Card className="overflow-hidden py-1 py-xl-3">
                  <Card.Body className="px-2 px-xl-4">
                    <div className="card-title">
                      <h6 className="title">{t("text.manageTaxes.sgst")}</h6>
                    </div>
                    <div className="form-group d-flex">
                      <div className="flex-grow-1 me-1 me-xl-2">
                        <TextInput
                          className="form-control"
                          placeholder="Enter SGST"
                          name="sgst"
                          variant="standard"
                          type="text"
                          disabled={!addEditTaxes?.sgst}
                          defaultValue="SGST"
                          setFieldValue={props.handleChange}
                        />
                      </div>
                      <div className="flex-shrink-0">
                        {addEditTaxes?.sgst ? (
                          <div className="text-end">
                            <CommonButton
                              name="sgst"
                              onClick={(e) => {
                                handleTaxes(e);
                                props.setFieldValue("sgst", taxData?.sgst);
                              }}
                              variant="light"
                              extraClassName="me-1 me-xl-2"
                            >
                              {t("text.common.cancel")}
                            </CommonButton>
                            <CommonButton
                              htmltype="button"
                              loading={loading}
                              type="submit"
                              variant="primary"
                            >
                              {t("text.common.update")}
                            </CommonButton>
                          </div>
                        ) : (
                          <div className="text-end">
                            <CommonButton
                              name="sgst"
                              onClick={handleTaxes}
                              variant="primary"
                            >
                              {t("text.common.edit")}
                            </CommonButton>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Form>
        );
      }}
    </Formik>
  );
}

export default ManageTaxesForm;
