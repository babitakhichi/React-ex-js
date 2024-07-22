import React, { useEffect, useState } from "react";

import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  DataTable,
  ModalComponent,
  nameImageFormatter,
  PageHeader,
  ListingHeader,
  ReferralsFilter,
  UpdateReferralsForm,
  serialNumberFormatter,
  checkValidCount,
  phoneNumberCountryFormatter,
  GlobalLoader,
} from "../../../../components";

import adminRoutesMap from "../../../../routeControl/adminRoutes";
import {
  dateFormatter,
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../../utils";
import { AdminReferralsServices } from "../../../../services";
import { classicDataTimeFormate } from "../../../../helpers";

function Referrals() {
  const [referalModal, setReferalModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;

  const [loading, setLoading] = useState(false);
  const [state, setState] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filterData, setFilterData] = useState({});
  const [param, setParam] = useState({});
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [visible, setVisible] = useState(false);

  const [csvData, setCsvData] = useState([]);
  // const [alertLoader, setAlertLoader] = useState(false);
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);
  const [loadingReferralDeails, setLoadingReferralDeails] = useState(false);
  const [referralDeailsData, setReferralDeailsData] = useState({});
  const [loadingUpdateReferral, setLoadingUpdateReferral] = useState(false);
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

  const tableReset = () => {
    setTableLoader(true);
    setState([]);
    setNoOfPage(0);
    setTotalCount(0);
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

  const getSearchValue = (val) => {
    setSearchName(val);
    if (val) {
      tableReset();
    }
  };

  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "REFERRALS",
    },
  ];
  const showReferalModal = () => {
    setReferalModal(true);
  };
  const hideReferalModal = () => {
    setReferalModal(false);
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
      dataField: "referredBy",
      text: t("text.referralAdmin.referredBy"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        row?.referredBy?.UserProfile
          ? nameImageFormatter(
              row?.referredBy?.UserProfile?.full_name,
              row?.referredBy?.UserProfile?.profile_img_url_full,
              "",
              row?.referredBy?.UserProfile?.email
            )
          : "-",
    },
    {
      dataField: "referredPhoneNumber",
      text: t("text.pendingQueries.phoneNumber"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        row?.referredBy?.UserProfile
          ? phoneNumberCountryFormatter(
              row?.referredBy?.UserProfile?.mobile_country_code,
              row?.referredBy?.UserProfile?.mobile_no
            )
          : "-",
    },
    {
      dataField: "referralCode",
      text: t("text.referralAdmin.referralCode"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => row?.referredBy?.UserProfile?.referral_code,
    },
    {
      dataField: "redeemedBy",
      text: t("text.referralAdmin.redeemedBy"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        row?.redeemedBy?.UserProfile
          ? nameImageFormatter(
              row?.redeemedBy?.UserProfile?.full_name,
              row?.redeemedBy?.UserProfile?.profile_img_url_full,
              "",
              row?.redeemedBy?.UserProfile?.email
            )
          : "-",
    },
    {
      dataField: "redeemedPhoneNumber",
      text: t("text.pendingQueries.phoneNumber"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        row?.redeemedBy?.UserProfile
          ? phoneNumberCountryFormatter(
              row?.redeemedBy?.UserProfile?.mobile_country_code,
              row?.redeemedBy?.UserProfile?.mobile_no
            )
          : "-",
    },
    {
      dataField: "createdAt",
      text: t("text.referralAdmin.redeemedAt"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        dateFormatter(row?.createdAt, classicDataTimeFormate),
    },
    {
      dataField: "rewards_earned",
      text: t("text.referralAdmin.rewardsEarned"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },

      formatter: checkValidCount,
    },
  ];
  const onSubmitFilter = (val) => {
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
    setFilterData({});
    tableReset();
    setVisible(false);
    const newParams = { ...param };
    newParams.page = 1;
    navigateWithParam(newParams, navigate, pathname);
  };

  const getCsvData = (data) => {
    if (data?.length > 0) {
      const dataCsv = data.map((item) => {
        return {
          "Referred Name ": item?.referredBy?.UserProfile?.full_name || "-",
          "Referred Email": item?.referredBy?.UserProfile?.email || "-",
          "Referred Phone Number": item?.referredBy?.UserProfile
            ?.mobile_country_code
            ? `${item?.referredBy?.UserProfile?.mobile_country_code} ${item?.referredBy?.UserProfile?.mobile_no}`
            : "-",
          "Referral Code": item?.referredBy?.UserProfile?.referral_code || "-",
          "	Redeemed Name ": item?.redeemedBy?.UserProfile?.full_name || "-",

          "Redeemed  Email": item?.redeemedBy?.UserProfile?.email || "-",

          " Redeemed Phone Number": item?.redeemedBy?.UserProfile
            ?.mobile_country_code
            ? `${item?.redeemedBy?.UserProfile?.mobile_country_code} ${item?.redeemedBy?.UserProfile?.mobile_no}`
            : "-",
          "Redeemed At": item?.createdAt
            ? dateFormatter(item?.createdAt, classicDataTimeFormate)
            : "-",
          "Rewards Earned": item?.rewards_earned || "0",
        };
      });
      setCsvData(dataCsv);
    }
  };

  const getReferralList = async () => {
    setTableLoader(true);

    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        ...filterData,
      };
      const res = await AdminReferralsServices.getReferralList({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.rows);
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
    setTableLoader(false);
  };
  const getReferralDetails = async () => {
    setLoadingReferralDeails(true);

    try {
      const res = await AdminReferralsServices.getReferralDetails();
      const { success, data, message } = res;
      if (success === 1) {
        setReferralDeailsData(data);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setLoadingReferralDeails(false);
  };
  useEffect(() => {
    if (search && JSON.stringify(param) !== "{}") {
      getReferralList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getReferralList();
      tableReset();
    }
  }, []);
  const updateReferral = async (values) => {
    setLoadingUpdateReferral(true);
    try {
      const bodyData = {
        ...values,
      };
      bodyData.status = bodyData.status ? "active" : "inactive";

      const res = await AdminReferralsServices.updateReferral(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        hideReferalModal(false);
        tableReset();
        getReferralList();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }

    setLoadingUpdateReferral(false);
  };
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading={t("text.referralAdmin.referrals")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create", "csvExport"]}
            btnText={t("text.referralAdmin.updateReferrals")}
            onHandleShow={() => {
              getReferralDetails();
              showReferalModal();
            }}
            popover={
              <ReferralsFilter
                onSubmit={onSubmitFilter}
                filterData={filterData}
                loading={loading}
                onReset={onReset}
              />
            }
            setVisible={setVisible}
            visible={visible}
            fileName="Referrals.csv"
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
        tableData={state}
        tableColumns={columns}
        param={param}
        defaultSort={defaultSort}
        setSizePerPage={setSizePerPage}
        tableLoader={tableLoader}
        tableReset={tableReset}
        getSearchValue={getSearchValue}
      />

      <ModalComponent
        backdrop
        show={referalModal}
        size="md"
        onHandleCancel={hideReferalModal}
        title={t("text.referralAdmin.updateReferrals")}
      >
        {loadingReferralDeails ? (
          <GlobalLoader />
        ) : (
          <UpdateReferralsForm
            hideReferalModal={hideReferalModal}
            referralDeailsData={referralDeailsData}
            onSubmit={updateReferral}
            loading={loadingUpdateReferral}
          />
        )}
      </ModalComponent>
    </>
  );
}
export default Referrals;
