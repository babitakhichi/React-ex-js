import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Accordion from "react-bootstrap/Accordion";
// import { useSelector } from "react-redux";
import { useLocation, Link } from "react-router-dom";
import SimpleBar from "simplebar-react";
import routesMap from "../../routeControl/adminRoutes";
import {
  getSidebarKey,
  // selectUserData,
  updateSidebarKey,
} from "../../redux/AuthSlice/index.slice";
import { getSideBarData } from "../../utils";
// import { Sider, Header } from "..";

function Sidebar({ routes, sidebarOpen, menuToggle }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const sidebarKey = useSelector(getSidebarKey);
  // const userData = useSelector(selectUserData);
  const [state, setState] = useState({
    collapsed: false,
    menu: [],
    current: location.pathname,
  });
  const [currentActive, setCurrentActive] = useState(location.pathname);
  useEffect(() => {
    if (routes && routes instanceof Array) {
      setState({ ...state, menu: getSideBarData(routes) });
    }
  }, [routes]);

  useEffect(() => {
    setCurrentActive(location.pathname);
  }, [location.pathname]);


  const [sideBarCompact, setSideBarCompact] = useState(false);  
  // let menuLink = document.querySelectorAll('.nk-menu-link:not(.nk-menu-toggle)');
  // menuLink?.forEach(link => {
  //   link.addEventListener('click', () => {
  //     menuToggle(false);
  //   })
  // });

  const sideBarToggle = () => {
    setSideBarCompact(!sideBarCompact);
  };

  // const toggleMenu = (e) => {
  //   console.log(e.target.closest("ul").clientHeight, "======");
  //   document.querySelectorAll(".nk-menu > li").forEach((item) => {
  //     if (item.classList.contains("active")) {
  //       item.classList.remove("active");
  //     }
  //   });
  //   e.target.parentNode.classList.toggle("active");
  // };

  return (
    <div
      className={`nk-sidebar nk-sidebar-fixed is-dark ${
        sideBarCompact ? "is-compact" : ""
      } ${sidebarOpen ? "nk-sidebar-active" : ""}`}
      data-content="sidebarMenu"
    >
      <div className="nk-sidebar-element nk-sidebar-head">
        <div className="nk-sidebar-brand">
          <Link
            to={routesMap.DASHBOARD.path}
            className="logo-link nk-sidebar-logo"
          >
            <img
              className="logo-light logo-img"
              src="/assets/images/admin/logo-light.svg"
              srcSet="../assets/images/admin/logo-light.svg"
              alt="logo"
            />
            <img
              className="logo-small logo-img logo-img-small"
              src="/assets/images/admin/logo-small-light.svg"
              srcSet="/assets/images/admin/logo-small-light.svg"
              alt="logo"
            />
          </Link>
        </div>
        <div className="nk-menu-trigger me-n2">
          <Link
            onClick={() => menuToggle(false)}
            role="button"
            className="nk-nav-toggle nk-quick-nav-icon d-xl-none"
            data-target="sidebarMenu"
          >
            <em className="icon ni ni-arrow-left" />
          </Link>
          <Link
            onClick={() => sideBarToggle()}
            role="button"
            className="nk-nav-compact nk-quick-nav-icon d-none d-xl-inline-flex"
            data-target="sidebarMenu"
          >
            <em className="icon ni ni-menu" />
          </Link>
          {/* <Link
            to="#"
            className="nk-nav-toggle nk-quick-nav-icon d-xl-none"
            data-target="sidebarMenu"
            onClick={(e) => {
              e.preventDefault();
              window.showSideBar("hide");
            }}
          >
            <em className="icon ni ni-arrow-left" />
          </Link> */}
        </div>
      </div>
      <div className="nk-sidebar-element">
        <div className="nk-sidebar-content">
          <SimpleBar className="nk-sidebar-menu" forceVisible="y" autoHide>
            <Accordion
              className="bg-transparent rounded-0"
              defaultActiveKey={sidebarKey}
            >
              <ul className="nk-menu">
                {state.menu.map((item, i) => {
                  let routeData;
                  if (item.children) {
                    routeData = (
                      <React.Fragment key={item.label}>
                        <Accordion.Item
                          as="li"
                          className={`bg-transparent nk-menu-item ${
                            sidebarKey === i ? "active" : ""
                          }`}
                          key={item.label}
                          eventKey={i}
                        >
                          <Accordion.Header>
                            <Link
                              to="#"
                              onClick={(e) => e.preventDefault()}
                              className="nk-menu-link nk-menu-toggle"
                            >
                              {item.icon}
                              <span className="nk-menu-text">{item.label}</span>
                            </Link>
                          </Accordion.Header>
                          <Accordion.Body className="p-0">
                            <ul className="nk-menu-sub">
                              {item.children.map((child, key) => {
                                if (child.path === currentActive) {
                                  dispatch(updateSidebarKey(i));
                                }
                                return (
                                  <>
                                    <li
                                      className={`nk-menu-item ${
                                        child.path === currentActive
                                          ? "active"
                                          : ""
                                      }`}
                                      key={key}
                                    >
                                      <Link
                                        to={child.path}
                                        className="nk-menu-link"
                                        onClick={() => menuToggle(false)}
                                        // onClick={(e) => toggleMenu(e)}
                                      >
                                        {child.icon}
                                        <span className="nk-menu-text">
                                          {child.label}
                                        </span>
                                      </Link>
                                    </li>
                                  </>
                                );
                              })}
                            </ul>
                          </Accordion.Body>
                        </Accordion.Item>
                      </React.Fragment>
                    );
                  } else {
                    if (item.path === currentActive) {
                      dispatch(updateSidebarKey(0));
                    }
                    routeData = (
                      <Accordion.Item
                        as="li"
                        eventKey={i}
                        className={`bg-transparent nk-menu-item ${
                          item.path === currentActive ? "active" : ""
                        }`}
                      >
                        <Accordion.Button className="nk-menu-link-normal">
                          <Link
                            to={item.path}
                            className="nk-menu-link"
                            onClick={() => menuToggle(false)}
                            // onClick={(e) => toggleMenu(e)}
                          >
                            {item.icon}
                            <span className="nk-menu-text">{item.label}</span>
                          </Link>
                        </Accordion.Button>
                      </Accordion.Item>
                    );
                  }
                  return routeData;
                })}
              </ul>
            </Accordion>
          </SimpleBar>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
