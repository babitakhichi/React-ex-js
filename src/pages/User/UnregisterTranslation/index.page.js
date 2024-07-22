import TextArea from "antd/lib/input/TextArea";

import React, { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  checkValidCount,
  CommonButton,
  GlobalLoader,
  ImageElement,

  // subscriptionpPlanFormetter,
  Tabs,

  // UploadInput,
} from "../../../components";
import {
  getLanguageList,
  selectLanguageData,
  selectProfileData,
  selectSubscriptionData,
} from "../../../redux/UserSlice/index.slice";

import { TranslateServices } from "../../../services";
import {
  copyToClipboard,
  filterLanguage,
  getCharLeft,
  logger,
  modalNotification,
  stripAllTags,
  // textSpeech,
} from "../../../utils";
import LanguageDropdown from "../Translation/LanguageDropdown";

function UnregisterTranslation({ basicActiveTranslation }) {
  const dispatch = useDispatch();
  const languageData = useSelector(selectLanguageData);

  const userActiveSubscription = useSelector(selectSubscriptionData);
  const userProfileData = useSelector(selectProfileData);
  const [translatedCount, setTranslatedCount] = useState(0);

  // const totalCount = useMemo(() => {
  //   // if (userActiveSubscription?.length > 0) {
  //   //   return currentSubscription?.Subscription?.SubscriptionFeature
  //   //     ?.translation;
  //   // }
  //   return 200;
  // }, []);
  const totalCount = useMemo(() => {
    if (basicActiveTranslation?.id) {
      return basicActiveTranslation?.SubscriptionFeature?.translation;
    }
  }, [basicActiveTranslation]);

  let remainingCount = useMemo(() => {
    if (checkValidCount(totalCount) - checkValidCount(translatedCount) > 0) {
      return checkValidCount(totalCount) - checkValidCount(translatedCount);
    } else {
      return 0;
    }
  }, [translatedCount]);
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

  const [translatedSpeechData, setTranslatedSpeechData] = useState("");
  const [translateSpeechData, setTranslateSpeechData] = useState("");

  const [textLoading, setTextLoading] = useState(false);
  // const [voiceSupportedList, setVoiceSupportedList] = useState([]);

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

  const languageList = useMemo(() => {
    if (search?.length >= 1 && firstTimeFetch) {
      return filterLanguage(languageData, search, "codeName");
    } else {
      return languageData;
    }
  }, [search]);

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

  let userSubscription = [
    {
      title: "Translate Text",
      subTitle: `${languageData?.length} Languages`,
      key: "translateText",
      content: textTranslate,
      icon: "icon-language flex-shrink-0",
    },
  ];

  useEffect(() => {
    setDefaultKey(userSubscription?.[0]?.key || "translateText");
  }, [userActiveSubscription]);

  useEffect(() => {
    setSearch("");
    setfromLangDropdown(false);
    settoLangDropdown(false);
    setTranslateData("");
    setTranslatedData("");

    setTranslatedSpeechData("");
    setTranslateSpeechData("");

    if (defaultKey === "translateText") {
      setFromLanguage({
        code_alpha_1: undefined,
        codeName: "Auto Detection",
        rtl: false,
      });
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
              setTranslatedCount(meta?.total_char_count + translatedCount);
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
      <section className="translationPage pt-4 pt-xxl-5">
        <div className="langTranslate">
          <Container>
            <Tabs
              tabContent={userSubscription}
              activeKey={defaultKey}
              // setActiveKey={setDefaultKey}
              // navDivClassName="d-flex flex-wrap flex-sm-nowrap align-items-center justify-content-between purchasePlan_head"
              navClass="langTranslate_tab border-0 justify-content-center"
              navLinkClass="d-flex align-items-center"
              // codeData={codeData}
              // priceMonth={priceMonth}
              // setPriceMonth={setPriceMonth}
              // onTabChange={onTabChange}
            />

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
          </Container>
        </div>
      </section>
    </>
  );
}

export default UnregisterTranslation;
