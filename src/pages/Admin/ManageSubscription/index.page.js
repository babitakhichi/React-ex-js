import React, { useState, useEffect, useRef } from "react";
import { t } from "i18next";

import { useLocation, useNavigate } from "react-router-dom";
import {
  actionFormatter,
  Breadcrumb,
  DataTable,
  ListingHeader,
  PageHeader,
  statusFormatter,
  SweetAlert,
  ModalComponent,
  SubscriptionPlanFilter,
  AddEditPlanForm,
  serialNumberFormatter,
  checkValidData,
  textFormatter,
  checkValidPrice,
} from "../../../components";
import {
  decodeQueryData,
  decodeSubscriptionJson,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../utils";
import { AdminManageSubscriptionServices } from "../../../services";
import { subscriptionDatakeys } from "../../../config/subscriptonData";

function ManageSubscription() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, search } = location;
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [status, setStatus] = useState("active");
  const [addPlanModal, setAddPlanModal] = useState(false);
  const [noOfPage, setNoOfPage] = useState();
  const [planModal, setPlanModal] = useState("");
  const [visible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [state, setState] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [checkboxData, setCheckboxData] = useState({});
  const [totalCount, setTotalCount] = useState(0);
  const [rowData, setRowData] = useState({});
  const [param, setParam] = useState({});
  const [reasonId, setReasonId] = useState();
  const [sizePerPage, setSizePerView] = useState(10);
  const [tableLoader, setTableLoader] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [checkError, setCheckError] = useState(false);
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);

  const formRef = useRef(null);
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
  const showAddPlanModal = () => {
    setPlanModal("add");
    setAddPlanModal(true);
  };
  const showPlanEditModal = (data) => {
    setPlanModal("edit");

    if (data?.SubscriptionFeature?.cloud_storage)
      data.SubscriptionFeature.storage_value = true;

    if (data?.SubscriptionFeature?.audio_video_conference)
      data.SubscriptionFeature.audio_video_conference_checkbox = true;

    // if (data?.SubscriptionMediaTypes?.length > 0)
    //   data.SubscriptionFeature.mediaTranslationCheckbox = true;

    if (data?.SubscriptionTranslationTypes?.length > 0)
      data.SubscriptionFeature.translationCheckbox = true;

    // if (data?.SubscriptionDocumentTypes?.length > 0)
    //   data.SubscriptionFeature.documentTranslationCheckbox = true;

    if (data?.SubscriptionFeature?.meet_duration)
      data.SubscriptionFeature.meeting_duration = true;

    if (data?.SubscriptionFeature?.translation)
      data.SubscriptionFeature.freeCharacters_checkbox = true;

    // if (data?.plan_type === "bundled" && data?.SubscriptionFeature?.translation)
    //   data.SubscriptionFeature.video_translation_checkbox_bundled = true;

    // if (
    //   data?.plan_type === "bundled" &&
    //   data?.SubscriptionFeature?.video_translation
    // )
    //   data.SubscriptionFeature.bundled_translation = true;

    // if (data?.SubscriptionFeature?.video_translation)
    //   data.SubscriptionFeature.video_translation_checkbox = true;
    let translationType = [];
    data?.SubscriptionTranslationTypes?.map((item) => {
      translationType.push(item?.translation_type);
    });

    let documentType = [];
    data?.SubscriptionDocumentTypes?.map((item) => {
      documentType.push(item?.document_type);
    });

    let mediaTypes = [];
    data?.SubscriptionMediaTypes?.map((item) => {
      mediaTypes.push(item?.media_type);
    });
    let editData = {};
    editData.translation_type = translationType;
    editData.document_type = documentType;
    editData.media_type = mediaTypes;

    editData = { ...editData, ...data };

    setRowData(editData);
    setAddPlanModal(true);
  };
  const hideAddPlanModal = () => {
    setAddPlanModal(false);
    setRowData({});
  };
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

  const planTypeData = [
    {
      id: "videoConferencing",
      name: "Video Conferencing",
    },
    {
      id: "translation",
      name: "Translation",
    },
    {
      id: "bundled",
      name: "Bundled",
    },
  ];
  // const planMonths = [
  //   {
  //     id: "1",
  //     name: "1 Month",
  //   },
  //   {
  //     id: "2",
  //     name: "2 Months",
  //   },
  //   {
  //     id: "3",
  //     name: "3 Months",
  //   }
  // ];
  const breadcrumb = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "SUBSCRIPTION PLANS",
    },
  ];
  const options = (row) => {
    const optionsArr = [
      {
        name: "Edit",
        icon: "icon ni ni-edit",
        action: "confirm",
        onClickHandle: () => {
          showPlanEditModal(row);
          // document.body.click();
        },
      },
    ];
    if (row.status === "active" && !row?.is_basic) {
      optionsArr.push({
        name: "Deactivate",
        icon: "icon ni ni-cross-circle",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          setStatus("inactive");
          setReasonId(row?.id);
          // document.body.click();
        },
      });
    }
    if (row.status === "inactive") {
      optionsArr.push({
        name: "Activate",
        icon: "icon ni ni-check-circle",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisible(true);
          setStatus("active");
          setReasonId(row?.id);
          // document.body.click();
        },
      });
    }
    return optionsArr;
  };

  const columns = [
    {
      dataField: "id",
      text: "S.No.",
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },
    {
      dataField: "name",
      text: t("text.manageSubscription.planName"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => checkValidData(textFormatter(row?.name)),
    },
    {
      dataField: "plan_type",
      text: t("text.manageSubscription.planType"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) => statusFormatter(row?.plan_type),
    },
    {
      dataField: "price",
      text: t("text.manageSubscription.planPrice"),
      headerClasses: "sorting",
      sort: true,
      formatter: checkValidPrice,
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
  // const handleChange = (value) => {
  //   setPlanType(value);
  // };
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
    setFilterData({});
    tableReset();
    setVisible(false);
    const newParams = { ...param };
    newParams.page = 1;
    navigateWithParam(newParams, navigate, pathname);
  };
  const getSubscriptionList = async () => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        typeList: "checked",
        ...filterData,
      };
      const res =
        await AdminManageSubscriptionServices.subscriptionListingService({
          queryParams,
        });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.rows);
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
  useEffect(() => {
    getSubscriptionList();
  }, [param]);

  const submitAddPlan = async (value) => {
    setPlanLoading(true);
    try {
      if (checkboxData) {
        delete checkboxData?.audio_video_conference_checkbox;
        delete checkboxData?.meeting_duration;
        delete checkboxData?.storage_value;
        // delete checkboxData?.video_translation_checkbox;
        delete checkboxData?.video_translation_checkbox_bundled;
        delete checkboxData?.bundled_translation;
        delete checkboxData?.freeCharacters_checkbox;
        delete checkboxData?.mediaTranslationCheckbox;
        delete checkboxData?.translationCheckbox;
        delete checkboxData?.documentTranslationCheckbox;
      }
      let bodyData = { ...value, ...checkboxData };
      if (rowData?.id) {
        Object.keys(bodyData)?.forEach((i) => {
          if (!subscriptionDatakeys[value.plan_type]?.includes(i)) {
            if (
              i !== "name" &&
              i !== "price" &&
              i !== "quarterly" &&
              i !== "half_yearly" &&
              i !== "annual" &&
              i !== "plan_type" &&
              i !== "is_corporate"
            ) {
              delete bodyData[i];
            }
          }
        });
      }

      const response = rowData?.id
        ? await AdminManageSubscriptionServices.editSubscriptionService(
            rowData?.id,
            // 20,
            bodyData
          )
        : await AdminManageSubscriptionServices.addSubscriptionService(
            bodyData
          );

      const { success, message } = response;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setAddPlanModal(false);
        getSubscriptionList();
        setRowData({});
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setPlanLoading(false);
  };

  const updateSubscriptionStatus = async () => {
    setStatusLoading(true);
    try {
      const bodyData = { status };
      const res =
        await AdminManageSubscriptionServices.updateSubscriptionStatus(
          reasonId,
          bodyData
        );
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        tableReset();
        getSubscriptionList();
        setStatus();
        setReasonId();
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
    setStatusLoading(false);
  };

  const generateSubscriptionData = (data, subscriptionData) => {
    if (data?.length > 0) {
      let resData = decodeSubscriptionJson(data, subscriptionData);

      setCheckboxData(resData);
    }
  };

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Subscription Plans">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create"]}
            btnText="Add New"
            popover={
              <SubscriptionPlanFilter
                onSubmit={handleFilterSubmit}
                loading={loading}
                onReset={onReset}
                filterData={filterData}
                t={t}
              />
            }
            onHandleShow={showAddPlanModal}
            setVisible={setVisible}
            visible={visible}
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
        setSizePerPage={setSizePerView}
        tableLoader={tableLoader}
        tableReset={tableReset}
        getSearchValue={getSearchValue}
        // searchPlaceholder={t("text.search.ManageSubscription")}
      />

      <ModalComponent
        backdrop
        show={addPlanModal}
        size="lg"
        onHandleCancel={hideAddPlanModal}
        title={
          planModal === "add"
            ? t("text.manageSubscription.addPlan")
            : t("text.manageSubscription.editPlan")
        }
      >
        <AddEditPlanForm
          planModal={planModal}
          t={t}
          hideAddPlanModal={hideAddPlanModal}
          planTypeData={planTypeData}
          onSubmit={submitAddPlan}
          loading={planLoading}
          generateSubscriptionData={generateSubscriptionData}
          rowData={rowData}
          formRef={formRef}
          checkError={checkError}
          setCheckError={setCheckError}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={
          status === "active"
            ? t("text.common.activeMessage")
            : t("text.common.deActiveMessage")
        }
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setIsAlertVisible}
        // showLoaderOnConfirm
        loading={statusLoading}
        onConfirmAlert={updateSubscriptionStatus}
      />
    </>
  );
}
export default ManageSubscription;
