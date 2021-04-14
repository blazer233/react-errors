import React from "react";
const initialState = { error: false };
class ErrorBoundary extends React.Component {
  state = initialState;
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
    if (this.props.onReset) this.props.onReset();
    this.setState(initialState);
  };
  render() {
    const { fallback, FallbackComponent, fallbackRender } = this.props;
    const { error } = this.state;
    if (error) {
      const fallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      };
      if (React.isValidElement(fallback)) return fallback;
      if (typeof fallbackRender === "function")
        return fallbackRender(fallbackProps);
      if (FallbackComponent) return <FallbackComponent {...fallbackProps} />;
      throw new Error("ErrorBoundary 组件需要传入 fallback");
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
