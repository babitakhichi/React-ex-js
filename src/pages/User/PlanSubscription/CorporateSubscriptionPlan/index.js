import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ReloadOutlined } from "@ant-design/icons";
import {
  AssignUserForm,
  DataTable,
  ModalComponent,
  RippleEffect,
  SweetAlert,
  Switch,
  Tabs,
  checkValidData,
  frontendActionFormatter,
  serialNumberFormatter,
  statusFormatter,
  textFormatter,
} from "../../../../components";
import {
  dateFormatter,
  decodeQueryData,
  getActiveAccount,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../../utils";
import { UserProfileServices } from "../../../../services";
import { selectUserData } from "../../../../redux/AuthSlice/index.slice";
import userRoutesMap from "../../../../routeControl/userRoutes";
import {
  getUserAccount,
  getUserSubscription,
  selectUserAccountData,
} from "../../../../redux/UserSlice/index.slice";

export default function CorporateSubscriptionPlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname, search } = location;
  const [activeKey, setActiveKey] = useState(location?.state || "assigned");
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false);
  const [assignUserShow, setAssignUserShow] = useState(false);
  const handleAssignUserShow = () => setAssignUserShow(true);
  const [assigneeMail, setAssigneeMail] = useState("");
  const [noOfPage, setNoOfPage] = useState(0);
  const [statusLoader, setStatusLoader] = useState(false);

  // const sizePerPage = 10;
  const [state, setState] = useState([]);
  // const [noOfPage, setNoOfPage] = useState();
  const [page, setPage] = useState(1);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [param, setParam] = useState({});
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);
  const handleClose = () => {
    setAssignUserShow(false);
  };
  const user = useSelector(selectUserData);
  const accounts = useSelector(selectUserAccountData);
  const [isLoading, setLoading] = useState(false);
  const [licenceKey, setLicenceKey] = useState(null);
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
    setLoading(true);
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
  const getCorporatePlans = async () => {
    setLoading(true);
    try {
      const res = await UserProfileServices.getCorporatePlans({
        user: user?.user_id,
        assigned: activeKey === "assigned" ? 1 : 0,
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
      });
      const { success, data, message } = res;
      if (success === 1) {
        // setCount(data?.count);
        // setNoOfPage(data?.count > 0 ? Math.ceil(data?.count / sizePerPage) : 1);
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
    setLoading(false);
  };
  const dispatch = useDispatch();
  const assign = async (value) => {
    setLoading(true);
    try {
      let bodyData = {
        licence_key: licenceKey,
        assigned: activeKey === "assigned" ? 0 : 1,
        ...value,
      };
      if (!!value?.revoke) {
        delete bodyData?.assigned;
        setIsDeleteAlertVisible(false);
      }
      const response = await UserProfileServices.assignPlanService(bodyData);
      const { success, message } = response;
      if (success === 1) {
        getCorporatePlans();
        modalNotification({
          type: "success",
          message,
        });
        dispatch(getUserAccount());
        if (user?.email === value?.email || user?.email === assigneeMail) {
          const activeAccount = getActiveAccount(accounts);
          const queryParams = {
            is_corporate: true,
            coporate_id: activeAccount?.id,
          };
          dispatch(getUserSubscription({ queryParams }));
        }
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    handleClose();
    setLoading(false);
  };
  const revokeKey = () => {
    assign({
      revoke: true,
      licence_key: licenceKey,
      email: assigneeMail,
    });
    return true;
  };
  const getOptions = (row) => {
    let optionArr = [
      {
        name:
          activeKey === "assigned"
            ? t("text.planAndSubscription.assignToOther")
            : t("text.planAndSubscription.assignToUser"),
        icon: "icon-user-change",
        action: "confirm",
        onClickHandle: () => {
          setLicenceKey(row?.licence_key);
          setAssigneeMail(row?.assigned_email);
          handleAssignUserShow();
        },
      },
    ];
    if (activeKey === "assigned")
      optionArr?.push({
        name: "Revoke key",
        icon: "icon-trash",
        action: "confirm",
        onClickHandle: () => {
          setIsDeleteAlertVisible(true);
          setLicenceKey(row?.licence_key);
          setAssigneeMail(row?.assigned_email);
          // assign({
          //     revoke: true,
          //     licence_key: row?.licence_key,
          //    email: row?.assigned_email,
          // });
        },
      });
    else if (activeKey === "unassigned")
      optionArr?.push({
        name: t("text.planAndSubscription.assignToSelf"),
        icon: "icon-user-change",
        action: "confirm",
        onClickHandle: () => {
          assign({
            licence_key: row?.licence_key,
            email: user?.email,
          });
        },
      });
    return optionArr;
  };
  const changeStatus = async (bodyData) => {
    setStatusLoader(true);
    try {
      const res = await UserProfileServices.updateCorporateStatus(bodyData);
      const { success, data, message } = res;
      if (success === 1) {
        const index = state?.findIndex((item) => item?.id === data?.[0]?.id);
        state?.splice(index, 1, data?.[0]);
        setState([...state]);
      } else {
        modalNotification({
          type: "error",
          message,
        });
      }
    } catch (error) {
      logger(error);
    }
    setStatusLoader(false);
  };
  const getColumns = () => {
    const columns = [
      {
        dataField: "id",
        text: t("text.common.sno"),
        headerClasses: "w_70",
        formatter: (cell, row, index) =>
          serialNumberFormatter(page, sizePerPage, index),
      },
      {
        dataField: "licence_key",
        text: t("text.common.key"),
        headerSortingClasses,
        formatter: checkValidData,
      },
      {
        dataField: "plan_category",
        text: t("text.manageSubscription.planType"),
        headerClasses: "sorting",
        headerSortingClasses,
        formatter: (col) => checkValidData(statusFormatter(col)),
        sort: true,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
      },
      {
        dataField: "plan_name",
        text: t("text.manageSubscription.planName"),
        formatter: (cell, row) =>
          checkValidData(textFormatter(row?.Plan?.plan_name)),
      },
      {
        dataField: "plan_type",
        text: t("text.videoConferencing.duration"),
        formatter: (cell, row) =>
          checkValidData(textFormatter(row?.Plan?.plan_type)),
      },
      {
        dataField: "date_of_invoice",
        text: t("text.planAndSubscription.dateOfInvoice"),
        formatter: (cell) => dateFormatter(cell, "DD-MM-YYYY"),
      },
      {
        dataField: "date_of_expiration",
        text: t("text.planAndSubscription.dateOfExpiration"),
        headerClasses: "sorting",
        sort: true,
        headerSortingClasses,
        onSort: (field, order) => {
          onSortColumn(field, order);
        },
        formatter: (cell) => dateFormatter(cell, "DD-MM-YYYY"),
      },

      {
        dataField: "",
        headerClasses: "text-end",
        formatter: (cell, row) =>
          row?.status === "expired"
            ? ""
            : frontendActionFormatter(getOptions(row)),
      },
    ];

    if (activeKey === "assigned") {
      columns?.splice(5, 0, {
        dataField: "assigned_email",
        text: t("text.planAndSubscription.assignedTo"),
      });
      columns?.splice(
        8,
        0,
        {
          dataField: "status",
          text: t("text.common.status"),
          formatter: (cell) => statusFormatter(cell, "frontend"),
        },
        {
          text: t("text.common.action"),
          formatter: (cell, row) => {
            return (
              <Switch
                statusValue={row?.status === "active"}
                disabled={row?.status === "expired"}
                onChange={(status) =>
                  changeStatus({ status, corporate_id: row?.id })
                }
                loading={statusLoader}
              />
            );
          },
        }
      );
    }

    return columns;
  };
  const columns = getColumns();
  useEffect(() => {
    if (search && JSON.stringify(param) !== "{}") {
      getCorporatePlans();
    }
  }, [param, activeKey]);
  useEffect(() => {
    if (!search) {
      getCorporatePlans();
      tableReset();
    }

    tableReset();
  }, [activeKey]);
  const content = (
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
      tableLoader={isLoading}
      tableReset={tableReset}
      header={false}
      isBasicTable
    />
  );
  const tabContent = [
    {
      name: "Assigned",
      key: "assigned",
      content,
    },
    {
      name: "Unassigned",
      key: "unassigned",
      content,
    },
  ];
  const handleRefresh = () => {
    setPage(1);
    getCorporatePlans();
  };

  return (
    <>
      <div className="planSubscription_box customCard">
        <div className="d-flex align-items-center flex-wrap justify-content-between pb-3">
          <h3 className="title font-eb mb-0 border-0 pb-0">
            {t("text.planAndSubscription.subscriptionPlan")}
          </h3>
          <ReloadOutlined
            className="reloadIcon me-auto ms-2 ms-lg-4"
            onClick={handleRefresh}
          />
          <RippleEffect>
            <Link
              to={userRoutesMap.PURCHASE_PLAN.path}
              className="btn btn-primary btn-md"
            >
              {t("text.planAndSubscription.explore")}
            </Link>
          </RippleEffect>
        </div>

        <Tabs
          defaultActiveKey={"assigned"}
          activeKey={activeKey}
          setActiveKey={setActiveKey}
          tabContent={tabContent}
          navDivClassName={"horizontalTabs"}
          pills={"pills"}
          tabsFor={"table"}
        />
      </div>
      <ModalComponent
        show={assignUserShow}
        modalExtraClass="noHeader"
        onHandleVisible={handleAssignUserShow}
        onHandleCancel={handleClose}
        title=""
        size="md"
      >
        <AssignUserForm
          licenceKey={licenceKey}
          mail={assigneeMail}
          onSubmit={assign}
        />
      </ModalComponent>
      <SweetAlert
        title={t("text.common.areYouSure")}
        text={t("text.planAndSubscription.wantToRevoke")}
        show={isDeleteAlertVisible}
        icon="warning"
        showCancelButton
        cancelButtonText="No"
        confirmButtonText="Yes"
        setIsAlertVisible={setIsDeleteAlertVisible}
        onConfirmAlert={revokeKey}
      />
    </>
  );
}
