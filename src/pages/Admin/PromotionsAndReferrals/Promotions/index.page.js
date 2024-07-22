import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  ListingHeader,
  PageHeader,
  statusFormatter,
  actionFormatter,
  DataTable,
  ModalComponent,
  SweetAlert,
  CouponsFilter,
  serialNumberFormatter,
  checkValidData,
  // textFormatter,
  percentageFormatter,
  checkValidCount,
  PromoCodeForm,
} from "../../../../components";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import {
  dateFormatter,
  decodeQueryData,
  encoder,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
  readMoreTextShow,
} from "../../../../utils";
import { AdminPromotionServices } from "../../../../services";

function Promotions() {
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertVisibleDelete, setIsAlertVisibleDelete] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [promoCode, setPromoCode] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, search } = location;
  const [readData, setReadData] = useState();
  const [showReadMore, setShowReadMore] = useState(false);
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

  const showMoreText = (data) => {
    setShowReadMore(true);
    setReadData(data.data);
  };
  const onCloseDescriptionModal = () => {
    setShowReadMore(false);
    setReadData("");
  };
  const breadcrumb = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "Promotions",
    },
  ];
  const showAddTypeModal = () => {
    setPromoCode(null);
    setShowPromoForm(true);
  };
  const options = (row) => {
    const optionsArr = [
      {
        name: "View History",
        icon: "icon ni ni-eye",
        action: "redirect",
        path: `${adminRoutesMap?.COUPONS_HISTORY?.path}/${encoder(row?.id)}`,
      },
      {
        name: t("text.common.edit"),
        icon: "icon ni ni-edit",
        action: "confirm",
        onClickHandle: () => {
          setIsEditModal(true);
          setPromoCode(row);
          setShowPromoForm(true);
          document.body.click();
        },
      },
      {
        name: t("text.common.delete"),
        icon: "icon ni ni-trash",
        action: "confirm",
        onClickHandle: () => {
          setPromoCode(row);
          setIsAlertVisibleDelete(true);
          document.body.click();
        },
      },
    ];
    if (row.status === "active") {
      optionsArr.push({
        name: t("text.common.deactivate"),
        icon: "icon ni ni-cross-circle",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          setPromoCode(row);
          document.body.click();
        },
      });
    }
    if (row.status === "inactive") {
      optionsArr.push({
        name: t("text.common.activate"),
        icon: "icon ni ni-check-circle",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          setPromoCode(row);
          document.body.click();
        },
      });
    }
    return optionsArr;
  };
  const columns = [
    {
      dataField: "id",
      text: t("text.common.sno"),
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },
    // {
    //   dataField: "title",
    //   text: t("text.promoCode.promoTitle"),
    //   headerClasses: "sorting",
    //   sort: true,
    //   headerSortingClasses,
    //   onSort: (field, order) => {
    //     onSortColumn(field, order);
    //   },
    //   formatter: (cell, row) => checkValidData(textFormatter(row?.title)),
    // },
    {
      dataField: "code",
      text: t("text.promoCode.promoText"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: checkValidData,
    },
    {
      dataField: "intervals",
      text: t("text.promoCode.appliedOn"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: statusFormatter,
    },
    {
      dataField: "discount_percentage",
      text: t("text.promoCode.discountPercentage"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => (cell ? percentageFormatter(Number(cell)) : "-"),
    },
    {
      dataField: "max_discount",
      text: t("text.promoCode.maxDiscount"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: checkValidCount,
    },
    {
      dataField: "description",
      text: t("text.promoCode.promoDesc"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => readMoreTextShow(cell, showMoreText),
    },
    {
      dataField: "promotionUsers",
      text: t("text.promoCode.userType"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        readMoreTextShow(
          row?.user_type === "all"
            ? "All"
            : row?.promotionUsers
                ?.map((item) => item?.User?.UserProfile?.full_name)
                ?.toString()
                ?.replaceAll(",", " , "),
          showMoreText
        ),
    },
    {
      dataField: "start_date",
      text: t("text.videoConferencing.startDate"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => (cell ? dateFormatter(cell, "DD/MM/YYYY") : "-"),
    },
    {
      dataField: "end_date",
      text: t("text.videoConferencing.endDate"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => (cell ? dateFormatter(cell, "DD/MM/YYYY") : "-"),
    },
    {
      dataField: "limit_per_user",
      text: t("text.promoCode.usage"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
    },
    {
      dataField: "status",
      text: t("text.common.status"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: statusFormatter,
    },
    {
      dataField: "action",
      text: t("text.common.action"),
      headerClasses: "nk-tb-col-tools text-end",
      formatter: (cell, row) => actionFormatter(options(row)),
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
          // "Promo code title": item?.title || "-",
          "Promo code text": item?.code || "-",
          "Applied On": item?.intervals || "-",
          "Discount percentage": item?.discount_percentage
            ? `${item?.discount_percentage}%`
            : "-",
          "Max discount": item?.max_discount ? `${item?.max_discount}%` : "-",

          "Promo code description": item?.description || "-",
          "User type":
            item?.user_type === "all"
              ? item?.user_type
              : item?.promotionUsers
                  ?.map((user) => user?.User?.UserProfile?.full_name)
                  ?.toString()
                  ?.replaceAll(",", " , "),
          "Start date": item?.start_date
            ? dateFormatter(item?.start_date, "DD/MM/YYYY")
            : "-",
          "End date": item?.end_date
            ? dateFormatter(item?.end_date, "DD/MM/YYYY")
            : "-",
          Usage: checkValidCount(item?.limit_per_user),
          Status: item?.status,
        };
      });
      setCsvData(dataCsv);
    }
  };

  const getPromotionsList = async () => {
    setTableLoader(true);
    let updatedFilterData = {
      start_date: filterData?.startDate
        ? dateFormatter(filterData?.startDate, "YYYY-MM-DD")
        : "",
      end_date: filterData?.endDate
        ? dateFormatter(filterData?.endDate, "YYYY-MM-DD")
        : "",
      status: filterData?.status,
    };

    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,

        ...updatedFilterData,
      };
      const res = await AdminPromotionServices.getPromoCodeList({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.data);
        getCsvData(data?.data);
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
  const removePromoCode = async () => {
    try {
      const response = await AdminPromotionServices.deletePromoCode(
        promoCode?.id
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        getPromotionsList();
        setShowPromoForm(false);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    return true;
  };
  const activeDeactive = async () => {
    try {
      let bodyData = {
        status: promoCode?.status === "active" ? "inactive" : "active",
      };
      const response = await AdminPromotionServices.updatePromoCodeStatus(
        promoCode?.id,
        bodyData
      );
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        getPromotionsList();
        setShowPromoForm(false);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    return true;
  };
  const onSubmit = async (values) => {
    try {
      values.start_date = dateFormatter(values.start_date, "YYYY-MM-DD");
      values.end_date = dateFormatter(values.end_date, "YYYY-MM-DD");
      if (!values?.max_discount) values.max_discount = null;
      let bodyData = { ...values, status: "active" };
      const response = await (isEditModal
        ? AdminPromotionServices.updatePromoCode(promoCode?.id, bodyData)
        : AdminPromotionServices.createPromoCode(bodyData));
      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        getPromotionsList();
        setShowPromoForm(false);
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
  useEffect(() => {
    if (search && JSON.stringify(param) !== "{}") {
      getPromotionsList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getPromotionsList();
      tableReset();
    }
  }, []);
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Promotions">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create", "csvExport"]}
            btnText="Create Promo Code"
            onHandleShow={showAddTypeModal}
            popover={
              <CouponsFilter
                onSubmit={onSubmitFilter}
                filterData={filterData}
                loading={loading}
                onReset={onReset}
              />
            }
            setVisible={setVisible}
            visible={visible}
            fileName="Promotions.csv"
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
        show={showReadMore}
        onHandleCancel={onCloseDescriptionModal}
        title="Read More"
      >
        <p className="text-break">{readData}</p>
      </ModalComponent>
      <ModalComponent
        backdrop
        show={showPromoForm}
        onHandleCancel={() => setShowPromoForm(false)}
        title={
          isEditModal
            ? t("text.promoCode.editPromoCode")
            : t("text.promoCode.createPromoCode")
        }
      >
        <PromoCodeForm
          promoCode={promoCode}
          onSubmit={onSubmit}
          cancel={() => setShowPromoForm(false)}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={
          promoCode?.status === "inactive"
            ? t("text.promoCode.activatePromo")
            : t("text.promoCode.deactivatePromo")
        }
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
        setIsAlertVisible={setIsAlertVisible}
        // showLoaderOnConfirm
        // loading={loading}
        onConfirmAlert={activeDeactive}
      />
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={t("text.promoCode.deletePromo")}
        show={isAlertVisibleDelete}
        icon="warning"
        showCancelButton
        confirmButtonText="Yes"
        cancelButtonText="No"
        setIsAlertVisible={setIsAlertVisibleDelete}
        // showLoaderOnConfirm
        // loading={loading}
        onConfirmAlert={removePromoCode}
      />
    </>
  );
}
export default Promotions;
