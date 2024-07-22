import { Checkbox } from "antd";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  bundledData,
  categoryData,
  subscriptionData,
} from "../../../../config/subscriptonData";
import {
  decodeSubscriptionJson,
  encodeSubscriptionJson,
} from "../../../../utils";
import { Input as TextInput, CommonButton, AntSelect } from "../../../index";

import validation from "./validation";

function AddEditPlanForm({
  onSubmit,
  t,
  hideAddPlanModal,
  planModal,
  planTypeData,
  loading,
  generateSubscriptionData,
  rowData,
  formRef,
  checkError,
  setCheckError,
}) {
  const [subscription, setSubscription] = useState([]);
  const [checkboxData, setCheckbox] = useState({});

  const [planType, setPlanType] = useState(
    rowData?.plan_type || "videoConferencing"
  );

  const [planValue, setPlanValue] = useState({});
  let transactionsData = [...subscriptionData?.translation];
  delete transactionsData[3];
  const initialValues = {
    name: planModal === "add" ? "" : rowData?.name,
    price: planModal === "add" ? "" : rowData?.price,
    quarterly: planModal === "add" ? "" : rowData?.quarterly,
    half_yearly: planModal === "add" ? "" : rowData?.half_yearly,
    annual: planModal === "add" ? "" : rowData?.annual,
    plan_type:
      planModal === "add"
        ? "videoConferencing"
        : rowData?.plan_type || "videoConferencing",
    audio_video_conference:
      planModal === "add"
        ? ""
        : rowData?.SubscriptionFeature?.audio_video_conference,
    translation:
      planModal === "add" ? 0 : rowData?.SubscriptionFeature?.translation,
    // video_translation:
    //   planModal === "add" ? 0 : rowData?.SubscriptionFeature?.video_translation,
    meet_duration:
      planModal === "add" ? "" : rowData?.SubscriptionFeature?.meet_duration,
    cloud_storage:
      planModal === "add" ? "" : rowData?.SubscriptionFeature?.cloud_storage,

    // freeCharacters: planModal === "add" ? "" : "",
    translationType: planModal === "add" ? [] : rowData?.translation_type,
    documentType: planModal === "add" ? [] : rowData?.document_type,
    mediaType: planModal === "add" ? [] : rowData?.media_type,
    is_corporate:
      planModal === "add" ? undefined : String(rowData?.is_corporate),
  };
  const onChange = (e) => {
    setSubscription(e);
  };
  useEffect(() => {
    if (subscription?.length > 0) {
      setCheckError(false);
    }
  }, [subscription]);
  useEffect(() => {
    setSubscription([]);
  }, [planType]);
  useEffect(() => {
    if (planType === "bundled") {
      setCheckbox(decodeSubscriptionJson(subscription, bundledData));
      if (subscription?.length > 0) {
        generateSubscriptionData(subscription, bundledData);
      }
    } else {
      setCheckbox(
        decodeSubscriptionJson(subscription, subscriptionData[planType])
      );
      if (subscription?.length > 0) {
        generateSubscriptionData(subscription, subscriptionData[planType]);
      }
    }
  }, [subscription]);

  useEffect(() => {
    if (rowData?.id) {
      setPlanType(rowData?.plan_type);
    }
  }, [rowData]);
  useEffect(() => {
    if (checkboxData?.meeting_duration === false || undefined) {
      formRef?.current?.setFieldValue("meet_duration", "");
    }
    if (checkboxData?.audio_video_conference_checkbox === false || undefined) {
      formRef?.current?.setFieldValue("audio_video_conference", "");
    }
    if (checkboxData?.storage_value === false || undefined) {
      formRef?.current?.setFieldValue("cloud_storage", "");
    }
    // if (checkboxData?.translationCheckbox === false || undefined) {
    //   formRef?.current?.setFieldValue("translationType", []);
    //   formRef?.current?.setFieldValue("documentType", []);
    //   formRef?.current?.setFieldValue("mediaType", []);
    // }
    if (checkboxData?.freeCharacters_checkbox === false || undefined) {
      formRef?.current?.setFieldValue("translation", 0);
    }
    // if (checkboxData?.documentTranslationCheckbox === false || undefined) {
    //   formRef?.current?.setFieldValue("documentType", []);
    // }
    // if (checkboxData?.mediaTranslationCheckbox === false || undefined) {
    //   formRef?.current?.setFieldValue("mediaType", []);
    // }
  }, [checkboxData]);
  useEffect(() => {
    if (rowData?.id) {
      if (rowData?.plan_type === planType) {
        let data = [];
        if (rowData?.SubscriptionFeature) {
          data = encodeSubscriptionJson(rowData?.SubscriptionFeature);
        }

        // if (planType === "translation") {
        //   setSubscription([]);
        // } else {
        setSubscription(data);
        // }
        formRef?.current?.setFieldValue(
          "translation",
          rowData?.SubscriptionFeature?.translation
        );
        // formRef?.current?.setFieldValue(
        //   "video_translation",
        //   rowData?.SubscriptionFeature?.video_translation
        // );
      } else {
        formRef?.current?.setFieldValue("translation", 0);
        // formRef?.current?.setFieldValue("video_translation", "");
      }
    }
  }, [rowData, planType]);

  function handleKey(e) {
    let ASCIICode = e.which ? e.which : e.keyCode;
    let keyCode = e.charCode;
    if (
      (ASCIICode > 31 && ASCIICode > 57) ||
      keyCode === 43 ||
      keyCode === 42 ||
      keyCode === 45 ||
      keyCode === 47 ||
      keyCode === 33 ||
      keyCode === 35 ||
      keyCode === 36 ||
      keyCode === 37 ||
      keyCode === 38 ||
      keyCode === 44 ||
      keyCode === 40 ||
      keyCode === 41 ||
      keyCode === 39 ||
      keyCode === 34 ||
      keyCode === 32
    ) {
      e.preventDefault();
    }
  }

  return (
    <Formik
      initialValues={{ ...initialValues }}
      validationSchema={validation(planValue, checkboxData, rowData)}
      onSubmit={(values) => {
        if (subscription.length <= 0) setCheckError(true);
        else onSubmit(values);
      }}
      validate={(e) => {
        if (e.plan_type) {
          setPlanType(e.plan_type);
        }
        if (!e.translationType?.includes("audioVideo")) {
          formRef?.current?.setFieldTouched("mediaType", false, false);
        }
        if (!e.translationType?.includes("document")) {
          formRef?.current?.setFieldTouched("documentType", false, false);
        }
        setPlanValue(e);
      }}
      innerRef={formRef}
      enableReinitialize
    >
      {(props) => {
        let { values } = props;

        return (
          <Form>
            {!rowData?.is_basic && (
              <div className="row">
                <div className="col-sm-12">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      {t("text.manageSubscription.subscriptionCategory")}
                    </label>
                    <AntSelect
                      size="large"
                      id="is_corporate"
                      extraClassName="form-control"
                      name="is_corporate"
                      disabled={false}
                      variant="standard"
                      placeholder="Select"
                      options={categoryData}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      {t("text.manageSubscription.planName")}
                    </label>
                    <TextInput
                      className="form-control form-control-lg"
                      placeholder={t(
                        "text.manageSubscription.planNamePlaceholder"
                      )}
                      name="name"
                      disabled={false}
                      variant="standard"
                      type="text"
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      {t("text.manageSubscription.price")}
                    </label>
                    <TextInput
                      className="form-control form-control-lg"
                      placeholder={t(
                        "text.manageSubscription.originalPricePlaceholder"
                      )}
                      name="price"
                      disabled={false}
                      variant="standard"
                      onKeyPress={(e) => handleKey(e)}
                      type="number"
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      {t("text.manageSubscription.quaterly")}
                    </label>
                    <TextInput
                      className="form-control form-control-lg"
                      placeholder={t(
                        "text.manageSubscription.pricePlaceholder"
                      )}
                      name="quarterly"
                      disabled={false}
                      variant="standard"
                      onKeyPress={(e) => handleKey(e)}
                      type="number"
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      {t("text.manageSubscription.halfYearly")}
                    </label>
                    <TextInput
                      className="form-control form-control-lg"
                      placeholder={t(
                        "text.manageSubscription.pricePlaceholder"
                      )}
                      name="half_yearly"
                      disabled={false}
                      variant="standard"
                      onKeyPress={(e) => handleKey(e)}
                      type="number"
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </div>
                <div className="col-sm-4">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      {t("text.manageSubscription.annual")}
                    </label>
                    <TextInput
                      className="form-control form-control-lg"
                      placeholder={t(
                        "text.manageSubscription.pricePlaceholder"
                      )}
                      name="annual"
                      disabled={false}
                      variant="standard"
                      onKeyPress={(e) => handleKey(e)}
                      type="number"
                      setFieldValue={props.handleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              {!rowData?.is_basic && (
                <div className="col-sm-6">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="plan">
                      {t("text.manageSubscription.planType")}
                    </label>
                    <AntSelect
                      getPopupContainer={(trigger) => trigger.parentElement}
                      size="large"
                      id="planType"
                      name="plan_type"
                      disabled={false}
                      variant="standard"
                      placeholder={t(
                        "text.manageSubscription.selectPlaceholder"
                      )}
                      arrayOfData={planTypeData}
                      defaultValue="videoConferencing"
                      // setFieldValue={props.handleChange}
                    />
                  </div>
                </div>
              )}
              {/* <div className="col-sm-6">
              <div className="mb-3">
                <label className="form-label" htmlFor="plan">Months</label>
                <AntSelect
                    size="large"
                    id="planType"
                    name="planType"
                    disabled={false}
                    variant="standard"
                    placeholder="Select"
                    arrayOfData={planMonths}
                    // handleChangeSelect={(e) => handleChange(e)}
                    defaultValue="1 Month"
                  />
              </div>
            </div> */}

              <Checkbox.Group
                value={subscription ?? []}
                onChange={(e) => {
                  onChange(e);

                  if (!e?.includes("translationCheckbox")) {
                    props?.setFieldValue("translationType", []);
                    props?.setFieldValue("documentType", []);
                    props?.setFieldValue("mediaType", []);
                  }
                  if (!e?.includes("translationCheckbox")) {
                    props?.setFieldTouched("translationType", false, false);
                  }
                }}
                name="subscriptionCheckbox"
              >
                {subscriptionData[values?.plan_type] &&
                  subscriptionData[values?.plan_type].length > 0 && (
                    <>
                      <div className="row">
                        {subscriptionData[values.plan_type].map((item, key) => {
                          if (item?.type === "checkbox") {
                            return (
                              <div className="col-sm-6" key={key}>
                                <div className="mb-2">
                                  <Checkbox
                                    name={item?.name}
                                    value={item?.name}
                                    // onClick={props.handleChange}
                                  >
                                    {item?.lable}
                                  </Checkbox>
                                </div>
                              </div>
                            );
                          } else if (item?.type === "text") {
                            return (
                              <div className="col-sm-6" key={key}>
                                <div className="mb-2">
                                  <Checkbox
                                    name={item?.name}
                                    value={item?.name}
                                    // onClick={props.handleChange}
                                  >
                                    {item?.lable}
                                  </Checkbox>
                                  {subscription?.includes(item?.name) && (
                                    <TextInput
                                      className="form-control form-control-md"
                                      placeholder={t(
                                        "text.manageSubscription.valuePlaceholder"
                                      )}
                                      name={item?.textName}
                                      disabled={false}
                                      variant="standard"
                                      type="number"
                                      style={{ width: "150px" }}
                                      setFieldValue={props.handleChange}
                                    />
                                  )}
                                </div>
                              </div>
                            );
                          } else if (item?.type === "checkbox_disable") {
                            return (
                              <div className="col-sm-6" key={key}>
                                <div className="mb-2">
                                  <Checkbox
                                    name={item?.name}
                                    value={item?.name}
                                    // onClick={props.handleChange}
                                  >
                                    {item?.lable}
                                  </Checkbox>
                                  <TextInput
                                    className="form-control form-control-md mt-1"
                                    placeholder={t(
                                      "text.manageSubscription.valuePlaceholder"
                                    )}
                                    name={item?.textName}
                                    disabled={
                                      !subscription?.includes(item?.name)
                                    }
                                    variant="standard"
                                    type="number"
                                    // style={{ width: "150px" }}
                                    setFieldValue={props.handleChange}
                                  />
                                </div>
                              </div>
                            );
                          } else if (item?.type === "only text") {
                            return (
                              <div className="col-sm-6">
                                <div className="mb-3">
                                  <label className="form-label">
                                    {item?.lable}
                                  </label>
                                  <TextInput
                                    className="form-control form-control-lg"
                                    placeholder={t(
                                      "text.manageSubscription.translationPlaceholder"
                                    )}
                                    name={item?.name}
                                    disabled={false}
                                    variant="standard"
                                    type="number"
                                    setFieldValue={props.handleChange}
                                  />
                                </div>
                              </div>
                            );
                          } else if (item?.type === "select") {
                            let disabled = true;
                            if (item?.selectName === "translationType") {
                              disabled = false;
                            } else if (item?.selectName === "documentType") {
                              disabled =
                                !values?.translationType?.includes("document");
                            } else if (item?.selectName === "mediaType") {
                              disabled =
                                !values?.translationType?.includes(
                                  "audioVideo"
                                );
                            }
                            return (
                              <div className="col-sm-6" key={key}>
                                <div className="mb-2 ">
                                  {item?.name === "translationCheckbox" ? (
                                    <Checkbox
                                      name={item?.name}
                                      value={item?.name}
                                      // onClick={props.handleChange}
                                    >
                                      {item?.lable}
                                    </Checkbox>
                                  ) : (
                                    <label>{item?.lable}</label>
                                  )}

                                  <AntSelect
                                    getPopupContainer={(trigger) =>
                                      trigger.parentElement
                                    }
                                    className="mt-1"
                                    mode="multiple"
                                    size="small"
                                    id={item?.selectName}
                                    name={item?.selectName}
                                    // disabled={!subscription.includes(item?.name)}
                                    disabled={
                                      disabled ||
                                      !subscription?.includes(
                                        "translationCheckbox"
                                      )
                                    }
                                    variant="standard"
                                    placeholder="Select"
                                    arrayOfData={item?.data}
                                    onSelect={(e) => {
                                      props?.setFieldValue(item?.selectName, e);
                                      if (
                                        item?.selectName === "translationType"
                                      ) {
                                        if (!e?.includes("document")) {
                                          props?.setFieldValue(
                                            "documentType",
                                            []
                                          );
                                        }
                                        if (!e?.includes("audioVideo")) {
                                          props?.setFieldValue("mediaType", []);
                                        }
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </>
                  )}

                {planType === "bundled" && (
                  <>
                    {" "}
                    <h6 className="title">Translation</h6>
                    <div className="row">
                      {transactionsData.map((item, key) => {
                        if (item?.type === "checkbox") {
                          return (
                            <div className="col-sm-6" key={key}>
                              <div className="mb-2">
                                <Checkbox
                                  name={item?.name}
                                  value={item?.name}
                                  // onClick={props.handleChange}
                                >
                                  {item?.lable}
                                </Checkbox>
                              </div>
                            </div>
                          );
                        } else if (item?.type === "checkbox_disable") {
                          return (
                            <div className="col-sm-6" key={key}>
                              <div className="mb-2">
                                <Checkbox
                                  name={item?.name}
                                  value={item?.name}
                                  // onClick={props.handleChange}
                                >
                                  {item?.lable}
                                </Checkbox>
                                <TextInput
                                  className="form-control form-control-md mt-1"
                                  placeholder={t(
                                    "text.manageSubscription.valuePlaceholder"
                                  )}
                                  name={item?.textName}
                                  disabled={!subscription?.includes(item?.name)}
                                  variant="standard"
                                  type="number"
                                  // style={{ width: "150px" }}
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </div>
                          );
                        } else if (
                          item?.type === "select" &&
                          !rowData?.is_basic
                        ) {
                          let disabled = true;
                          if (
                            item?.selectName === "translationType" &&
                            !rowData?.is_basic
                          ) {
                            disabled = false;
                          } else if (
                            item?.selectName === "documentType" &&
                            !rowData?.is_basic
                          ) {
                            disabled =
                              !values?.translationType?.includes("document");
                          } else if (
                            item?.selectName === "mediaType" &&
                            !rowData?.is_basic
                          ) {
                            disabled =
                              !values?.translationType?.includes("audioVideo");
                          }

                          return (
                            <div className="col-sm-6" key={key}>
                              <div className="mb-2 ">
                                {item?.name === "translationCheckbox" ? (
                                  <Checkbox
                                    name={item?.name}
                                    value={item?.name}
                                    // onClick={props.handleChange}
                                  >
                                    {item?.lable}
                                  </Checkbox>
                                ) : (
                                  <label>{item?.lable}</label>
                                )}

                                <AntSelect
                                  getPopupContainer={(trigger) =>
                                    trigger.parentElement
                                  }
                                  className="mt-1"
                                  mode="multiple"
                                  size="small"
                                  id={item?.selectName}
                                  name={item?.selectName}
                                  // disabled={!subscription.includes(item?.name)}
                                  disabled={
                                    disabled ||
                                    !subscription?.includes(
                                      "translationCheckbox"
                                    )
                                  }
                                  variant="standard"
                                  placeholder="Select"
                                  arrayOfData={item?.data}
                                  onSelect={(e) => {
                                    props?.setFieldValue(item?.selectName, e);
                                    if (
                                      item?.selectName === "translationType"
                                    ) {
                                      if (!e?.includes("document")) {
                                        props?.setFieldValue(
                                          "documentType",
                                          []
                                        );
                                      }
                                      if (!e?.includes("audioVideo")) {
                                        props?.setFieldValue("mediaType", []);
                                      }
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                    <h6 className="title mt-3 mb-2 ">Video Conferencing</h6>
                    <div className="row">
                      {subscriptionData?.videoConferencing.map((item, key) => {
                        if (item?.type === "checkbox") {
                          return (
                            <div className="col-sm-6" key={key}>
                              <div className="mb-2">
                                <Checkbox
                                  name={item?.name}
                                  value={item?.name}
                                  // onClick={props.handleChange}
                                >
                                  {item?.lable}
                                </Checkbox>
                              </div>
                            </div>
                          );
                        } else if (item?.type === "text") {
                          return (
                            <div className="col-sm-6" key={key}>
                              <div className="mb-2">
                                <Checkbox
                                  name={item?.name}
                                  value={item?.name}
                                  // onClick={props.handleChange}
                                >
                                  {item?.lable}
                                </Checkbox>
                                {subscription?.includes(item?.name) && (
                                  <TextInput
                                    className="form-control form-control-md"
                                    placeholder={t(
                                      "text.manageSubscription.valuePlaceholder"
                                    )}
                                    name={item?.textName}
                                    disabled={false}
                                    variant="standard"
                                    type="number"
                                    style={{ width: "150px" }}
                                    setFieldValue={props.handleChange}
                                  />
                                )}
                              </div>
                            </div>
                          );
                        } else if (item?.type === "only text") {
                          return (
                            <div className="col-sm-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  {item?.lable}
                                </label>
                                <TextInput
                                  className="form-control form-control-lg"
                                  placeholder={t(
                                    "text.manageSubscription.translationPlaceholder"
                                  )}
                                  name={item?.name}
                                  disabled={false}
                                  variant="standard"
                                  type="number"
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </div>
                          );
                        } else if (item?.type === "select") {
                          return (
                            <div className="col-sm-6" key={key}>
                              <div className="mb-2 ">
                                <Checkbox
                                  name={item?.name}
                                  value={item?.name}
                                  // onClick={props.handleChange}
                                >
                                  {item?.lable}
                                </Checkbox>
                                <AntSelect
                                  getPopupContainer={(trigger) =>
                                    trigger.parentElement
                                  }
                                  className="mt-1"
                                  mode="multiple"
                                  size="large"
                                  id={item?.selectName}
                                  name={item?.selectName}
                                  disabled={!subscription?.includes(item?.name)}
                                  variant="standard"
                                  placeholder="Select"
                                  arrayOfData={item?.data}
                                  setFieldValue={props.handleChange}
                                />
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>
                  </>
                )}
              </Checkbox.Group>
            </div>
            {checkError ? (
              <div className="ant-form-item-explain-error">
                {t("text.manageSubscription.selectOne")}
              </div>
            ) : null}
            <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2 mt-3">
              <div>
                {/* {planModal === "add" ? (
                  <Link href="#" className="btn btn-lg btn-primary">
                    Add
                  </Link>
                ) : (
                  <Link href="#" className="btn btn-lg btn-primary">
                    Update
                  </Link>
                )} */}
                <CommonButton
                  extraClassName="btn btn-lg btn-primary"
                  loading={loading}
                  // onClick={()=>navigate(adminRoutesMap.OTP_VERIFICATION.path)}
                  htmltype="button"
                  type="submit"
                >
                  {planModal === "add"
                    ? t("text.common.add")
                    : t("text.common.update")}
                </CommonButton>
              </div>
              <div>
                <Link
                  href="#"
                  onClick={() => hideAddPlanModal()}
                  className="link link-light"
                >
                  {t("text.common.cancel")}
                </Link>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
}

export default AddEditPlanForm;
