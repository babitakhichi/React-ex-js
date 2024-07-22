import { Form, Formik } from "formik";

import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { t } from "i18next";

import {
  AntSelect,
  CommonButton,
  Input as TextInput,
  RippleEffect,
  ImageElement,
  Checkbox,
} from "../../../../index";
import validation from "./validation";
import { logger, modalNotification } from "../../../../../utils";
import { CommonServices } from "../../../../../services";

function UserBusinessForm({
  onSubmit,
  loading,
  countryList,
  handleClose,
  PaymentForm,
  userData,
}) {
  const initialValues = {
    organization_name: userData?.UserBusinessAccount?.organization_name || "",
    gst_number: userData?.UserBusinessAccount?.gst_number || "",
    address: userData?.UserBusinessAccount?.address || "",
    city:
      (userData?.UserBusinessAccount?.city &&
        (!!Number(userData?.UserBusinessAccount?.city)
          ? Number(userData?.UserBusinessAccount?.city)
          : userData?.UserBusinessAccount?.city)) ||
      "",
    postal_code: userData?.UserBusinessAccount?.postal_code || "",
    state:
      (userData?.UserBusinessAccount?.state &&
        (!!Number(userData?.UserBusinessAccount?.state)
          ? Number(userData?.UserBusinessAccount?.state)
          : userData?.UserBusinessAccount?.state)) ||
      "",
    business_country_id:
      userData?.UserBusinessAccount?.business_country_id || "",
    pan_number: userData?.UserBusinessAccount?.pan_number || "",
    isGST: !userData?.UserBusinessAccount?.gst_number || false,
  };
  const [formValue, setFormValue] = useState({ ...initialValues });
  const [stateList, setStateList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const getStateList = async (id) => {
    try {
      let queryParams = {
        country_id: id,
      };
      let res = await CommonServices.stateList({ queryParams });
      const { data, success, message } = res;
      if (success === 1) {
        setStateList(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  const getCitiesList = async (countryId, stateId) => {
    try {
      let queryParams = {
        country_id: countryId,
        state_id: stateId,
      };
      let res = await CommonServices.citiesList({ queryParams });
      const { data, success, message } = res;
      if (success === 1) {
        setCitiesList(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  useEffect(() => {
    if (userData?.UserBusinessAccount) {
      getStateList(userData?.UserBusinessAccount?.business_country_id);
      getCitiesList(
        userData?.UserBusinessAccount?.business_country_id,
        userData?.UserBusinessAccount?.state
      );
    }
  }, [userData?.UserBusinessAccount]);
  // const onChangeState = (val, props) => {
  //   props.setFieldValue("state", val);
  //   props.setFieldValue("city", "");
  // };
  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation(formValue)}
      onSubmit={onSubmit}
      enableReinitialize
      validate={(e) => {
        setFormValue(e);
      }}
    >
      {(props) => {
        let { values } = props;

        return (
          <Form className="modalForm">
            <Row>
              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.organizationName")}
                  </label>
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      placeholder="Enter Organization Name"
                      type="text"
                      name="organization_name"
                      setFieldValue={props.handleChange}
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-organization" />
                        </div>
                      }
                      disabled={PaymentForm}
                    />
                  </div>
                </div>
              </Col>

              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group">
                  <div className="d-flex flex-column flex-sm-row align-items-sm-center">
                    <label className="form-label order-2 order-sm-1">
                      GST / VAT Number
                    </label>
                    {PaymentForm && (
                      <Checkbox
                        className="mb-3 mb-sm-2 ms-sm-auto order-1 order-sm-2"
                        name="isGST"
                        checked={values.isGST}
                        onChange={props.handleChange}
                        disabled={PaymentForm}
                      >
                        I do not have GST/VAT detail
                      </Checkbox>
                    )}
                  </div>
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      placeholder="Enter GST / VAT Number"
                      type="text"
                      name="gst_number"
                      setFieldValue={props.handleChange}
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-tag" />
                        </div>
                      }
                      disabled={PaymentForm || values?.isGST}
                    />
                    {!PaymentForm && (
                      <Checkbox
                        className="mb-3 mb-sm-2 ms-sm-auto order-1 order-sm-2"
                        name="isGST"
                        checked={values?.isGST}
                        disabled={PaymentForm}
                        // onChange={props.handleChange}
                        onChange={(e) => {
                          props?.setFieldValue("gst_number", "");
                          props?.setFieldValue("isGST", e?.target?.checked);
                        }}
                      >
                        I do not have GST/VAT detail
                      </Checkbox>
                    )}
                  </div>
                </div>
              </Col>
              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.panNumber")}
                    {!values?.isGST && <span className="text-danger"> *</span>}
                  </label>
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      placeholder="Enter Pan Number"
                      type="text"
                      name="pan_number"
                      setFieldValue={props.handleChange}
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-location" />
                        </div>
                      }
                      disabled={PaymentForm}
                    />
                  </div>
                </div>
              </Col>
              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group countryPick">
                  <label className="form-label">
                    {t("text.userProfile.country")}
                  </label>
                  <div className="form-control-wrap">
                    <AntSelect
                      size="medium"
                      id="status"
                      disabled={PaymentForm}
                      name="business_country_id"
                      variant="standard"
                      placeholder="Select Country "
                      showSearch
                      optionFilterProp="children"
                      onSelect={(e) => {
                        props?.setFieldValue("business_country_id", e);
                        getStateList(e);
                        props?.setFieldValue("state", "");
                        props?.setFieldValue("city", "");
                      }}
                      filterOption={(input, option) => {
                        return (
                          option?.key
                            ?.toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0 ||
                          option?.title
                            .toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {countryList?.length > 0 &&
                        countryList?.map((item, index) => {
                          return (
                            <option
                              value={item?.id}
                              title={item?.name}
                              key={index}
                              id={item?.id}
                            >
                              {item?.svg_text ? (
                                <div
                                  className="flagIcon"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.svg_text?.replace(
                                      /^\/|\/$/g,
                                      ""
                                    ),
                                  }}
                                />
                              ) : (
                                <ImageElement
                                  className="flagIcon"
                                  source="flag-default.svg"
                                />
                              )}

                              {item?.name}
                            </option>
                          );
                        })}
                    </AntSelect>
                  </div>
                </div>
              </Col>
              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group">
                  <label className="form-label">
                    {t("text.userProfile.state")}
                    <span className="text-danger"> *</span>
                  </label>
                  <div className="form-control-wrap">
                    {/* {stateList?.length > 0 ? ( */}
                    <AntSelect
                      size="medium"
                      id="state"
                      name="state"
                      variant="standard"
                      disabled={PaymentForm}
                      placeholder="Select States "
                      showSearch
                      optionFilterProp="children"
                      onSelect={(e) => {
                        props?.setFieldValue("state", e);
                        getCitiesList(values?.business_country_id, e);
                        props?.setFieldValue("city", "");
                      }}
                      filterOption={(input, option) => {
                        return (
                          option?.key
                            ?.toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0 ||
                          option?.title
                            .toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0
                        );
                      }}
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-state" />
                        </div>
                      }
                    >
                      {stateList?.length > 0 &&
                        stateList?.map((item, index) => {
                          return (
                            <option
                              value={item?.id}
                              title={item?.name}
                              key={index}
                              id={item?.id}
                            >
                              {item?.name}
                            </option>
                          );
                        })}
                    </AntSelect>
                    {/* ) : (
                      <TextInput
                        className="form-control"
                        placeholder="Enter State / Province"
                        type="text"
                        icon={
                          <div className="form-icon form-icon-left icon-gradiant">
                            <em className="icon-state" />
                          </div>
                        }
                        id="state"
                        name="state"
                        disabled={PaymentForm}
                        // setFieldValue={props.handleChange}
                        onChange={(e) => {
                          onChangeState(e.target.value, props);
                        }}
                      />
                    )} */}
                  </div>
                </div>
              </Col>
              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.city")}
                    <span className="text-danger"> *</span>
                  </label>
                  <div className="form-control-wrap">
                    {/* {citiesList?.length > 0 ? ( */}
                    <AntSelect
                      size="medium"
                      id="city"
                      name="city"
                      variant="standard"
                      disabled={PaymentForm}
                      placeholder="Select city "
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) => {
                        return (
                          option?.key
                            ?.toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0 ||
                          option?.title
                            .toLowerCase()
                            .indexOf(input?.toLowerCase()) >= 0
                        );
                      }}
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-state" />
                        </div>
                      }
                    >
                      {citiesList?.length > 0 &&
                        citiesList?.map((item) => {
                          return (
                            <option
                              value={item?.id}
                              title={item?.city_name}
                              key={item?.city_name}
                              id={item?.id}
                            >
                              {item?.city_name}
                            </option>
                          );
                        })}{" "}
                    </AntSelect>
                    {/* ) : (
                      <TextInput
                        className="form-control"
                        placeholder="Enter City"
                        type="text"
                        name="city"
                        disabled={PaymentForm}
                        setFieldValue={props.handleChange}
                        icon={
                          <div className="form-icon form-icon-left icon-gradiant">
                            <em className="icon-buildings-alt" />
                          </div>
                        }
                      />
                    )} */}
                  </div>
                </div>
              </Col>
              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.address")}
                    <span className="text-danger"> *</span>
                  </label>
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      placeholder="Enter Address / Street"
                      type="text"
                      name="address"
                      disabled={PaymentForm}
                      setFieldValue={props.handleChange}
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-location" />
                        </div>
                      }
                    />
                  </div>
                </div>
              </Col>
              <Col sm={PaymentForm ? "0" : 6}>
                <div className="form-group">
                  <label className="form-label">
                    {" "}
                    {t("text.userProfile.postalCode")}
                    <span className="text-danger"> *</span>
                  </label>
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      placeholder="Enter Postal Code"
                      type="text"
                      name="postal_code"
                      disabled={PaymentForm}
                      setFieldValue={props.handleChange}
                      icon={
                        <div className="form-icon form-icon-left icon-gradiant">
                          <em className="icon-map-pin" />
                        </div>
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <div className="text-end modalFooter">
              {!PaymentForm && (
                <>
                  {" "}
                  <RippleEffect extraClassName="me-2 me-sm-3" type="light">
                    <CommonButton onClick={handleClose} variant="info">
                      {t("text.common.cancel")}
                    </CommonButton>
                  </RippleEffect>
                  <RippleEffect>
                    <CommonButton
                      variant="primary"
                      loading={loading}
                      htmltype="button"
                      type="submit"
                    >
                      {t("text.userProfile.create")}
                    </CommonButton>
                  </RippleEffect>
                </>
              )}
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}
export default React.memo(UserBusinessForm);
