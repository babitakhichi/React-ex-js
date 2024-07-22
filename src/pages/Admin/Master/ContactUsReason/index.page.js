import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  actionFormatter,
  Breadcrumb,
  DataTable,
  DocumentTypeFilter,
  ListingHeader,
  ModalComponent,
  PageHeader,
  statusFormatter,
  SweetAlert,
  AddEditReasonForm,
  serialNumberFormatter,
  checkValidData,
  textFormatter,
} from "../../../../components";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import { AdminContactUsReasonServices } from "../../../../services/Admin/Master/ContactUsReason/index.service";
import {
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../../utils";

function ContactUsReason() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState("");
  const [state, setState] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [isAlertVisibleDelete, setIsAlertVisibleDelete] = useState(false);
  const [contactReasonModal, setContactReasonModal] = useState(false);
  const [reasonModal, setReasonModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [reasonLoading, setReasonLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [param, setParam] = useState({});
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerView] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [rowData, setRowData] = useState();
  const [reasonId, setReasonId] = useState();
  const [alertLoader, setAlertLoader] = useState(false);
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

  const getContactUsReasonList = async () => {
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
      const res = await AdminContactUsReasonServices.getContactUsReasonList({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.documentData?.rows);
        setNoOfPage(
          data?.documentData?.count > 0
            ? Math.ceil(data?.documentData?.count / sizePerPage)
            : 1
        );
        setTotalCount(data?.documentData?.count);
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
    if (search && JSON.stringify(param) !== "{}") {
      getContactUsReasonList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getContactUsReasonList();
    }
  }, []);

  const showAddResonModal = () => {
    setReasonModal("add");
    setContactReasonModal(true);
  };
  const showReasonEditModal = (data) => {
    setReasonModal("edit");
    setRowData(data);
    setContactReasonModal(true);
  };
  const hideReasonModal = () => {
    setContactReasonModal(false);
    setRowData();
  };
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: t("text.master.contactUsReasonTitle"),
    },
  ];

  const options = (row) => {
    const optionsArr = [
      {
        name: t("text.common.edit"),
        icon: "icon ni ni-edit",
        action: "confirm",
        onClickHandle: () => {
          showReasonEditModal(row);
          // document.body.click();
        },
      },
      {
        name: t("text.common.delete"),
        icon: "icon ni ni-trash",
        action: "confirm",
        onClickHandle: () => {
          setIsAlertVisibleDelete(true);
          setStatus("deleted");
          setReasonId(row?.id);
          // document.body.click();
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
          setStatus("inactive");
          setReasonId(row?.id);
          // document.body.click();
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
      text: t("text.common.sno"),
      headerClasses: "w_70",
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },
    {
      dataField: "contact_reason",
      text: t("text.master.documentType"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => checkValidData(textFormatter(cell)),
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

  const onSubmit = (val) => {
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

  const onReasonSubmit = async (values) => {
    setReasonLoading(true);
    try {
      const bodyData = { ...values };
      const res = rowData?.id
        ? await AdminContactUsReasonServices.editContactUsReason(
            rowData?.id,
            bodyData
          )
        : await AdminContactUsReasonServices.addContactUsReason(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setContactReasonModal(false);
        getContactUsReasonList();
        setRowData();
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setReasonLoading(false);
  };

  const updateDocumentStatus = async () => {
    try {
      const bodyData = { status };
      const res =
        await AdminContactUsReasonServices.updateContactUsReasonStatus(
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
        getContactUsReasonList();
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
    setAlertLoader(false);
  };

  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading={t("text.master.contactUsReasonTitle")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create"]}
            btnText={t("text.common.addNew")}
            onHandleShow={showAddResonModal}
            popover={
              <DocumentTypeFilter
                t={t}
                loading={loading}
                onSubmit={onSubmit}
                onReset={onReset}
                filterData={filterData}
              />
            }
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
        // searchPlaceholder={t("text.search.manageCustomers")}
      />
      <ModalComponent
        backdrop
        show={contactReasonModal}
        onHandleCancel={hideReasonModal}
        title={
          reasonModal === "add"
            ? t("text.master.addReason")
            : t("text.master.editReason")
        }
      >
        <AddEditReasonForm
          onSubmit={onReasonSubmit}
          hideReasonModal={hideReasonModal}
          reasonModal={reasonModal}
          loading={reasonLoading}
          rowData={rowData}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={
          status === "active"
            ? t("text.master.activateReasontext")
            : t("text.master.deactivateReasontext")
        }
        show={isAlertVisible}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setIsAlertVisible}
        showLoaderOnConfirm
        loading={alertLoader}
        onConfirmAlert={updateDocumentStatus}
      />
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={t("text.master.deleteReasonText")}
        show={isAlertVisibleDelete}
        icon="warning"
        showCancelButton
        confirmButtonText={t("text.common.yes")}
        cancelButtonText={t("text.common.no")}
        setIsAlertVisible={setIsAlertVisibleDelete}
        showLoaderOnConfirm
        loading={alertLoader}
        onConfirmAlert={updateDocumentStatus}
      />
    </>
  );
}

export default ContactUsReason;
