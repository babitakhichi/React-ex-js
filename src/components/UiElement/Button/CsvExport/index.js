import React from "react";
import { CSVLink } from "react-csv";

export default function CsvExport({
  fileName,
  data,
  extraClassName,
  children,
}) {
  return (
    <>
      <CSVLink filename={fileName} data={data} className={`${extraClassName}`}>
        {children}
      </CSVLink>
    </>
  );
}
