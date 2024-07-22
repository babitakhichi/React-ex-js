import React from "react";
import { Link } from "react-router-dom";
// import config from "../../../config";

function DashboardCardComponent({ linkPath, title, count, image }) {
  return (
    <>
      <div className="col-xxl-3 col-xl-4 col-md-6">
        <Link to={linkPath} className="card card-bordered">
          <div className="card-inner">
            <div className="card-title-group">
              <div className="icon">
                <img src={image} className="img-fluid" alt="total-buyers" />
              </div>
              <div className="card-title">
                <h6 className="title text-muted text-right">{title}</h6>
                <div className="nk-sale-data text-right">
                  <div className="amount">{count}</div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}

export default DashboardCardComponent;
