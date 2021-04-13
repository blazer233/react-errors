import React, { useState } from "react";
import catchreacterror from "./hanlder";
import "./App.css";
const fnCount1 = ({ count }) => {
  if (count == 3) throw new Error("count is three");
  return <span>{count}</span>;
};
class fnCount2 extends React.Component {
  render() {
    const { count } = this.props;
    if (count == 2) throw new Error("count is two");
    return <span>{count}</span>;
  }
}
const SafeCount1 = catchreacterror()(fnCount1);
const SafeCount2 = catchreacterror()(fnCount2);

const App = () => {
  const [count, setCount] = useState(0);
  const errorbackfn = ({ error, resetErrorBoundary }) => (
    <div>
      <p>出错啦</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
  const errorbackcom = () => <h1>出错啦,不可撤销</h1>;
  const ListenError = (arg, info) => console.log("出错了:" + arg.message, info);
  const onReset = () => setCount(0);
  return (
    <div className="App">
      <section>
        <button onClick={() => setCount(count => count + 1)}>+</button>
        <button onClick={() => setCount(count => count - 1)}>-</button>
      </section>
      <hr />
      <div>
        Class componnet:
        <SafeCount2
          count={count}
          fallbackRender={errorbackfn}
          onReset={onReset}
          onError={ListenError}
        />
      </div>
      <div>
        Function componnet:
        <SafeCount1
          count={count}
          FallbackComponent={errorbackcom}
          onError={ListenError}
        />
      </div>
    </div>
  );
};

export default App;
