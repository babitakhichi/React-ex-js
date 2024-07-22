import { t } from "i18next";
import React, { useState } from "react";

import {
  checkValidCount,
  checkValidData,
  checkValidDiscount,
  checkValidPrice,
  CommonButton,
  GlobalLoader,
  Pagination,
  RippleEffect,
  statusFormatter,
  textFormatter,
} from "../../../../components";
import { PaymentServices } from "../../../../services";
import { dateFormatter, logger, modalNotification } from "../../../../utils";

export default function BillingHistory({
  count,
  page,
  sizePerPage,
  noOfPage,
  goToPage,
  billingHistoryData,
  loading,
}) {
  // const [loadingInvoice, setInvoiceLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState();
  const downloadInvoice = async (id) => {
    // setInvoiceLoading(true);
    try {
      let bodyData = {
        order_id: id,
      };
      const res = await PaymentServices.downloadInvoiceService(bodyData);
      const { success, message, data } = res;
      if (success === 1 && data) {
        // window.open(data);

        // -----
        fetch(data)
          .then((response) => response.blob())
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Invoice.pdf");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          })
          .catch((error) => {
            logger(error);
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
    // setInvoiceLoading(false);
    setInvoiceId();
  };

  return (
    <div className="planSubscription_box customCard">
      <h3 className="title font-eb mb-0">
        {t("text.planAndSubscription.billingHistory")}{" "}
      </h3>
      {loading ? (
        <GlobalLoader />
      ) : billingHistoryData.length > 0 ? (
        billingHistoryData.map((item) => {
          return (
            <div className="billingList">
              <h5 className="font-bd">
                {statusFormatter(item?.Subscription?.plan_type)}
              </h5>
              <ul className="list-unstyled d-flex flex-wrap">
                <li>
                  <span className="d-inline-block">
                    {t("text.userPayment.plan")}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {textFormatter(item?.Subscription?.name)} /{" "}
                    {statusFormatter(item?.plan_duration)}
                  </p>
                </li>
                <li>
                  <span className="d-inline-block">
                    {t("text.transactionHistory.subscriptionPrice")}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {checkValidPrice(item?.total_subscription_amount)}
                  </p>
                </li>
                <li>
                  <span className="d-inline-block">
                    {item?.is_corporate
                      ? t("text.transactionHistory.noLicenses")
                      : t("text.transactionHistory.previousAdjusted")}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {item?.is_corporate
                      ? item?.no_licenses
                      : checkValidPrice(item?.previous_adjusted)}
                  </p>
                </li>
                {!item?.is_corporate && (
                  <li>
                    <span className="d-inline-block">
                      {t("text.transactionHistory.coinsApplied")}
                    </span>{" "}
                    <p className="mb-0 font-bd">
                      {/* $20{" "} */}
                      {checkValidCount(item?.coins)}{" "}
                      {t("text.userPayment.coins")}
                      {/* <span className="font-rg">
                      {checkValidCount(item?.coins)}{" "}
                      {t("text.userPayment.coins")}
                    </span> */}
                    </p>
                  </li>
                )}
                <li>
                  <span className="d-inline-block">
                    {t("text.transactionHistory.amountPaid")}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {checkValidPrice(item?.order_amount)}
                  </p>
                </li>
                <li>
                  <span className="d-inline-block">
                    {t("text.planAndSubscription.dateOfInvoice")}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {dateFormatter(item?.createdAt, "DD-MM-YYYY")}
                  </p>
                </li>
                <li>
                  <span className="d-inline-block">
                    {t("text.planAndSubscription.dateOfExpiration")}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {dateFormatter(item?.expires_on, "DD-MM-YYYY")}
                  </p>
                </li>
                <li>
                  <span className="d-inline-block">
                    {t("text.common.status")}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {checkValidData(textFormatter(item?.status))}
                  </p>
                </li>
                {!item?.is_corporate && (
                  <li>
                    <span className="d-inline-block">
                      {t("text.transactionHistory.refund")}
                    </span>{" "}
                    <p className="mb-0 font-bd">
                      {item?.second_refund_amount
                        ? checkValidPrice(
                            Number(item?.refund_amount) +
                              Number(item?.second_refund_amount)
                          )
                        : checkValidPrice(item?.refund_amount)}
                    </p>
                  </li>
                )}
                <li>
                  <span className="d-inline-block">
                    {t("text.planAndSubscription.paymentmethod")}{" "}
                  </span>{" "}
                  <p className="mb-0 font-bd">
                    {checkValidData(statusFormatter(item?.payment_type))}
                  </p>
                </li>
                {item?.discount_amount && (
                  <li>
                    <span className="d-inline-block">
                      {t("text.discountRequest.discount")}
                    </span>{" "}
                    <p className="mb-0 font-bd">
                      {checkValidDiscount(
                        item?.discount_amount,
                        item?.discount_type
                      )}
                    </p>
                  </li>
                )}
              </ul>
              <RippleEffect>
                <CommonButton
                  extraClassName="btn-md"
                  variant="secondary"
                  loading={invoiceId === item?.order_id}
                  onClick={() => {
                    setInvoiceId(item?.order_id);
                    downloadInvoice(item?.order_id);
                  }}
                >
                  {" "}
                  <em className="icon-download icon-left" />
                  {t("text.planAndSubscription.downloadInvoice")}
                </CommonButton>
              </RippleEffect>
            </div>
          );
        })
      ) : (
        <div className="noActivePlans mx-auto text-center">
          <h3 className="mb-1 font-eb">
            {" "}
            {t("text.planAndSubscription.noBill")}
          </h3>
          <p className="mb-2 mb-lg-3">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industrys standard.
          </p>
        </div>
      )}
      {count > 0 && (
        <div className="mt-3">
          <Pagination
            count={count}
            page={page}
            sizePerPage={sizePerPage}
            noOfPage={noOfPage}
            goToPage={goToPage}
          />
        </div>
      )}
    </div>
  );
}
