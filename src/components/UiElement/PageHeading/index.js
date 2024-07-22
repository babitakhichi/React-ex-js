import React from "react";

function PageHeading({ heading }) {
  return (
    <>
      <section className="pageHeading text-center ">
        <h2 className="pageHeading-text-2">{heading}</h2>
      </section>
    </>
  );
}

export default PageHeading;
