import React, {
  useEffect,
  useState, // useEffect,
} from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

// import { AppLayout } from "..";
import { Header, Footer } from "../../components";
import { selectUserData } from "../../redux/AuthSlice/index.slice";
import { moduleRoutesList } from "../../routes/index";
import AppLayout from "../Auth/index.layout";

function PrivateLayout() {
  const userData = useSelector(selectUserData);
  // let routeList = moduleRoutesList();

  const navigate = useNavigate();
  const [redirectpath, setRedirectPath] = useState("");

  useEffect(() => {
    if (redirectpath) {
      navigate(redirectpath);
    }
  }, [redirectpath]);

  const location = useLocation();
  const { pathname } = location;
  let path = pathname.replace("/", "");
  path = path === "" ? "home" : path;
  path = path.includes("invitee") ? "invitee" : path;
  path = path.includes("meeting") ? "invitee" : path;
  useEffect(() => {
    const mainCnt = document.querySelector(".mainContent");
    if (["home"].includes(path)) {
      mainCnt?.classList.add("bg-white");
    } else {
      mainCnt?.classList.remove("bg-white");
    }
  });

  const getmoduleRoutesList = moduleRoutesList();
  let user = "user";

  useEffect(() => {
    if (JSON.stringify(userData) !== "{}")
      setTimeout(() => {
        let navbar = document.querySelector(".navbar");
        let footer = document.querySelector(".footerSec");
        let navbarHeight = navbar?.clientHeight;
        let footerHeight = footer?.clientHeight;
        document.querySelector(".mainContent").style.minHeight = `${
          window.innerHeight - (navbarHeight + footerHeight)
        }px`;
      }, 300);
  }, []);

  return (
    <AppLayout setRedirectPath={setRedirectPath}>
      <div className="mainBody">
        {path === "invitee" ? (
          <div className="mainContent">
            <Outlet />
          </div>
        ) : (
          <>
            <Header routes={getmoduleRoutesList?.[user]} />

            <div className="mainContent">
              <Outlet />
            </div>
            <Footer routes={getmoduleRoutesList?.[user]} />
          </>
        )}
      </div>
    </AppLayout>
  );
}

export default PrivateLayout;
