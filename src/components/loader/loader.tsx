import React from "react";
import "./loader.css"

const Loader: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span className={`loader ${className}`}></span>
);

export default Loader;
