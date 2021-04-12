import { Component, forwardRef } from "react";
import { isComponentClass, isReactMemo } from "./util";
import DefaultErrorBoundary from "./Default";
const catchreacterror = (Boundary = DefaultErrorBoundary) => InnerComponent => {
  if (!isComponentClass(InnerComponent) && isReactMemo(InnerComponent)) {
    const NewComponent = InnerComponent;
    InnerComponent = function (props) {
      return <NewComponent {...props} />;
    };
  }
  if (isComponentClass(InnerComponent)) {
    class WrapperComponent extends Component {
      render() {
        const { forwardedRef } = this.props;
        return (
          <Boundary>
            {isComponentClass(InnerComponent) ? (
              <InnerComponent {...this.props} ref={forwardedRef} />
            ) : (
              <InnerComponent {...this.props} />
            )}
          </Boundary>
        );
      }
    }

    return forwardRef((props, ref) => (
      <WrapperComponent forwardedRef={ref} {...props} />
    ));
  } else {
    return props => (
      <Boundary>
        <InnerComponent {...props} />
      </Boundary>
    );
  }
};

export default catchreacterror;
