import React from "react";

function PageHeader({ children, heading }) {
  return (
    <>
      <div className="nk-block-head-content">
        <h3 className="nk-block-title page-title">{heading}</h3>
        <div className="nk-block-des">
          {children}
        </div>
      </div>
    </>
  );
}

export default PageHeader;
