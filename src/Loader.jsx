import React from "react";

export default function Loader({ showLoader, error, children }) {
  if (error) {
    return <div className="errorText">{error}</div>;
  }

  return showLoader ? (
    <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  ) : (
    <div>{children}</div>
  );
}
