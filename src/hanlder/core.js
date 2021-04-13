import * as React from "react";
const initialState = { error: null };
class ErrorBoundary extends React.Component {
  state = initialState;
  updatedWithError = false;
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo.componentStack);
    }
  }

  // 执行自定义重置逻辑，并重置组件状态
  resetErrorBoundary = () => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.reset();
  };
  reset = () => {
    this.updatedWithError = false;
    this.setState(initialState);
  };
  render() {
    const { fallback, FallbackComponent, fallbackRender } = this.props;
    const { error } = this.state;
    if (error !== null) {
      const fallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      };
      if (React.isValidElement(fallback)) {
        return fallback;
      }
      if (typeof fallbackRender === "function") {
        return fallbackRender(fallbackProps);
      }
      if (FallbackComponent) {
        return <FallbackComponent {...fallbackProps} />;
      }
      throw new Error("ErrorBoundary 组件需要传入 fallback");
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
