// import { t } from "i18next";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Dropdown,
  Nav,
  // Nav,
  Navbar,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";
import { GlobalLoader, SweetAlert } from "..";
import { logout, selectUserData } from "../../../redux/AuthSlice/index.slice";
import {
  getUserAccount,
  removeUserSubscription,
  selectAppVersionData,
  selectProfileData,
  selectSubscriptionData,
  selectUserAccountData,
  updateAppVersion,
  updateLanguageList,
  updateProfile,
  updateUserAccount,
  updateUserAccountData,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import {
  NotificationServices,
  UserAuthServices,
  UserServices,
} from "../../../services";
import {
  getActiveAccount,
  getIscorporateActive,
  logger,
  modalNotification,
  totalTimeDifference,
} from "../../../utils";
import ImageElement from "../ImageElement";
import {
  commasFormatter,
  statusFormatter,
  textFormatter,
} from "../../Formatter";
import ModalComponent from "../Modal";
// import { Link, useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";
// import routesMap from "../../../routeControl/userRouteMap";
// import { getHeaderData, getLocalStorageToken } from "../../../utils";
// import ImageElement from "../ImageElement";
// import { selectUserData } from "../../../redux/AuthSlice/index.slice";
// import HeaderDropdownMenu from "../HeaderDropdown";
// import moduleRoutesMap from "../../../routeControl";
// import userRoutesMap from "../../../routeControl/userRoutes";

function Header() {
  const [scroll, setScroll] = useState(0);
  const [home, setHome] = useState(false);
  const userData = useSelector(selectUserData);
  const { jwt } = userData;
  const profileData = useSelector(selectProfileData);
  const userAccountData = useSelector(selectUserAccountData);
  let planList = useSelector(selectSubscriptionData);
  const [notificationList, setNotificationList] = useState([]);
  const [notificationCount, setNotificationCount] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const appVersion = useSelector(selectAppVersionData);
  const [showAccount, setShowAccount] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  let dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [headerHeight, setHeaderHeight] = useState(80);
  // const [activeTab, setActiveTab] = useState("home");
  // const location = useLocation();
  // const { pathname } = location;
  // const headerData = getHeaderData(routes);
  const [accountName, setAccountName] = useState(
    userAccountData?.find((acc) => acc?.status === "1")?.account
  );
  const [isGuest, setIsGuest] = useState(false);
  const [planInfo, setPlanInfo] = useState(false);
  const [existingPlanModal, setExistingPlanModal] = useState(false);
  const [corporatePlanList, setCorporatePlanList] = useState({});
  const [corporateLoader, setCorporateLoader] = useState(false);
  const handleExistingPlanModalShow = () => setExistingPlanModal(true);
  const handleExistingPlanModalClose = () => setExistingPlanModal(false);
  const [appVersionNew, setAppVersionNew] = useState(0);
  // const [expanded, setExpanded] = useState("");
  // const userData = useSelector(selectUserData);
  // const userToken = getLocalStorageToken();

  // useEffect(() => {
  //   setExpanded("");
  //   setShow(false);
  // }, [pathname]);

  // const dropDownList = [
  //   {
  //     label: "My Profile",
  //     path: moduleRoutesMap?.[userData?.user_type]?.PROFILE?.path,
  //   },
  //   {
  //     label: "My Message",
  //     path: moduleRoutesMap?.[userData?.user_type]?.MY_MESSAGE?.path,
  //     // path: moduleRoutesMap?.[userData?.user_type]?.PROVIDER_MESSAGE?.path,
  //   },
  //   {
  //     label: "Logout",
  //     path: "#",
  //     onClick: (e) => {
  //       e.preventDefault();
  //     },
  //   },
  // ];

  // useEffect(() => {
  //   setTimeout(() => {
  //     let navbar = document.querySelector(".navbar").clientHeight;
  //     document.querySelector(".mainHeader").style.paddingTop = `${navbar}px`;
  //   }, 300);
  // }, []);

  // const scrollHandler = () => {
  //   let homePage = document.getElementById("home");
  //   let about = document.getElementById("about");
  //   let weOffer = document.getElementById("weOffer");
  //   let ourTeam = document.getElementById("team");
  //   let howItWorks = document.getElementById("howItWorks");
  //   let pricing = document.getElementById("pricing");

  //   let posMenu = window.pageYOffset + headerHeight;

  //   let posHome = homePage?.offsetTop + homePage?.offsetHeight;
  //   let posAbout = about?.offsetTop + about?.offsetHeight;
  //   let posWeOffer = weOffer?.offsetTop + weOffer?.offsetHeight;
  //   let posOurTeam = ourTeam?.offsetTop + ourTeam?.offsetHeight;
  //   let posHowItWorks = howItWorks?.offsetTop + howItWorks?.offsetHeight;
  //   let posPricing = pricing?.offsetTop + pricing?.offsetHeight;

  //   let distanceHome = posHome - posMenu;
  //   let distanceAbout = posAbout - posMenu;
  //   let distanceWeOffer = posWeOffer - posMenu;
  //   let distanceOurTeam = posOurTeam - posMenu;
  //   let distanceHowItWorks = posHowItWorks - posMenu;
  //   let distancePricing = posPricing - posMenu;

  //   let min = Math.min(
  //     ...[
  //       distanceHome,
  //       distanceAbout,
  //       distanceWeOffer,
  //       distanceOurTeam,
  //       distanceHowItWorks,
  //       distancePricing,
  //     ].filter((num) => num > 0)
  //   );

  //   if (min === distanceHome) setActiveTab("home");
  //   if (min === distanceAbout) setActiveTab("about");
  //   if (min === distanceWeOffer) setActiveTab("weOffer");
  //   if (min === distanceOurTeam) setActiveTab("team");
  //   if (min === distanceHowItWorks) setActiveTab("howItWorks");
  //   if (min === distancePricing) setActiveTab("pricing");
  // };

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 50;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
        // scrollHandler();
      }
    });
  }, []);

  const location = useLocation();
  const { pathname } = location;
  let path = pathname.replace("/", "");
  path = path === "" ? "home" : path;
  useEffect(() => {
    let navbar = document.querySelector(".navbar");
    setHeaderHeight(navbar?.clientHeight);
    if (["home"].includes(path)) {
      setHome(true);
      document.querySelector(".mainHeader").style.paddingTop = "0";
    } else {
      setHome(false);
      setTimeout(() => {
        let navbarHeight = navbar?.clientHeight;
        document.querySelector(
          ".mainHeader"
        ).style.paddingTop = `${navbarHeight}px`;
      }, 300);
    }
  });

  const accountLogout = async () => {
    try {
      const response = await UserAuthServices.logoutService();
      const { message } = response;
      dispatch(logout(navigate, userData?.userRole));
      dispatch(updateProfile({}));
      dispatch(removeUserSubscription());
      dispatch(updateLanguageList([]));
      dispatch(updateUserAccountData([]));
      modalNotification({
        type: "success",
        message: message || "Logout successful",
      });
    } catch (error) {
      logger(error);
    }
  };

  const getNotificationCount = async () => {
    try {
      let queryParams = {
        type: "customer",
      };
      const res = await NotificationServices.unreadCountService({
        queryParams,
      });
      const { data, success } = res;
      if (success === 1) {
        setNotificationCount(data?.count);
        setAppVersionNew(data?.app_version);
        if (
          data?.app_version !== appVersion?.version &&
          appVersion?.version !== 0
        ) {
          setIsAlertVisible(true);
        } else {
          setIsAlertVisible(false);
        }
      }
    } catch (error) {
      logger(error);
    }
  };
  const handleRead = async () => {
    // setNotificationLoading(true);

    try {
      let bodyData = { type: "customer" };
      const response = await NotificationServices.readNotificationsService(
        bodyData
      );
      const { success } = response;
      if (success === 1) {
        getNotificationCount();
      }
    } catch (error) {
      logger(error);
    }
    // setNotificationLoading(false);
  };

  const handlenotificationList = async () => {
    setLoading(true);
    try {
      let queryParams = {
        type: "customer",
      };
      const response = await NotificationServices.getNotificationListService({
        queryParams,
      });
      const { success, data } = response;
      if (success === 1) {
        setNotificationList(data?.rows);
      }
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };
  const handleCorporatePlanList = async () => {
    setCorporateLoader(true);
    try {
      let queryParams = {
        user_id: profileData?.id,
      };
      const response = await UserServices.corporatePlanListService({
        queryParams,
      });
      const { success, data } = response;
      if (success === 1) {
        setCorporatePlanList(data);
      }
    } catch (error) {
      logger(error);
    }
    setCorporateLoader(false);
  };
  useEffect(() => {
    if (jwt) {
      handlenotificationList();
      getNotificationCount();
      const interval = setInterval(() => {
        getNotificationCount();
      }, 20000);
      return () => clearInterval(interval);
    }
  }, []);
  const notificationRef = useRef();
  const accountRef = useRef();
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        show &&
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [show]);
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        showAccount &&
        accountRef.current &&
        !accountRef.current.contains(e.target)
      ) {
        setShowAccount(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showAccount]);

  useEffect(() => {
    setShow(false);
    setShowAccount(false);
  }, [location]);
  const redirectNotification = (data) => {
    let pathObject;
    if (accountName?.includes("(Guest)")) {
      pathObject = {
        userPlanExpired: userRoutesMap.USER_DASHBOARD.path,
        userSubscription: userRoutesMap.USER_DASHBOARD.path,
        userSubscriptionFail: userRoutesMap.USER_DASHBOARD.path,
        userSignup: userRoutesMap.USER_DASHBOARD.path,
      };
    } else {
      pathObject = {
        userPlanExpired: userRoutesMap.PLAN_SUBSCRIPTION.path,
        userSubscription: userRoutesMap.PLAN_SUBSCRIPTION.path,
        userSubscriptionFail: userRoutesMap.PLAN_SUBSCRIPTION.path,
        userSignup: userRoutesMap.USER_DASHBOARD.path,
      };
    }

    navigate(pathObject?.[data?.type]);
  };

  useEffect(() => {
    if (show) {
      handlenotificationList();
    }
  }, [show]);
  useEffect(() => {
    if (showAccount) {
      dispatch(getUserAccount());
    }
  }, [showAccount]);

  const scrollToDiv = (id) => {
    let element = document.getElementById(id);
    setTimeout(() => {
      window.scrollTo({
        top: element?.offsetTop - headerHeight,
        behavior: "smooth",
      });
      // setActiveTab(id);
    }, 500);
  };

  useEffect(() => {
    if (location.state) {
      scrollToDiv(location?.state?.tab);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const navData = useMemo(() => {
    return {
      home: {
        section: "home",
        title: t("text.aboutUs.metaTitle"),
      },
      // about: {
      //   section: "about",
      //   title: t("text.aboutUs.heading"),
      // },
      weOffer: {
        section: "weOffer",
        title: t("text.aboutUs.solutionsWeOffer"),
      },
      pricing: {
        section: "pricing",
        title: t("text.aboutUs.pricing"),
      },
      howItWorks: {
        section: "howItWorks",
        title: "How It Works",
      },
      // team: {
      //   section: "team",
      //   title: t("text.aboutUs.ourTeam"),
      // },
    };
  }, []);

  const changeAccount = (item) => {
    navigate(userRoutesMap.USER_DASHBOARD.path);
    dispatch(updateUserAccount(item));
  };
  useEffect(() => {
    setIsGuest(accountName?.includes("(Guest)"));
    if (
      pathname === userRoutesMap.PLAN_SUBSCRIPTION.path &&
      accountName?.includes("(Guest)")
    )
      navigate(userRoutesMap.USER_DASHBOARD.path);
  }, [accountName]);

  useEffect(() => {
    const activeAccount = getActiveAccount(userAccountData);
    setAccountName(activeAccount?.account);
  }, [userAccountData]);
  const onConfirmAlert = () => {
    dispatch(updateAppVersion({ version: appVersionNew, refresh: false }));
    accountLogout();
    setTimeout(() => {
      window.location.reload(true);
    }, 2000);
    return true;
  };
  useEffect(() => {
    if (appVersion?.refresh === true) {
      setTimeout(() => {
        window.location.reload(true);
        dispatch(
          updateAppVersion({ version: appVersion?.version, refresh: false })
        );
      }, 2000);
    }
  }, []);
  return (
    <>
      <header className="mainHeader w-100">
        <Navbar
          fixed="top"
          className={`${home ? "" : "navbar-inner"} ${
            scroll ? "navbar-fixed" : ""
          }`}
          expand="lg"
        >
          <Container>
            <Link
              className="navbar-brand"
              to={
                userData?.jwt
                  ? userRoutesMap.USER_DASHBOARD.path
                  : userRoutesMap.HOME.path
              }
            >
              <img
                className="img-fluid"
                src="../assets/images/frontend/logo.svg"
                alt="logo"
              />
            </Link>
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            {!userData?.jwt && (
              <>
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav as="ul" className="m-auto">
                    <>
                      {Object.keys(navData)?.length > 0 &&
                        Object.keys(navData)?.map((item, key) => {
                          if (path === "home") {
                            return (
                              <>
                                {/* <li key={key}>
                                <Link
                                  className={`nav-link ${
                                    activeTab === navData?.[item]?.section
                                      ? "active"
                                      : ""
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    scrollToDiv(navData?.[item]?.section);
                                  }}
                                >
                                  {navData?.[item]?.title}
                                </Link>
                              </li> */}
                                <li>
                                  <LinkScroll
                                    className="nav-link"
                                    activeClass="active"
                                    to={navData?.[item]?.section}
                                    offset={-headerHeight}
                                    spy
                                    delay={0}
                                    smooth
                                    duration={300}
                                  >
                                    {navData?.[item]?.title}
                                  </LinkScroll>
                                </li>
                              </>
                            );
                          } else {
                            return (
                              <li key={key}>
                                <Link
                                  className="nav-link"
                                  to={userRoutesMap.HOME.path}
                                  state={{ tab: navData?.[item]?.section }}
                                >
                                  {navData?.[item]?.title}
                                </Link>
                              </li>
                            );
                          }
                        })}
                    </>
                    <li>
                      <Link
                        className={`nav-link ${
                          location.pathname === userRoutesMap.ABOUT_US.path
                            ? "active"
                            : ""
                        }`}
                        to={userRoutesMap.ABOUT_US.path}
                      >
                        {t("text.aboutUs.heading")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link ${
                          location.pathname === userRoutesMap.OUR_TEAM.path
                            ? "active"
                            : ""
                        }`}
                        to={userRoutesMap.OUR_TEAM.path}
                      >
                        {t("text.aboutUs.ourTeam")}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link ${
                          location.pathname === userRoutesMap.PARTNERS.path
                            ? "active"
                            : ""
                        }`}
                        to={userRoutesMap.PARTNERS.path}
                      >
                        Partners
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`nav-link ${
                          location.pathname ===
                          userRoutesMap.USER_CONTACT_US.path
                            ? "active"
                            : ""
                        }`}
                        to={userRoutesMap.USER_CONTACT_US.path}
                      >
                        {t("text.aboutUs.contactUs")}
                      </Link>
                    </li>
                  </Nav>
                </Navbar.Collapse>
                <Dropdown className="loginBtn ms-auto">
                  <Dropdown.Toggle
                    as="a"
                    className=" d-flex"
                    id="dropdown-basic"
                  >
                    <span className="icon-user-circle" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end">
                    <Link
                      className="dropdown-item"
                      to={userRoutesMap.LOGIN.path}
                    >
                      {t("text.aboutUs.signIn")}
                    </Link>
                    <Dropdown.Divider className="m-0" />
                    <Link
                      className="dropdown-item"
                      to={userRoutesMap.SIGNUP.path}
                    >
                      {t("text.aboutUs.signUp")}
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            {userData?.jwt && (
              <>
                <div
                  className={`planInfo d-flex font-sb ${
                    planInfo ? "show" : ""
                  }`}
                >
                  {accountName?.includes("(Business Account)") && (
                    <Link
                      className="planInfo_existing"
                      onClick={() => {
                        handleCorporatePlanList();
                        handleExistingPlanModalShow();
                      }}
                    >
                      {t("text.header.existingPlan")}
                    </Link>
                  )}
                  {!accountName?.includes("(Business Account)") &&
                    planList?.length > 0 && (
                      <p>
                        <span>{t("text.header.existingPlan")}:</span>
                        {commasFormatter(
                          planList?.map(
                            (plan) =>
                              `${textFormatter(
                                plan?.Subscription?.name
                              )} - ${statusFormatter(
                                plan?.Subscription?.plan_type
                              )}`
                          )
                        )}
                      </p>
                    )}
                  {!accountName?.includes("(Guest)") && (
                    <Link
                      to={userRoutesMap.PURCHASE_PLAN.path}
                      className="planInfo_other"
                    >
                      {t("text.header.exploreOtherPlans")}
                    </Link>
                  )}
                </div>
                <Link
                  className="planInfo_icon"
                  onClick={() => setPlanInfo(!planInfo)}
                >
                  <em className="icon-receipt" />
                </Link>
                <Dropdown
                  show={show}
                  className="notify ms-auto me-3"
                  ref={notificationRef}
                >
                  <Dropdown.Toggle
                    onClick={() => {
                      setShow(!show);
                    }}
                    as="a"
                    className="d-flex justify-content-center align-items-center p-0 position-relative"
                    id="dropdown-notify"
                  >
                    <em className="icon-notification" />
                    {notificationCount > 0 && (
                      <span className="badge position-absolute">
                        {" "}
                        {notificationCount}
                      </span>
                    )}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="dropdown-menu-end">
                    <ul className="notify_list list-unstyled mb-0 overflow-auto">
                      {loading ? (
                        <div className="py-3">
                          <GlobalLoader />
                        </div>
                      ) : notificationList.length > 0 ? (
                        notificationList.map((item) => {
                          return (
                            <li className="notify_list_item">
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleRead();
                                  redirectNotification(item);
                                  // navigate(routesMap.NOTIFICATIONS.path);
                                  // document.body.click();
                                }}
                                className={`d-flex align-items-stretch justify-content-start ${
                                  item?.receiverRead !== "read" ? "noRead" : ""
                                }`}
                              >
                                <div className="userImg me-2 flex-shrink-0">
                                  <img
                                    className="img-fluid"
                                    src="../assets/images/frontend/notifications.png"
                                    alt="profile"
                                  />
                                </div>
                                <div className="notifyMsg overflow-hidden">
                                  <h6 className="font-bd mb-0 text-black">
                                    {" "}
                                    {item?.title}
                                  </h6>
                                  <p className="mb-0 text-truncate">
                                    {" "}
                                    {item?.message}
                                  </p>
                                  <span>
                                    {" "}
                                    {totalTimeDifference(
                                      item?.createdAt,
                                      new Date()
                                    )}
                                  </span>
                                </div>
                              </Link>
                            </li>
                          );
                        })
                      ) : (
                        <div className="py-3 emptySec text-center w-100">
                          <ImageElement
                            source="no-notification.svg"
                            alt="No Data Found"
                          />
                          <h6>{t("text.common.noData")}</h6>
                        </div>
                      )}

                      {/* <li className="notify_list_item">
                        <Link className="d-flex align-items-stretch justify-content-start">
                          <div className="userImg me-2">
                            <img
                              className="img-fluid"
                              src="../assets/images/frontend/profile.jpg"
                              alt="profile"
                            />
                          </div>
                          <div className="notifyMsg">
                            <p className="mb-0">
                              Lorem ipsum dolor sit amet consec
                            </p>
                            <span>1 month ago</span>
                          </div>
                        </Link>
                      </li> */}
                    </ul>
                    {notificationList?.length > 0 && (
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRead();
                          navigate(userRoutesMap.NOTIFICATION.path);
                        }}
                        className="link-primary viewAll d-block text-center"
                      >
                        {t("text.common.viewAll")}
                      </Link>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
                <Dropdown
                  className="profile"
                  show={showAccount}
                  ref={accountRef}
                >
                  <Dropdown.Toggle
                    onClick={() => {
                      setShowAccount(!showAccount);
                    }}
                    as="a"
                    className="d-flex align-items-center"
                    id="dropdown-basic1"
                  >
                    <div className="profileImg">
                      {profileData?.UserProfile?.profile_img_url_full ? (
                        <ImageElement
                          previewSource={
                            profileData?.UserProfile?.profile_img_url_full
                          }
                        />
                      ) : (
                        <ImageElement source="/profile-img.jpg" />
                      )}
                    </div>
                    <div className="profileName">
                      <h6>{profileData?.UserProfile?.full_name}</h6>
                      {userAccountData?.length > 0 && (
                        <p>{textFormatter(accountName)}</p>
                      )}
                    </div>
                    {/* <span>{profileData?.UserProfile?.full_name}</span> */}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="dropdown-menu-end">
                    {userAccountData?.length > 0 && (
                      <>
                        {userAccountData?.map((item) => {
                          return (
                            <Link
                              className={`dropdown-item ${
                                item.account === accountName &&
                                " dropdown-item-active"
                              }`}
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                changeAccount(item);
                              }}
                            >
                              {textFormatter(item?.account)}
                            </Link>
                          );
                        })}{" "}
                        <Dropdown.Divider />
                      </>
                    )}

                    <Link
                      className="dropdown-item"
                      to={userRoutesMap.USER_ACCOUNT.path}
                      onClick={document.body.click()}
                    >
                      {t("text.common.myProfile")}
                    </Link>
                    {!isGuest && (
                      <Link
                        className="dropdown-item"
                        to={userRoutesMap.PLAN_SUBSCRIPTION.path}
                        onClick={document.body.click()}
                      >
                        {t("text.common.billingSubscription")}
                      </Link>
                    )}
                    {!getIscorporateActive(userAccountData) && (
                      <Link
                        className="dropdown-item"
                        to={userRoutesMap.REFER_FRIEND.path}
                        onClick={document.body.click()}
                      >
                        {t("text.header.referandEarn")}
                      </Link>
                    )}
                    <Link
                      className="dropdown-item"
                      to={userRoutesMap.USER_CONTACT_US.path}
                      onClick={document.body.click()}
                    >
                      {t("text.common.contactUs")}
                    </Link>
                    <Dropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to={userRoutesMap.HOME.path}
                      onClick={(e) => {
                        e.preventDefault();
                        accountLogout();
                      }}
                    >
                      {t("text.common.signOut")}
                    </Link>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            )}
            {!userData?.jwt && (
              <Navbar.Toggle aria-controls="basic-navbar-nav">
                <span className="navbar-toggler-icon" />
                <span className="navbar-toggler-icon" />
                <span className="navbar-toggler-icon" />
              </Navbar.Toggle>
            )}
          </Container>
        </Navbar>
      </header>
      <ModalComponent
        show={existingPlanModal}
        modalExtraClass="noHeader"
        onHandleVisible={handleExistingPlanModalShow}
        onHandleCancel={handleExistingPlanModalClose}
        title=""
        size="sm"
      >
        {corporateLoader ? (
          <GlobalLoader />
        ) : (
          <>
            <div className="modalHeader">
              <h3>{t("text.header.existingPlan")}</h3>
            </div>
            <ul className="existingPlanList list-unstyled mb-0 font-sb">
              {corporatePlanList?.length > 0 ? (
                corporatePlanList?.map((list, index) => {
                  return (
                    <li key={index}>
                      {textFormatter(list?.Plan?.plan_name)} -{" "}
                      {statusFormatter(list?.plan_category)} ({list?.count})
                    </li>
                  );
                })
              ) : (
                <div className="py-3 emptySec text-center w-100">
                  {/* <ImageElement
                    source="no-notification.svg"
                    alt="No Data Found"
                  /> */}
                  <h6>{t("text.common.noData")}</h6>
                </div>
              )}
            </ul>
          </>
        )}
      </ModalComponent>
      <SweetAlert
        title="Session Expired"
        text="We have recently upgraded our system and recommend you to re-login for a better experience."
        show={isAlertVisible}
        icon="warning"
        confirmButtonText="Re-login"
        setIsAlertVisible={setIsAlertVisible}
        showLoaderOnConfirm
        onConfirmAlert={onConfirmAlert}
        iconCustomClass="loginIcon"
      />
    </>
  );
}

export default React.memo(Header);
