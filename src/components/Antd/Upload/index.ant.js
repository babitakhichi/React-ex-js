import React, { useEffect, useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Upload, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useField } from "formik";
import ImgCrop from "antd-img-crop";
import { useTranslation } from "react-i18next";
import {
  getLocalStorageToken,
  removeSessionStorageToken,
} from "../../../utils";
import modalNotification from "../../../utils/notifications";
import configs from "../../../config";
import {
  selectUserData,
  updateUserData,
} from "../../../redux/AuthSlice/index.slice";
import {
  selectProfileData,
  updateProfile,
} from "../../../redux/UserSlice/index.slice";
// import { ImageElement } from "../../UiElement";

function UploadInput({
  applyImageCropper = true,
  label = "",
  apiEndPoints,
  name,
  defaultImageUrl,
  aspect,
  children,
  setFileUplod, // uploadFileName = "",
  stepTwoImage,
  setFileDetails,
  validateFileType = ["image/jpeg", "image/png", "image/jpg"],
  button = false,
  customMessage = "",
  isProfile = false,
  aspectSlider = false,
  imageButton = false,
  ...rest
}) {
  const { t } = useTranslation();
  const userData = useSelector(selectUserData);
  const [loading, setLoading] = useState(false);
  let profileData = useSelector(selectProfileData);
  const [imageUrl, setImageUrl] = useState();
  let dispatch = useDispatch();
  const [field, meta, helpers] = useField(name);
  const config = { ...field, ...rest };
  const apiToken = getLocalStorageToken();

  if (meta && meta.touched && meta.error) {
    config.error = true;
    config.helperText = meta.error;
  }
  // useEffect(() => {
  //   if (uploadFileName) {
  //     setFileName(uploadFileName?.name);
  //   } else {
  //     setFileName("");
  //   }
  // }, [uploadFileName]);

  useEffect(() => {
    if (defaultImageUrl) {
      setImageUrl(defaultImageUrl);
    } else {
      setImageUrl(`${configs.ADMIN_IMAGE_URL}/logo-default.jpg`);
    }
  }, [defaultImageUrl]);

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  // const beforeUpload = (file) => {
  //   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

  //   if (!isJpgOrPng) {
  //     modalNotification({
  //       type: "error",
  //       message: t("text.common.imageOnlyMessgae"),
  //     });
  //   }

  //   const isLt2M = file.size / 1024 / 1024 < 5;

  //   if (!isLt2M) {
  //     modalNotification({
  //       type: "error",
  //       message: t("text.common.imageSizeExceedingMessage"),
  //     });
  //   }

  //   return isJpgOrPng && isLt2M;
  // };

  const beforeUpload = (file) => {
    const isJpgOrPng = validateFileType.includes(file.type);

    if (!isJpgOrPng) {
      modalNotification({
        type: "error",
        message: `${
          applyImageCropper
            ? t("text.common.imageOnlyMessgae")
            : `Please Upload ${customMessage || validateFileType}`
          // : "Please Upload Either Pdf , Docx or Doc"
        }`,
      });
    }

    const isLt2M = file.size / 1024 / 1024 < 5;

    if (!isLt2M) {
      if (applyImageCropper) {
        modalNotification({
          type: "error",
          message: `${
            applyImageCropper && t("text.common.imageSizeExceedingMessage")
          }`,
        });
      }
    }

    return (isJpgOrPng && isLt2M) || Upload.LIST_IGNORE;
  };

  const handleChange = (info) => {
    if (setFileDetails) {
      setFileDetails(info);
      setFileUplod(true);
    }
    if (info.file.status === "uploading") {
      setLoading(true);
    } else {
      const { status, response } = info.file;
      if (status === "done" && response.success === 1) {
        getBase64(info.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
        });

        if (applyImageCropper) {
          modalNotification({
            type: "success",
            message: response.message,
            // description: `${info.file.name} file uploaded successfully.`,
          });
          if (userData.userRole === "user") {
            let updatesProfileData = { ...profileData };
            let userDetails = { ...updatesProfileData.UserProfile };
            userDetails.profile_img_url_full = response.data.avatar;
            updatesProfileData.UserProfile = { ...userDetails };

            dispatch(
              updateProfile({
                ...updatesProfileData,
              })
            );
          } else if (userData.userRole === "admin" && isProfile) {
            let updatesUserData = { ...userData };
            let userDetails = { ...updatesUserData.userData };
            userDetails.avatar = response.data.avatar;
            updatesUserData.userData = { ...userDetails };
            dispatch(
              updateUserData({
                ...updatesUserData,
              })
            );
          } else if (userData.userRole === "admin") {
            helpers.setValue(response.data.avatar);
          }

          // onFileUploaded(response.data.basePath)
          // helpers.setValue(response.data.basePath);
        } else if (
          (userData.userRole === "user" || imageButton) &&
          applyImageCropper === false
        ) {
          helpers.setValue(response.data.avatar);
        } else {
          helpers.setValue(info.file.name);
          setFileUplod(true);
        }
      } else if (status === "error" || response.success === 0) {
        setLoading(false);
        modalNotification({
          type: "error",
          message: info?.fileList[0]?.response?.message,
          description: `${info.file.name} file upload failed. ${info.file.response.detail}`,
        });
        if (response.detail.search("authenticated") !== -1) {
          removeSessionStorageToken();
        }
      }
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        <div className="my-auto text-center">
          <span className="icon-camera" />
          <div className="font-sm txt">+ Upload Image</div>
        </div>
      </div>
    </div>
  );
  return applyImageCropper ? (
    <Form.Item
      label={label}
      className="flex-col mb-0"
      name={name}
      help={meta.error && meta?.error && meta?.touched ? meta.error : ""}
      validateStatus={config.error ? "error" : "success"}
    >
      <ImgCrop quality={1} aspect={aspect} aspectSlider={aspectSlider}>
        {button ? (
          <Upload
            name={name}
            type="file"
            listType="picture"
            className="avatar-uploader"
            showUploadList={false}
            action={apiEndPoints}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            disabled={loading}
            {...rest}
            headers={{
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${apiToken}`,
            }}
          >
            {/* {imageUrl ? (
              loading ? (
                userData.userRole === "admin" ? (
                  <LoadingOutlined />
                ) : (
                  <LoadingOutlined className="text-white" />
                )
              ) : (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    // width: '100%',
                    height: "100%",
                  }}
                />
              )
            ) : (
              uploadButton
            )} */}
            {children}
          </Upload>
        ) : (
          <Upload
            name={name}
            type="file"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={apiEndPoints}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            disabled={loading}
            {...rest}
            headers={{
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer ${apiToken}`,
            }}
          >
            {imageUrl ? (
              loading ? (
                userData.userRole === "admin" ? (
                  <LoadingOutlined />
                ) : (
                  <LoadingOutlined className="text-white" />
                )
              ) : (
                <img
                  src={imageUrl}
                  alt="avatar"
                  style={{
                    // width: '100%',
                    height: "100%",
                  }}
                />
              )
            ) : (
              uploadButton
            )}
            {children}
          </Upload>
        )}
      </ImgCrop>
    </Form.Item>
  ) : (
    <Form.Item
      label={label}
      className="flex-col mb-0"
      name={name}
      help={meta.error && meta?.error && meta?.touched ? meta.error : ""}
      validateStatus={config.error ? "error" : "success"}
    >
      {imageButton ? (
        <Upload
          name={name}
          type="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action={apiEndPoints}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          disabled={loading}
          {...rest}
          headers={{
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${apiToken}`,
          }}
        >
          {imageUrl ? (
            loading ? (
              userData.userRole === "admin" ? (
                <LoadingOutlined />
              ) : (
                <LoadingOutlined className="text-white" />
              )
            ) : (
              <img
                src={imageUrl}
                alt="avatar"
                style={{
                  // width: '100%',
                  height: "100%",
                }}
              />
            )
          ) : (
            uploadButton
          )}
          {children}
        </Upload>
      ) : (
        <Upload
          name={name}
          type="file"
          // listType="picture-card"
          // className="avatar-uploader"
          showUploadList={false}
          action={apiEndPoints}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          {...rest}
          headers={{
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${apiToken}`,
          }}
        >
          {/* {loading ? (
          <LoadingOutlined className="text-white" />
        ) : (
          <>
            <label
              htmlFor="uploadPhoto01"
              className="uploadStuff_upload d-flex flex-column align-items-center justify-content-center mb-0"
            >
              {(fileName && <ImageElement source="/file-icon.svg" />) ||
                stepTwoImage || (
                  <>
                    ssss
                    <em className="icon-upload" />
                    <span className="d-block">{t("text.common.document")}</span>
                  </>
                )}
            </label>
          </>
        )} */}

          {children}
        </Upload>
      )}
    </Form.Item>
  );
}

export default UploadInput;
