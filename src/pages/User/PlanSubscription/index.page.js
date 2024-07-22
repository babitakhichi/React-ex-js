import { t } from "i18next";
import React, { useState, useEffect } from "react";

import { Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { SweetAlert, VerticalTabs } from "../../../components";
import { selectUserData } from "../../../redux/AuthSlice/index.slice";
import {
  getUserSubscription,
  selectUserAccountData,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import { PaymentServices, TransactionHistoryServices } from "../../../services";
// import userRoutesMap from "../../../routeControl/userRoutes";
import {
  getActiveAccount,
  getIscorporateActive,
  // dateNewFormatter,
  logger,
  modalNotification,
  // momentDateFormatter,
  validSubscriptionSwitch,
} from "../../../utils";
import BillingHistory from "./BillingHistory";
import SubscriptionPlan from "./SubscriptionPlan";
import CorporateSubscriptionPlan from "./CorporateSubscriptionPlan";

function PlanSubscription() {
  const dispatch = useDispatch();
  const account = useSelector(selectUserAccountData);
  const [isCancelAlertVisible, setIsCancelAlertVisible] = useState(false);
  const [billingHistoryData, setBillingHistoryData] = useState([]);
  const [noOfPage, setNoOfPage] = useState(0);
  const [count, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState({});
  const sizePerPage = 10;
  const [page, setPage] = useState(1);
  let user = useSelector(selectUserData);
  const [defaultKey, setDefaultKey] = useState("subscriptionPlans");
  const [cancelLoading, setCancelLoading] = useState(false);
  const [disableLoading, setDisableLoading] = useState(false);
  const userAccounts = useSelector(selectUserAccountData);
  const [disableRenewalAlertVisible, setDisableRenewalAlertVisible] =
    useState(false);
  const onDisableConfirmAlert = async () => {
    setDisableLoading(true);
    try {
      let bodyData = {
        subReferenceId: planData?.subReference_id,
      };
      const res = await PaymentServices.autoRenewUpdateService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        let activeAccount = getActiveAccount(userAccounts);
        let queryParams = {
          is_corporate: getIscorporateActive(account),
          corporate_id:activeAccount?.id
        };
        dispatch(getUserSubscription({ queryParams }));
        setDisableRenewalAlertVisible(false);

        return true;
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setDisableLoading(false);
  };
  const goToPage = (pageNo) => {
    setPage(pageNo);
    window.scrollTo(0, 0);
  };

  const getTransactionHistoryList = async () => {
    setLoading(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        user: user?.user_id,
        is_corporate:getIscorporateActive(userAccounts) 
      };
      const res =
        await TransactionHistoryServices.getTransactionHistoryListService({
          queryParams,
        });
      const { success, data, message } = res;
      if (success === 1) {
        setBillingHistoryData(data?.rows);
        // getCsvData(data?.rows);
        setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1);
        setTotalCount(data?.count);
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
  useEffect(() => {
    getTransactionHistoryList();
  }, [page,userAccounts]);

  const planSubscriptions = [
    {
      name: t("text.planAndSubscription.subscriptionPlan"),
      key: "subscriptionPlans",
      content: (getIscorporateActive(userAccounts) ?
        <CorporateSubscriptionPlan />
        :
        <SubscriptionPlan
          setDisableRenewalAlertVisible={setDisableRenewalAlertVisible}
          setIsCancelAlertVisible={setIsCancelAlertVisible}
          setPlanData={setPlanData}
        />
      ),
      icon: "icon-star",
    },
    {
      name: t("text.planAndSubscription.billingHistory"),
      key: "billingHistory",
      content: (
        <BillingHistory
          billingHistoryData={billingHistoryData}
          page={page}
          goToPage={goToPage}
          noOfPage={noOfPage}
          sizePerPage={sizePerPage}
          count={count}
          loading={loading}
        />
      ),
      icon: "icon-card",
    },
  ];

  const onCancelConfirmAlert = async () => {
    setCancelLoading(true);
    try {
      let bodyData = {
        refund_order_id: planData?.order_id,
        refund_amount: planData?.order_amount,
        isRefund: validSubscriptionSwitch(planData?.first_charge_date),
      };
      const res = await PaymentServices.orderCancelService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        let activeAccount = getActiveAccount(account);
        let queryParams = {
          is_corporate: getIscorporateActive(account),
          corporate_id:activeAccount?.id
        };
        dispatch(getUserSubscription({ queryParams }));
        setIsCancelAlertVisible(false);

        return true;
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }

    setCancelLoading(false);
  };

  return (
    <>
      <div className="subscriptionPage">
        <section className="planSubscription py-70">
          <Container>
            <h1 className="backheading font-eb">
              <Link to={userRoutesMap.USER_DASHBOARD.path}>
                <em className="icon-arrow-back" />
              </Link>
              {t("text.planAndSubscription.title")}
            </h1>
            <div className="planSubscription_inner">
              <VerticalTabs
                tabContent={planSubscriptions}
                tabsFor="payment"
                activeKey={defaultKey}
                setActiveKey={setDefaultKey}
                verticalTabsDivClass="verticalTabs"
              />
            </div>
          </Container>
        </section>
      </div>
      <SweetAlert
        title={t("text.planAndSubscription.wantToCancle")}
        // text={`Cancellation will be effective at the end of your billing cycle on ${dateNewFormatter(
        //   planData?.expires_on,
        //   "YYYY-MM-DD",
        //   "DD MMM YYYY"
        // )}. Restart your membership anytime.`}
        text="Cancellation will be immediate however you can continue to enjoy the services till the end of billing cycle. Restart your membership anytime. T&C apply!"
        show={isCancelAlertVisible}
        icon="warning"
        showCancelButton
        cancelButtonText={t("text.common.no")}
        confirmButtonText={t("text.common.yes")}
        setIsAlertVisible={setIsCancelAlertVisible}
        showLoaderOnConfirm
        loading={cancelLoading}
        onConfirmAlert={onCancelConfirmAlert}
      />
      <SweetAlert
        title={t("text.planAndSubscription.sure")}
        text={t("text.planAndSubscription.disableRenewal")}
        show={disableRenewalAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setDisableRenewalAlertVisible}
        showLoaderOnConfirm
        loading={disableLoading}
        onConfirmAlert={onDisableConfirmAlert}
      />
    </>
  );
}

export default PlanSubscription;
