import React from "react";
import DefaultErrorBoundary from "./core";
const catchreacterror = (
  Boundary = DefaultErrorBoundary
) => InnerComponent => props => (
  <Boundary {...props}>
    <InnerComponent {...props} />
  </Boundary>
);

export default catchreacterror;
