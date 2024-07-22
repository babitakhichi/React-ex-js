import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import config from "../../config";
import { subscriptionData } from "../../config/subscriptonData";
import adminRoutesMap from "../../routeControl/adminRoutes";

import { encoder, PhoneNumber, PhoneNumberCountry } from "../../utils";
import { AntTooltip } from "../Antd";
// import { EditCommissionForm } from "../Form";
import { ActionButton } from "../UiElement";

export const imageFormatter = (cell, text) => {
  return (
    <>
      {cell ? (
        <img className="category-img rounded-3" src={cell} alt="img" />
      ) : (
        text
      )}
    </>
  );
};

export const logoFormatter = (path, text) => {
  return (
    <>
      {path ? (
        <div className="table-img">
          <img src={path} alt="Category1" />
        </div>
      ) : (
        text
      )}
    </>
  );
};

function getButton(data, linkClass) {
  let element;
  if (data.action === "redirect") {
    element = (
      <Link to={data.path}>
        <em className={data.icon} /> {data.name}
      </Link>
    );
  } else if (data.action === "modal") {
    element = (
      <a data-bs-toggle="modal" href={data.path}>
        <em className={data.icon} /> {data.name}
      </a>
    );
  } else if (data.action === "confirm") {
    element = (
      <Link
        className={linkClass}
        to="#"
        onClick={(e) => {
          e.preventDefault();
          data.onClickHandle();
        }}
      >
        <em className={data.icon} /> {data.name}
      </Link>
    );
  }

  return element;
}

export function actionFormatter(options) {
  return (
    <>
      <div className="text-end">
        <Dropdown className="position-static">
          <Dropdown.Toggle as="a" className="btn btn-icon btn-trigger">
            <em className="icon ni ni-more-h" />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" size="sm" className="wide-xs">
            <ul className="link-list-plain">
              {options.map((item, key) => {
                return <li key={key}> {getButton(item)} </li>;
              })}
            </ul>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </>
  );
}
export function frontendActionFormatter(options) {
  return (
    <>
    <Dropdown className="tableDropdown position-static">
        <Dropdown.Toggle id="dropdown-basic">
            <em className="icon-toggle" />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          {options.map((item) => {
            return getButton(item, 'dropdown-item');
          })}
            {/* <Dropdown.Item onClick={() => handleAssignOtherShow()}><em className="icon-user-change" />Assign to other</Dropdown.Item> */}
        </Dropdown.Menu>
    </Dropdown>

    </>
  );
}

export const actionButtonFormatter = (btnText, status, onHandleAction) => {
  return (
    <>
      {status === "pending" ? (
        <ActionButton
          onHandleAction={() => {
            onHandleAction();
          }}
          btnText={btnText}
        />
      ) : (
        ""
      )}
    </>
  );
};

export const linkFormatter = (cell, link = "#", extraClassName = "") => {
  return (
    <Link className={`${extraClassName}`} to={link}>
      {cell}
    </Link>
  );
};

export const nameImageFormatter = (name, imgPath, path, email) => {
  return (
    <div>
      {name ? (
        <Link to={path} className="user-card">
          <div className="user-avatar">
            {imgPath ? (
              <img src={imgPath} alt="UserImage" />
            ) : (
              <img
                src={`${config.ADMIN_IMAGE_URL}/profile-img.jpg`}
                alt="userImage"
              />
            )}
          </div>
          <div className="user-info">
            <span className="user-name fw-medium">{name}</span>
            <span className="d-block">{email}</span>
          </div>
        </Link>
      ) : (
        "-"
      )}
    </div>
  );
};
export const notificationFormatter = (data) => {
  let path;
  let pathObject = {
    adminUserSignup: adminRoutesMap.MANAGE_CUSTOMERS.path,
    adminSubscription: adminRoutesMap.MANAGE_CUSTOMERS.path,
    adminQuery: adminRoutesMap.PENDING_QUERIES.path,
    adminDiscountRequest: adminRoutesMap.DISCOUNT_REQUESTS.path,
    adminSubscriptionFail: `${
      adminRoutesMap?.CUSTOMERS_DETAILS?.path
    }/${encoder(data?.notificationData)}`,
  };

  path = pathObject?.[data?.type];

  return (
    <div>
      {data ? (
        <>
          <Link to={path}>
            <h6 className="mb-0">{data?.title}</h6>
            <p className="text-gray">{data?.message}</p>
          </Link>
        </>
      ) : (
        "-"
      )}
    </div>
  );
};
export const phoneEmailFormatter = (number, email, path) => {
  return (
    <div>
      {number ? (
        <Link to={path} className="user-card">
          <div className="user-info">
            <span className="user-name fw-medium">{number}</span>
            <span className="d-block">{email}</span>
          </div>
        </Link>
      ) : (
        "-"
      )}
    </div>
  );
};

export function commasFormatter(data) {
  return data.join(", ");
}

export const statusFormatter = (cell, frontend) => {
  const successArr = [
    "active",
    "inStock",
    "delivered",
    "paid",
    "accepted",
    "assigned",
    "completed",
  ];
  const failedArr = [
    "rejected",
    "outOfStock",
    "cancelled",
    "inactive",
    "reject",
    "canceled",
  ];
  const onGoingArr = [
    "scheduled",
    "pending",
    "lowStock",
    "pendingApproval",
    "readyToShip",
    "lowInventory",
    "packed",
    "pickedUp",
  ];
  const planType = ["bundled", "videoConferencing", "translation"];
  const planTypeMonths = ["halfyearly", "annual", "monthly", "quarterly"];
  const pastArr = ["expired"];
  const doneArr = ["shipped"];
  const incompleteArr = ["profileInComplete", "credited", "received", "refund"];

  const paymentType = ["card", "netbanking", "upi"];
  const statusArr = {
    active: "Active",
    inactive: "Inactive",
    scheduled: "Scheduled",
    expired: "Expired",
    delivered: "Delivered",
    shipped: "Shipped",
    pending: "Pending",
    rejected: "Rejected",
    outOfStock: "Out of Stock",
    lowStock: "Low Stock",
    inStock: "In stock",
    pendingApproval: "Pending Approval",
    paid: "Paid",
    readyToShip: "Ready to Ship",
    cancelled: "Cancelled",
    received: "Received",
    profileInComplete: "Profile Incomplete",
    reject: "Rejected",
    lowInventory: "Low Inventory",
    credited: "Credited",
    accepted: "Accepted",
    assigned: "Assigned",
    packed: "packed",
    pickedUp: "pickedUp",
    completed: "completed",
    canceled: "canceled",
    refund: "Refund",
    bundled: "Bundled",
    videoConferencing: "Video Conferencing",
    translation: "Translation",
    halfyearly: "Half-Yearly",
    annual: "Annual",
    monthly: "Monthly",
    quarterly: "Quarterly",
    card: "Credit & Debit Cards",
    netbanking: "Internet Banking",
    upi: "UPI",
  };
  let data;
  if (frontend === 'frontend') {
    if (successArr.includes(cell)) {
      data = (
        <span className="text-500">
          {statusArr?.[cell]}
        </span>
      );
    } else if (failedArr.includes(cell) || pastArr.includes(cell)) {
      data = (
        <span className="text-danger">
          {statusArr?.[cell]}
        </span>
      );
    }
    return data;
  }else{
    if (successArr.includes(cell)) {
      data = (
        <span className="badge rounded-pill badge-dim bg-outline-success badge-sm">
          {statusArr?.[cell]}
        </span>
      );
    } else if (failedArr.includes(cell)) {
      data = (
        <span className="badge rounded-pill badge-dim bg-outline-danger badge-sm">
          {statusArr?.[cell]}
        </span>
      );
    } else if (onGoingArr.includes(cell)) {
      data = (
        <span className="badge rounded-pill badge-dim bg-outline-warning badge-sm">
          {statusArr?.[cell]}
        </span>
      );
    } else if (pastArr.includes(cell)) {
      data = (
        <span className="badge rounded-pill badge-dim bg-outline-secondary badge-sm">
          {statusArr?.[cell]}
        </span>
      );
    } else if (doneArr.includes(cell)) {
      data = (
        <span className="badge badge-dot text-purple">{statusArr?.[cell]}</span>
      );
    } else if (incompleteArr.includes(cell)) {
      data = (
        <span className="badge rounded-pill badge-dim bg-outline-info badge-sm">
          {statusArr?.[cell]}
        </span>
      );
    } else if (planType.includes(cell)) {
      data = statusArr?.[cell];
    } else if (planTypeMonths.includes(cell)) {
      data = statusArr?.[cell];
    } else if (paymentType.includes(cell)) {
      data = statusArr?.[cell];
    }
    return data;
  }
};
export const subscriptionpPlanFormetter = (cell) => {
  const jitsiToolbarButtons = [
    "conference_chat",
    "disable_camera",
    "live_stream",
    // "mute_participant",
    "noise_cancellation",
    "raise_hand",
    "record_meeting",
    "screen_sharing",
    "share_youtube",
    "whiteboard",
  ];
  const toolbarButtons = {
    whiteboard: "whiteboard",
    live_stream: "livestreaming",
    noise_cancellation: "noisesuppression",
    raise_hand: "raisehand",
    record_meeting: "recording",
    conference_chat: "chat",
    disable_camera: "camera",
    screen_sharing: "desktop",
    share_youtube: "sharedvideo",
    protected_meeting: "security",
  };
  const jitsiConfig = {
    toolbarButtons: [
      "fullscreen",
      "hangup",
      "help",
      "highlight",
      // "invite",
      "microphone",
      "participants-pane",
      "camera",
      "select-background",
      "settings",
      "tileview",
      // "shortcuts",
    ],
    disablePolls: true,
    breakoutRooms: {
      hideAddRoomButton: true,
      hideAutoAssignButton: true,
      hideJoinRoomButton: true,
    },
    enableLobbyChat: false,
    // participantsPane: {
    //   hideModeratorSettingsTab: true,
    //   hideMoreActionsButton: true,
    //   hideMuteAllButton: true,
    // },
  };
  if (cell) {
    Object.keys(cell)?.forEach((item) => {
      if (cell[item] === true) {
        if (jitsiToolbarButtons.includes(item)) {
          // if (item === "whiteboard") {
          //   jitsiConfig.whiteboard = {
          //     enabled: true,
          //     collabServerBaseUrl: "https://stag-excalidraw-backend.daakia.co.in",
          //   };
          // }
          jitsiConfig.toolbarButtons.push(toolbarButtons?.[item]);
        } else {
          if (item === "breakout_room") {
            jitsiConfig.breakoutRooms = {
              hideAddRoomButton: false,
              hideAutoAssignButton: false,
              hideJoinRoomButton: false,
            };
          }
          if (item === "lobby") {
            jitsiConfig.enableLobbyChat = true;
          }
          if (item === "poll") {
            jitsiConfig.disablePolls = false;
          }
        }
      }
    });
  }

  return jitsiConfig;
};
export const phoneNumberFormatter = (countryCode, phoneNumber) => {
  return (
    <>
      {phoneNumber ? (
        <>
          <PhoneNumber countryCode={countryCode} contactNumber={phoneNumber} />
        </>
      ) : (
        "-"
      )}
    </>
  );
};
export const phoneNumberCountryFormatter = (countryCode, phoneNumber) => {
  return (
    <PhoneNumberCountry countryCode={countryCode} contactNumber={phoneNumber} />
  );
};

export const csvPhoneCountryFormatter = (countryCode, contactNumber) => {
  let code = "";
  let number = "";
  if (countryCode !== null) {
    if (countryCode?.toString()?.includes("+")) code = countryCode;
    else code = `+${countryCode}`;
  }
  if (code && contactNumber !== null) {
    number = `${code} ${contactNumber}`;
  } else if (countryCode === null && contactNumber !== null) {
    number = `${contactNumber}`;
  } else number = "-";

  return number;
};

export const mobileFormatter = (countryCode, number) => {
  return <>{number ? `${countryCode} ${" "} ${number}` : "-"}</>;
};

export const percentageFormatter = (val) => {
  return <>{val ? `${val} %` : "-"}</>;
};

export const serialNumberFormatter = (page, sizePerPage, index) => {
  return (page - 1) * sizePerPage + index + 1;
};

export const checkValidData = (data) => {
  return data || "-";
};

export const checkValidInvoice = (data) => {
  return data ? ` # ${data}` : "-";
};

export const checkValidCount = (data) => {
  return data || 0;
};

export const checkValidPrice = (data) => {
  return data ? `INR ${Number(data).toFixed(2)}` : "INR 0";
};
export const checkValidDiscount = (data, check) => {
  return data
    ? check === "coin"
      ? `Coins ${data}`
      : `INR ${Number(data).toFixed(2)}`
    : "-";
};
export const currencyFormatter = (dollar, type) => {
  return (
    <>
      {dollar
        ? dollar?.toLocaleString(type === "INR" ? `en-IN` : `en-US`, {
            style: "currency",
            currency: `${type}`,
          })
        : "0"}
    </>
  );
};

export const nameFormatter = (firstName, lastName) => {
  return <>{firstName ? ` ${firstName} ${" "} ${lastName}` : "-"}</>;
};

export const textFormatter = (data) => {
  return data ? data?.charAt(0)?.toUpperCase() + data.slice(1) : "";
};
export const alltextFormatter = (data) => {
  return data ? data?.toUpperCase() : "-";
};
export const checkValidDateFormatter = (data, formatter) => {
  return <>{data ? formatter : "-"}</>;
};

export function truncate(source, size) {
  return source.length > size ? `${source.slice(0, size - 1)}…` : source;
}

export const addressFormatter = (cell) => {
  let addressLength = cell.length;
  return (
    <>
      {addressLength > 20 ? (
        <AntTooltip placement="top" promptText={`${cell}`}>
          {truncate(cell, 20)}
        </AntTooltip>
      ) : (
        truncate(cell, 20)
      )}
    </>
  );
};

export const checkCount = (data) => {
  return <>{data > 0 ? data : "-"}</>;
};

export const decimalValueFormatter = (cell) => {
  if (Number(cell) >= 0) {
    return Number(cell).toFixed(2);
  } else {
    return ``;
  }
};

export function getText(html) {
  let divContainer = document.createElement("div");
  divContainer.innerHTML = html;
  return divContainer.textContent || divContainer.innerText || "";
}

export const showLinkFormatter = (data) => {
  if ([undefined, null, false].includes(data)) {
    return <>-</>;
  }
  if (data.length < 30) {
    return <a href={data}>{data}</a>;
  }
  return <a href={data}>{data.substring(0, 30)}...</a>;
};

export const iconNameFormatter = (fullName) => {
  let name = fullName.split(" ");
  // return name[0]?.charAt(0)?.toUpperCase() + name[1]?.charAt(0)?.toUpperCase();
  return name[0] && name[1]
    ? name[0]?.charAt(0)?.toUpperCase() + name[1]?.charAt(0)?.toUpperCase()
    : name[0]?.charAt(0)?.toUpperCase();
  // return firstName && lastName
  //   ? firstName?.charAt(0)?.toUpperCase() + lastName?.charAt(0)?.toUpperCase()
  //   : firstName?.charAt(0)?.toUpperCase();
};

export const subscriptionFeaturesLabelFormatter = (key) => {
  let obj = {};
  if (key) {
    subscriptionData[key]?.forEach((data) => {
      obj[data?.name] = data?.lable;
    });
  } else {
    Object.keys(subscriptionData).forEach((item) => {
      subscriptionData[item]?.forEach((data) => {
        obj[data?.name] = data?.lable;
      });
    });
  }

  return obj;
};

export const translationTypeFormatter = (data) => {
  let obj = {
    plainText: "Plain text",
    html: "Html",
    audioVideo: "Audio Video",
    document: "Document",
  };

  return obj[data];
};
