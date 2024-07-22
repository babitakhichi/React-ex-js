import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";

import { useSelector } from "react-redux";
import { CommonButton, AntSelect, ImageElement } from "../../../index";
import { selectCountryData } from "../../../../redux/UserSlice/index.slice";
import { CommonServices } from "../../../../services";
import { logger, modalNotification } from "../../../../utils";
import validation from "./validation";

function HeadquarterForm({ onSubmit, loading, formData }) {
  const [isEdit, setIsEdit] = useState(false);
  const countryList = useSelector(selectCountryData);
  const [stateList, setStateList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const initialValues = {
    country_id: formData?.country_id || undefined,
    state_id: formData?.state_id || undefined,
    city_id: formData?.city_id || undefined,
  };
  const getStateList = async (id) => {
    try {
      setStateList([]);
      setCitiesList([]);
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
      setCitiesList([]);
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
    if (formData?.country_id) getStateList(formData?.country_id);
    if (formData?.country_id && formData?.state_id)
      getCitiesList(formData?.country_id, formData?.state_id);
  }, [formData]);
  return (
    <Formik
      initialValues={{ ...initialValues }}
      onSubmit={(val) => {
        onSubmit(val);
        setIsEdit(false);
      }}
      validationSchema={validation()}
      enableReinitialize
    >
      {(props) => {
        let { values } = props;
        return (
          <Form>
            <Card className="overflow-hidden py-1 py-xl-3">
              <Card.Body className="px-2 px-xl-4">
                <Row className="g-3">
                  <Col lg="4">
                    <div className="card-title">
                      <h6 className="title">Country</h6>
                    </div>
                    <div className="form-group d-flex">
                      <div className="flex-grow-1">
                        <AntSelect
                          size="medium"
                          id="status"
                          disabled={!isEdit}
                          name="country_id"
                          variant="standard"
                          placeholder="Select"
                          showSearch
                          optionFilterProp="children"
                          onSelect={(e) => {
                            props?.setFieldValue("country_id", e);
                            getStateList(e);
                            props?.setFieldValue("state_id", "");
                            props?.setFieldValue("city_id", "");
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
                  <Col lg="4">
                    <div className="card-title">
                      <h6 className="title">State</h6>
                    </div>
                    <div className="form-group d-flex">
                      <div className="flex-grow-1">
                        <AntSelect
                          size="medium"
                          id="state_id"
                          name="state_id"
                          variant="standard"
                          disabled={!isEdit}
                          placeholder="Select"
                          showSearch
                          optionFilterProp="children"
                          onSelect={(e) => {
                            props?.setFieldValue("state_id", e);
                            getCitiesList(values?.business_country_id, e);
                            props?.setFieldValue("city_id", "");
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
                              <em className="icon-state_id" />
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
                      </div>
                    </div>
                  </Col>
                  <Col lg="4">
                    <div className="card-title">
                      <h6 className="title">City</h6>
                    </div>
                    <div className="form-group d-flex">
                      <div className="flex-grow-1">
                        <AntSelect
                          size="medium"
                          id="city_id"
                          name="city_id"
                          variant="standard"
                          disabled={!isEdit}
                          placeholder="Select"
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
                              <em className="icon-state_id" />
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
                      </div>
                    </div>
                  </Col>
                  <Col lg="12">
                    {isEdit ? (
                      <div className="text-end">
                        <CommonButton
                          onClick={() => setIsEdit(false)}
                          variant="light"
                          extraClassName="me-1 me-xl-2"
                        >
                          Cancel
                        </CommonButton>
                        <CommonButton
                          type="submit"
                          variant="primary"
                          loading={loading}
                        >
                          Update
                        </CommonButton>
                      </div>
                    ) : (
                      <div className="text-end">
                        <CommonButton
                          onClick={() => setIsEdit(true)}
                          variant="primary"
                        >
                          Edit
                        </CommonButton>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
}

export default HeadquarterForm;
