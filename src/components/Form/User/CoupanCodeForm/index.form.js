import { Form, Formik } from "formik";

import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { t } from "i18next";

import { CommonButton, GlobalLoader, RippleEffect } from "../../../UiElement";

import { Input as TextInput, statusFormatter } from "../../../index";
import { CoupanCodeServices } from "../../../../services";
import { dateFormatter, logger, modalNotification } from "../../../../utils";

function CoupanCodeForm({ onSubmit, coupanPrice, planDetails }) {
  const [search, setSearch] = useState("");
  const [list, setList] = useState({});
  const [loadingList, setLoadingList] = useState(false);
  const initialValues = {
    coupon_code: "",
    coupanData: { id: null, amount: 0 },
  };

  const getCoupanList = async () => {
    setLoadingList(true);
    try {
      let queryParams = {
        search,
        plan_type: planDetails?.duration,
      };
      let res = await CoupanCodeServices.getcoupanCodeListingService({
        queryParams,
      });
      const { data, success, message } = res;
      if (success === 1) {
        setList(data);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoadingList(false);
  };
  const applyCoupan = async (id, props) => {
    setLoadingList(true);
    try {
      let bodyData = {
        promotion_id: id,
        intervals: planDetails?.duration,
        order_amount: coupanPrice,
      };
      let res = await CoupanCodeServices.applyCoupanCodeService(bodyData);
      const { data, success, message } = res;
      if (success === 1) {
        props?.setFieldValue("coupanData", { id, amount: data });
        modalNotification({
          type: "success",
          message,
        });
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoadingList(false);
  };
  useEffect(() => {
    getCoupanList();
  }, [search]);
  return (
    <Formik initialValues={{ ...initialValues }} onSubmit={onSubmit}>
      {(props) => {
        let { values } = props;
        return (
          <>
            <div className="modalHeader">
              <h3>{t("text.coupanCode.applyCoupanCode")}</h3>
            </div>
            <Form>
              <div className="modalForm">
                <div className="form-group w-100">
                  <div className="form-control-wrap">
                    <TextInput
                      className="form-control"
                      type="text"
                      name="coupon_code"
                      placeholder="Enter Coupon Code"
                      setFieldValue={props.handleChange}
                    />
                    <Link
                      to="#"
                      className="text-500 check"
                      onClick={() => {
                        setSearch(props?.values?.coupon_code);
                      }}
                    >
                      {t("text.coupanCode.check")}
                    </Link>
                  </div>
                </div>
                {loadingList ? (
                  <GlobalLoader />
                ) : (
                  <>
                    {list?.length > 0 ? (
                      <div className="modalForm_coupon">
                        {list?.map((item) => {
                          return (
                            <div
                              className={`couponBox d-sm-flex justify-content-between ${
                                (item?.promotion_id || item?.id) ===
                                  values?.coupanData?.id ||
                                planDetails?.duration !==
                                  (item?.intervals ||
                                    item?.Promotion?.intervals)
                                  ? ""
                                  : "active"
                              }`}
                            >
                              <div className="title">
                                <h4>
                                  {t("text.coupanCode.get")}{" "}
                                  {Number(item?.discount_percentage) ||
                                    Number(
                                      item?.Promotion?.discount_percentage
                                    )}
                                  % OFF{" "}
                                  {(item?.max_discount ||
                                    item?.Promotion?.max_discount) &&
                                    `up to INR ${
                                      Number(item?.max_discount) ||
                                      Number(item?.Promotion?.max_discount)
                                    }`}
                                </h4>

                                {(item?.intervals ||
                                  item?.Promotion?.intervals) && (
                                  <p className="mb-0 tag">
                                    Coupon code valid for{" "}
                                    {statusFormatter(
                                      item?.intervals ||
                                        item?.Promotion?.intervals
                                    )}{" "}
                                    plan on minimum purchase of INR{" "}
                                    {Number(item?.minimum_purchase) ||
                                      Number(item?.Promotion?.minimum_purchase)}
                                    {/* {t("text.userLogin.valid")}{" "}
                                    {statusFormatter(
                                      item?.intervals ||
                                        item?.Promotion?.intervals
                                    )}{" "}
                                    plan */}
                                  </p>
                                )}

                                <span className="title_code d-inline-block">
                                  {item?.code || item?.Promotion?.code}
                                </span>
                                {(item?.end_date ||
                                  item?.Promotion?.end_date) && (
                                  <p className="mb-0 tag">
                                    {t("text.coupanCode.expireOn")}{" "}
                                    {dateFormatter(
                                      item?.end_date ||
                                        item?.Promotion?.end_date,
                                      "MMMM DD, YYYY"
                                    )}{" "}
                                  </p>
                                )}
                              </div>
                              <RippleEffect>
                                <CommonButton
                                  variant="primary"
                                  extraClassName="btn-md"
                                  loading={
                                    (item?.promotion_id || item?.id) ===
                                      values?.coupanData?.id ||
                                    planDetails?.duration !==
                                      (item?.intervals ||
                                        item?.Promotion?.intervals)
                                  }
                                  onClick={() =>
                                    applyCoupan(
                                      item?.promotion_id || item?.id,
                                      props
                                    )
                                  }
                                >
                                  {t("text.coupanCode.apply")}
                                </CommonButton>
                              </RippleEffect>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="emptySec text-center w-100">
                        {/* <ImageElement
                            source="video-conferencing-icon.svg"
                            alt="No Data Found"
                          /> */}
                        <h6>{t("text.common.noData")}</h6>
                        {/* <p className="mb-0">
                There are no Pricing Plan to show here right now.
              </p> */}
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="modalFooter d-flex align-items-center justify-content-between">
                <div>
                  <h5>{t("text.coupanCode.maxSaving")}:</h5>
                  <p className="mb-0">₹ {props?.values?.coupanData?.amount}</p>
                </div>
                <RippleEffect>
                  <CommonButton
                    variant="primary"
                    htmltype="button"
                    type="submit"
                    loading={props?.values?.coupanData?.amount <= 0}
                  >
                    Confirm & Proceed
                  </CommonButton>
                </RippleEffect>
              </div>
            </Form>
          </>
        );
      }}
    </Formik>
  );
}
export default React.memo(CoupanCodeForm);
