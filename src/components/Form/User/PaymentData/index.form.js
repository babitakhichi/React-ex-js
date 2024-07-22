import React from "react";
import { t } from "i18next";
import { Link } from "react-router-dom";
import { Checkbox, Popovers } from "../../../Antd";
import { CommonButton, RippleEffect } from "../../../UiElement";

function PaymentMode({
  formData,
  loading,
  planDetails,
  availableCoin,
  pageData,
  userData,
  getPrice,
  taxes,
  taxesPercentage,
  noLicensesPrice,
  handleCouponShow,
  coupanAmount,
  setCoupanAmount,
  coinsLimit,
}) {
  const pageDetails = {
    videoConferencing: {
      title: t("text.manageSubscription.conferencing"),
      icon: "icon-video",
    },
    translation: {
      title: t("text.manageSubscription.translation"),
      icon: "icon-video",
    },
    bundled: {
      title: t("text.manageSubscription.bundled"),
      icon: "icon-video",
    },
  };

  return (
    <div className="paymentMode_right ms-xl-auto">
      {planDetails?.is_corporate === "0" && (
        <div className="paymentBox paymentBox-coin position-relative">
          <h5 className="font-bd mb-0 d-flex align-items-center">
            <em className="icon-coin" />
            {t("text.userPayment.coinAvailable")}
          </h5>
          <h6 className="font-bd">
            {userData?.coin} <span>{t("text.userPayment.coins")}</span>
          </h6>
          {userData?.coin > 0 && (
            <>
              <p>
                Maximum coins that can be redeemed is{" "}
                {availableCoin > coinsLimit ? coinsLimit : availableCoin} coins
                {/* Redeem {userData?.coin} Coins to get{" "}
                <span className="font-bd">Rs.{userData?.coin} Off</span> */}
              </p>
              {/* <Checkbox className="dark">Use Coins</Checkbox> */}
              <Checkbox
                className="dark"
                type="checkbox"
                name="coin"
                checked={formData?.values?.coin}
                onChange={formData?.handleChange}
                // onChange={onChangeCoin}
              >
                {t("text.userPayment.useCoins")}
              </Checkbox>
            </>
          )}
        </div>
      )}
      <div className="paymentBox paymentBox-coin">
        <h5 className="font-bd mb-0 d-flex align-items-center">
          <em className={pageDetails?.[planDetails?.plan_type].icon} />
          {pageDetails?.[planDetails?.plan_type].title}
        </h5>
        <ul className="paymentBox_summary list-unstyled">
          <li className="font-sb">
            {t("text.userPayment.plan")} <span>{planDetails?.name}</span>
          </li>
          <li className="font-sb">
            {t("text.userPayment.price")}{" "}
            <span>
              ₹ {pageData?.price} / {t("text.userHome.monthly")}
            </span>
          </li>
          <li className="font-sb">
            {t("text.userPayment.expOfdate")} <span>{pageData?.expDate}</span>
          </li>
          {planDetails?.is_corporate === "1" && (
            <li className="font-sb totalPayment pb-2 pb-xxl-3">
              {t("text.userPayment.numberOfLicenses")} (
              {formData?.values?.no_licenses}) (
              {pageData?.price * pageData?.duration}x
              {formData?.values?.no_licenses}) <span>₹ {noLicensesPrice}</span>
            </li>
          )}
          {planDetails?.isRefund && (
            <li className="font-sb">
              {t("text.userPayment.previousAdjusted")}
              <span>- ₹ {planDetails?.adjustAmount}</span>
            </li>
          )}
          {planDetails?.totalRefundAmount && (
            <li className="font-sb">
              {t("text.userPayment.refundAmount")}
              <span>- ₹ {planDetails?.totalRefundAmount}</span>
            </li>
          )}
          {planDetails?.is_corporate === "0" &&
            (coupanAmount?.amount > 0 ? (
              <li className="font-sb">
                Coupon Discount{" "}
                <Link
                  className="paymentBox_infoIcon me-auto ms-2"
                  to="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCoupanAmount({ id: null, amount: 0 });
                  }}
                >
                  <em className="icon-trash" />
                </Link>
                <span>- ₹ {coupanAmount?.amount}</span>
              </li>
            ) : (
              <li className="font-sb">
                Coupon Discount
                <Link
                  to="#"
                  className="text-500"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCouponShow();
                  }}
                >
                  <span>Apply Coupon</span>
                </Link>
              </li>
            ))}
          {formData?.values?.coin &&
            (availableCoin > coinsLimit ? (
              <li className="font-sb">
                Coins <span>- ₹ {coinsLimit}</span>
              </li>
            ) : (
              <li className="font-sb">
                {availableCoin} Coins <span>- ₹ {availableCoin}</span>
              </li>
            ))}
          {taxes?.igst && (
            <li className="font-sb totalPayment">
              IGST @{taxesPercentage?.igst}%<span> ₹ {taxes?.igst}</span>
            </li>
          )}
          {taxes?.cgst && (
            <li className="font-sb totalPayment">
              CGST @{taxesPercentage?.cgst}%<span> ₹ {taxes?.cgst}</span>
            </li>
          )}{" "}
          {taxes?.sgst && (
            <li className="font-sb">
              SGST @{taxesPercentage?.sgst}%<span> ₹ {taxes?.sgst}</span>
            </li>
          )}
          <li className="totalPayment font-bd pb-0">
            {t("text.userPayment.payment")}
            <span>₹ {getPrice}</span>
          </li>
        </ul>
        {planDetails?.is_corporate === "0" && (
          <Checkbox
            className="dark"
            name="auto_recurring"
            checked={formData?.values?.auto_recurring}
            onChange={formData?.handleChange}
          >
            {t("text.userPayment.auto")}
            <Popovers
              overlayClassName="renewalInfo"
              content={
                <>
                  <h5> {t("text.userPayment.auto")}</h5>
                  <p>
                    Payment Would Be Automatically Deducted From Your Saved
                    Card/Account On Renewal Date
                  </p>
                </>
              }
            >
              <em className="icon-info paymentBox_infoIcon" />
            </Popovers>
          </Checkbox>
        )}

        <div className="mt-2 mt-md-3 mt-xl-4">
          <RippleEffect extraClassName="w-100">
            <CommonButton
              className="w-100"
              variant="primary"
              type="submit"
              loading={loading}
            >
              {t("text.userPayment.payNow")}
            </CommonButton>
          </RippleEffect>
        </div>
      </div>
    </div>
  );
}

export default React.memo(PaymentMode);
