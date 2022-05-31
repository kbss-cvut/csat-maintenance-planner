import React from "react";

interface Props {
  height?: number;
  width?: number;
}

const DoubleArrowIcon = ({ height = 24, width = 24 }: Props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height}>
    <path d="m13.707 4.707-1.414-1.414L3.586 12l8.707 8.707 1.414-1.414L6.414 12l7.293-7.293z" />
    <path d="m19.707 4.707-1.414-1.414L9.586 12l8.707 8.707 1.414-1.414L12.414 12l7.293-7.293z" />
  </svg>
);

export default DoubleArrowIcon;
