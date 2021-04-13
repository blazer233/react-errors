import React from "react";
import DefaultErrorBoundary from "./core";
const catchreacterror = (Boundary = DefaultErrorBoundary) => InnerComponent => {
  return props => (
    <Boundary {...props}>
      <InnerComponent {...props} />
    </Boundary>
  );
};

export default catchreacterror;
