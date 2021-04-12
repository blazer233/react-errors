import React, { useState } from "react";
import catchreacterror from "./hanlder";
import "./App.css";

function fnCount({ count }) {
  if (count == 3) {
    throw new Error("count is three");
  }
  return <h1>{count}</h1>;
}
const SafeCount = catchreacterror()(fnCount);

function App() {
  const [count, setCount] = useState(0);
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
        Function componnet: <SafeCount count={count} />
      </div>
    </div>
  );
}

export default App;
