import { createSlice } from "@reduxjs/toolkit";
import {
  CommonServices,
  TranslateServices,
  UserHomeServices,
  UserProfileServices,
} from "../../services";
import {
  getActiveAccount,
  getIscorporateActive,
  getUniqueListBy,
  modalNotification,
} from "../../utils";
import logger from "../../utils/logger";

export const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profileData: {},
    languageList: [],
    countryList: [],
    cmsList: [],
    subscriptionData: [],
    userAccount: [],
    stateList: [],
    appVersion: { version: 0, refresh: false },
  },
  reducers: {
    profileAction: (state, action) => {
      return (state = {
        ...state,
        profileData: { ...action.payload },
      });
    },
    userAccountAction: (state, action) => {
      return (state = {
        ...state,
        userAccount: [...action.payload],
      });
    },
    languageAction: (state, action) => {
      return (state = {
        ...state,
        languageList: [...action.payload],
      });
    },
    countryAction: (state, action) => {
      return (state = {
        ...state,
        countryList: [...action.payload],
      });
    },
    stateAction: (state, action) => {
      return (state = {
        ...state,
        stateList: [...action.payload],
      });
    },
    cmsAction: (state, action) => {
      return (state = {
        ...state,
        cmsList: [...action.payload],
      });
    },
    subscriptionAction: (state, action) => {
      return (state = {
        ...state,
        subscriptionData: [...action.payload],
      });
    },
    removeSubscriptionAction: (state) => {
      return (state = {
        ...state,
        subscriptionData: [],
      });
    },
    updateAppVersionAction: (state, action) => {
      return (state = {
        ...state,
        appVersion: { ...action.payload },
      });
    },
  },
});

export const {
  profileAction,
  languageAction,
  countryAction,
  cmsAction,
  subscriptionAction,
  removeSubscriptionAction,
  userAccountAction,
  stateAction,
  updateAppVersionAction,
} = profileSlice.actions;

export const getProfile = () => async (dispatch) => {
  try {
    let res = await UserProfileServices.getDetailsService();
    const { data, success, message } = res;
    if (success === 1) {
      let resData = data;
      if (data?.country_code) {
        resData.country_code = data?.country_code?.includes("+")
          ? data?.country_code
          : `+${data?.country_code}`;
      }
      dispatch(profileAction(resData));
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

export const getLanguageList = () => async (dispatch) => {
  try {
    // let queryParams = { platform: "api" };
    const res = await TranslateServices.languageListingService({
      // queryParams,
    });
    // const { result } = res;
    // if (result?.length > 0) {
    //   let data = getUniqueListBy(result, "code_alpha_1");
    //   dispatch(languageAction(data));
    // }
    if (res?.data?.length > 0 && res?.status === "success") {
      let data = getUniqueListBy(res?.data, "code_alpha_1");
      dispatch(languageAction(data));
    }
  } catch (error) {
    logger(error);
  }
};

export const getCountryList = () => async (dispatch) => {
  try {
    let res = await CommonServices.countries();
    const { data, success, message } = res;
    if (success === 1) {
      dispatch(countryAction(data.rows));
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
export const getStateList = () => async (dispatch) => {
  try {
    let res = await CommonServices.stateList();
    const { data, success, message } = res;
    if (success === 1) {
      dispatch(stateAction(data?.rows));
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
export const getCmsList = () => async (dispatch) => {
  try {
    let res = await CommonServices.getAllCmsService();
    const { data, success, message } = res;
    if (success === 1) {
      dispatch(cmsAction(data));
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
export const updateProfile = (data) => async (dispatch) => {
  try {
    dispatch(profileAction(data));
  } catch (error) {
    logger(error);
  }
};

export const updateLanguageList = (data) => async (dispatch) => {
  try {
    dispatch(languageAction(data));
  } catch (error) {
    logger(error);
  }
};

export const updateCountryList = (data) => async (dispatch) => {
  try {
    dispatch(countryAction(data));
  } catch (error) {
    logger(error);
  }
};
export const updateCmsList = (data) => async (dispatch) => {
  try {
    dispatch(cmsAction(data));
  } catch (error) {
    logger(error);
  }
};

export const getUserSubscription =
  ({ queryParams }) =>
  async (dispatch) => {
    try {
      let res = await UserHomeServices.userActiveSubscriptionListingService({
        queryParams,
      });
      const { data, success, message } = res;
      if (success === 1) {
        dispatch(subscriptionAction(data));
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

export const updateUserSubscription = (data) => async (dispatch) => {
  try {
    // let res = await UserHomeServices.userActiveSubscriptionListingService({});
    // const { data, success } = res;
    // if (success === 1) {
    dispatch(subscriptionAction(data));
    // }
  } catch (error) {
    logger(error);
  }
};

export const removeUserSubscription = () => async (dispatch) => {
  try {
    // let res = await UserHomeServices.userActiveSubscriptionListingService({});
    // const { data, success } = res;
    // if (success === 1) {
    dispatch(removeSubscriptionAction());
    // }
  } catch (error) {
    logger(error);
  }
};

export const updateUserAccount = (bodyData) => async (dispatch) => {
  try {
    const res = await UserProfileServices.updateAccountStatusService({
      bodyData,
    });
    const { data, success, message } = res;
    if (success === 1) {
      dispatch(userAccountAction(data));
      let activeAcc = getActiveAccount(data);
      let queryParams = {
        is_corporate: getIscorporateActive(data),
        corporate_id: activeAcc?.id,
      };
      dispatch(getUserSubscription({ queryParams }));
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
export const getUserAccount = () => async (dispatch) => {
  try {
    const res = await UserProfileServices.getAccountService();
    const { data, success, message } = res;
    if (success === 1) {
      dispatch(userAccountAction(data));
      const check = data?.find((acc) => acc?.status === "1");
      if (data?.length > 1 && check === undefined) {
        const checkData = data?.find(
          (acc) => acc?.account === "Personal Account"
        );
        dispatch(updateUserAccount(checkData));
      }
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
export const updateAppVersion = (data) => async (dispatch) => {
  try {
    dispatch(updateAppVersionAction(data));
  } catch (error) {
    logger(error);
  }
};

export const updateUserAccountData = (data) => async (dispatch) => {
  try {
    dispatch(userAccountAction(data));
  } catch (error) {
    logger(error);
  }
};

export const selectProfileData = (state) => state.profile.profileData;
export const selectLanguageData = (state) => state.profile.languageList;
export const selectCountryData = (state) => state.profile.countryList;
export const selectCmsData = (state) => state.profile.cmsList;
export const selectSubscriptionData = (state) => state.profile.subscriptionData;
export const selectUserAccountData = (state) => state.profile.userAccount;
export const selectStateData = (state) => state.profile.stateList;
export const selectAppVersionData = (state) => state.profile.appVersion;
export default profileSlice.reducer;
