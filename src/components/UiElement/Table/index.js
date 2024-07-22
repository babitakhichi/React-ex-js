import React, { useEffect, useState } from "react";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import BootstrapTable from "react-bootstrap-table-next";
import { useLocation, useNavigate } from "react-router-dom";
import { t } from "i18next";
import { Col, Row } from "react-bootstrap";
import Pagination from "../Pagination";
import { navigateWithParam } from "../../../utils";
import { GlobalLoader } from "..";
import { AntTooltip } from "../..";

function DataTable(props) {
  const {
    pagination = true,
    hasLimit,
    handleLimitChange,
    noOfPage,
    sizePerPage,
    page,
    count,
    tableReset,
    tableData,
    tableColumns,
    param,
    defaultSort,
    header = true,
    bordered = false,
    setSizePerPage,
    tableLoader = false,
    getSearchValue=()=>{},
    searchPlaceholder = "",
    isCard = true,
    selectRow = false,
    onRowSelect,
    onRowSelectAll,
    searchShow = true,
    selectedRowData,isBasicTable=false
  } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;
  const [search, setSearch] = useState("");
  const [firstTimeFetch, setFirstTimeFetch] = useState(false);

  // useEffect(() => {
  //   const element = document.getElementsByClassName("datatable-wrap");
  //   element.forEach((item) => {
  //     item.classList.remove("react-bootstrap-table");
  //   });
  //   // element.classList.remove("react-bootstrap-table");
  // }, [tableData]);

  const goToPage = (pageNo) => {
    const newParams = { ...param };
    if (pageNo) {
      newParams.page = pageNo;
    }
    navigateWithParam(newParams, navigate, pathname);
    tableReset();
  };
  const handleSelect = (e) => {
    setSizePerPage(e.target.value);
    goToPage(1);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if ((search.length >= 3 || search.length === 0) && firstTimeFetch) {
        // navigateWithParam(newParam, navigate, pathname);
        // tableReset();
        getSearchValue(search);
        goToPage(1);
      }
    }, 700);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setFirstTimeFetch(true);
  }, []);

  const handleSearchValue = (val) => {
    setSearch(val);
  };

  const options = {
    page,
    sizePerPage,
  };

  const indicationLoading = () => <GlobalLoader />;

  const indicationNoRecords = () => {
    return <div className="text-center">{t("text.common.noRecordFound")}</div>;
  };

  const rowSelection = {
    mode: "checkbox",
    clickToSelect: false,
    selected: selectedRowData,
    onSelect: (row, isSelect, rowIndex, e) => {
      onRowSelect(row, isSelect, rowIndex, e);
    },
    onSelectAll: (isSelect, rows, e) => {
      onRowSelectAll(isSelect, rows, e);
    },
  };

  return (
    isBasicTable?(
      <div className="commonTable ">    <BootstrapTable
    classes="dataTable tableTooltip mb-0"
    keyField="id"
    data={tableData}
    options={options}
    columns={tableColumns}
    defaultSorted={param?.sortType ? defaultSort : []}
    bordered={false}
    wrapperClasses="table-responsive"
    loading={tableLoader}
    noDataIndication={
      tableLoader ? indicationLoading : indicationNoRecords()
    }
  />

{pagination && (
  <Pagination
    count={count}
    page={parseInt(page)}
    sizePerPage={sizePerPage}
    noOfPage={noOfPage}
    goToPage={goToPage}
    handleLimitChange={handleLimitChange}
    hasLimit={hasLimit}
  />
)}</div>
):(<div className="nk-block">
    <div className={`${isCard ? "card" : ""} position-static`}>
      <div className="card-inner">
        <div className="common-table">
          <div className="dataTables_wrapper dt-bootstrap4 no-footer">
            {header && (
              <Row className="justify-between g-2">
                <Col xs="7" sm="6" className="text-start">
                  {searchShow && (
                    <div
                      id="DataTables_Table_0_filter"
                      className="dataTables_filter"
                    >
                      {searchPlaceholder ? (
                        <AntTooltip
                          placement="topLeft"
                          promptText={`Search by ${searchPlaceholder}`}
                        >
                          <label>
                            <input
                              type="search"
                              className="form-control form-control-md"
                              placeholder="Type 3 or more characters"
                              aria-controls="DataTables_Table_0"
                              onChange={(e) =>
                                handleSearchValue(e.target.value)
                              }
                              value={search}
                            />
                          </label>
                        </AntTooltip>
                      ) : (
                        <label>
                          <input
                            type="search"
                            className="form-control form-control-md"
                            placeholder="Search"
                            aria-controls="DataTables_Table_0"
                            onChange={(e) =>
                              handleSearchValue(e.target.value)
                            }
                            value={search}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </Col>

                <Col xs="5" sm="6" className="text-end">
                  <div className="datatable-filter">
                    <div
                      className="dataTables_length"
                      id="DataTables_Table_0_length"
                    >
                      <label>
                        <span className="d-none d-sm-inline-block">Show</span>
                        <div className="form-control-select">
                          {" "}
                          <select
                            name="DataTables_Table_0_length"
                            aria-controls="DataTables_Table_0"
                            className="custom-select custom-select-sm form-control form-control-sm"
                            onChange={handleSelect}
                          >
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>{" "}
                        </div>
                      </label>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
            {selectRow ? (
              <BootstrapTable
                classes="table dataTable tableTooltip"
                keyField="id"
                data={tableData}
                options={options}
                columns={tableColumns}
                defaultSorted={param?.sortType ? defaultSort : []}
                bordered={bordered}
                selectRow={rowSelection}
                wrapperClasses="datatable-wrap my-3"
                loading={tableLoader}
                noDataIndication={
                  tableLoader ? indicationLoading : indicationNoRecords()
                }
              />
            ) : (
              <BootstrapTable
                classes="table dataTable tableTooltip"
                keyField="id"
                data={tableData}
                options={options}
                columns={tableColumns}
                defaultSorted={param?.sortType ? defaultSort : []}
                bordered={bordered}
                wrapperClasses="datatable-wrap my-3"
                loading={tableLoader}
                noDataIndication={
                  tableLoader ? indicationLoading : indicationNoRecords()
                }
              />
            )}
            {pagination && (
              <Pagination
                count={count}
                page={parseInt(page)}
                sizePerPage={sizePerPage}
                noOfPage={noOfPage}
                goToPage={goToPage}
                handleLimitChange={handleLimitChange}
                hasLimit={hasLimit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  </div>)
    
  );
}

export default DataTable;
