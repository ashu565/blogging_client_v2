import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.scss";

export default function Modal() {
  const [page, setPage] = useState(false);
  useEffect(() => {
    setPage(true);
  }, []);
  return page
    ? ReactDOM.createPortal(
        <div>hello</div>,
        document.getElementById("modal-portal")
      )
    : null;
}
