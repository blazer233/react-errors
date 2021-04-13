import React, { useState, useEffect, useRef, forwardRef } from "react";
import catchreacterror from "./hanlder";
import "./App.css";
function fnCount1(props) {
  if (props.count == 3) {
    throw new Error("count is three");
  }
  return props.count;
}
class fnCount2 extends React.Component {
  render() {
    console.log(this.props)
    const { count } = this.props;
    if (count == 2) {
      throw new Error("count is two");
    }
    return <span>{count}</span>;
  }
}
const SafeCount2 = catchreacterror()(fnCount2);
const SafeCount1 = catchreacterror()(fnCount1);

function App() {
  const [count, setCount] = useState(0);
  const refs_function = useRef();
  const refs_class = useRef();
  useEffect(() => {
    console.log(refs_function.current);
    console.log(refs_class.current);
  }, []);

  const errorbackfn = ({ error, resetErrorBoundary }) => {
    return (
      <div role="alert">
        <p>出错啦</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    );
  };

  const errorbackcom = () => <h1>出错啦,不可撤销</h1>;
  const ListenError = (arg, info) => {
    console.log("出错了:" + arg.message, info);
  };
  const onReset = () => setCount(0);
  return (
    <div className="App">
      <section className="btns">
        <button className="btn" onClick={() => setCount(count => count + 1)}>
          +
        </button>
        <button className="btn" onClick={() => setCount(count => count - 1)}>
          -
        </button>
      </section>
      <hr />
      <div>
        Class componnet:
        <SafeCount2
          count={count}
          ref={refs_class}
          fallbackRender={errorbackfn}
          onReset={onReset}
          onError={ListenError}
        />
      </div>
      <div>
        Function componnet:
        <SafeCount1
          count={count}
          ref={refs_function}
          FallbackComponent={errorbackcom}
          onError={ListenError}
        />
      </div>
    </div>
  );
}

export default App;
