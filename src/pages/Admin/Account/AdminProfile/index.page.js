import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { logger, modalNotification } from "../../../../utils";
import {
  AcountSidebar,
  AdminUpdateProfileForm,
  AdminUpdateSocialLink,

  //   Breadcrumb,
  MetaTags,
  ModalComponent,
  PageHeader,
  //   PageHeader,
  //   ProfileForm,
} from "../../../../components";
import { AdminAuthServices } from "../../../../services";
import { logger, modalNotification } from "../../../../utils";
// import Media from "../../../../apiEndPoints/Admin/Media";
// import { AdminAuthServices } from "../../../../services";
import {
  selectUserData,
  updateUserData,
  //   updateUserData,
} from "../../../../redux/AuthSlice/index.slice";
// import moduleRoutesMap from "../../../../routeControl";

function AdminProfile() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showEditSocial, setShowEditSocial] = useState(false);
  const userData = useSelector(selectUserData);
  //   const formRef = useRef(null);
  const dispatch = useDispatch();
  //   const [isEdit, setIsEdit] = useState(false);

  //   const editProfile = () => {
  //     setIsEdit(true);
  //   };
  //   const cancelProfile = () => {
  //     formRef.current.resetForm({ ...userData });
  //     setIsEdit(false);
  //   };

  const onSubmit = async (value, dataFrom) => {
    setLoading(true);

    try {
      let bodyData = { ...value };
      const response = await AdminAuthServices.updateProfileService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });

        const resData = { ...userData };
        resData.userRole = "admin";
        resData.userData = { ...resData.userData, ...value };
        dispatch(updateUserData(resData));
        if (dataFrom === "profile") setShowEdit(false);
        else setShowEditSocial(false);
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

  const onSubmitSocialLink = async (value) => {
    setLoading(true);

    try {
      let bodyData = { ...value };
      const response = await AdminAuthServices.updateSocialLinkService(
        "1",
        bodyData
      );
      const { success, message, data } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });

        dispatch(updateUserData({ socialLink: { ...data } }));

        setShowEditSocial(false);
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

  // const [socialLinkLoading, setSocialLinkLoading] = useState(false);

  // const [profileLoading, setProfileLoading] = useState(false);
  const editProfileModal = () => {
    setShowEdit(true);
  };
  const closeEditProfileModal = () => {
    setShowEdit(false);
  };
  const editSocialLinkModal = () => {
    setShowEditSocial(true);
  };
  const closeSocialLinkModal = () => {
    setShowEditSocial(false);
  };
  const [asideView, setAsideView] = useState(false);
  const asideToggle = () => {
    setAsideView(!asideView);
  };
  if (asideView) {
    document.querySelector("body").classList.add("toggle-shown");
  } else {
    document.querySelector("body").classList.remove("toggle-shown");
  }

  return (
    <>
      <MetaTags title={t("text.userProfile.title")} />
      {/* <div className="nk-block-head nk-block-head-sm">
            <div className="nk-block-between">
            <PageHeader heading={t("text.userProfile.title")}>
                <Breadcrumb breadcrumb={breadcrumb} />
            </PageHeader>
            </div>
        </div> */}
      <div className="nk-block">
        <div className="card">
          <div className="card-aside-wrap">
            <div className="card-inner card-inner-lg">
              <div className="nk-block-head nk-block-head-lg">
                <div className="nk-block-between">
                  <PageHeader heading="Personal Information">
                    <p>{t("text.adminUpdateProfile.basicInfo")}</p>
                  </PageHeader>
                  <div className="nk-block-head-content align-self-start d-lg-none">
                    <Link
                      to="#"
                      onClick={() => asideToggle()}
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${
                        asideView ? "active" : ""
                      }`}
                    >
                      <em className="icon ni ni-menu-alt-r" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="nk-block">
                <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title">
                      {t("text.adminUpdateProfile.basics")}{" "}
                    </h6>
                  </div>
                  <div className="data-item" onClick={() => editProfileModal()}>
                    <div className="data-col">
                      <span className="data-label">
                        {" "}
                        {t("text.adminUpdateProfile.fullName")}{" "}
                      </span>
                      <span className="data-value">
                        {userData?.userData?.full_name}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <em className="icon ni ni-forward-ios" />
                      </span>
                    </div>
                  </div>
                  {/* <div className="data-item" onClick={() => editProfileModal()}>
                    <div className="data-col">
                      <span className="data-label">
                        {t("text.adminUpdateProfile.displayName")}
                      </span>
                      <span className="data-value">
                        {userData?.userData?.username}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <em className="icon ni ni-forward-ios" />
                      </span>
                    </div>
                  </div> */}
                  <div className="data-item">
                    <div className="data-col">
                      <span className="data-label">
                        {t("text.adminUpdateProfile.email")}
                      </span>
                      <span className="data-value text-break">
                        {userData?.userData?.email}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <em className="icon ni ni-lock-alt" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title">
                      {" "}
                      {t("text.adminUpdateProfile.socialLinks")}
                    </h6>
                  </div>
                  <div
                    className="data-item"
                    onClick={() => editSocialLinkModal()}
                  >
                    <div className="data-col">
                      <span className="data-label">
                        {t("text.AdminUpdateSocialLink.facebook")}
                      </span>
                      <span className="data-value text-break">
                        {userData?.socialLink?.facebook}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <em className="icon ni ni-forward-ios" />
                      </span>
                    </div>
                  </div>
                  <div
                    className="data-item"
                    onClick={() => editSocialLinkModal()}
                  >
                    <div className="data-col">
                      <span className="data-label">
                        {t("text.AdminUpdateSocialLink.twitter")}
                      </span>
                      <span className="data-value text-break">
                        {userData?.socialLink?.twitter}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <em className="icon ni ni-forward-ios" />
                      </span>
                    </div>
                  </div>
                  <div
                    className="data-item"
                    onClick={() => editSocialLinkModal()}
                  >
                    <div className="data-col">
                      <span className="data-label">
                        {" "}
                        {t("text.AdminUpdateSocialLink.instagram")}
                      </span>
                      <span className="data-value text-break">
                        {userData?.socialLink?.instagram}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <em className="icon ni ni-forward-ios" />
                      </span>
                    </div>
                  </div>
                  <div
                    className="data-item"
                    onClick={() => editSocialLinkModal()}
                  >
                    <div className="data-col">
                      <span className="data-label">
                        {" "}
                        {t("text.AdminUpdateSocialLink.linkedin")}
                      </span>
                      <span className="data-value text-break">
                        {userData?.socialLink?.linkedin}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <em className="icon ni ni-forward-ios" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <AcountSidebar asideView={asideView} asideToggle={asideToggle} />
          </div>
        </div>
      </div>
      <ModalComponent
        closeButton={false}
        extraTitleClassName="justify-content-center"
        onHandleCancel={() => {
          setShowEdit(false);
        }}
        backdrop
        show={showEdit}
        title={t("text.adminUpdateProfile.title")}
      >
        <AdminUpdateProfileForm
          onSubmit={onSubmit}
          closeEditProfileModal={closeEditProfileModal}
          loading={loading}
          t={t}
          userData={userData?.userData}
        />
      </ModalComponent>

      <ModalComponent
        closeButton={false}
        extraTitleClassName="justify-content-center"
        onHandleCancel={() => {
          setShowEditSocial(false);
        }}
        backdrop
        show={showEditSocial}
        title={t("text.AdminUpdateSocialLink.title")}
      >
        <AdminUpdateSocialLink
          t={t}
          onSubmit={onSubmitSocialLink}
          closeSocialLinkModal={closeSocialLinkModal}
          loading={loading}
          userData={userData?.socialLink}
        />
      </ModalComponent>
    </>
  );
}

export default AdminProfile;
