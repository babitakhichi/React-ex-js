import React, { useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  CommonButton,
  ModalComponent,
  RippleEffect,
  ImageElement,
  VerticalTabs,
} from "../../../components";
import userRoutesMap from "../../../routeControl/userRoutes";
// import SavedPayment from "./SavedPaymentOffer";
import UPI from "./UPI";
import CreditCard from "./CreditCard";
import InternetBanking from "./InternetBanking";

import {
  agoDateTime,
  dateFormatter,
  dateNewFormatter,
  getLocalStorage,
  logger,
  modalNotification,
} from "../../../utils";
import {
  // getUserSubscription,
  selectProfileData,
  updateProfile,
} from "../../../redux/UserSlice/index.slice";
import { CommonServices, PaymentServices } from "../../../services";

function PaymentMethod() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [defaultKey, setDefaultKey] = useState("paymentOption");
  const [defaultKey, setDefaultKey] = useState("card");
  let formRefUPI = useRef();
  let formRefInternet = useRef();
  let formRefSaved = useRef();
  let formRefCard = useRef();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const planDetails = getLocalStorage("plan");

  useEffect(() => {
    if (planDetails === false) {
      navigate(userRoutesMap.PURCHASE_PLAN.path);
    }
  }, [planDetails]);

  const [pageData, setPageData] = useState({});
  const userData = useSelector(selectProfileData);
  const [availableCoin, setAvailableCoin] = useState(userData?.coin);
  const [checkCoin, setCheckCoin] = useState(false);
  const [documentType, setDocumentType] = useState([]);
  const [category, setCategory] = useState("sc/st");

  useEffect(() => {
    if (planDetails) {
      let pageObj = {};
      if (planDetails?.duration === "monthly") {
        pageObj.duration = 1;
        pageObj.price = planDetails?.price;
        pageObj.expDate = agoDateTime(1, "month", "DD-MM-YYYY");
      } else if (planDetails?.duration === "quarterly") {
        pageObj.price = planDetails?.quarterly;
        pageObj.duration = 3;
        pageObj.expDate = agoDateTime(3, "month", "DD-MM-YYYY");
      } else if (planDetails?.duration === "halfyearly") {
        pageObj.duration = 6;
        pageObj.price = planDetails?.half_yearly;
        pageObj.expDate = agoDateTime(6, "month", "DD-MM-YYYY");
      } else if (planDetails?.duration === "annual") {
        pageObj.duration = 12;
        pageObj.price = planDetails?.annual;
        pageObj.expDate = agoDateTime(12, "month", "DD-MM-YYYY");
      }
      setPageData(pageObj);
    }
  }, [planDetails?.id]);

  const getPrice = useMemo(() => {
    let price = 0;
    price = pageData.price * pageData.duration;
    if (planDetails?.refund_amount) {
      if (price > planDetails?.refund_amount) {
        price -= planDetails?.refund_amount;
      } else {
        price = 0;
      }
    }
    if (checkCoin) {
      if (price > userData?.coin) {
        price -= userData?.coin;
      } else {
        setAvailableCoin(price);
        price = 0;
      }
    }
    return price;
  }, [checkCoin, pageData]);

  const handleClose = () => setShow(false);

  const handleShow = () => {
    setShow(true);
  };
  const resetForm = () => {
    formRefUPI?.current?.resetForm();
    formRefInternet?.current?.resetForm();
    formRefSaved?.current?.resetForm();
    formRefCard?.current?.resetForm();
  };

  const onFormSubmit = async (values) => {
    setLoading(true);
    try {
      let bodyData = { ...values };
      bodyData.order_amount = getPrice;
      bodyData.order_currency = "INR";
      bodyData.subscription_id = planDetails?.id;
      bodyData.isSwitch = planDetails?.isSwitch;
      if (planDetails?.isSwitch) {
        if (planDetails?.plan_type !== "bundled") {
          bodyData.refund_order_id = planDetails?.refund_order_id;
          bodyData.refund_amount = planDetails?.refund_amount;
        } else if (
          planDetails?.isVideoConference ||
          planDetails?.isTranslation
        ) {
          if (planDetails?.isVideoConference) {
            bodyData.refund_order_id = planDetails?.videoOrderId;
            bodyData.refund_amount = planDetails?.videoRefund;
          }
          if (planDetails?.isTranslation) {
            bodyData.internal_order_id = planDetails?.videoOrderId;
            bodyData.internal_order_amount = planDetails?.videoRefund;
          }
        }
      }
      if (values.coin) {
        bodyData.coins = availableCoin;
      } else {
        bodyData.coins = 0;
      }
      bodyData.expires_on = dateNewFormatter(
        pageData?.expDate,
        "DD-MM-YYYY",
        "YYYY-MM-DD"
      );
      bodyData.first_charge_date = dateFormatter(new Date(), "YYYY-MM-DD");
      let paymentType = "";
      if (defaultKey === "upi") {
        bodyData.upi_id = values.upi_id.concat(values.upi);
        paymentType = "upi";
        delete bodyData.upi;
      } else if (defaultKey === "card") {
        paymentType = "card";
      } else if (defaultKey === "internet") {
        paymentType = "net_banking";
      }
      bodyData.payment_type = paymentType;
      bodyData.plan_type = planDetails?.duration;
      bodyData.document_image = "Test";
      bodyData.video_conferencing =
        planDetails?.plan_type === "videoConferencing";
      bodyData.translation = planDetails?.plan_type === "translation";
      bodyData.bundled = planDetails?.plan_type === "bundled";
      let planId = planDetails?.Plans?.filter((item) => {
        if (Number(item.intervals) === pageData.duration) {
          return item;
        }
      });
      bodyData.plan_id = planId?.[0]?.id;
      bodyData.plan_type = planId?.[0]?.planType;
      delete bodyData.coin;
      const res = await PaymentServices.createOrderService(bodyData);
      const { message, success, data } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message: "Pay Successfully",
        });
        let profileData = { ...userData };
        profileData.coin = userData?.coin - bodyData.coins;
        dispatch(updateProfile(profileData));
        let redirectPath = "";
        if (defaultKey === "upi") {
          redirectPath = data?.data?.payload?.web;
        } else if (defaultKey === "card") {
          redirectPath = data?.data?.url;
        } else if (defaultKey === "internet") {
          redirectPath = data?.data?.url;
        }
        if (redirectPath) {
          window.location.replace(redirectPath);
        }

        // dispatch(getUserSubscription({}));
        // resetForm();
        // handleShow();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }

    setLoading(false);
  };

  const getDocumentList = async () => {
    try {
      let queryParams = { all: true, category, status: "active" };
      const res = await CommonServices.documentTypeList({ queryParams });
      const { data, success, message } = res;
      if (success === 1) {
        setDocumentType(data?.documentData?.rows);
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

  const tabContent = [
    // {
    //   name: (
    //     <span>
    //       <em className="icon-star" />
    //       {t("text.userPayment.saveOption")}
    //     </span>
    //   ),
    //   key: "paymentOption",
    //   content: (
    //     <SavedPayment
    //       onFormSubmit={onFormSubmit}
    //       loading={loading}
    //       formRef={formRefSaved}
    //       planDetails={planDetails}
    //       setCheckCoin={setCheckCoin}
    //       getPrice={getPrice}
    //       availableCoin={availableCoin}
    //       pageData={pageData}
    //       userData={userData}
    //       documentType={documentType}
    //     />
    //   ),
    // },
    {
      name: (
        <span>
          <em className="icon-card" />
          {t("text.userPayment.creditdebit")}
        </span>
      ),
      key: "card",
      content: (
        <CreditCard
          onFormSubmit={onFormSubmit}
          loading={loading}
          formRef={formRefCard}
          planDetails={planDetails}
          setCheckCoin={setCheckCoin}
          getPrice={getPrice}
          availableCoin={availableCoin}
          pageData={pageData}
          userData={userData}
          documentType={documentType}
          setCategory={setCategory}
        />
      ),
    },
    {
      name: (
        <span>
          <em className="icon-bank" />
          {t("text.userPayment.internetBanking")}
        </span>
      ),
      key: "internet",
      content: (
        <InternetBanking
          onFormSubmit={onFormSubmit}
          loading={loading}
          formRef={formRefInternet}
          planDetails={planDetails}
          setCheckCoin={setCheckCoin}
          getPrice={getPrice}
          availableCoin={availableCoin}
          pageData={pageData}
          userData={userData}
          documentType={documentType}
        />
      ),
    },
    {
      name: (
        <span>
          <em className="icon-upi" />
          {t("text.userPayment.upi")}
        </span>
      ),

      key: "upi",
      content: (
        <UPI
          onFormSubmit={onFormSubmit}
          loading={loading}
          formRef={formRefUPI}
          planDetails={planDetails}
          setCheckCoin={setCheckCoin}
          getPrice={getPrice}
          availableCoin={availableCoin}
          pageData={pageData}
          userData={userData}
          documentType={documentType}
        />
      ),
    },
  ];

  useEffect(() => {
    getDocumentList();
  }, [category]);
  useEffect(() => {
    resetForm();
  }, [defaultKey]);

  return (
    <>
      <div className="paymentMethod">
        <section className="paymentMode py-70">
          <Container>
            <h3 className="backheading font-eb">
              <Link to={userRoutesMap.PURCHASE_PLAN.path}>
                <em className="icon-arrow-back" />
              </Link>
              {t("text.userPayment.choosePayment")}
            </h3>
            <div className="paymentMode_inner verticalTabs">
              <VerticalTabs
                tabContent={tabContent}
                tabsFor="payment"
                activeKey={defaultKey}
                setActiveKey={setDefaultKey}
              />
            </div>
          </Container>
        </section>
      </div>
      <ModalComponent
        show={show}
        modalExtraClass="paymentSuccessModal"
        onHandleVisible={handleShow}
        onHandleCancel={handleClose}
        title=""
        size="sm"
        closeButton={false}
      >
        <div className="text-center">
          <ImageElement
            source="payment-success.svg"
            alt="payment-success"
            className="img-fluid"
          />
          <h3 className="font-bd">
            {" "}
            {t("text.userPayment.paymentSucessfull")}
          </h3>
          <p> {t("text.userPayment.sentToEmail")}</p>
          <div>
            <RippleEffect extraClassName="me-2 me-sm-3" type="light">
              <CommonButton onClick={() => handleClose()} variant="info">
                {t("text.userPayment.no")}
              </CommonButton>
            </RippleEffect>
            <RippleEffect>
              <CommonButton variant="primary" onClick={() => handleClose()}>
                {t("text.userPayment.yes")}
              </CommonButton>
            </RippleEffect>
          </div>
        </div>
      </ModalComponent>
    </>
  );
}

export default React.memo(PaymentMethod);
