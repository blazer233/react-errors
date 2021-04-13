import { Component, forwardRef } from "react";
import { isComponentClass } from "./util";
import DefaultErrorBoundary from "./core";
const catchreacterror = (Boundary = DefaultErrorBoundary) => InnerComponent => {
  if (isComponentClass(InnerComponent)) {
    console.log("类组件", InnerComponent.name);
    class WrapperComponent extends Component {
      render() {
        /**
         *高阶组件中使用 forwardRef 为了传递给高阶组件内部所包裹的组件中使用
         */
        const { forwardedRef } = this.props;
        return (
          <Boundary {...this.props}>
            <InnerComponent {...this.props} ref={forwardedRef} />
          </Boundary>
        );
      }
    }
    return forwardRef((props, ref) => (
      <WrapperComponent forwardedRef={ref} {...props} />
    ));
  } else {
    console.log("函数组件", InnerComponent.name);
    return forwardRef((props, ref) => (
      <Boundary {...props}>
        <InnerComponent ref={ref} {...props} />
      </Boundary>
    ));
  }
};

export default catchreacterror;
