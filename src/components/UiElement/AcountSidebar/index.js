import { Formik } from "formik";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { ImageElement } from "../..";
import { AdminMedia } from "../../../apiEndPoints";
import { selectUserData } from "../../../redux/AuthSlice/index.slice";
import adminRoutesMap from "../../../routeControl/adminRoutes";
import { UploadInput } from "../../Antd";
import { iconNameFormatter } from "../../Formatter";

function AcountSidebar({ asideView, asideToggle }) {
  const userData = useSelector(selectUserData);
  const location = useLocation();
  const initialValues = {
    image: "",
  };
  return (
    <>
      <div
        className={` min-vh-auto card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
          asideView ? "content-active" : ""
        }`}
      >
        <div className="card-inner-group" data-simplebar>
          <div className="card-inner">
            <div className="user-card">
              <div className="user-avatar bg-primary">
                {userData?.userData?.avatar ? (
                  <ImageElement previewSource={userData?.userData?.avatar} />
                ) : (
                  <span>
                    {iconNameFormatter(userData?.userData?.full_name)}
                  </span>
                )}
              </div>
              <div className="user-info">
                <span className="lead-text">
                  {userData?.userData?.full_name || "-"}
                </span>
                <span className="sub-text">
                  {userData?.userData?.email || "-"}
                </span>
              </div>
              <div className="user-action">
                <Dropdown>
                  <Dropdown.Toggle
                    as="a"
                    className="btn btn-icon btn-trigger me-n2"
                  >
                    <em className="icon ni ni-more-v" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Formik
                      initialValues={{ ...initialValues }}
                      enableReinitialize
                    >
                      {(props) => (
                        <ul className="link-list-opt no-bdr">
                          <li className="adminImage">
                            <UploadInput
                              apiEndPoints={AdminMedia.profileImage}
                              name="image"
                              type="file"
                              button
                              // defaultImageUrl={
                              //   userData?.avatar ||
                              //   `${config.IMAGE_URL}/profile-img.jpg`
                              // }
                              setFieldValue={props.handleChange}
                              isProfile
                            >
                              <Link to="#">
                                <em className="icon ni ni-camera-fill" />
                                <span>Change Photo</span>
                              </Link>
                            </UploadInput>
                          </li>
                          {/* <li><Link to="#"><em className="icon ni ni-edit-fill"/><span>Update Profile</span></Link></li> */}
                        </ul>
                      )}
                    </Formik>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <div className="card-inner p-0">
            <ul className="link-list-menu">
              <li>
                <Link
                  className={
                    location.pathname === adminRoutesMap.PROFILE.path
                      ? "active"
                      : ""
                  }
                  to={adminRoutesMap.PROFILE.path}
                >
                  <em className="icon ni ni-user-fill-c" />
                  <span>Personal Infomation</span>
                </Link>
              </li>
              <li>
                <Link
                  className={
                    location.pathname === adminRoutesMap.CHANGE_PASSWORD.path
                      ? "active"
                      : ""
                  }
                  to={adminRoutesMap.CHANGE_PASSWORD.path}
                >
                  <em className="icon ni ni-lock-alt-fill" />
                  <span>Change Password</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {asideView ? (
        <div
          onClick={() => asideToggle()}
          className="toggle-overlay"
          data-target="userAside"
        />
      ) : (
        ""
      )}
    </>
  );
}

export default AcountSidebar;
