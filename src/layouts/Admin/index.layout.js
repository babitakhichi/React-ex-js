import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { selectUserData } from "../../redux/AuthSlice/index.slice";
import {
  getCmsList,
  getCountryList,
  getLanguageList,
  selectCmsData,
  selectCountryData,
  selectLanguageData,
} from "../../redux/UserSlice/index.slice";
// import { AppLayout } from "..";
import "../../styles/scss/admin/admin.scss";
// import { decodeQueryData, navigateWithParam } from "../../utils";

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const dispatch = useDispatch();
  const countryList = useSelector(selectCountryData);
  const cmsList = useSelector(selectCmsData);
  const userData = useSelector(selectUserData);
  const languageList = useSelector(selectLanguageData);

  useEffect(() => {
    let pathPattern = /[ ]$/g;
    if (pathPattern.test(pathname)) {
      navigate(pathname.replace(pathPattern, ""), { replace: true });
    }
    if (countryList?.length === 0) {
      dispatch(getCountryList());
    }
    if (userData?.jwt && cmsList?.length === 0) {
      dispatch(getCmsList());
    }
    if (languageList?.length === 0) {
      dispatch(getLanguageList());
    }
  }, [pathname]);

  return <Outlet />;
}

export default AdminLayout;
