import { t } from "i18next";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { SweetAlert } from "../../../components";
import {
  getUserSubscription,
  selectUserAccountData,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import {
  getActiveAccount,
  getIscorporateActive,
  getLocalStorage,
  removeLocalStorage,
} from "../../../utils";

function PaymentSuccess() {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const planDetails = getLocalStorage("plan");
  const account = useSelector(selectUserAccountData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (planDetails === false) {
      navigate(userRoutesMap.PURCHASE_PLAN.path);
    } else {
      setIsAlertVisible(true);
      const activeAcc = getActiveAccount(account);
      let queryParams = {
        is_corporate: getIscorporateActive(account),
        corporate_id:activeAcc?.id
      };
      dispatch(getUserSubscription({ queryParams }));
      removeLocalStorage("plan");
    }
  }, []);

  const onConfirm = () => {
    setIsAlertVisible(false);
    navigate(userRoutesMap.PLAN_SUBSCRIPTION.path);
    return true;
  };

  return (
    <div>
      <SweetAlert
        reverseButtons
        icon="success"
        confirmButtonColor="#ea4c89"
        title={t("text.userPayment.paymentSucessfull")}
        // text={t("text.common.deleteTreatment")}
        setIsAlertVisible={setIsAlertVisible}
        // cancelButtonText=""
        // confirmButtonText=
        // onConfirmAlert={handleDelete}
        show={isAlertVisible}
        // showLoaderOnConfirm
        // loading={loading}
        onConfirmAlert={onConfirm}
      />
    </div>
  );
}

export default PaymentSuccess;
