import React from "react";

import "./statuscard.css";

const StatusCard5 = (props) => {
  return (
    <div className="status-card">
      <div className="status-card__icon">
        <i className={props.icon}></i>
      </div>
      <div className="status-card__info">
        <p>
          Error Code
          <h1>
            <b>{props.errorCount}</b>
          </h1>
        </p>
      </div>
    </div>
  );
};

export default StatusCard5;
