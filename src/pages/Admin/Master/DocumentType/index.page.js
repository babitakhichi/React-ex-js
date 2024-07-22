import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  actionFormatter,
  Breadcrumb,
  DataTable,
  ListingHeader,
  ModalComponent,
  PageHeader,
  statusFormatter,
  SweetAlert,
  DocumentTypeFilter,
  checkValidData,
  serialNumberFormatter,
  DocumentTypeForm,
  textFormatter,
  alltextFormatter,
} from "../../../../components";
import adminRoutesMap from "../../../../routeControl/adminRoutes";
import { AdminDocumentTypeServices } from "../../../../services";
import {
  decodeQueryData,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../../utils";

function DocumentType() {
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
  const [documentTypeModal, setDocumentTypeModal] = useState(false);
  const [typeModal, setTypeModal] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const [param, setParam] = useState({});
  const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerView] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [tableLoader, setTableLoader] = useState(false);
  const [rowData, setRowData] = useState();
  const [documentId, setDocumentId] = useState();
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

  const showAddTypeModal = () => {
    setTypeModal("add");
    setDocumentTypeModal(true);
  };
  const showTypeEditModal = (data) => {
    setTypeModal("edit");
    setRowData(data);
    setDocumentTypeModal(true);
  };
  const hideDocumentTypeModal = () => {
    setDocumentTypeModal(false);
    setRowData();
  };
  // const documentTypeAdded = () => {
  //   setDocumentTypeModal(false);
  //   modalNotification({
  //     type: "success",
  //     message: "Document Type Added Successfully",
  //   });
  // };
  // const documentTypeUpdated = () => {
  //   setDocumentTypeModal(false);
  //   modalNotification({
  //     type: "success",
  //     message: "Document Type Updated Successfully",
  //   });
  // };

  // const onTypeDeleteConfirmAlert = () => {
  //   modalNotification({
  //     type: "success",
  //     message: "Document Type Deleted Successfully",
  //   });
  //   setIsAlertVisible(false);
  //   return true;
  // };
  const breadcrumb = [
    {
      path: adminRoutesMap.DASHBOARD.path,
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: t("text.master.documentTypeTitle"),
    },
  ];

  const options = (row) => {
    const optionsArr = [
      {
        name: t("text.common.edit"),
        icon: "icon ni ni-edit",
        action: "confirm",
        onClickHandle: () => {
          showTypeEditModal(row);
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
          setDocumentId(row?.id);
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
          setDocumentId(row?.id);
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
          setDocumentId(row?.id);
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
      dataField: "document_type",
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
      dataField: "category",
      text: t("text.master.category"),
      headerClasses: "sorting",
      sort: true,
      headerSortingClasses,
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        (row?.category === "general" &&
          checkValidData(textFormatter(row?.category))) ||
        alltextFormatter(row?.category),
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

  const getDocumentTypeList = async () => {
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
      const res = await AdminDocumentTypeServices.getDocumentTypeList({
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
      getDocumentTypeList();
    }
  }, [param]);

  useEffect(() => {
    if (!search) {
      getDocumentTypeList();
    }
  }, []);

  const onDocumentSubmit = async (values) => {
    setLoading(true);
    try {
      const bodyData = { ...values };
      const res = rowData?.id
        ? await AdminDocumentTypeServices.editDocumentTypeList(
            rowData?.id,
            bodyData
          )
        : await AdminDocumentTypeServices.addDocumentTypeList(bodyData);
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        setDocumentTypeModal(false);
        getDocumentTypeList();
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
    setLoading(false);
  };

  const updateDocumentStatus = async () => {
    try {
      const bodyData = { status };
      const res = await AdminDocumentTypeServices.updateDocumentTypeStatus(
        documentId,
        bodyData
      );
      const { success, message } = res;
      if (success === 1) {
        modalNotification({
          type: "success",
          message,
        });
        tableReset();
        getDocumentTypeList();
        setStatus();
        setDocumentId();
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
          <PageHeader heading={t("text.master.documentTypeTitle")}>
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter", "create"]}
            btnText={t("text.common.addNew")}
            onHandleShow={showAddTypeModal}
            popover={
              <DocumentTypeFilter
                t={t}
                loading={loading}
                onSubmit={onSubmit}
                onReset={onReset}
                filterData={filterData}
                type="docType"
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
        show={documentTypeModal}
        onHandleCancel={hideDocumentTypeModal}
        title={typeModal === "add" ? "Add Document Type" : "Edit Document Type"}
      >
        <DocumentTypeForm
          hideDocumentTypeModal={hideDocumentTypeModal}
          onSubmit={onDocumentSubmit}
          submitButtonText={
            typeModal === "add" ? t("text.common.add") : t("text.common.update")
          }
          loading={loading}
          rowData={rowData}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={
          status === "active"
            ? t("text.common.documentActiveMessage")
            : t("text.common.documentDeactivateMessage")
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
        text={t("text.master.deleteDocumentText")}
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

export default DocumentType;
