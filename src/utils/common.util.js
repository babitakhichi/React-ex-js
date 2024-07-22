import CryptoJS from "crypto-js";
import moment from "moment";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import config from "../config";
import modalNotification from "./notifications";
import {
  commasFormatter,
  subscriptionFeaturesLabelFormatter,
  textFormatter,
  translationTypeFormatter,
} from "../components";
// import { subscriptionData } from "../config/subscriptonData";

const getItem = (path, label, key, icon, children) => {
  if (children) {
    return { label, key, icon, children, path };
  }
  return { label, key, icon, path };
};

export const getHeaderData = (arr) => {
  if (arr instanceof Array) {
    return arr.reduce((prev, item) => {
      if (item?.belongsToHeader) {
        if (item.children instanceof Array) {
          const children = item.children.reduce(
            (prevElement, currentSubChild) => {
              if (currentSubChild?.belongsToHeader) {
                prevElement.push(
                  getItem(
                    currentSubChild?.path,
                    currentSubChild?.name,
                    currentSubChild?.key,
                    currentSubChild?.icon,
                    ""
                  )
                );
              }
              return prevElement;
            },
            []
          );
          prev.push(
            getItem(item?.path, item?.name, item?.key, item?.icon, children)
          );
        } else {
          prev.push(getItem(item?.path, item?.name, item?.key, item?.icon));
        }
      }
      return prev;
    }, []);
  }
  return [];
};
export const makeValidLink = (data) => {
  let link = `${
    data?.url?.search("http") < 0 ? `http://${data?.url}` : `${data?.url}`
  }`;
  return link;
};
export const phoneNumberField = (e) => {
  let ASCIICode = e.which ? e.which : e.keyCode;
  if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) {
    e.preventDefault();
  }
};
export const getFooterLink = (arr) => {
  if (arr instanceof Array) {
    return arr.reduce((prev, item) => {
      if (item?.belongsToFooter) {
        if (item.children instanceof Array) {
          const children = item.children.reduce(
            (prevElement, currentSubChild) => {
              if (currentSubChild?.belongsToFooter) {
                prevElement.push(
                  getItem(
                    currentSubChild?.path,
                    currentSubChild?.name,
                    currentSubChild?.key,
                    currentSubChild?.icon,
                    ""
                  )
                );
              }
              return prevElement;
            },
            []
          );
          prev.push(
            getItem(item?.path, item?.name, item?.key, item?.icon, children)
          );
        } else {
          prev.push(getItem(item?.path, item?.name, item?.key, item?.icon));
        }
      }
      return prev;
    }, []);
  }
  return [];
};

export const removeSessionStorageToken = () => {
  if (sessionStorage.getItem(`${config.NAME_KEY}:token`)) {
    sessionStorage.setItem(`${config.NAME_KEY}:token`, null);
  }
};

export const setSessionStorageToken = (token) => {
  sessionStorage.setItem(
    `${config.NAME_KEY}:token`,
    CryptoJS.AES.encrypt(token, `${config.NAME_KEY}-token`).toString()
  );
};

export const setSessionStorage = (keyName, formData) => {
  let stringData = JSON.stringify(formData);
  sessionStorage.setItem(
    `${config.NAME_KEY}:${keyName}`,
    CryptoJS.AES.encrypt(stringData, `${config.NAME_KEY}-${keyName}`).toString()
  );
};

export const getSessionStorage = (keyName) => {
  const cipherText = sessionStorage.getItem(`${config.NAME_KEY}:${keyName}`);
  if (cipherText) {
    const bytes = CryptoJS.AES.decrypt(
      cipherText,
      `${config.NAME_KEY}-${keyName}`
    );
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  return false;
};

export const removeSessionStorage = (keyName) => {
  if (sessionStorage.getItem(`${config.NAME_KEY}:${keyName}`)) {
    sessionStorage.setItem(`${config.NAME_KEY}:${keyName}`, "");
  }
};

export const removeLocalStorageToken = (navigate) => {
  if (localStorage.getItem(`${config.NAME_KEY}:token`)) {
    localStorage.setItem(`${config.NAME_KEY}:token`, null);
  }
  if (navigate) {
    navigate("/");
  }
};

export const getSessionStorageToken = () => {
  const ciphertext = sessionStorage.getItem(`${config.NAME_KEY}:token`);
  if (ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, `${config.NAME_KEY}-token`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return false;
};

export const setLocalStorage = (keyName, formData) => {
  let stringData = JSON.stringify(formData);
  localStorage.setItem(
    `${config.NAME_KEY}:${keyName}`,
    CryptoJS.AES.encrypt(stringData, `${config.NAME_KEY}-${keyName}`).toString()
  );
};

export const getLocalStorage = (keyName) => {
  const cipherText = localStorage.getItem(`${config.NAME_KEY}:${keyName}`);
  if (cipherText) {
    const bytes = CryptoJS.AES.decrypt(
      cipherText,
      `${config.NAME_KEY}-${keyName}`
    );
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  return false;
};

export const removeLocalStorage = (keyName) => {
  if (localStorage.getItem(`${config.NAME_KEY}:${keyName}`)) {
    localStorage.setItem(`${config.NAME_KEY}:${keyName}`, "");
  }
};

export const setLocalStorageToken = (token) => {
  localStorage.setItem(
    `${config.NAME_KEY}:token`,
    CryptoJS.AES.encrypt(token, `${config.NAME_KEY}-token`).toString()
  );
};

export const getLocalStorageToken = () => {
  const token = localStorage.getItem(`${config.NAME_KEY}:token`);
  if (token) {
    const bytes = CryptoJS.AES.decrypt(token, `${config.NAME_KEY}-token`);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
  return false;
};

export const getLocalStorageLanguage = () => {
  const language = localStorage.getItem(`${config.NAME_KEY}:language`);
  if (language) {
    return ["en", "hi"].includes(language) ? language : config.DEFAULT_LANGUAGE;
  }
  return config.DEFAULT_LANGUAGE;
};

export const getCompleteUrl = (url) => {
  return url;
};

export function decodeQueryData(data) {
  return JSON.parse(
    `{"${decodeURI(data)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace("?", "")}"}`
  );
}

export const navigateWithParam = (data, navigate, pathname) => {
  const searchParams = new URLSearchParams(data).toString();
  navigate(`${pathname}?${searchParams}`);
};

export function getSortType(data) {
  return data === "ASC" ? "asc" : "desc";
}

export function dateFormatter(params, format) {
  return moment(params)
    .tz(moment.tz.guess())
    .format(format ?? config.DATE_FORMAT);
}
export const totalTimeDifference = (createdAt, updatedAt) => {
  let startTime = moment(createdAt);

  let endTime = moment(updatedAt);

  let difference = startTime.from(endTime);
  return difference;
};
export function dateNewFormatter(params, oldFormat, format) {
  return moment(params, oldFormat)
    .tz(moment.tz.guess())
    .format(format ?? config.DATE_FORMAT);
}

export function filterDateFormatter(param, format) {
  return moment(param).format(format);
}

export function momentDateFormatter(param, format) {
  return moment(param, format).tz(moment.tz.guess());
}

export function momentTimezoneFormatter(param) {
  return moment(param).tz(moment.tz.guess());
}

export function momentDateTimeTimezoneFormatter(param, timezone, format) {
  if (format) {
    return moment.tz(param, timezone).format(format);
  } else {
    return moment.tz(param, timezone);
  }
}

export function readMoreTextShow(data, showMoreText) {
  if ([undefined, null, false].includes(data)) {
    return <></>;
  }
  if (data.length < 50) {
    return <>{data}</>;
  }

  return (
    <p className="mb-0">
      {data.substring(0, 50)}...
      {showMoreText ? (
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            showMoreText({ data });
          }}
        >
          Read More
          {/* {t("common.readMore")} */}
        </Link>
      ) : (
        ""
      )}
    </p>
  );
}

export function PhoneNumber({ countryCode, contactNumber }) {
  if (countryCode && contactNumber) {
    return <>{`${countryCode}-${contactNumber}`}</>;
  }
  return <span className="center">-</span>;
}
export function PhoneNumberCountry({ countryCode, contactNumber }) {
  let code = "";
  if (countryCode !== null) {
    if (countryCode.toString().includes("+")) code = countryCode;
    else code = `+${countryCode}`;
  }
  if (countryCode !== null && contactNumber !== null) {
    return <>{`${code}-${contactNumber}`}</>;
  } else if (countryCode === null && contactNumber !== null) {
    return <>{`${contactNumber}`}</>;
  } else return <span className="center">-</span>;
}
export function otpRegex() {
  let regex = /^[0-9]+$/;
  return regex;
}

export function phoneRegex() {
  let regex =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  return regex;
}

export function getSideBarData(arr) {
  if (arr instanceof Array) {
    return arr.reduce((prev, item) => {
      if (item?.belongsToSidebar) {
        if (item.children instanceof Array) {
          const children = item.children.reduce(
            (prevElement, currentSubChild) => {
              if (currentSubChild?.belongsToSidebar) {
                prevElement.push(
                  getItem(
                    currentSubChild?.path,
                    currentSubChild?.name,
                    currentSubChild?.key,
                    currentSubChild?.icon,
                    ""
                  )
                );
              }
              return prevElement;
            },
            []
          );
          prev.push(
            getItem(item?.path, item?.name, item?.key, item?.icon, children)
          );
        } else {
          prev.push(getItem(item?.path, item?.name, item?.key, item?.icon));
        }
      }
      return prev;
    }, []);
  }
  return [];
}

export const disabledFutureDate = (current) => {
  return current > moment();
};

export const disabledPastDate = (current, startDate = new Date()) => {
  return (
    moment(
      moment(startDate).add(0, "days").format("DD-MM-YYYY"),
      "DD-MM-YYYY"
    ) > moment(current.format("DD-MM-YYYY"), "DD-MM-YYYY")
  );
};
export const disabledPastDateCurrent = (current) => {
  return moment().add(0, "days") >= current;
};
export const disabledPastTime = (date, data = moment(new Date())) => {
  let hours = [];
  const currentDate = data;
  if (
    !(
      moment(date, "YYYY-MM-DD").format("YYYY-MM-DD") ===
      moment(date).format("YYYY-MM-DD")
    )
  )
    date = moment(date, "YYYY-MM-DD").format("YYYY-MM-DD");
  if (currentDate.format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")) {
    [...new Array(60)].forEach((item, key) => {
      if (key < currentDate.format("HH")) {
        hours.push(key);
      }
    });
  }

  return {
    disabledHours: () => hours,
    disabledMinutes: (selectedHour) => {
      let disabled = [];
      if (
        currentDate.format("YYYY-MM-DD") ===
          moment(date).format("YYYY-MM-DD") &&
        selectedHour === Number(currentDate.format("HH"))
      ) {
        [...new Array(60)].forEach((item, key) => {
          if (key < currentDate.format("mm")) {
            disabled.push(key);
          }
        });
      }
      return disabled;
    },
  };
};

export function encoder(code) {
  return window.btoa(code);
}
export function decoder(str) {
  // return window.atob(code);
  if (str === "" || str.trim() === "") {
    return false;
  }
  try {
    return window.atob(str);
  } catch (err) {
    modalNotification({
      type: "error",
    });
    return false;
  }
}

export const encodeSubscriptionJson = (data) => {
  let arr = [];
  Object.keys(data)?.forEach((item) => {
    if (data[item] === true) {
      arr.push(item);
    }
  });
  return arr;
};

export const decodeSubscriptionJson = (data, userSubscriptionData) => {
  let mainObj = {};
  if (data.length > 0) {
    userSubscriptionData?.forEach((item) => {
      if (data.includes(item?.name)) {
        mainObj[item?.name] = true;
      } else {
        mainObj[item?.name] = false;
      }
    });
  }

  return mainObj;
};

export const disableStartDateFutureDays = (
  current,
  values,
  dateFormat,
  initialValues
) => {
  let date;
  const end = momentDateFormatter(values.endDate, dateFormat);
  if (values.endDate === "") {
    date = !current.isBefore(moment());
  } else if (initialValues?.startDate || values.startDate === "") {
    date = !(current.isBefore(moment()) && end.isAfter(current));
  } else {
    date = !(current.isBefore(moment()) && end.add(1, "day").isAfter(current));
  }

  return date;
};

export const disableEndDateFutureDays = (current, dateFormat, fromDate) => {
  let date;
  let start;
  if (fromDate === "") {
    start = momentDateFormatter(new Date(), dateFormat);
    // date = !start.isSameOrBefore(current);
  } else {
    start = momentDateFormatter(fromDate, dateFormat);
  }
  date = !(current.isSameOrAfter(start) && current.isSameOrBefore(moment()));
  return date;
};

export const allCountryData = (data) => {
  let mainObj = {
    counrty: [],
    label: {},
  };
  data.forEach((item) => {
    if (item?.country_short_code) {
      mainObj.counrty.push(item?.country_short_code);
    }
    if (item?.country_code) {
      mainObj.label[item.country_short_code] = {
        // primary: `${item?.country_name}`,
        primary: `+${item?.country_code}`,
      };
    }
  });
  return mainObj;
};

export const filterCountryCode = (code, data = []) => {
  let codeData = {};
  data.forEach((item) => {
    if (item?.id === code) {
      codeData = { ...item };
    }
  });

  return codeData;
};

export const getUniqueListBy = (arr, key1) => {
  return [...new Map(arr.map((item) => [item[key1], item])).values()];
};

export const filterLanguage = (list, name, checkKey = "", find = false) => {
  if (list?.length > 0) {
    let data = [];
    let shouldSkip = false;
    list.forEach((item) => {
      return Object.keys(item).forEach((key) => {
        if (shouldSkip) {
          return;
        }
        if (typeof item?.[key] === "string") {
          if (checkKey && item?.[checkKey]?.includes(name)) {
            if (find) {
              shouldSkip = true;
            }
            data.push(item);
          } else if (new RegExp(name, "i").test(item?.[key])) {
            data.push(item);
          }
        }
      });
    });
    data = getUniqueListBy(data, "code_alpha_1");
    return data;
  }
};

export const stringToHTML = (str) => {
  return parse(str);
};
export const getCharLeft = (char, maxChar) => {
  if (char && maxChar)
    return `${maxChar - char?.replaceAll(" ", "")?.length}/${maxChar}`;
  else return `${maxChar}/${maxChar}`;
};

export const dateValidationForDOB = (param) => {
  return moment().subtract(param, "days");
};

export const momentTimeFormatter = (param) => {
  return moment(param);
};

export const agoDateTime = (addHour, addType, format, date = "") => {
  let getCurrentTime = momentTimeFormatter(date || new Date());
  return getCurrentTime.add(addHour, addType).format(format);
};

export const beforeDateTime = (addHour, addType, format, date = "") => {
  let getCurrentTime = momentTimeFormatter(date || new Date());
  return getCurrentTime.subtract(addHour, addType).format(format);
};
export const addDateTime = (addHour, addType, format, date = "") => {
  let getCurrentTime = momentTimeFormatter(date || new Date());
  return getCurrentTime.add(addHour, addType).format(format);
};
export const validSubscriptionSwitch = (data) => {
  let checkDate = data?.createdAt
    ? momentTimeFormatter(data?.createdAt).add(7, "day")
    : false;
  let switchCheck = data?.is_switch;
  // return data ? checkDate >= momentTimeFormatter(new Date()) : false;
  return !switchCheck && checkDate >= momentTimeFormatter(new Date());
};

export const getCurrentActiveSubscription = (
  data,
  defaultKey,
  type = false
) => {
  let currentData = {};
  let shouldSkip = false;
  data.forEach((item) => {
    if (shouldSkip) {
      return;
    }
    if (item?.Subscription?.plan_type === defaultKey && !item?.is_base) {
      shouldSkip = true;
      currentData = { ...item };
    } else if (
      type === true &&
      (item?.Subscription?.plan_type === "bundled" ||
        item?.Subscription?.plan_type === defaultKey)
    ) {
      currentData = { ...item };
    }
  });

  return currentData;
};

export const planData = (item, priceMonth) => {
  let obj = {};
  if (priceMonth === "monthly") {
    obj.subscriptionPrice = item.price;
    obj.duration = 1;
    obj.planDuration = "Monthly";
  } else if (priceMonth === "quarterly") {
    obj.subscriptionPrice = item.quarterly;
    obj.duration = 3;
    obj.planDuration = "Quarterly";
  } else if (priceMonth === "halfyearly") {
    obj.subscriptionPrice = item.half_yearly;
    obj.duration = 6;
    obj.planDuration = "Half Yearly";
  } else if (priceMonth === "annual") {
    obj.subscriptionPrice = item.annual;
    obj.duration = 12;
    obj.planDuration = "Yearly";
  }
  return obj;
};

export const getTimezoneList = () => {
  let list = moment.tz.names();
  return list;
};

export const baseUrlGenerator = (link) => {
  return `${window.location.protocol}//${window.location.hostname}${
    window.location.port ? `:${window.location.port}` : ""
  }${link || ""}`;
};

export const copyToClipboard = (data) => {
  window.navigator.clipboard.writeText(data);
};

export const textSpeech = (text, lang) => {
  const synth = window.speechSynthesis;
  const utterThis = new SpeechSynthesisUtterance();
  utterThis.volume = 1; // From 0 to 1
  utterThis.rate = 1; // From 0.1 to 10
  utterThis.pitch = 1; // From 0 to 2
  utterThis.text = text;
  utterThis.lang = lang;

  if (!synth?.speaking) {
    synth.speak(utterThis);
  } else {
    synth.cancel();
    synth.speak(utterThis);
  }
};

export const translationFileTypeValidation = (data, tabName = "") => {
  let validFile = {
    name: [],
    validation: [],
  };
  let fileType = {
    pdf: "application/pdf",
    txt: "text/plain",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    img: "image/jpeg",
    gif: "image/gif",
    xlx: "text/csv",
    mp4: "video/mp4",
    mp3: "audio/mpeg",
  };
  if (tabName === "translateFiles") {
    if (data?.SubscriptionDocumentTypes?.length > 0) {
      data?.SubscriptionDocumentTypes?.forEach((item) => {
        validFile.validation.push(fileType[item?.document_type]);
        validFile.name.push(item?.document_type);
      });
    }
  } else if (tabName === "translateAudio") {
    if (data?.SubscriptionMediaTypes?.length > 0) {
      data?.SubscriptionMediaTypes?.forEach((item) => {
        validFile.validation.push(fileType[item?.media_type]);
        validFile.name.push(item?.media_type);
      });
    }
  }

  return validFile;
};
export const getTimeZoneData = (list, checkKey) => {
  let data = {};
  list.forEach((i) => {
    if (i.text === checkKey) {
      data = { ...i };
    }
  });
  return data;
};

export const showSubscriptionFeatures = (item) => {
  let html = "";
  let lables = subscriptionFeaturesLabelFormatter(
    item?.Subscription?.plan_type !== "bundled"
      ? item?.Subscription?.plan_type
      : ""
  );
  Object.keys(item?.Subscription?.SubscriptionFeature)?.forEach((data) => {
    if (
      (item?.Subscription?.SubscriptionFeature[data] === true ||
        item?.Subscription?.SubscriptionFeature[data] > 0) &&
      data !== "id" &&
      data !== "subscription_id" &&
      data !== "is_active"
    ) {
      if (lables[data]) {
        html += `<li class="d-flex">
      <em class="icon-check"></em>
     <p class="mb-0">${lables[data]}</p>
    </li>`;
      } else if (data === "audio_video_conference") {
        html += `<li class="d-flex"><em class="icon-check"></em><p class="mb-0">Audio & video conference
        <span class="font-sb">
          (Upto ${item?.Subscription?.SubscriptionFeature[data]} participants)
        </span></p></li>`;
      } else if (data === "meet_duration") {
        html += `<li class="d-flex">
        <em class="icon-check"></em>
        <p class="mb-0">Maximum meeting duration <span class="font-sb">
        (${item?.Subscription?.SubscriptionFeature[data]} minutes)
      </span>
      </p>
      </li>`;
      } else if (data === "translation") {
        html += `<li class="d-flex">
        <em class="icon-check"></em>
        <p class="mb-0"> ${lables.freeCharacters_checkbox} <span class="font-sb">
        (${item?.Subscription?.SubscriptionFeature[data]} characters)
      </span></p>
      </li>`;
      }
    }
  });
  if (item?.Subscription?.SubscriptionTranslationTypes?.length > 0) {
    html += `<li class="d-flex">
  <em class="icon-check"></em>
  <p class="mb-0">${lables.translationCheckbox} <span class="font-sb">
  (${commasFormatter(
    item?.Subscription?.SubscriptionTranslationTypes?.map((type) => {
      return `${translationTypeFormatter(type?.translation_type)}`;
    })
  )})
</span></p>
</li>`;
  }
  if (item?.Subscription?.SubscriptionDocumentTypes?.length > 0) {
    html += `<li class="d-flex">
  <em class="icon-check"></em>
  <p class="mb-0">${lables.documentTranslationCheckbox} <span class="font-sb">
  (${commasFormatter(
    item?.Subscription?.SubscriptionDocumentTypes?.map((type) => {
      return `${textFormatter(type?.document_type)}`;
    })
  )})
</span></p>
</li>`;
  }
  if (item?.Subscription?.SubscriptionMediaTypes?.length > 0) {
    html += `<li class="d-flex">
  <em class="icon-check"></em>
  <p class="mb-0">${lables.mediaTranslationCheckbox} <span class="font-sb">
  (${commasFormatter(
    item?.Subscription?.SubscriptionMediaTypes?.map((type) => {
      return `${textFormatter(type?.media_type)}`;
    })
  )})
</span></p>
</li>`;
  }
  return html;
};

export const stripAllTags = (data) => {
  return data?.replace(/(<([^>]+)>)/gi, "");
};

export const getSplittedUsername = (fullname) => {
  const nameArr = fullname.split(" ");
  return [nameArr.splice(0, 1)?.[0], nameArr.toString().replaceAll(",", " ")];
};
export const getIscorporateActive = (data) => {
  let isCorporate = false;
  if (data?.length > 0) {
    let checkData = data?.find((acc) => acc?.status === "1");
    if (checkData) {
      isCorporate = checkData?.account !== "Personal Account";
    }
  }
  return isCorporate;
};
export const getActiveAccount = (data) => {
  let active = data?.length > 0 && data?.find((acc) => acc?.status === "1");
  return active;
};
export const dateDifferenceMonthDays = (start, end) => {
  let startDate = moment(start, "YYYY-MM-DD");
  let endDate = moment(end, "YYYY-MM-DD");
  let monthsDiff = endDate.diff(startDate, "months");
  startDate.add(monthsDiff, "months");
  let daysDiff = endDate.diff(startDate, "days");

  let difference = "";
  if (monthsDiff > 0) difference = `${monthsDiff} months`;
  if (daysDiff > 0) difference += ` ${daysDiff} days`;

  return difference;
};
