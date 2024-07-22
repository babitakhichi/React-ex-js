import { t } from "i18next";
import React from "react";
import { Checkbox, Popovers } from "../../Antd";
import { CommonButton, RippleEffect } from "../../UiElement";

export default function PaymentMode({ values, loading, formRef }) {
  const onChangeSelect = (e) => {
    formRef?.current?.setFieldValue("autoRenewal", e.target.checked);
  };
  const onChangeSelectCoin = (e) => {
    formRef?.current?.setFieldValue("coin", e.target.checked);
  };
  return (
    <div className="paymentMode_right ms-xl-auto">
      <div className="paymentBox paymentBox-coin position-relative">
        <h5 className="font-bd mb-0 d-flex align-items-center">
          <em className="icon-coin" />
          Coins Available
        </h5>
        <h6 className="font-bd">
          1500 <span>Coins</span>
        </h6>
        <p>
          Redeem 1500 Coins to get <span className="font-bd">Rs.100 Off</span>
        </p>
        <Checkbox
          className="dark"
          name="coin"
          value={values?.coin}
          onChange={onChangeSelectCoin}
        >
          Use Coins
        </Checkbox>
      </div>
      <div className="paymentBox paymentBox-coin">
        <h5 className="font-bd mb-0 d-flex align-items-center">
          <em className="icon-video" />
          Video Conferencing
        </h5>
        <ul className="paymentBox_summary list-unstyled">
          <li className="font-sb">
            Plan <span>Silver</span>
          </li>
          <li className="font-sb">
            Subscription Price <span>₹ 999 / Monthly</span>
          </li>
          <li className="font-sb">
            Date of Expiration <span>24-10-2023</span>
          </li>
          <li className="font-sb">
            1500 Coins <span>- ₹ 100</span>
          </li>
          <li className="totalPayment font-bd pb-0">
            Total Payment <span>₹ 899</span>
          </li>
        </ul>
        <Checkbox
          className="dark"
          name="autoRenewal"
          value={values?.autoRenewal}
          onChange={onChangeSelect}
        >
          Auto-Renewal{" "}
          <Popovers
            overlayClassName="renewalInfo"
            content={
              <>
                <h5>Auto-Renewal</h5>
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
        <div className="mt-2 mt-md-3 mt-xl-4">
          <RippleEffect extraClassName="w-100">
            <CommonButton
              className="w-100"
              variant="primary"
              loading={loading}
              htmltype="button"
              type="submit"
            >
              {t("text.userPayment.payNow")}
            </CommonButton>
          </RippleEffect>
        </div>
      </div>
    </div>
  );
}
