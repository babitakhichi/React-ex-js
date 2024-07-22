import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Radio } from "antd";
import { Form, Formik } from "formik";
import { t } from "i18next";
import moment from "moment";
import {
  AntRadio,
  AntSelect,
  AntTextArea,
  CommonButton,
  DatePicker,
  GlobalLoader,
  Input as TextInput,
} from "../../../index";
import { UsersServices } from "../../../../services";
import { disabledPastDate, logger, modalNotification } from "../../../../utils";
import validation from "./validation";
import { classicDateFormat, dateFormateYearMonth } from "../../../../helpers";

function PromoCodeForm({ promoCode, cancel, onSubmit }) {
  const [userData, setUserData] = useState([]);
  const [userDataLoader, setUserDataLoader] = useState(false);
  const [userType, setUserType] = useState(
    promoCode ? promoCode?.user_type : "all"
  );
  const fetchUsers = async () => {
    setUserDataLoader(true);
    try {
      let queryParams = {
        all: true,
      };
      const res = await UsersServices.getUserListService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setUserData(
          data?.rows?.map((user) => {
            return {
              id: user?.id,
              name: `${user?.UserProfile?.full_name} (${user?.UserProfile?.email})`,
            };
          })
        );
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setUserDataLoader(false);
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const codeData = [
    {
      value: "monthly",
      label: "Monthly",
    },
    {
      value: "quarterly",
      label: "Quarterly",
    },
    {
      value: "halfyearly",
      label: "Half-Yearly",
    },
    {
      value: "annual",
      label: "Annual",
    },
  ];
  const initialValues = {
    title: promoCode?.title || "",
    code: promoCode?.code || "",
    discount_percentage: promoCode
      ? `${parseInt(promoCode?.discount_percentage)}`
      : "",
    description: promoCode?.description || "",
    max_discount: promoCode?.max_discount || null,
    minimum_purchase: promoCode?.minimum_purchase || "",
    user_type: promoCode?.user_type || "all",
    user_ids:
      promoCode?.promotionUsers?.length > 0
        ? promoCode?.promotionUsers?.map((user) => user?.User?.id)
        : [],
    start_date: promoCode?.start_date || "",
    end_date: promoCode?.end_date || "",
    limit_per_user: promoCode?.limit_per_user || "",
    intervals: promoCode?.intervals || undefined,
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validation(userType)}
      >
        {(props) => {
          return (
            <Form>
              {userDataLoader ? (
                <GlobalLoader />
              ) : (
                <div className="nk-block">
                  <div className="card">
                    <div className="card-inner">
                      <Row>
                        <Col md={12}>
                          <Row>
                            {/* <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.promoTitle")}
                                </label>
                                <TextInput
                                  className="form-control"
                                  placeholder={t("text.promoCode.enterTitle")}
                                  name="title"
                                  type="text"
                                  setFieldValue={props.handleChange}
                                  maxLength={50}
                                />
                              </div>
                            </Col> */}

                            <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.promoText")}
                                </label>
                                <TextInput
                                  className="form-control"
                                  placeholder={t("text.promoCode.enterText")}
                                  name="code"
                                  type="text"
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.appliedOn")}
                                </label>
                                <AntSelect
                                  size="medium"
                                  id="category"
                                  extraClassName="form-control"
                                  name="intervals"
                                  disabled={false}
                                  variant="standard"
                                  placeholder="Select"
                                  options={codeData}
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.discountPercentage")}
                                </label>
                                <TextInput
                                  className="form-control"
                                  placeholder={t(
                                    "text.promoCode.enterDiscount"
                                  )}
                                  name="discount_percentage"
                                  type="text"
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.maxDiscount")}
                                </label>
                                <TextInput
                                  className="form-control"
                                  placeholder={t(
                                    "text.promoCode.enterMaxDiscount"
                                  )}
                                  name="max_discount"
                                  type="number"
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </Col>
                            <Col sm={12}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.minimumPurchase")}
                                </label>
                                <TextInput
                                  className="form-control"
                                  placeholder={t(
                                    "text.promoCode.enterMinimumPurchase"
                                  )}
                                  name="minimum_purchase"
                                  type="number"
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </Col>
                            <Col sm={12}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.promoDesc")}
                                </label>
                                <AntTextArea
                                  className="form-control"
                                  placeholder={t(
                                    "text.promoCode.enterCodeDesc"
                                  )}
                                  name="description"
                                  type="text"
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </Col>
                            <Col sm={12}>
                              <div className="mb-3">
                                <label className="form-label mb-0">
                                  {t("text.promoCode.userType")}
                                </label>
                                <Radio.Group
                                  onChange={(e) => setUserType(e.target.value)}
                                  name="user_type"
                                  value={props.values?.user_type}
                                >
                                  <ul className="list-unstyled ms-2 mb-0 d-flex flex-wrap">
                                    <li>
                                      <AntRadio
                                        onChange={(e) => {
                                          props.handleChange(e);
                                          if (e.target.value === "all") {
                                            props.setFieldValue("user_ids", []);
                                          }
                                        }}
                                        value="all"
                                        // onClick={()=>props.setFieldValue('user_ids',[])}
                                      >
                                        All
                                      </AntRadio>
                                    </li>
                                    <li>
                                      <AntRadio
                                        onChange={props.handleChange}
                                        value="specific"
                                      >
                                        Specific
                                      </AntRadio>
                                    </li>
                                  </ul>
                                </Radio.Group>
                              </div>
                            </Col>
                            {props.values?.user_type === "specific" && (
                              <Col sm={12}>
                                <div className="mb-3">
                                  <label className="form-label">
                                    {t("text.promoCode.selectUser")}
                                  </label>
                                  <AntSelect
                                    size="medium"
                                    id="planType"
                                    mode="multiple"
                                    name="user_ids"
                                    disabled={false}
                                    variant="standard"
                                    placeholder="Select"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                      (
                                        option?.name
                                          ?.toString()
                                          .toLowerCase() ?? ""
                                      ).includes(input)
                                    }
                                    filterSort={(optionA, optionB) =>
                                      (optionA?.name ?? "")
                                        .toLowerCase()
                                        .localeCompare(
                                          (optionB?.name ?? "").toLowerCase()
                                        )
                                    }
                                    fieldNames={{
                                      label: "name",
                                      value: "id",
                                      options: "options",
                                    }}
                                    options={userData}

                                    // defaultValue={props.values.user_ids}
                                  />
                                </div>
                              </Col>
                            )}
                            <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.videoConferencing.startDate")}
                                </label>
                                <DatePicker
                                  getPopupContainer={(trigger) =>
                                    trigger.parentElement
                                  }
                                  className="form-control"
                                  placeholder={classicDateFormat}
                                  format={classicDateFormat}
                                  requiredDateTimeFormat={dateFormateYearMonth}
                                  name="start_date"
                                  type="text"
                                  validation
                                  defaultValue={
                                    promoCode?.start_date
                                      ? moment(promoCode?.start_date)
                                      : ""
                                  }
                                  onChange={(_, dateString) =>
                                    props.setFieldValue(
                                      "start_date",
                                      dateString
                                    )
                                  }
                                  disabledDate={(current) =>
                                    disabledPastDate(current)
                                  }
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.videoConferencing.endDate")}
                                </label>
                                <DatePicker
                                  getPopupContainer={(trigger) =>
                                    trigger.parentElement
                                  }
                                  className="form-control"
                                  placeholder={classicDateFormat}
                                  format={classicDateFormat}
                                  requiredDateTimeFormat={dateFormateYearMonth}
                                  name="end_date"
                                  type="text"
                                  validation
                                  defaultValue={
                                    promoCode?.end_date
                                      ? moment(promoCode?.end_date)
                                      : ""
                                  }
                                  onChange={(_, dateString) =>
                                    props.setFieldValue("end_date", dateString)
                                  }
                                  disabledDate={(current) =>
                                    disabledPastDate(
                                      current,
                                      props?.values?.start_date
                                    )
                                  }
                                />
                              </div>
                            </Col>
                            <Col sm={6}>
                              <div className="mb-3">
                                <label className="form-label">
                                  {t("text.promoCode.limitPerUser")}
                                </label>
                                <TextInput
                                  className="form-control"
                                  placeholder={t(
                                    "text.promoCode.enterLimitPerUser"
                                  )}
                                  name="limit_per_user"
                                  type="number"
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </Col>
                          </Row>
                          <div className="text-end">
                            <CommonButton
                              extraClassName="btn btn-primary my-3"
                              htmlType="submit"
                              type="submit"
                            >
                              {t("text.common.save")}
                            </CommonButton>
                            <CommonButton
                              extraClassName="btn btn-light my-3 ms-2"
                              onClick={cancel}
                            >
                              {t("text.common.cancel")}
                            </CommonButton>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </>
  );
}
export default PromoCodeForm;
