import TextArea from "antd/lib/input/TextArea";
import { Formik } from "formik";
import { t } from "i18next";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  AudioRecorder,
  checkValidCount,
  commasFormatter,
  CommonButton,
  GlobalLoader,
  ImageElement,
  RippleEffect,
  // subscriptionpPlanFormetter,
  Tabs,
  textFormatter,
  // UploadInput,
} from "../../../components";
import {
  getLanguageList,
  getUserSubscription,
  selectLanguageData,
  selectProfileData,
  selectSubscriptionData,
  selectUserAccountData,
} from "../../../redux/UserSlice/index.slice";
import userRoutesMap from "../../../routeControl/userRoutes";
import { TranslateServices } from "../../../services";
import {
  copyToClipboard,
  filterLanguage,
  getActiveAccount,
  getCharLeft,
  getCurrentActiveSubscription,
  getIscorporateActive,
  logger,
  modalNotification,
  stripAllTags,
  // textSpeech,
  translationFileTypeValidation,
} from "../../../utils";
import LanguageDropdown from "./LanguageDropdown";

function Translation() {
  const dispatch = useDispatch();
  const languageData = useSelector(selectLanguageData);
  const account = useSelector(selectUserAccountData);
  const userActiveSubscription = useSelector(selectSubscriptionData);
  const userProfileData = useSelector(selectProfileData);
  const [translatedCount, setTranslatedCount] = useState(0);
  const [translationSubscription, setTranslateSubscription] = useState([]);
  const [fileDisable, setfileDisable] = useState(false);
  let currentSubscription = useMemo(() => {
    if (userActiveSubscription?.length > 0) {
      const subscriptionData = getCurrentActiveSubscription(
        userActiveSubscription,
        "translation",
        true
      );
      let translationType = [];
      if (
        subscriptionData?.Subscription?.SubscriptionTranslationTypes?.length > 0
      ) {
        subscriptionData?.Subscription?.SubscriptionTranslationTypes?.forEach(
          (item) => translationType.push(item?.translation_type)
        );
      }
      setTranslateSubscription(translationType);

      return subscriptionData;
    }
  }, [userActiveSubscription]);

  const totalCount = useMemo(() => {
    if (userActiveSubscription?.length > 0) {
      return currentSubscription?.Subscription?.SubscriptionFeature
        ?.translation;
    }
  }, [currentSubscription, userActiveSubscription]);

  let remainingCount = useMemo(() => {
    if (checkValidCount(totalCount) - checkValidCount(translatedCount) > 0) {
      return checkValidCount(totalCount) - checkValidCount(translatedCount);
    } else {
      return 0;
    }
  }, [totalCount, translatedCount]);
  const errorMsgCount0 = () => {
    return modalNotification({
      type: "error",
      message:
        "You have utilized the total characters as per plan. Please upgrade to continue using the translation services",
    });
  };
  // let autoDetectLanguage = useMemo(
  //   () =>
  //     filterLanguage(
  //       languageData,
  //       window?.navigator?.language?.split("-")?.[0],
  //       "code_alpha_1",
  //       true
  //     ),
  //   []
  // );

  const [fileUplod, setFileUplod] = useState(false);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [voiceTranslate, setVoiceTranslate] = useState(false);
  const [fileDetails, setFileDetails] = useState({});
  const [fromLangDropdown, setfromLangDropdown] = useState(false);
  const [toLangDropdown, settoLangDropdown] = useState(false);
  const [defaultKey, setDefaultKey] = useState("translateText");
  // const [fromLanguage, setFromLanguage] = useState(
  //   autoDetectLanguage?.length > 0 ? autoDetectLanguage?.[0] : {}
  // );
  const [fromLanguage, setFromLanguage] = useState({
    code_alpha_1: undefined,
    codeName: "Auto Detection",
    rtl: false,
  });
  const [toLanguage, setToLanguage] = useState({});
  const [translateData, setTranslateData] = useState("");
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);
  const [translatedData, setTranslatedData] = useState("");
  const [search, setSearch] = useState("");
  const [translatedDocument, setTranslatedDocument] = useState("");
  const [translatedSpeechData, setTranslatedSpeechData] = useState("");
  const [translateSpeechData, setTranslateSpeechData] = useState("");
  const [speechLoading, setspeechLoading] = useState(false);
  const [textLoading, setTextLoading] = useState(false);
  // const [voiceSupportedList, setVoiceSupportedList] = useState([]);
  const [speechLanguages, setSpeechLanguage] = useState([]);
  const [recallTranslationData, setRecallTransaltionData] = useState({});
  const [documentsData, setDocumentsData] = useState();
  const [recallLoading, setRecallLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const getSpeechLanguageList = async () => {
    try {
      const response = await TranslateServices.getSpeechLanguageService();
      const { status, code, data } = response;
      if (status === "success" && code === "OK") {
        setSpeechLanguage(data);
      } else {
        modalNotification({
          type: "error",
          message: "Something went wrong",
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  useEffect(() => {
    getSpeechLanguageList();
    const activeAcc = getActiveAccount(account);
    setIsGuest(activeAcc?.account?.includes("(Guest)"));
  }, []);

  const onFromLanguageChange = (data) => {
    setTranslateSpeechData("");
    setTranslateData("");
    setFromLanguage(data);
  };

  useEffect(() => {
    setTranslatedSpeechData("");
    setTranslatedData("");
  }, [toLanguage?.code_alpha_1]);

  const fromLangDropdownOpen = () => {
    setfromLangDropdown(!fromLangDropdown);
    setSearch("");
  };
  const fromLangDropdownClose = () => {
    setfromLangDropdown(false);
    setSearch("");
  };

  const toLangDropdownOpen = () => {
    settoLangDropdown(!toLangDropdown);
    setSearch("");
  };
  const toLangDropdownClose = () => {
    settoLangDropdown(false);
    setSearch("");
  };

  const documentReset = () => {
    setFileUplod(false);
    setFileDetails({});
    setTranslateLoading(false);
    setTranslatedDocument("");
  };

  const getRemainingCount = async (count) => {
    try {
      const isCorporate = getIscorporateActive(account);
      const activeAcc = getActiveAccount(account);
      let bodyData = {
        order_id: currentSubscription?.order_id,
        total_count: count,
        is_corporate: isCorporate ? 1 : 0,
        corporate_id: activeAcc?.id,
      };
      const res = await TranslateServices.getTranslateRemainingCountService(
        bodyData
      );
      const { success, data } = res;
      if (success === 1) {
        setTranslatedCount(data?.translation);
      }
    } catch (error) {
      logger(error);
    }
  };

  useEffect(() => {
    getRemainingCount(0);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const languageList = useMemo(() => {
    if (search?.length >= 1 && firstTimeFetch) {
      return filterLanguage(languageData, search, "codeName");
    } else {
      return languageData;
    }
  }, [search]);

  const speechLanguageList = useMemo(() => {
    if (search?.length >= 1 && firstTimeFetch) {
      return filterLanguage(speechLanguages, search, "codeName");
    } else {
      return speechLanguages;
    }
  }, [search, speechLanguages]);

  // useEffect(() => {
  //   if (window !== undefined) {
  //     window.speechSynthesis.onvoiceschanged = () => {
  //       let voices = window.speechSynthesis.getVoices();
  //       setVoiceSupportedList(voices);
  //     };
  //   }
  // }, []);

  // const isFromVoiceSupported = useMemo(() => {
  //   if (voiceSupportedList?.length > 0) {
  //     return voiceSupportedList?.some((item) =>
  //       item?.lang.includes(fromLanguage?.code_alpha_1)
  //     );
  //   }
  // }, [voiceSupportedList, fromLanguage]);

  // const isToVoiceSupported = useMemo(() => {
  //   if (voiceSupportedList?.length > 0) {
  //     return voiceSupportedList?.some((item) =>
  //       item?.lang.includes(toLanguage?.code_alpha_1)
  //     );
  //   }
  // }, [voiceSupportedList, toLanguage]);

  let validFile = useMemo(() => {
    if (
      userActiveSubscription?.length > 0 &&
      (defaultKey === "translateFiles" || defaultKey === "translateAudio")
    ) {
      let features = translationFileTypeValidation(
        currentSubscription?.Subscription,
        defaultKey
      );
      return features;
    }
  }, [currentSubscription, userActiveSubscription, defaultKey]);

  let validFileName = useMemo(() => {
    if (validFile?.name?.length > 0) {
      return commasFormatter(
        validFile?.name?.map((item) => textFormatter(item))
      );
    }
  }, [validFile?.name]);

  const getTranslatedDocument = async (documentData) => {
    try {
      let queryParams = {
        encoded_name: documentData.encodedName,
      };
      const response = await TranslateServices.getTranslateDocumentService({
        queryParams,
      });
      const { status, code, data } = response;
      if (status === "success" && code === "OK") {
        setDocumentsData(documentData);
        setRecallTransaltionData(data);
        if (data?.file_url) {
          setRecallLoading(false);
          setTranslatedDocument(data?.file_url);
          setDocumentsData({});
          setRecallTransaltionData({});
        } else {
          setTranslatedDocument("");
        }
      } else {
        modalNotification({
          type: "error",
          message: "Something went wrong",
        });
      }
    } catch (error) {
      logger(error);
    }
    setTranslateLoading(false);
  };
  useEffect(() => {
    if (recallTranslationData?.status === "processing") {
      setRecallLoading(true);

      const interval = setInterval(() => {
        getTranslatedDocument(documentsData);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [recallTranslationData]);
  const translateClick = async (type, docDetails) => {
    setTranslateLoading(true);
    try {
      if (remainingCount > 0) {
        let bodyData = {
          source_language: fromLanguage?.code_alpha_1,
          target_language: toLanguage?.code_alpha_1,
          file: type === "audio" ? docDetails : fileDetails?.file,
        };

        let formHeaders = { "content-type": "multipart/form-data" };
        const res =
          type === "audio"
            ? await TranslateServices.translateMediaService(
                bodyData,
                formHeaders
              )
            : await TranslateServices.translateDocumentService(
                bodyData,
                formHeaders
              );
        const { status, code, data, meta } = res;
        if (status === "success" && code === "OK") {
          if (type === "audio") {
            setTranslatedSpeechData(data?.translatedText);
            setTranslateSpeechData(data?.sourceText);
            setTranslateLoading(false);
          } else {
            setTimeout(() => {
              getTranslatedDocument(data);
            }, 4000);
          }
          getRemainingCount(meta?.total_char_count);
        } else {
          modalNotification({
            type: "error",
            message: "Something went wrong",
          });
        }
      } else {
        modalNotification({
          type: "error",
          message: "Your remaining count is exceed over limit",
        });
      }
    } catch (error) {
      logger(error);
      setspeechLoading(false);
      setTranslateLoading(false);
    }
  };

  const switchLanguage = () => {
    const oldFromLanguage = fromLanguage;
    const oldToLanguage = toLanguage;
    setFromLanguage(oldToLanguage);
    setToLanguage(oldFromLanguage);
    // eslint-disable-next-line
    if (defaultKey === "translateText" || defaultKey === "translateHTML") {
      const oldFromText = translateData;
      const oldToText = translatedData;
      setTranslatedData(oldFromText);
      setTranslateData(oldToText);
    } else if (defaultKey === "translateAudio") {
      const oldFromSpeechText = translateSpeechData;
      const oldToSpeechText = translatedSpeechData;
      setTranslatedSpeechData(oldFromSpeechText);
      setTranslateSpeechData(oldToSpeechText);
    }
    setSearch("");
  };

  let fileIcon = useMemo(() => {
    return {
      pdf: "pdf-file.svg",
      txt: "txt-file.svg",
      doc: "doc-file.svg",
      docx: "doc-file.svg",
      pptx: "ppt-file.svg",
      ppt: "ppt-file.svg",
      mp4: "mp4-file.svg",
      mp3: "mp3-file.svg",
    };
  }, []);

  function validateFileType(id) {
    try {
      let fileName = document.getElementById(id)?.value;
      let idxDot = fileName?.lastIndexOf(".") + 1;
      let extFile = fileName?.substr(idxDot, fileName.length)?.toLowerCase();
      if (fileName && !validFile?.name?.includes(extFile)) {
        modalNotification({
          type: "error",
          message: `${`Please Upload ${validFileName}`}`,
        });
        document.getElementById(id).value = "";
        setFileUplod(false);
      } else {
        let fileDetail = document.getElementById(id);
        const fileSize = fileDetail?.files?.item(0)?.size;
        const fileMb = fileSize / 1024;
        let docDetails = {
          type: extFile,
          name: fileDetail?.files?.item(0)?.name,
          size: fileMb.toFixed(1),
          file: fileDetail?.files?.item(0),
        };
        setFileUplod(true);
        setFileDetails({ ...docDetails });
        if (id === "audio") {
          translateClick("audio", docDetails.file);
        }
      }
    } catch (error) {
      logger(error);
    }
  }

  const speechToTextTranslation = async (audioData, count) => {
    setspeechLoading(true);
    try {
      if (count > 0) {
        translateClick("audio", audioData);
        // let bodyData = {
        //   file: audioData,
        //   source_language: fromLanguage?.code_alpha_1,
        //   target_language: toLanguage?.code_alpha_1,
        // };
        // let formHeaders = { "content-type": "multipart/form-data" };
        // const res = await TranslateServices.translateSpeechToTextService(
        //   bodyData,
        //   formHeaders
        // );
        // const { status, code, data, meta } = res;
        // if (status === "success" && code === "OK") {
        //   setTranslatedSpeechData(data?.result);
        //   getRemainingCount(meta?.total_char_count);
        // } else {
        //   modalNotification({
        //     type: "error",
        //     message: "Something went wrong",
        //   });
        // }
      } else {
        errorMsgCount0();
        // modalNotification({
        //   type: "error",
        //   message: "Your remaining count is exceed over limit",
        // });
      }
    } catch (error) {
      logger(error);
    }
    setspeechLoading(false);
  };

  function TranslateBar() {
    return (
      <Row className="g-0">
        <Col xs={6}>
          <div className="translateBar_head">
            <div className="d-flex align-items-center">
              <label className="font-bd">Source Language</label>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  fromLangDropdownOpen();
                  toLangDropdownClose();
                }}
                className={`languageSelect ${fromLangDropdown ? "active" : ""}`}
              >
                {fromLanguage?.codeName}{" "}
              </Link>
            </div>
          </div>
        </Col>
        <Col xs={6}>
          <div className="translateBar_head">
            <div className="d-flex align-items-center position-relative">
              <Link
                className="languageFilpBtn"
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  toLangDropdownClose();
                  fromLangDropdownClose();
                  switchLanguage();
                }}
              >
                <em className="icon-replace" />
              </Link>
              <label className="font-bd">Target Language </label>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  toLangDropdownOpen();
                  fromLangDropdownClose();
                }}
                className={`languageSelect ${toLangDropdown ? "active" : ""}`}
              >
                {toLanguage?.codeName}{" "}
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  const isAudio = useMemo(() => {
    return defaultKey === "translateAudio";
  }, [defaultKey]);

  const textTranslate = (
    <div className="translateBar bg-white position-relative">
      <TranslateBar />

      {!(fromLangDropdown || toLangDropdown) && (
        <div className="translateBar_body">
          <Row className="g-0">
            <Col sm={6}>
              <div className="translateBar_body_left">
                <TextArea
                  dir={fromLanguage?.rtl ? "rtl" : "ltr"}
                  rows={5}
                  placeholder="Translation"
                  maxLength={
                    translateData?.length > 0
                      ? translateData?.length +
                        (10000 - translateData?.replaceAll(" ", "").length)
                      : "10000"
                  }
                  onChange={(e) => {
                    // if (
                    //   // remainingCount <= 0 ||
                    //   e.target.value.replaceAll(" ", "").length > remainingCount
                    // ) {
                    //   e.preventDefault();
                    // } else {

                    // eslint-disable-next-line
                    if (defaultKey === "translateHTML") {
                      setTranslateData(stripAllTags(e.target.value));
                    } else {
                      setTranslateData(e.target.value);
                    }

                    if (e.target.value.replaceAll(" ", "").length === 0) {
                      setTranslatedData("");
                    }
                    // }
                  }}
                  value={translateData}
                />
                <div className="translateBar_bottom d-flex align-items-center justify-content-between">
                  <ul className="list-inline mb-0">
                    <li className="list-inline-item">
                      <Link
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          copyToClipboard(translateData);
                          modalNotification({
                            type: "success",
                            message: "Text copied to clipboard",
                          });
                        }}
                      >
                        <em className="icon-copy" />
                      </Link>
                    </li>
                    {/* {isFromVoiceSupported && (
                      <li className="list-inline-item">
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if ("speechSynthesis" in window) {
                              if (fromLanguage?.code_alpha_1) {
                                textSpeech(
                                  translateData,
                                  fromLanguage?.code_alpha_1
                                );
                              }
                            } else {
                              modalNotification({
                                type: "error",
                                message: "Web Speech API not supported :-(",
                              });
                            }
                          }}
                        >
                          <em className="icon-sound" />
                        </Link>
                      </li>
                    )} */}
                    <li className="list-inline-item">
                      <CommonButton
                        extraClassName="btn-sm mw-auto"
                        loading={textLoading}
                        onClick={() => {
                          if (remainingCount > 0) {
                            // eslint-disable-next-line
                            getTranslatedData(translateData);
                          } else {
                            errorMsgCount0();
                          }
                        }}
                        variant="primary"
                      >
                        Translate
                      </CommonButton>
                    </li>
                  </ul>
                  <span className="characterCout">
                    {getCharLeft(translateData, "10000")}
                  </span>
                </div>
              </div>
            </Col>
            <Col sm={6}>
              <div className="translateBar_body_right">
                {textLoading ? (
                  <GlobalLoader />
                ) : (
                  <>
                    <TextArea
                      dir={toLanguage?.rtl ? "rtl" : "ltr"}
                      rows={5}
                      placeholder="Translation"
                      value={translatedData}
                      readOnly
                    />
                    {translatedData?.length > 0 && (
                      <div className="translateBar_bottom d-flex align-items-center justify-content-between">
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item">
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                copyToClipboard(translatedData);
                                modalNotification({
                                  type: "success",
                                  message: "Text copied to clipboard",
                                });
                              }}
                            >
                              <em className="icon-copy" />
                            </Link>
                          </li>
                          {/* {isToVoiceSupported && (
                            <li className="list-inline-item">
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if ("speechSynthesis" in window) {
                                    if (toLanguage?.code_alpha_1) {
                                      textSpeech(
                                        translatedData,
                                        toLanguage?.code_alpha_1
                                      );
                                    }
                                  } else {
                                    modalNotification({
                                      type: "error",
                                      message:
                                        "Web Speech API not supported :-(",
                                    });
                                  }
                                }}
                              >
                                <em className="icon-sound" />
                              </Link>
                            </li>
                          )} */}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
      {fromLangDropdown && (
        <LanguageDropdown
          langDropdownClose={fromLangDropdownClose}
          setLanguage={onFromLanguageChange}
          languageData={languageList}
          // autoDetectLanguage={autoDetectLanguage}
          search={search}
          setSearch={setSearch}
          defaultKey={defaultKey}
        />
      )}
      {toLangDropdown && (
        <LanguageDropdown
          langDropdownClose={toLangDropdownClose}
          setLanguage={setToLanguage}
          languageData={languageList}
          // autoDetectLanguage={autoDetectLanguage}
          search={search}
          setSearch={setSearch}
          defaultKey={defaultKey}
        />
      )}
    </div>
  );
  const initialValues = {
    file: "",
  };
  const fileTranslate = (
    <div className="translateBar bg-white">
      <TranslateBar />

      {!(fromLangDropdown || toLangDropdown) && (
        <div className="translateBar_body">
          <Row className="g-0">
            <Col sm={6}>
              <div className="translateBar_body_left position-relative">
                {/* browse button */}
                {fileUplod ? (
                  <div className="uploadDocument uploadDocument-file text-center">
                    <div className="uploadDocument_wrap">
                      <ImageElement
                        source={fileIcon?.[fileDetails?.type]}
                        alt={fileIcon?.[fileDetails?.type]}
                      />
                      <h6 className="font-sb mb-0 text-break">
                        {fileDetails?.name}
                      </h6>
                      <p className="mb-0">{fileDetails?.size} Kb</p>
                      <Link
                        className="closeIcon"
                        to="#"
                        onClick={(e) => {
                          e.preventDefault();
                          documentReset();
                        }}
                      >
                        <em className="icon-close" />
                      </Link>
                    </div>
                    <RippleEffect>
                      <CommonButton
                        // disabled={translate}
                        onClick={() => translateClick("file")}
                        variant="primary"
                      >
                        Translate
                      </CommonButton>
                    </RippleEffect>
                  </div>
                ) : (
                  <Formik
                    initialValues={{ ...initialValues }}
                    enableReinitialize
                  >
                    {() => (
                      <div className="uploadDocument text-center ">
                        <h6 className="font-sb mb-0">Choose a Document</h6>
                        <p>{validFileName && `Upload a ${validFileName}`}</p>
                        <RippleEffect>
                          {/* <UploadInput
                            name="file"
                            uploadFileName={props.values.file}
                            apiEndPoints="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            type="file"
                            id="uploadId"
                            setFileUplod={setFileUplod}
                            setFileDetails={setFileDetails}
                            // mediaUrl={mediaUrl}
                            // stepTwoImage={stepTwoImage}
                            // defaultImageUrl={`${config.IMAGE_URL}/profile-img.jpg`}
                            setFieldValue={props.handleChange}
                            validateFileType={validFile?.validation || false}
                            validateFileTypename={validFileName || ""}
                            applyImageCropper={false}
                          > */}

                          <CommonButton
                            as="label"
                            variant="primary"
                            loading={textLoading}
                            onClick={() => {
                              if (remainingCount <= 0) {
                                errorMsgCount0();
                                setfileDisable(true);
                              } else setfileDisable(false);
                            }}
                          >
                            <input
                              className="d-none"
                              type="file"
                              id="file"
                              name="file"
                              disabled={fileDisable}
                              // accept="application/msword, text/plain, audio/mpeg"
                              onChange={() => validateFileType("file")}
                            />
                            Browse
                          </CommonButton>
                          {/* </UploadInput> */}
                        </RippleEffect>
                      </div>
                    )}
                  </Formik>
                )}
              </div>
            </Col>
            <Col sm={6}>
              <div className="translateBar_body_right position-relative">
                {/* download button */}
                {fileUplod &&
                  (translateLoading ? (
                    <GlobalLoader />
                  ) : recallLoading ? (
                    <GlobalLoader />
                  ) : (
                    translatedDocument !== "" && (
                      <div className="uploadDocument uploadDocument-file text-center">
                        <div className="uploadDocument_wrap">
                          <ImageElement
                            source={fileIcon?.[fileDetails?.type]}
                            alt={fileIcon?.[fileDetails?.type]}
                          />
                          <h6 className="font-sb mb-0 text-break">
                            {translatedDocument?.substring(
                              translatedDocument?.lastIndexOf("/") + 1,
                              translatedDocument?.length
                            )}
                          </h6>
                          {/* <p className="mb-0">448 Kb</p> */}
                          {/* <Link className="closeIcon">
                            <em className="icon-close" />
                          </Link> */}
                        </div>
                        <RippleEffect>
                          {/* <CommonButton variant="primary">
                            {" "}
                            <em className="icon-download icon-left" /> Download
                          </CommonButton> */}
                          <a
                            className="btn btn-primary"
                            href={translatedDocument}
                            download
                            target="_blank"
                            rel="noreferrer"
                          >
                            <em className="icon-download icon-left" /> Download
                          </a>
                        </RippleEffect>
                      </div>
                    )
                  ))}
              </div>
            </Col>
          </Row>
        </div>
      )}
      {fromLangDropdown && (
        <LanguageDropdown
          langDropdownClose={fromLangDropdownClose}
          setLanguage={onFromLanguageChange}
          languageData={languageList}
          // autoDetectLanguage={autoDetectLanguage}
          search={search}
          setSearch={setSearch}
          defaultKey={defaultKey}
        />
      )}
      {toLangDropdown && (
        <LanguageDropdown
          langDropdownClose={toLangDropdownClose}
          setLanguage={setToLanguage}
          languageData={languageList}
          // autoDetectLanguage={autoDetectLanguage}
          search={search}
          setSearch={setSearch}
          defaultKey={defaultKey}
        />
      )}
    </div>
  );
  const audioTranslate = (
    <div className="translateBar bg-white">
      <TranslateBar />

      {!(fromLangDropdown || toLangDropdown) && (
        <div className="translateBar_body">
          <Row className="g-0">
            <Col sm={6}>
              <div className="translateBar_body_left position-relative">
                {speechLoading || translateLoading ? (
                  <div className="loaderView">
                    <GlobalLoader />
                  </div>
                ) : (
                  <>
                    <TextArea
                      readOnly
                      dir={fromLanguage?.rtl ? "rtl" : "ltr"}
                      rows={5}
                      placeholder="Translation"
                      value={translateSpeechData}
                    />
                  </>
                )}
                {/* {fileUplod ? (
                  <>
                    <div className="uploadDocument uploadDocument-file text-center">
                      <div className="uploadDocument_wrap">
                        <ImageElement
                          source={fileIcon?.[fileDetails?.type]}
                          alt={fileIcon?.[fileDetails?.type]}
                        />
                        <h6 className="font-sb mb-0 text-break">
                          {fileDetails?.name}
                        </h6>
                        <p className="mb-0">{fileDetails?.size} Kb</p>
                        <Link
                          className="closeIcon"
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            documentReset();
                          }}
                        >
                          <em className="icon-close" />
                        </Link>
                      </div>
                    </div>
                    <div className="audioTranslate d-flex mt-3">
                      <AudioRecorder
                        voiceTranslate={voiceTranslate}
                        setVoiceTranslate={setVoiceTranslate}
                        speechToTextTranslation={speechToTextTranslation}
                        remainingCount={remainingCount}
                        totalCount={totalCount}
                        isAudio={isAudio}
                        documentReset={documentReset}
                      />
                      <RippleEffect>
                        <CommonButton
                          // disabled={translate}
                          onClick={() => translateClick("audio")}
                          variant="primary"
                        >
                          Translate
                        </CommonButton>
                      </RippleEffect>
                    </div>
                  </>
                ) : ( */}
                <Formik initialValues={{ ...initialValues }} enableReinitialize>
                  {() => (
                    <>
                      {/* <div className="uploadDocument text-center ">
                        <h6 className="font-sb mb-0">Choose a Document</h6>
                        <p>{validFileName && `Upload a ${validFileName}`}</p>
                      </div> */}
                      <div className="audioTranslate d-flex">
                        <AudioRecorder
                          voiceTranslate={voiceTranslate}
                          setVoiceTranslate={setVoiceTranslate}
                          speechToTextTranslation={speechToTextTranslation}
                          remainingCount={remainingCount}
                          totalCount={totalCount}
                          isAudio={isAudio}
                          documentReset={documentReset}
                        />
                        <RippleEffect>
                          {/* <UploadInput
                            name="file"
                            uploadFileName={props.values.file}
                            apiEndPoints="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            type="file"
                            id="uploadId"
                            setFileUplod={setFileUplod}
                            setFileDetails={setFileDetails}
                            // mediaUrl={mediaUrl}
                            // stepTwoImage={stepTwoImage}
                            // defaultImageUrl={`${config.IMAGE_URL}/profile-img.jpg`}
                            setFieldValue={props.handleChange}
                            validateFileType={validFile?.validation || false}
                            validateFileTypename={validFileName || ""}
                            applyImageCropper={false}
                          > */}

                          <CommonButton
                            as="label"
                            variant="primary"
                            extraClassName="btn-sm mw-auto"
                            loading={textLoading}
                            onClick={() => {
                              if (remainingCount <= 0) {
                                errorMsgCount0();
                                setfileDisable(true);
                              } else setfileDisable(false);
                            }}
                          >
                            <input
                              className="d-none"
                              type="file"
                              id="audio"
                              name="audio"
                              // accept="application/msword, text/plain, audio/mpeg"
                              disabled={fileDisable}
                              onChange={() => {
                                validateFileType("audio");
                              }}
                            />
                            Browse
                          </CommonButton>
                          {/* </UploadInput> */}
                        </RippleEffect>
                      </div>
                    </>
                  )}
                </Formik>
                {/* )} */}
              </div>
            </Col>
            <Col sm={6}>
              <div className="translateBar_body_right position-relative">
                {speechLoading || translateLoading ? (
                  <GlobalLoader />
                ) : (
                  <>
                    <TextArea
                      dir={toLanguage?.rtl ? "rtl" : "ltr"}
                      value={translatedSpeechData}
                      readOnly
                      rows={5}
                    />
                    {translatedSpeechData?.length > 0 && (
                      <div className="translateBar_bottom d-flex align-items-center justify-content-between">
                        <ul className="list-inline mb-0">
                          <li className="list-inline-item">
                            <Link
                              to="#"
                              onClick={(e) => {
                                e.preventDefault();
                                copyToClipboard(translatedSpeechData);
                                modalNotification({
                                  type: "success",
                                  message: "Text copied to clipboard",
                                });
                              }}
                            >
                              <em className="icon-copy" />
                            </Link>
                          </li>
                          {/* {isFromVoiceSupported && (
                            <li className="list-inline-item">
                              <Link
                                to="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  if ("speechSynthesis" in window) {
                                    if (toLanguage?.code_alpha_1) {
                                      textSpeech(
                                        translatedSpeechData,
                                        toLanguage?.code_alpha_1
                                      );
                                    }
                                  } else {
                                    modalNotification({
                                      type: "error",
                                      message:
                                        "Web Speech API not supported :-(",
                                    });
                                  }
                                }}
                              >
                                <em className="icon-sound" />
                              </Link>
                            </li>
                          )} */}
                        </ul>
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
          </Row>
        </div>
      )}
      {fromLangDropdown && (
        <LanguageDropdown
          langDropdownClose={fromLangDropdownClose}
          setLanguage={onFromLanguageChange}
          languageData={speechLanguageList}
          // autoDetectLanguage={autoDetectLanguage}
          search={search}
          setSearch={setSearch}
          defaultKey={defaultKey}
        />
      )}
      {toLangDropdown && (
        <LanguageDropdown
          langDropdownClose={toLangDropdownClose}
          setLanguage={setToLanguage}
          languageData={speechLanguageList}
          // autoDetectLanguage={autoDetectLanguage}
          search={search}
          setSearch={setSearch}
          defaultKey={defaultKey}
        />
      )}
    </div>
  );

  const getTabs = () => {
    let tabs = [];
    if (translationSubscription?.includes("plainText")) {
      tabs.push({
        title: "Translate Text",
        subTitle: `${languageData?.length} Languages`,
        key: "translateText",
        content: textTranslate,
        icon: "icon-language flex-shrink-0",
      });
    }
    if (translationSubscription?.includes("document")) {
      tabs.push({
        title: "Translate Document",
        subTitle: `${languageData?.length} Languages`,
        key: "translateFiles",
        content: fileTranslate,
        icon: "icon-files flex-shrink-0",
      });
    }
    if (translationSubscription?.includes("audioVideo")) {
      tabs.push({
        title: "Translate Audio",
        subTitle: `${speechLanguages?.length} Languages`,
        key: "translateAudio",
        content: audioTranslate,
        icon: "icon-record flex-shrink-0",
      });
    }
    if (translationSubscription?.includes("html")) {
      tabs.push({
        title: "Translate HTML",
        subTitle: `${languageData?.length} Languages`,
        key: "translateHTML",
        content: textTranslate,
        icon: "icon-html flex-shrink-0",
      });
    }
    return tabs;
  };
  let userSubscription = getTabs();

  useEffect(() => {
    setDefaultKey(userSubscription?.[0]?.key || "translateText");
  }, [userActiveSubscription]);

  useEffect(() => {
    setSearch("");
    setfromLangDropdown(false);
    settoLangDropdown(false);
    setTranslateData("");
    setTranslatedData("");
    documentReset();
    setTranslatedSpeechData("");
    setTranslateSpeechData("");
    setfileDisable(false);
    if (defaultKey === "translateText") {
      setFromLanguage({
        code_alpha_1: undefined,
        codeName: "Auto Detection",
        rtl: false,
      });
    } else if (defaultKey === "translateAudio") {
      setFromLanguage(speechLanguages?.[0] ?? {});
      setToLanguage({});
    } else {
      setFromLanguage(languageList?.[0] ?? {});
      setToLanguage({});
    }
  }, [defaultKey]);

  useEffect(() => {
    if (userProfileData?.language_id) {
      let getLanguage = filterLanguage(
        languageData,
        userProfileData?.language_id,
        "codeName"
      );
      setToLanguage(getLanguage?.[0]);
    }
  }, [userProfileData]);

  const getTranslatedData = async (textData) => {
    setTextLoading(true);
    try {
      if (remainingCount > 0) {
        if (toLanguage?.code_alpha_1) {
          if (textData) {
            let bodyData = {
              text: textData,
              source_language: fromLanguage?.code_alpha_1,
              target_language: toLanguage?.code_alpha_1,
            };

            const res =
              defaultKey === "translateText"
                ? await TranslateServices.translateTextService(bodyData)
                : await TranslateServices.translateHtmlService(bodyData);
            const { status, code, data, meta } = res;
            if (status === "success" && code === "OK") {
              if (fromLanguage?.code_alpha_1 === undefined) {
                let detectedLanguage = filterLanguage(
                  languageData,
                  data?.detectedSourceLanguage,
                  "code_alpha_1",
                  true
                );
                setFromLanguage(detectedLanguage?.[0]);
              }
              setTranslatedData(data?.translatedText);
              getRemainingCount(meta?.total_char_count);
            } else {
              modalNotification({
                type: "error",
                message: "Something went wrong",
              });
            }
          } else {
            setTranslatedData(textData);
          }
        } else {
          modalNotification({
            type: "error",
            message: "Target Language should not be auto detect",
          });
        }
      } else {
        modalNotification({
          type: "error",
          message: "Your remaining count is exceed over limit",
        });
      }
    } catch (error) {
      logger(error);
    }
    setTextLoading(false);
  };

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     if (
  //       (translateData.length >= 3 || translateData.length === 0) &&
  //       firstTimeFetch
  //     ) {
  //       getTranslatedData(translateData);
  //     }
  //   }, 700);

  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [translateData]);

  useEffect(() => {
    setFirstTimeFetch(true);
  }, []);

  // useEffect(() => {
  //   if (
  //     fromLanguage?.code_alpha_1 &&
  //     toLanguage?.code_alpha_1 &&
  //     translateData
  //   ) {
  //     getTranslatedData(translateData);
  //   }
  // }, [toLanguage?.code_alpha_1, fromLanguage?.code_alpha_1]);

  useEffect(() => {
    // if (languageData?.length === 0) {
    dispatch(getLanguageList());
    // }
    const activeAcc = getActiveAccount(account);
    let queryParams = {
      is_corporate: getIscorporateActive(account),
      corporate_id: activeAcc?.id,
    };
    dispatch(getUserSubscription({ queryParams }));
  }, []);

  useEffect(() => {
    let triggerTabList = document.querySelectorAll(
      ".langTranslate_tab .nav-link"
    );
    triggerTabList?.forEach(function (triggerEl) {
      triggerEl.addEventListener("click", function () {
        setfromLangDropdown(false);
      });
    });
  }, []);

  return (
    <>
      <section className="translationPage py-70">
        <Container>
          <div className="text-center heading mx-auto">
            <h3 className="heading_sub font-ad">Translate</h3>
            <h1 className="heading_main">Language Is No Barrier In Daakia</h1>
            <p className="mb-0">
              Whether text, document, HTML or media files; translate with high
              accuracy through our AI powered translation engine.
            </p>
          </div>
        </Container>
        <div className="langTranslate">
          <Container>
            {getTabs().length > 0 ? (
              <Tabs
                tabContent={userSubscription}
                activeKey={defaultKey}
                setActiveKey={setDefaultKey}
                // navDivClassName="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between purchasePlan_head"
                navClass="langTranslate_tab border-0 justify-content-center"
                navLinkClass="d-flex align-items-center"
                // codeData={codeData}
                // priceMonth={priceMonth}
                // setPriceMonth={setPriceMonth}
                // onTabChange={onTabChange}
              />
            ) : (
              <div className="emptySec text-center w-100">
                <ImageElement
                  source="translation-services.svg"
                  alt="No Data Found"
                />
                <h2>{t("text.common.noData")}</h2>
                {!isGuest && (
                  <Link
                    to={userRoutesMap.PURCHASE_PLAN.path}
                    className="btn btn-primary btn-md"
                  >
                    {t("text.planAndSubscription.purchasePlan")}
                  </Link>
                )}
                {/* <p className="mb-0">
                  There are no Pricing Plan to show here right now.
                </p> */}
              </div>
            )}

            {getTabs().length > 0 && (
              <div className="d-sm-flex align-items-center justify-content-center staticInfo">
                <div className="staticInfo_box d-flex align-items-center">
                  <ImageElement
                    source="characters-sign.svg"
                    alt="Characters-sign"
                  />
                  <div>
                    {translatedCount} <span>Characters Translated</span>
                  </div>
                </div>
                <div className="staticInfo_box d-flex align-items-center">
                  <ImageElement
                    source="characters-sign.svg"
                    alt="Characters-sign"
                  />
                  <div>
                    {remainingCount} <span>Characters Remaining</span>
                  </div>
                </div>
              </div>
            )}
          </Container>
        </div>
      </section>
    </>
  );
}

export default Translation;
