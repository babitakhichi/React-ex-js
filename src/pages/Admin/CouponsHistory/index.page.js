import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  dateFormatter,
  decodeQueryData,
  decoder,
  getSortType,
  logger,
  modalNotification,
  navigateWithParam,
} from "../../../utils";
import {
  Input as TextInput,
  AntTextArea,
  Breadcrumb,
  DataTable,
  ListingHeader,
  ModalComponent,
  PageHeader,
  Switch,
  linkFormatter,
  nameImageFormatter,
  ConsumptionFilter,
  percentageFormatter,
  serialNumberFormatter,
  textFormatter,
} from "../../../components";
import { AdminPromotionServices } from "../../../services";
import { classicDataTimeFormate } from "../../../helpers";

function CouponsHistory() {
  const [referalModal, setReferalModal] = useState(false);
  const [visible, setVisible] = useState(false);
  const [sizePerPage, setSizePerPage] = useState(10);
  const [tableLoader, setTableLoader] = useState(false);
  const [noOfPage, setNoOfPage] = useState(10);
  const [totalCount, setTotalCount] = useState(110);
  const [state, setState] = useState([]);
  const [searchName, setSearchName] = useState();
  const params = useParams();
  const [param, setParam] = useState({});
  const [page, setPage] = useState(1);
  const location = useLocation();
  const { pathname, search } = location;
  const [loading, setLoading] = useState(false);
  const [filterData, setFilterData] = useState({});
  const navigate = useNavigate();
  const [defaultSort, setDefaultSort] = useState([
    {
      dataField: "",
      order: "",
    },
  ]);
  const tableReset = () => {
    setTableLoader(true);
    setState([]);
    setNoOfPage(0);
    setTotalCount(0);
  };
  const getSearchValue = (val) => {
    setSearchName(val);
    if (val) {
      tableReset();
    }
  };
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
  const fetchHistory = async (id) => {
    setTableLoader(true);
    try {
      let queryParams = {
        offset: (page - 1) * sizePerPage,
        limit: sizePerPage,
        sortBy: param?.sortBy,
        sortType: param?.sortType,
        search: searchName,
        promotion_id: decoder(id),
        ...filterData,
      };
      const res = await AdminPromotionServices.getConsumptionDataService({
        queryParams,
      });
      const { success, data, message } = res;
      if (success === 1) {
        setState(data?.rows);
        // getCsvData(data?.data);
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
    if (params?.id) fetchHistory(params?.id);
  }, [filterData]);
  const breadcrumb = [
    {
      path: "/admin/dashboard",
      name: "DASHBOARD",
    },
    {
      path: "#",
      name: "Consumption Dashboard",
    },
  ];
  const showReferalModal = () => {
    setReferalModal(true);
  };
  const hideReferalModal = () => {
    setReferalModal(false);
  };
  const updatedReferalModal = () => {
    setReferalModal(false);
    modalNotification({
      type: "success",
      message: "Referrals Updated Successfully",
    });
  };
  const onSortColumn = (field, order) => {
    const data = { ...param };
    data.sortBy = field;
    data.sortType = order === "asc" ? "ASC" : "DESC";
    navigateWithParam(data, navigate, pathname);
    tableReset();
  };
  const columns = [
    {
      dataField: "id",
      text: "S.No.",
      headerClasses: "w_70",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row, index) =>
        serialNumberFormatter(page, sizePerPage, index),
    },
    {
      dataField: "name",
      text: "Used By",
      sort: true,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        nameImageFormatter(
          textFormatter(row?.User?.UserProfile?.full_name),
          row?.User?.UserProfile?.profile_img_url_thumb,
          "",
          row?.User?.UserProfile?.email
        ),
    },
    {
      dataField: "phone",
      text: "Phone",
      sort: true,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell, row) =>
        `${row?.User?.UserProfile?.mobile_country_code} ${row?.User?.UserProfile?.mobile_no}`,
    },
    {
      dataField: "Promotion",
      text: "Promo code",
      // sort:true,
      // headerClasses: "sorting",
      // onSort: (field, order) => {
      //   onSortColumn(field, order);
      // },
      formatter: (cell, row) => row?.Promotion?.code || "-",
    },
    {
      dataField: "discount_percentage",
      text: "Discount percentage",
      formatter: (cell, row) =>
        percentageFormatter(Number(row?.Promotion?.discount_percentage)),
    },
    {
      dataField: "createdAt",
      text: "Applied At",
      sort: true,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => dateFormatter(cell, classicDataTimeFormate),
    },
    {
      dataField: "total_discount",
      text: "Total discount",
      sort: true,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => cell || "-",
    },
    {
      dataField: "invoice_id",
      text: "Transaction Reference",
      sort: true,
      headerClasses: "sorting",
      onSort: (field, order) => {
        onSortColumn(field, order);
      },
      formatter: (cell) => linkFormatter(cell),
    },
  ];
  const onReset = () => {
    setFilterData({});
    tableReset();
    setVisible(false);
    const newParams = { ...param };
    newParams.page = 1;
    navigateWithParam(newParams, navigate, pathname);
  };
  const onSubmitFilter = (val) => {
    setLoading(true);
    if (!!val?.applied_at)
      val.applied_at = dateFormatter(val?.applied_at, "YYYY-MM-DD");
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
  useEffect(() => {
    if (search && JSON.stringify(param) !== "{}") {
      fetchHistory(params?.id);
    }
  }, [param]);
  return (
    <>
      <div className="nk-block-head nk-block-head-sm">
        <div className="nk-block-between">
          <PageHeader heading="Consumption Dashboard">
            <Breadcrumb breadcrumb={breadcrumb} />
          </PageHeader>
          <ListingHeader
            btnArray={["filter"]}
            onHandleShow={showReferalModal}
            setVisible={setVisible}
            visible={visible}
            popover={
              <ConsumptionFilter
                onSubmit={onSubmitFilter}
                filterData={filterData}
                loading={loading}
                onReset={onReset}
              />
            }
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
        // param={param}
        defaultSort={defaultSort}
        setSizePerPage={setSizePerPage}
        tableLoader={tableLoader}
        tableReset={tableReset}
        getSearchValue={getSearchValue}
        // searchPlaceholder={t("text.search.ManageSubscription")}
      />

      <ModalComponent
        backdrop
        show={referalModal}
        size="md"
        onHandleCancel={hideReferalModal}
        title="Update Referrals"
      >
        <form>
          <div className="mb-3">
            <label className="form-label">Message</label>
            <AntTextArea
              className="form-control form-control-lg"
              placeholder="Enter message"
              name="plan"
              type="text"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Enter the reward</label>
            <TextInput
              className="form-control form-control-lg"
              placeholder="Enter the reward"
              defaultValue="150"
              name="plan"
              type="text"
            />
          </div>
          <div className="mb-3 mt-4">
            <label className="form-label me-3">Activate/Deactivate</label>
            <Switch />
          </div>
          <div className="align-center justify-content-center flex-wrap flex-sm-nowrap gx-4 gy-2 mt-3">
            <div>
              <Link
                href="#"
                onClick={() => updatedReferalModal()}
                className="btn btn-lg btn-primary"
              >
                Update
              </Link>
            </div>
            <div>
              <Link
                href="#"
                onClick={() => hideReferalModal()}
                className="link link-light"
              >
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </ModalComponent>
    </>
  );
}
export default CouponsHistory;
