import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/scss/frontend/frontend.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  getCountryList,
  selectCountryData,
} from "../../redux/UserSlice/index.slice";
// import { AppLayout } from "..";
// import { decodeQueryData, navigateWithParam } from "../../utils";

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const dispatch = useDispatch();
  const countryList = useSelector(selectCountryData);

  useEffect(() => {
    window.scrollTo(0, 0);
    let pathPattern = /[ ]$/g;
    if (pathPattern.test(pathname)) {
      navigate(pathname.replace(pathPattern, ""), { replace: true });
    }
    if (countryList?.length === 0) {
      dispatch(getCountryList());
    }
  }, [pathname]);

  return <Outlet />;
}

export default UserLayout;
