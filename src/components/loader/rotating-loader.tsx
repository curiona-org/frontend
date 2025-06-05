import React from "react";
import "./rotating-loader.css";

const RotatingLoader: React.FC<{ className?: string }> = ({
  className = "",
}) => <span className={`rotating-loader ${className}`}></span>;

export default RotatingLoader;
