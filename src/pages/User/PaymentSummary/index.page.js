import React, { useState, useRef, useEffect, useMemo } from "react";

import { Link, useNavigate } from "react-router-dom";
import { Container, Tab, Col, Row } from "react-bootstrap";
import { t } from "i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  CommonButton,
  ModalComponent,
  RippleEffect,
  ImageElement,
  PaymentFrom,
  GlobalLoader,
  VerificationForm,
  AddEmailForm,
  AddStateForm,
  UserBusinessForm,
  CoupanCodeForm,
} from "../../../components";
import userRoutesMap from "../../../routeControl/userRoutes";
// import SavedPayment from "./SavedPaymentOffer";
// import UPI from "../PaymentMethod/UPI";
// import CreditCard from "./CreditCard";
// import InternetBanking from "./InternetBanking";
import {
  agoDateTime,
  dateFormatter,
  dateNewFormatter,
  getActiveAccount,
  getIscorporateActive,
  getLocalStorage,
  logger,
  modalNotification,
  removeLocalStorage,
} from "../../../utils";
import {
  getProfile,
  getUserAccount,
  getUserSubscription,
  selectCountryData,
  selectLanguageData,
  selectProfileData,
  selectStateData,
  selectUserAccountData,
  updateProfile,
  updateUserAccount,
} from "../../../redux/UserSlice/index.slice";
import {
  AdminHeadquaterServices,
  AdminManageTaxes,
  AdminReferralsServices,
  CommonServices,
  PaymentServices,
  UserAuthServices,
  UserProfileServices,
} from "../../../services";

let timer;

function PaymentMethod() {
  const countryList = useSelector(selectCountryData);
  const stateList = useSelector(selectStateData);
  const account = useSelector(selectUserAccountData);
  const languageDetails = useSelector(selectLanguageData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [supplyStateCode, setSupplyStateCode] = useState({});

  const [taxes, setTaxes] = useState({});
  const [taxesPercentage, setTaxesPercentage] = useState({});

  // const [defaultKey, setDefaultKey] = useState("paymentOption");
  // const [defaultKey, setDefaultKey] = useState("card");
  let formRef = useRef();

  let dropModal = useRef();
  const priceRef = useRef(0);
  // let formRefInternet = useRef();
  // let formRefSaved = useRef();
  // let formRefCard = useRef();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [cashdropModal, setCashdropModal] = useState(false);
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
  const [otpShow, setOtpShow] = useState(false);
  const [addData, setAddData] = useState({});
  const [counter, setCounter] = useState(60);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [callCounter, setCallCounter] = useState(false);
  const [addPhoneEmailShow, setAddPhoneEmailShow] = useState(false);
  const [addStateShow, setAddStateShow] = useState(false);
  const [addChangeEmailPhoneCheck, setAddChangeEmailPhoneCheck] = useState({
    type: "",
    useFor: "",
  });
  const [addPhoneEmailLoading, setAddPhoneEmailLoading] = useState(false);
  const [otp, setOtp] = useState({
    input1: "",
    input2: "",
    input3: "",
    input4: "",
    input5: "",
    input6: "",
  });
  const [category, setCategory] = useState("");

  const [businessAccount, setBusinessAccount] = useState(false);
  const [businessLoader, setBusinessLoader] = useState(false);
  const [noLicenses, setNoLicenses] = useState(1);
  const [noLicensesPrice, setNoLicensesPrice] = useState(0);
  const [coupon, setCoupon] = useState(false);
  const [coupanPrice, setCoupanPrice] = useState(0);
  const [coupanAmount, setCoupanAmount] = useState({ id: null, amount: 0 });
  const [genderList, setGenderList] = useState([]);
  const handleCouponShow = () => setCoupon(true);
  const handleStateShow = () => setAddStateShow(true);
  const createBusinessAccount = () => setBusinessAccount(true);
  function percentage(num, per) {
    return (num / 100) * per;
  }
  const [coinsLimit, setCoinsLimit] = useState(0);
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
  const getTaxesList = async () => {
    try {
      let res = await AdminManageTaxes.getTaxesListService();
      const { data, success, message } = res;
      if (success === 1) {
        setTaxesPercentage(data?.taxesData?.rows?.[0]);
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
  const getReferralDetails = async () => {
    try {
      const res = await AdminReferralsServices.getReferralDetails();
      const { success, data, message } = res;
      if (success === 1) {
        setCoinsLimit(data?.max_coins_limit);
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
  const getSupplyState = async () => {
    try {
      const res = await AdminHeadquaterServices.getHeadquaterService();
      const { success, data, message } = res;
      if (success === 1) {
        setSupplyStateCode({
          country: data?.country_id,
          state: `${data?.state_id}`,
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
  };
  const getGenderList = async () => {
    try {
      let res = await CommonServices.genderList();
      const { data, success, message } = res;
      if (success === 1) {
        setGenderList(data?.rows);
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
    getSupplyState();
    getTaxesList();
    getGenderList();
    getReferralDetails();
    const activeAccount = getActiveAccount(account);
    if (activeAccount?.account?.includes("(Guest)"))
      navigate(userRoutesMap.USER_DASHBOARD.path);
  }, []);
  const getPrice = useMemo(() => {
    let price = 0;

    price = pageData.price * pageData.duration;

    if (planDetails?.refund_amount) {
      if (planDetails?.isCancelled) {
        price = pageData.price * pageData.duration;
      } else if (price > planDetails?.refund_amount) {
        price -= planDetails?.refund_amount;
      } else {
        price = 0;
      }
    }
    let coinPrice = 0;

    if (checkCoin && priceRef.current > 0 && coupanAmount?.amount === 0) {
      coinPrice = priceRef.current;
    } else {
      coinPrice = price;
    }
    setCoupanPrice(coinPrice);

    if (coupanAmount?.amount > 0) {
      price = coinPrice - coupanAmount?.amount;
    }
    if (checkCoin) {
      // if (price > userData?.coin) {

      if (userData?.coin > coinsLimit) {
        if (price < coinsLimit) {
          setAvailableCoin(price);
          price = 0;
        } else {
          setAvailableCoin(userData?.coin);
          price -= coinsLimit;
        }
      } else if (userData?.coin <= coinsLimit) {
        if (price < userData?.coin) {
          setAvailableCoin(price);
          price = 0;
        } else {
          setAvailableCoin(userData?.coin);
          price -= userData?.coin;
        }
      }
      // } else {
      //   setAvailableCoin(price);
      //   price = 0;
      // }
      priceRef.current = price;
    }

    if (planDetails?.is_corporate === "1") {
      price *= Number(noLicenses);
      setNoLicensesPrice(price);
    }

    let changePrice = price;
    if (
      (userData?.UserBusinessAccount?.state &&
        planDetails?.is_corporate === "1") ||
      (userData?.UserProfile?.state_id && planDetails?.is_corporate === "0")
    ) {
      if (
        (supplyStateCode?.state === userData?.UserBusinessAccount?.state &&
          userData?.UserBusinessAccount?.business_country_id ===
            supplyStateCode?.country &&
          planDetails?.is_corporate === "1") ||
        (supplyStateCode?.state === userData?.UserProfile?.state_id &&
          userData?.UserProfile?.country_id === supplyStateCode?.country &&
          planDetails?.is_corporate === "0")
      ) {
        const igstvalue = percentage(price, Number(taxesPercentage?.igst ?? 0));

        setTaxes({ igst: igstvalue.toFixed(2) });
        changePrice += Number(igstvalue.toFixed(2));

        price = changePrice;
      } else if (
        (supplyStateCode?.state !== userData?.UserBusinessAccount?.state &&
          userData?.UserBusinessAccount?.business_country_id ===
            supplyStateCode?.country &&
          planDetails?.is_corporate === "1") ||
        (supplyStateCode?.state !== userData?.UserProfile?.state_id &&
          userData?.UserProfile?.country_id === supplyStateCode?.country &&
          planDetails?.is_corporate === "0")
      ) {
        const cgstvalue = percentage(
          price,
          parseInt(taxesPercentage?.cgst ?? 0)
        );
        const sgstvalue = percentage(
          price,
          parseInt(taxesPercentage?.sgst ?? 0)
        );
        setTaxes({ cgst: cgstvalue.toFixed(2), sgst: sgstvalue.toFixed(2) });
        changePrice +=
          Number(cgstvalue.toFixed(2)) + Number(sgstvalue.toFixed(2));

        price = changePrice;
      } else {
        setTaxes({});
        price = changePrice;
      }
    }

    return price.toFixed(2);
  }, [
    checkCoin,
    pageData,
    taxesPercentage,
    userData,
    noLicenses,
    coupanAmount,
    supplyStateCode,
  ]);
  const handleClose = () => {
    setAddData({});
    setOtp({
      input1: "",
      input2: "",
      input3: "",
      input4: "",
      input5: "",
      input6: "",
    });
    setCounter(60);
    clearTimeout(timer);
    setShow(false);
    setOtpShow(false);
    setAddPhoneEmailShow(false);
    setAddStateShow(false);
    setBusinessAccount(false);
    setCoupon(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  const updateStatusFunction = () => {
    let statusData = account.find((entry) =>
      entry.account.includes("(Business Account)")
    );
    if (!statusData)
      statusData = account?.find(
        (acc) => acc?.account === userData.UserBusinessAccount.organization_name
      );
    return statusData;
  };
  const updatePaymentStatus = async (orderId, status) => {
    try {
      let bodyData = {
        type: status,
        order_id: orderId,
      };
      bodyData.is_corporate = planDetails?.is_corporate === "1";
      bodyData.no_licenses = noLicenses;
      if (coupanAmount?.amount > 0) {
        bodyData.promo_code = true;
        bodyData.promotion_id = coupanAmount.id;
        bodyData.total_discount = coupanAmount?.amount;
      }

      const res = await PaymentServices.updatePaymentStatusService(bodyData);
      const { success } = res;
      if (success === 1) {
        if (status === "success") {
          modalNotification({
            type: "success",
            message: "Payment Successful",
          });

          let coins = 0;
          let profileData = { ...userData };
          if (checkCoin) {
            if (availableCoin > coinsLimit) {
              coins = coinsLimit;
            } else {
              coins = availableCoin;
            }
          } else {
            coins = 0;
          }
          profileData.coin = userData?.coin - coins;
          setTimeout(() => {
            if (planDetails?.is_corporate === "1") {
              dispatch(updateUserAccount(updateStatusFunction()));
            }
            setCashdropModal(false);
            dispatch(updateProfile(profileData));
            let activeAcc = getActiveAccount(account);
            let queryParams = {
              is_corporate: getIscorporateActive(account),
              corporate_id: activeAcc?.id,
            };
            dispatch(getUserSubscription({ queryParams }));
            removeLocalStorage("plan");
            if (planDetails?.is_corporate === "1") {
              navigate(userRoutesMap.PLAN_SUBSCRIPTION.path, {
                state: "unassigned",
              });
            } else {
              navigate(userRoutesMap.PLAN_SUBSCRIPTION.path);
            }
            if (res?.data?.successData?.authLink) {
              window.open(res?.data?.successData?.authLink, "_self");
            }
          }, 3000);
        } else {
          modalNotification({
            type: "error",
            message: "Payment unsuccessful.",
          });
          setCashdropModal(false);
        }
      } else {
        modalNotification({
          type: "error",
          message: "Payment unsuccessful.",
        });
        setCashdropModal(false);
      }
    } catch (error) {
      logger(error);
    }
  };

  const cbs = function (data) {
    if (data.order && data.order.status === "PAID") {
      let parent = dropModal.current;
      parent.innerHTML = `<div class="text-center"><div class="spinner-border text-primary"></div></div>`;
      updatePaymentStatus(data.order.orderId, "success");
    }
  };
  const cbf = function (data) {
    updatePaymentStatus(data?.order?.orderId, "fail");
    setCashdropModal(false);
  };
  function render(paymentType, paymentSessionId) {
    // let paymentSessionId =
    //   "session_2QY7XoZ3SsTwP-BI7sRanic6M7fOyT7rAigXuiPa1_50dI3AUAeFkrXxI4gGAdkdhNI5JwXkBCZ7DbYp8My3NDaar_eW0RX-4VgnVUPq6Xin";
    // let parent = document.getElementById("drop_in_container");
    if (paymentSessionId === "") {
      modalNotification({
        type: "error",
        message: "No token specified",
      });
      return;
    }
    setTimeout(() => {
      let parent = dropModal.current;
      parent.innerHTML = "";
      const cashfree = new window.Cashfree(paymentSessionId);

      cashfree.drop(parent, {
        onSuccess: cbs,
        onFailure: cbf,
        components: ["order-details", paymentType],
      });
    }, 5000);
  }

  const onFormSubmit = async (values) => {
    try {
      if (
        userData?.UserProfile?.email_verified &&
        userData?.UserProfile?.phone_verified &&
        ((userData?.UserProfile?.state_id &&
          userData?.UserProfile?.zip_code &&
          userData?.UserProfile?.profile_address &&
          userData?.UserProfile?.city_id &&
          planDetails?.is_corporate === "0") ||
          (planDetails?.is_corporate === "1" &&
            userData?.UserBusinessAccount?.state))
      ) {
        setLoading(true);
        setCashdropModal(true);

        let bodyData = { ...values };
        bodyData.order_amount = getPrice;
        bodyData.order_currency = "INR";
        bodyData.subscription_id = planDetails?.id;
        bodyData.isSwitch = planDetails?.isSwitch;
        delete bodyData.image;
        if (planDetails?.isSwitch) {
          if (planDetails?.videoOrderId || planDetails?.translationOrderId) {
            if (planDetails?.videoOrderId && planDetails?.translationOrderId) {
              bodyData.refund_order_id = planDetails?.videoOrderId;
              bodyData.refund_amount = planDetails?.videoRefund;
              bodyData.internal_order_id = planDetails?.translationOrderId;
              bodyData.internal_order_amount = planDetails?.translationRefund;
            } else if (planDetails?.videoOrderId) {
              bodyData.refund_order_id = planDetails?.videoOrderId;
              bodyData.refund_amount = planDetails?.videoRefund;
            } else {
              bodyData.refund_order_id = planDetails?.translationOrderId;
              bodyData.refund_amount = planDetails?.translationRefund;
            }
          } else {
            bodyData.refund_order_id = planDetails?.refund_order_id;
            bodyData.refund_amount = planDetails?.refund_amount;
          }
        }
        if (values.coin) {
          if (availableCoin > coinsLimit) {
            bodyData.coins = coinsLimit;
          } else {
            bodyData.coins = availableCoin;
          }
        } else {
          bodyData.coins = 0;
        }
        bodyData.expires_on = dateNewFormatter(
          pageData?.expDate,
          "DD-MM-YYYY",
          "YYYY-MM-DD"
        );
        bodyData.first_charge_date = dateFormatter(new Date(), "YYYY-MM-DD");

        //   bodyData.payment_type = paymentType;
        bodyData.plan_type = planDetails?.duration;
        bodyData.document_image = values.image;
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
        bodyData.plan_type = planId?.[0]?.plan_type;
        delete bodyData.coin;
        delete bodyData.affirmative;
        if (taxes) {
          if (taxes.igst) {
            bodyData.igst = taxes.igst;
          } else if (taxes.cgst) {
            bodyData.cgst = taxes.cgst;
            bodyData.sgst = taxes.sgst;
          }
        }
        bodyData.is_corporate = planDetails?.is_corporate === "1";
        if (coupanAmount?.amount > 0) {
          bodyData.deduct_amount = coupanAmount?.amount;
        } else {
          bodyData.deduct_amount = 0;
        }
        const res = await PaymentServices.createOrderService(bodyData);
        const { message, success, data } = res;
        if (success === 1) {
          if (data?.payment_session_id) {
            render(bodyData.payment_type, data?.payment_session_id);
          } else {
            modalNotification({
              type: "success",
              message: "Payment success",
            });
            if (res?.data?.authLink) {
              window.open(res?.data?.authLink, "_blank");
            }
            let coins = 0;
            let profileData = { ...userData };
            if (checkCoin) {
              if (availableCoin > coinsLimit) {
                coins = coinsLimit;
              } else {
                coins = availableCoin;
              }
            } else {
              coins = 0;
            }
            profileData.coin = userData?.coin - coins;
            setTimeout(() => {
              if (planDetails?.is_corporate === "1") {
                dispatch(updateUserAccount(updateStatusFunction()));
              }

              dispatch(updateProfile(profileData));
              let activeAcc = getActiveAccount(account);
              let queryParams = {
                is_corporate: getIscorporateActive(account),
                corporate_id: activeAcc?.id,
              };
              dispatch(getUserSubscription({ queryParams }));
              if (planDetails?.is_corporate === "1") {
                navigate(userRoutesMap.PLAN_SUBSCRIPTION.path, {
                  state: "unassigned",
                });
              } else {
                navigate(userRoutesMap.PLAN_SUBSCRIPTION.path);
              }
            }, 3000);
          }
          // let profileData = { ...userData };
          // profileData.coin = userData?.coin - bodyData.coins;
          // dispatch(updateProfile(profileData));
          // dispatch(getUserSubscription({}));
          // resetForm();
          // handleShow();
        } else {
          modalNotification({
            type: "error",
            message,
          });
          setCashdropModal(false);
        }
      } else if (
        !userData?.UserProfile?.email_verified ||
        !userData?.UserProfile?.phone_verified
      ) {
        let verificationType = userData?.UserProfile?.email_verified
          ? "Phone number"
          : "Email";
        modalNotification({
          type: "error",
          message: `${verificationType} verification required. Please verify ${verificationType} first`,
        });
      } else if (
        (!userData?.UserProfile?.state_id ||
          !userData?.UserProfile?.zip_code ||
          !userData?.UserProfile?.profile_address) &&
        planDetails?.is_corporate === "0"
      ) {
        modalNotification({
          type: "error",
          message: "Please Complete Your Profile first",
        });
      } else if (
        planDetails?.is_corporate === "1" &&
        !userData?.UserBusinessAccount?.state
      ) {
        modalNotification({
          type: "error",
          message:
            "Business Account is required. Please Add Business Account first",
        });
      }
    } catch (error) {
      logger(error);
    }

    setLoading(false);
  };

  const dropClass = {
    upi: "dropin-parent-upi",
    card: "",
    netbanking: "dropin-parent-banking",
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

  useEffect(() => {
    getDocumentList();
  }, [category]);

  useEffect(() => {
    if (counter > 0 && callCounter && otpShow) {
      timer = setTimeout(() => setCounter((c) => c - 1), 1000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [counter, callCounter, otpShow]);

  const onVerifyClick = async (verificationType) => {
    setCallCounter(true);
    try {
      let bodyData = { type: verificationType, typeCheck: true };
      if (verificationType === "email") {
        bodyData.email = userData?.UserProfile?.email;
      } else {
        bodyData.country_code = userData?.UserProfile?.mobile_country_code;
        bodyData.phone_number = userData?.UserProfile?.mobile_no;
      }
      const response = await UserProfileServices.changeEmailPhoneService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setOtpShow(true);
        setAddData(bodyData);
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

  const reSendOtp = async () => {
    try {
      let bodyData;

      if (addData?.email) {
        bodyData = { type: "email", email: addData?.email };
      } else {
        bodyData = {
          type: "mobile",
          country_code: addData?.country_code,
          phone_number: addData?.phone_number,
        };
      }

      const response = await UserProfileServices.resendOTPProfileService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setCounter(60);
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

  const handleOtpShow = () => {
    setCallCounter(true);
    setOtpShow(true);
  };

  const onVerificationSubmit = async () => {
    setVerifyLoading(true);
    try {
      let otpValue = "";
      let bodyData;
      for (let key in otp) {
        if (key) {
          otpValue += otp[key];
        }
      }
      if (otpValue && otpValue.length === 6) {
        if (addData?.type === "email") {
          bodyData = { type: "email", email: addData?.email, otp: otpValue };
        } else {
          bodyData = {
            type: "mobile",
            country_code: addData?.country_code,
            phone_number: addData?.phone_number,
            otp: otpValue,
          };
        }
        let response;
        if (
          (!userData?.UserProfile?.email_verified &&
            !userData?.UserProfile?.email) ||
          (!userData?.UserProfile?.phone_verified &&
            !userData?.UserProfile?.mobile_no)
        ) {
          response = await UserProfileServices.verifyAddEmailPhoneService(
            bodyData
          );
        } else {
          response = await UserProfileServices.verifyChangeEmailPhoneService(
            bodyData
          );
        }
        const { success, message } = response;
        if (success === 1) {
          modalNotification({
            type: "success",
            message,
          });
          setOtpShow(false);
          setOtp({});
          dispatch(getProfile());
        } else {
          modalNotification({
            type: "error",
            message,
          });
        }
      } else {
        modalNotification({
          type: "error",
          message: t("validation.common.validOtp"),
        });
      }
    } catch (error) {
      logger(error);
    }
    setVerifyLoading(false);
  };

  const handleAddMoblieEmailShow = (check) => {
    setAddChangeEmailPhoneCheck({
      type: check,
      useFor: "add",
    });
    // if (check === "email") setAddPhoneEmail(true);
    // else setAddPhoneEmail(false);
    setAddPhoneEmailShow(true);
  };
  const onAddEmailPhone = async (value) => {
    setAddPhoneEmailLoading(true);
    try {
      let bodyData;
      if (value?.email) {
        bodyData = { type: "email", email: value?.email };
      } else {
        bodyData = {
          type: "mobile",
          country_code: value?.country_code,
          phone_number: value?.phone_number,
        };
      }

      const response = await UserProfileServices.addEmailPhoneService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        // setOtpShow(true);
        handleOtpShow();
        setAddData(bodyData);
        setAddPhoneEmailShow(false);
        // setCallCounter(true);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setAddPhoneEmailLoading(false);
  };
  const onAddStateSubmit = async (values) => {
    let bodyData = { ...values };
    bodyData.full_name = `${values?.first_name} ${values?.last_name}`;
    delete bodyData.first_name;
    delete bodyData.last_name;
    bodyData.dob = dateFormatter(values?.dob, "YYYY-MM-DD");
    bodyData.username = userData.username;
    const response = await UserAuthServices.updateDetailService(bodyData);
    const { success, message } = response;
    if (success === 1) {
      modalNotification({
        type: "success",
        message,
      });
      dispatch(getProfile());
      setAddStateShow(false);
    } else {
      modalNotification({
        type: "error",
        message,
      });
    }
  };
  const onBusinessSubmit = async (val) => {
    setBusinessLoader(true);
    try {
      let bodyData = { ...val };
      delete bodyData.isGST;
      const response = await UserProfileServices.addBusinessAccountService(
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });

        setBusinessAccount(false);
        dispatch(getProfile());
        dispatch(getUserAccount());
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setBusinessLoader(false);
  };

  return (
    <>
      <div className="paymentMethod">
        <section className="paymentMode py-70">
          <Container>
            <div className="paymentMode_inner verticalTabs">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey="paymentOption"
              >
                <Row className="justify-content-center">
                  <Col lg={10}>
                    <h1 className="backheading font-eb">
                      <Link to={userRoutesMap.PURCHASE_PLAN.path}>
                        <em className="icon-arrow-back" />
                      </Link>
                      {t("text.userPayment.paymentSummary")}
                    </h1>
                    <div className="paymentMode_cnt customCard">
                      <h3 className="font-eb mb-2 mb-xl-3">
                        {t("text.planAndSubscription.paymentmethod")}
                      </h3>
                      <div className="paymentSec">
                        <PaymentFrom
                          onFormSubmit={onFormSubmit}
                          loading={loading}
                          formRef={formRef}
                          planDetails={planDetails}
                          setCheckCoin={setCheckCoin}
                          getPrice={getPrice}
                          availableCoin={availableCoin}
                          pageData={pageData}
                          userData={userData}
                          documentType={documentType}
                          setCategory={setCategory}
                          setDocumentType={setDocumentType}
                          onVerifyClick={onVerifyClick}
                          handleAddMoblieEmailShow={handleAddMoblieEmailShow}
                          taxes={taxes}
                          taxesPercentage={taxesPercentage}
                          countryList={countryList}
                          stateList={stateList}
                          createBusinessAccount={createBusinessAccount}
                          setNoLicenses={setNoLicenses}
                          noLicensesPrice={noLicensesPrice}
                          handleCouponShow={handleCouponShow}
                          coupanAmount={coupanAmount}
                          setCoupanAmount={setCoupanAmount}
                          coinsLimit={coinsLimit}
                          handleStateShow={handleStateShow}
                        />
                      </div>
                      {planDetails?.is_corporate !== "1" && (
                        <div className="text-center mt-4 mt-xxl-5">
                          <p className="mb-0 text-secondary">
                            Purchased plan can be cancelled within 7 days to get
                            full refund{" "}
                          </p>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </Container>
        </section>
      </div>
      <ModalComponent
        show={addPhoneEmailShow}
        modalExtraClass="noHeader"
        onHandleVisible={handleAddMoblieEmailShow}
        onHandleCancel={handleClose}
        title=""
        size="md"
      >
        <AddEmailForm
          onSubmit={onAddEmailPhone}
          loading={addPhoneEmailLoading}
          addChangeEmailPhoneCheck={addChangeEmailPhoneCheck}
          handleClose={handleClose}
          // countryLoader={countryLoader}
          // formRef={formRef}
          countryList={countryList}
        />
      </ModalComponent>
      <ModalComponent
        show={addStateShow}
        modalExtraClass="noHeader"
        onHandleVisible={handleStateShow}
        onHandleCancel={handleClose}
        title=""
        size="lg"
      >
        <AddStateForm
          onSubmit={onAddStateSubmit}
          loading={addPhoneEmailLoading}
          handleClose={handleClose}
          countryList={countryList}
          userData={userData}
          stateList={stateList}
          languageDetails={languageDetails}
          genderList={genderList}
        />
      </ModalComponent>
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
      <ModalComponent
        show={cashdropModal}
        size="sm"
        modalExtraClass="noHeader paymentModal"
        onHandleCancel={() => setCashdropModal(false)}
        // closeButton={false}
      >
        <div
          className={`dropin-parent ${
            dropClass[formRef?.current?.values?.payment_type]
          }`}
          id="drop_in_container"
          ref={dropModal}
        >
          <GlobalLoader />
        </div>
      </ModalComponent>
      <ModalComponent
        show={otpShow}
        modalExtraClass="noHeader"
        onHandleVisible={handleOtpShow}
        onHandleCancel={handleClose}
        title=""
        size="md"
      >
        <VerificationForm
          profileData={userData}
          onSubmit={onVerificationSubmit}
          otp={otp}
          setOtp={setOtp}
          // checkEmailPhone={changeEmail}
          handleClose={handleClose}
          addChange
          addData={addData}
          addEmail={addData?.type === "email"}
          loading={verifyLoading}
          counter={counter}
          reSendOtp={reSendOtp}
        />
      </ModalComponent>
      <ModalComponent
        show={businessAccount}
        modalExtraClass="noHeader"
        onHandleVisible={createBusinessAccount}
        onHandleCancel={handleClose}
        title=""
        size="lg"
      >
        <div className="modalHeader">
          <h3> {t("text.userProfile.createBusinessAccount")}</h3>
        </div>
        <UserBusinessForm
          onSubmit={onBusinessSubmit}
          loading={businessLoader}
          countryList={countryList}
          handleClose={handleClose}
          state={stateList}
        />
      </ModalComponent>
      <ModalComponent
        show={coupon}
        modalExtraClass="noHeader couponModal"
        onHandleVisible={handleCouponShow}
        onHandleCancel={handleClose}
        title=""
        size="lg"
      >
        <CoupanCodeForm
          coupanPrice={coupanPrice}
          setCoupanAmount={setCoupanAmount}
          onSubmit={(val) => {
            setCoupanAmount(val?.coupanData);
            handleClose();
          }}
          planDetails={planDetails}
        />
      </ModalComponent>
    </>
  );
}

export default React.memo(PaymentMethod);
