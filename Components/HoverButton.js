import React from "react";
import classNames from "../styles/Hover.module.css";

const HoverButton = ({ children }) => {
  return <a className={classNames.hoverBtn}>{children}</a>;
};

export default HoverButton;
