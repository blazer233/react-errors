# 封装一个处理 react 异常的最简 ErrorBoundary 组件 🎅

### 前言 📝

> 👉 从 React 16 开始，引入了 Error Boundaries 概念，它可以捕获它的子组件中产生的错误，记录错误日志，并展示降级内容，具体 [官网地址](https://zh-hans.reactjs.org/docs/error-boundaries.html#introducing-error-boundaries)。 👈

![image-1](https://raw.githubusercontent.com/blazer233/Today-wallpapers/master/public/logo512.png)

错误边界避免一个组件错误导致整个页面白屏不能使用等情况，使用优雅降级的方式呈现备用的 UI，错误边界可以在渲染期间、生命周期和整个组件树的构造函数中捕获错误。自 React 16 起，任何未被错误边界捕获的错误将会导致整个 React 组件树被卸载

---

### ErrorBoundary 意义 🤖

- 某些 UI 崩溃，不至于整个 webapp 崩溃

在浏览页面时，由于后端返回异常或者前端的某些错误校验，会导致用户体验很差，你想想，你带着老婆，坐着火车，吃着火锅唱着歌，~~突然被麻匪劫了~~，突然就报错了，有些场景下，比如正在设置金额，或者查看关键页面时，这样的体验就会很糟糕，比如你游戏充值了 500，结果由于接口原因显示出来充值`NaN`，这种显示比不显示还让人苦恼，不过相信大家对 JS 异常捕获很熟悉了，`try-catch` 一包业务代码就收工了。不过，在组件里对异常捕获，需要用到的是 React 提供的 `Error Boundary` 错误边界特性，用 `componentDidCatch` 钩子来对页面异常进行捕获，以至于不会将异常扩散到整个页面，有效防止页面白屏。

---

### 官网如何实现 🥔

> 👉 如果一个 class 组件中定义了 static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。当抛出错误后，请使用 static getDerivedStateFromError() 渲染备用 UI ，使用 componentDidCatch() 打印错误信息 👈

```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

然后你可以将它作为一个常规组件去使用：

```javascript
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

错误边界的工作方式类似于 JavaScript 的 `catch {}`，不同的地方在于错误边界只针对 `React` 组件。只有 `class` 组件才可以成为错误边界组件。大多数情况下, 你只需要声明一次错误边界组件, 并在整个应用中使用它，在使用时被包裹组件出现的错误或者`throw new Error()`抛出的异常都可以被错误边界组件捕获，并且显示出兜底 UI

---

### 封装一个可配置的 ErrorBoundary 🚲

了解了官网实现错误边界组件的方法，我们可以封装一个`ErrorBoundary`组件，造一个好用的轮子，而不是直接写死`return <h1>Something went wrong</h1>`，学习了`react-redux`原理后我们知道可以用高阶组件来包裹`react`组件，将`store`中的数据和方法全局注入，同理，我们也可以使用高阶组件包裹使其成为一个能够错误捕获的 react 组件

#### 1️⃣创造一个可配置的 ErrorBoundary 类组件

相比与官网的 `ErrorBoundary`，我们可以将日志上报的方法以及显示的 `UI` 通过接受传参的方式进行动态配置，对于传入的`UI`，我们可以设置以`react`组件的方式 或 是一个`React Element`进行接受，而且通过组件的话，我们可以传入参数，这样可以在兜底 UI 中拿到具体的错误信息

- componentDidCatch() : 错误日志处理的钩子函数
- static getDerivedStateFromError() : 它将抛出的错误作为参数，并返回一个值以更新 state

```javascript
class ErrorBoundary extends React.Component {
  state = { error: false };
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      //上报日志通过父组件注入的函数进行执行
      this.props.onError(error, errorInfo.componentStack);
    }
  }
  render() {
    const { fallback, FallbackComponent } = this.props;
    const { error } = this.state;
    if (error) {
      const fallbackProps = { error };
      //判断是否为React Element
      if (React.isValidElement(fallback)) {
        return fallback;
      }
      //组件方式传入
      if (FallbackComponent) {
        return <FallbackComponent {...fallbackProps} />;
      }
      throw new Error("ErrorBoundary 组件需要传入兜底UI");
    }
    return this.props.children;
  }
}
```

这样就可以对兜底`UI`显示和`错误日志`进行动态获取，使组件更加灵活，但是又有一个问题出现，有时候会遇到这种情况：服务器突然 503、502 了，前端获取不到响应，这时候某个组件报错了，但是过一会又正常了。比较好的方法是用户点一下被`ErrorBoundary`封装的组件中的一个方法来重新加载出错组件，不需要重刷页面，这时候需要兜底的组件中应该暴露出一个方法供`ErrorBoundary`进行处理

![image-1](https://raw.githubusercontent.com/blazer233/react-errors/errors-hook/public/png.png)

1. 在 ErrorBoundary 中添加方法，检测是否有注入重置方法，如果有重置方法就执行并且重置 state 中的 error，使其错误状态为 false

```javascript
resetErrorBoundary = () => {
  if (this.props.onReset) this.props.onReset();
  this.setState({ error: false });
};
```

2. 在 render 中添加函数组件类型进行渲染，可以将重置的方法以及错误信息当做参数进行传递到当前组件进行处理

```javascript
  render() {
    const { fallback, FallbackComponent, fallbackRender } = this.props;
    const { error } = this.state;
    if (error) {
      const fallbackProps = {
        error,
        resetErrorBoundary: this.resetErrorBoundary,
      };
      ...
      if (typeof fallbackRender === "function")return fallbackRender(fallbackProps);
      ...
    }
    return this.props.children;
  }
```

##### 2️⃣将 ErrorBoundary 通过高阶函数进行包裹返回

```javascript
import React from "react";
import DefaultErrorBoundary from "./core";
const catchreacterror = (Boundary = DefaultErrorBoundary) => InnerComponent => {
  return props => (
    <Boundary {...props}>
      <InnerComponent {...props} />
    </Boundary>
  );
};
```

---

##### 2、使用&测试 🏁

通过一个点击自增的 Demo，分别对 class 组件和 Function 组件作为发起异常的组件进行测试

- 发起异常的组件

```javascript
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
```

- 处理错误异常的函数组件

```javascript
const errorbackfn = ({ error: { message }, resetErrorBoundary }) => (
  <div>
    <p>出错啦</p>
    <pre>{message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);
```

- 处理错误异常的普通组件

```javascript
const errorbackcom = () => <h1>出错啦,不可撤销</h1>;
```

- 测试组件

```javascript
//对发起异常的组件进行包裹处理，返回一个可以处理错误编辑的高阶组件
const SafeCount1 = catchreacterror()(fnCount1);
const SafeCount2 = catchreacterror()(fnCount2);
const App = () => {
  const [count, setCount] = useState(0);
  const ListenError = (arg, info) => console.log("出错了:" + arg.message, info); //错误时进行的回调
  const onReset = () => setCount(0); //点击重置时进行的回调
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
```

![demo-1](https://raw.githubusercontent.com/blazer233/Today-wallpapers/master/public/logo512.png)

大功告成！

### 遇到的问题&总结 💢

有很多时候 react 错误边界不是万能的比如

- 事件错误

![demo-1](https://upload-images.jianshu.io/upload_images/13262886-423b6eb21486d828.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

- 异步代码

![demo-1](https://upload-images.jianshu.io/upload_images/13262886-b0255bba376a0bfd.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

- 服务端渲染 和 错误边界自己的错误

总结

- 抽离组件 ✔
- 错误反馈 ✔
- UI 抽离 ✔
- 错误重置 ✔
- 抽离 hook 模式 ✖
- 服务端 ✖

至此，谢谢各位在百忙之中点开这篇文章，希望对你们能有所帮助，相信你对 react 中的错误边界有了大概的认实，也会编写一个简单的`ErrorBoundary`总的来说优化的点还有很多，如有问题欢迎各位大佬指正。

- 👋：[跳转 github](https://github.com/blazer233/react-errors/tree/errors-hook)

### 参考文献

- 🍑：[React.js |错误边界组件](https://juejin.cn/post/6877165871693987847#heading-2)
- 🍑：[捕获 React 异常](https://github.com/x-orpheus/catch-react-error/blob/master/doc/catch-react-error.md)
- 🍑：[造一个 React 错误边界的轮子](https://github.com/Haixiang6123/my-react-error-bounday)
- 🍑：[错误边界(Error Boundaries)](https://react.html.cn/docs/error-boundaries.html)
- 🍑：[深入浅出 React 的异常错误边界](https://www.jianshu.com/p/3ae9838ed51c)

求个 star，谢谢大家了
