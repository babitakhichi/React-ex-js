import { t } from "i18next";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";
import {
  actionFormatter,
  Breadcrumb,
  checkValidCount,
  checkValidData,
  commasFormatter,
  DataTable,
  ListingHeader,
  ManageUserFilter,
  ModalComponent,
  nameImageFormatter,
  NotificationForm,
  PageHeader,
  phoneNumberCountryFormatter,
  serialNumberFormatter,
  statusFormatter,
  SweetAlert,
  textFormatter,
} from "../../../../../components";
import { classicDataTimeFormate } from "../../../../../helpers";
import {
  selectCountryData,
  selectLanguageData,
} from "../../../../../redux/UserSlice/index.slice";
import adminRoutesMap from "../../../../../routeControl/adminRoutes";
import {
  CommonServices,
  // CommonServices,
  // UserProfileServices,
  UsersServices,
} from "../../../../../services";
import {
  dateFormatter,
  decodeQueryData,
  encoder,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../../../utils";

function ManageCustomers() {
  const countryList = useSelector(selectCountryData);
  const languageDetails = useSelector(selectLanguageData);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [status, setStatus] = useState(1);
  const [sendNotification, setSendNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [customerData, setCustomerData] = useState([]);
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerView] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [param, setParam] = useState({});
  const location = useLocation();
  const { pathname, search } = location;
  const [searchName, setSearchName] = useState("");
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState();
  const [alertLoader, setAlertLoader] = useState(false);
  const [nameArray, setNameArray] = useState([]);
  const [hideArray, setRemoveSelectedArray] = useState([]);
  // const [languageDetails, setLanguageDetails] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(true);
  // const [selected, setSelected] = useState("");
  const [genderList, setGenderList] = useState([]);
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);

  // const formRef = useRef(null);
  useEffect(() => {
    if (search) {
      const data = decodeQueryData(search);
      setParam(data);
      setPage(data?.page ?? 1);
      // setSearchName(data?.name ?? "");
      if (data?.sortType) {
        const sortData = [
          {
            order: getSortType(data?.sortType),
            dataField: data?.sortBy,
          },
        ];
        setDefaultSort(sortData);
      } else {
        setDefaultSort({
          dataField: "",
          order: "",
        });
      }
    }
  }, [location]);
  const getGenderList = async () => {
    try {
      let res = await CommonServices.genderList();
      const { data, success, message } = res;
      if (success === 1) {
        setGenderList(data?.rows);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
  };
  const showSendNotificationModal = () => {
    setSendNotification(true);
  };
  const hideSendNotificationModal = () => {
    setNameArray([]);
    setSendNotification(false);
  };

  let rowArray = [];
  if (nameArray.length > 0) {
    nameArray.map((item, index) => {
      rowArray.push(item, index);
    });
  }

  const getCsvData = (data) => {
    const dataCsv = data.map((item) => {
      return {
        Name: `${item?.UserProfile?.full_name || "-"}`,
        "Phone Number": item?.UserProfile?.mobile_country_code
          ? `${item?.UserProfile?.mobile_country_code} ${item?.UserProfile?.mobile_no}`
          : "-",
        Age: checkValidCount(item?.UserProfile?.age_count),
        Gender: checkValidData(item?.UserProfile?.gender?.title),
        Country: checkValidData(item?.UserProfile?.Country?.name),
        "Preferred Language": checkValidData(
          item?.UserProfile?.default_lang_title
        ),
        "Plan Type": item?.UserSubscriptions
          ? commasFormatter(
              item?.UserSubscriptions?.map((items) =>
                statusFormatter(items?.Subscription?.plan_type)
              )
            )
          : "-",
        "Created On": dateFormatter(item?.created_at, classicDataTimeFormate),
        "Last Login": dateFormatter(
          item?.last_login_datetime,
          classicDataTimeFormate
        ),
        Status: item?.is_active ? "Active" : "Inactive",
      };
    });
    setCsvData(dataCsv);
  };

  const getUSerList = async () => {
    setLoading(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        ...filterData,
      };
      const { success, data, message } = await UsersServices.getUserListService(
        {
          queryParams,
        }
      );
      if (success === 1 && data) {
        setCustomerData(data?.rows);
        getCsvData(data?.rows);
        setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1);
        setTotalCount(data?.count);
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

  useEffect(() => {
    if (search && JSON.stringify(param) !== "{}") {
      getUSerList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getUSerList();
    }
    getGenderList();
  }, []);

  const tableReset = () => {
    setLoading(true);
    setCustomerData([]);
    setNoOfPage(0);
    setTotalCount(0);
  };

  const getSearchValue = (val) => {
    setSearchName(val);
    if (val) {
      tableReset();
    }
  };

  const onSortColumn = (field, order) => {
    const data = { ...param };
    data.sortBy = field;
    data.sortType = order === "asc" ? "ASC" : "DESC";
    navigateWithParam(data, navigate, pathname);
    tableReset();
  };

  const headerSortingClasses = (column, sortOrder) => {
    return sortOrder === "asc" ? "sorting_asc" : "sorting_desc";
  };

  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: t("text.userManagement.title"),
    },
  ];

  const options = (row) => {
    const optionsArr = [
      {
        name: "View",
        icon: "icon ni ni-eye",
        action: "redirect",
        path: `${adminRoutesMap?.CUSTOMERS_DETAILS?.path}/${encoder(row?.id)}`,
      },
      {
        name: row?.is_active
          ? t("text.common.deactivate")
          : t("text.common.activate"),
        icon: row?.is_active
          ? "icon ni ni-cross-circle"
          : "icon ni ni-check-circle",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          setStatus(row?.is_active ? 0 : 1);
          setUserId(row?.username);
        },
      },
    ];

    return optionsArr;
  };

  const updateUserStatus = async () => {
    try {
      const bodyData = { username: userId, status };
      const res = await UsersServices.UpdateUserStatusService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        tableReset();
        getUSerList();
        setStatus();
        setUserId();
        return true;
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setAlertLoader(false);
  };

  const columns = [
    {
      dataField: "id",
      text: t("text.common.sno"),
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },
    {
      dataField: "UserProfile.full_name",
      text: t("text.userManagement.name"),
      headerClasses: "sorting",
      formatter: (cell, row) =>
        nameImageFormatter(
          checkValidData(textFormatter(row?.UserProfile?.full_name)),

          row?.UserProfile?.profile_img_url_full,
          `${adminRoutesMap?.CUSTOMERS_DETAILS?.path}/${encoder(row?.id)}`,
          row?.UserProfile?.email
        ),
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
    },
    {
      dataField: "UserProfile.mobile_country_code",
      text: t("text.userManagement.phone"),
      headerClasses: "sorting",
      formatter: (cell, row) =>
        phoneNumberCountryFormatter(
          row?.UserProfile?.mobile_country_code,
          row?.UserProfile?.mobile_no
        ),
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
    },

    {
      dataField: "UserProfile.age_count",
      text: t("text.userManagement.age"),
      headerClasses: "sorting",
      formatter: (cell, row) => checkValidCount(row?.UserProfile?.age_count),
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
    },
    {
      dataField: "UserProfile.gender.title",
      text: t("text.userManagement.gender"),
      headerClasses: "sorting",
      formatter: (cell, row) => checkValidData(row?.UserProfile?.gender?.title),
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
    },
    {
      dataField: "UserProfile.Country.name",
      text: t("text.userManagement.country"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => checkValidData(row?.UserProfile?.Country?.name),
    },
    {
      dataField: "UserProfile.default_lang_title",
      text: t("text.userManagement.language"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        checkValidData(row?.UserProfile?.default_lang_title),
    },
    {
      dataField: "UserSubscriptions",
      text: t("text.userManagement.type"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        row?.UserSubscriptions
          ? commasFormatter(
              row?.UserSubscriptions?.map((item) =>
                statusFormatter(item?.Subscription?.plan_type)
              )
            )
          : "-",
    },
    {
      dataField: "created_at",
      text: t("text.userManagement.created"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        dateFormatter(row?.created_at, classicDataTimeFormate),
    },
    {
      dataField: "last_login_datetime",
      text: t("text.userManagement.lastLogin"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        dateFormatter(row?.last_login_datetime, classicDataTimeFormate),
    },
    {
      dataField: "is_active",
      text: t("text.common.status"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => statusFormatter(cell ? "active" : "inactive"),
    },
    {
      dataField: "action",
      text: t("text.common.action"),
      headerClasses: "nk-tb-col-tools text-end",
      formatter: (cell, row) => actionFormatter(options(row)),
    },
  ];
  const handleFilterSubmit = (val) => {
    setLoading(true);
    try {
      setFilterData(val);
      tableReset();
      const newParams = { ...param };
      newParams.page = 1;
      navigateWithParam(newParams, navigate, pathname);
      setVisible(false);
      setLoading(false);
    } catch (error) {
      logger(error);
    }
    setLoading(false);
  };

  const onReset = () => {
    // setSelected("");
    setFilterData({});
    tableReset();
    setVisible(false);
    const newParams = { ...param };
    newParams.page = 1;
    navigateWithParam(newParams, navigate, pathname);
  };

  const onNotificationSubmit = async (values) => {
    setLoading(true);
    try {
      const bodyData = {
        usernames: nameArray,
        subject: values.subject,
        message: values.message,
      };
      const res = await UsersServices.AddEmailNotificationService(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        tableReset();
        getUSerList();
        setSendNotification(false);
        setNameArray([]);
        setRemoveSelectedArray([]);
        setDeleteLoading(true);
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

  const rowSelection = (row, isSelect) => {
    let tempArray = [...nameArray];
    let hidesArray = [...hideArray];
    if (isSelect === true) {
      tempArray.push(row?.username);
      hidesArray.push(row?.id);
    } else {
      let removeIndex = tempArray.findIndex((data) => {
        return data === row?.username;
      });
      let removeIndexRow = hidesArray.findIndex((data) => {
        return data === row?.id;
      });
      tempArray.splice(removeIndex, 1);
      hidesArray.splice(removeIndexRow, 1);
    }
    let unique = [...new Set(tempArray)];
    let uniqueArray = [...new Set(hidesArray)];
    if (uniqueArray.length > 0) {
      setDeleteLoading(false);
    } else {
      setDeleteLoading(true);
    }
    setNameArray(unique);
    setRemoveSelectedArray(uniqueArray);
  };

  const AllRowSelection = (isSelect, rows) => {
    let tempArray = [...nameArray];
    let hidesArray = [...hideArray];
    if (isSelect === true) {
      rows.forEach((item) => {
        tempArray.push(item?.username);
        hidesArray.push(item?.id);
      });
    } else {
      tempArray = [];
      hidesArray = [];
    }
    let unique = [...new Set(tempArray)];
    let uniqueArray = [...new Set(hidesArray)];
    if (uniqueArray.length > 0) {
      setDeleteLoading(false);
    } else {
      setDeleteLoading(true);
    }
    setNameArray(unique);
    setRemoveSelectedArray(uniqueArray);
  };
  // const getLanguageDetails = async () => {
  //   try {
  //     const response = await UserProfileServices.getlanguageService();
  //     const { success, data, message } = response;

  //     if (success === 1) {
  //       setLanguageDetails(data?.rows);
  //     } else {
  //       modalNotification({
  //         type: "error",
  //         message,
  //       });
  //     }
  //   } catch (error) {
  //     logger(error);
  //   }
  // };
  // useEffect(() => {
  //   getLanguageDetails();
  // }, []);
  // const getCountryList = async (code) => {
  //   try {
  //     let res = await CommonServices.singleCountry(code);
  //     const { success, message } = res;
  //     if (success === 1) {
  //       formRef?.current?.setFieldValue(
  //         "country_code",
  //         `+${res?.data?.country_code}`
  //       );
  //     } else {
  //       modalNotification({
  //         type: "error",
  //         message,
  //       });
  //     }
  //   } catch (error) {
  //     logger(error);
  //   }
  // };

  // useEffect(() => {
  //   if (selected) {
  //     getCountryList(selected);
  //   }
  // }, [selected]);
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading={t("text.userManagement.title")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "csvExport", "extraButton"]}
            extraBtnText="Notification"
            extraBtnClass="btn btn-primary"
            popover={
              <ManageUserFilter
                onSubmit={handleFilterSubmit}
                loading={loading}
                onReset={onReset}
                filterData={filterData}
                t={t}
                languageDetails={languageDetails}
                countryData={countryList}
                genderList={genderList}
                // selected={selected}
                // setSelected={setSelected}
                // formRef={formRef}
                // countryList={countryList}
              />
            }
            loading={deleteLoading}
            setVisible={setVisible}
            visible={visible}
            onExtraButtonHandleShow={showSendNotificationModal}
            fileName="User-List.csv"
            csvData={csvData}
          />
        </div>
      </div>
      <DataTable
        hasLimit
        noOfPage={noOfPage}
        sizePerPage={sizePerPage}
        page={page}
        count={totalCount}
        tableData={customerData}
        tableColumns={columns}
        tableReset={tableReset}
        setSizePerPage={setSizePerView}
        selectRow
        param={param}
        defaultSort={defaultSort}
        tableLoader={loading}
        getSearchValue={getSearchValue}
        onRowSelect={rowSelection}
        onRowSelectAll={AllRowSelection}
        selectedRowData={hideArray}

        // searchPlaceholder={t("text.search.manageCustomers")}
      />
      <SweetAlert
        title="Are you sure"
        text={
          status
            ? t("text.common.activateUser")
            : t("text.common.deactivateUser")
        }
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
        setIsAlertVisible={setIsAlertVisible}
        showLoaderOnConfirm
        loading={alertLoader}
        onConfirmAlert={updateUserStatus}
      />
      <ModalComponent
        modalExtraClass="zoom"
        backdrop
        show={sendNotification}
        onHandleCancel={hideSendNotificationModal}
        title={t("text.userManagement.sendNotification")}
      >
        <NotificationForm
          hideSendNotificationModal={hideSendNotificationModal}
          onSubmit={onNotificationSubmit}
        />
      </ModalComponent>
    </>
  );
}

export default ManageCustomers;
