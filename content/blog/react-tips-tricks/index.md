---
title: 💍 React Performance, pitfalls, traps, optimisation and secrets
date: "2020-06-26T22:12:03.284Z"
description: "A collection of React performance pitfalls, anti-patterns, and optimization techniques learned the hard way. From unnecessary re-renders to memo misuse, practical tips for writing faster React applications."
tags: ["Tech", "Written Before ChatGPT"]
---

This article serves as a personal reminder of all the bad code I've written in the past and how to avoid it in the future when building React applications.

These tips are ordered in no particular way. If anything is wrong or badly explained, feel free to <a href="https://twitter.com/antoninarto">tweet angrily at me</a> 🙏

Also, since standards and best practices move pretty fast (remember when redux-form was THE form management tool to use ?), this article may quickly become out of date 💃

### 1. The rendering engine does not live in the `react` package.

Yes, you read that right. It is a common misconception to think that the rendering logic is in the react package. It lives in different packages, each used for different purposes, such as `react-dom` or `react-native` for example. The `react` package exports tools like `React.Component` , `React.createElement` , hooks, etc...
These tools are platform-agnostic, meaning that no matter the rendering target (mobile, server, web client), the same methods are usable and accessible, and you could [build your own Renderer on top of React](https://github.com/facebook/react/blob/master/packages/react-reconciler/README.md#practical-examples) ! Your root `index.js` file would look something like this

```jsx
import React from "react"
import MyCustomRenderer from "./myCustomRenderer"
import App from "./App"

MyCustomRenderer.render(<App />, document.getElementById("root"))
```

### 2. Treat the state as immutable

Now that you have learned that `react` does not handle the rendering, let's see how you can properly use `setState` .
While React's `setState` logic is fairly straightforward, there are a few pitfalls I usually see junior developers fall in when trying to update a component state.

Consider this code

```jsx
class TodoApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        { text: "Learn React", id: 1 },
        { text: "Go fast", id: 2 },
      ],
    }
  }

  addEntry() {
    const entry1 = { text: "Break Things", id: this.state.items.length + 1 }
    const items = this.state.items
    items.push(entry1)
    this.setState({ items })
  }

  render() {
    return (
      <div>
        <h2>Todos:</h2>
        <ol>
          {this.state.items.map(item => (
            <li key={item.id}>
              <label>
                <span>{item.text}</span>
              </label>
            </li>
          ))}
        </ol>
        <div onClick={() => this.addEntry()}>--Add Entry--</div>
      </div>
    )
  }
}

ReactDOM.render(<TodoApp />, document.querySelector("#app"))
```

While this code works in practice, it has a major flaw. React's state should be treated as immutable. Here, the `push` method directly modifies the `items` array instead of creating a new array.

Since this is a simple `React.Component` , the component is re-rendered every time `setState` is called. Let's say we want to optimise this `React.Component` by replacing it with a `React.PureComponent` now.

```jsx
class TodoApp extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        { text: "Learn React", id: 1 },
        { text: "Go fast", id: 2 },
      ],
    }
  }

  addEntry() {
    const entry1 = { text: "Break Things", id: this.state.items.length + 1 }
    const items = this.state.items
    items.push(entry1)
    this.setState({ items })
  }

  render() {
    return (
      <div>
        <h2>Todos:</h2>
        <ol>
          {this.state.items.map(item => (
            <li key={item.id}>
              <label>
                <span>{item.text}</span>
              </label>
            </li>
          ))}
        </ol>
        <div onClick={() => this.addEntry()}>--Add Entry--</div>
      </div>
    )
  }
}

ReactDOM.render(<TodoApp />, document.querySelector("#app"))
```

When clicking on `--Add Entry--` , nothing happens, yet `setState` is still called.
It's because, internally, the `React.PureComponent` implements a function to check if it should update the component or not, thus preventing useless re-renders.

This function looks like this, you could also implement it yourself:

```jsx
shouldComponentUpdate(nextProps, nextState) {
    if (this.state.items !== nextState.items) {
      return true;
    }
    return false;
  }
```

Since we have modified the original `items` array and returned it, the reference stays the same, thus returning false here and not re-rendering.
An easy way to rewrite the `addEntry` method would be to use either `.concat()` which returns a new array or the ES6 spread operator like this `[...this.state.items, entry1]`

### 3. Use pure, stateless, functional components (or React.PureComponent) to prevent useless re-renders

Using a functional component instead of a class when you can helps make your code easier to read, your bundle size smaller (functions are better minified than classes) and your code more performant since it won't update everytime the slightest state or props update happens.

Just be careful when using `React.PureComponent` as we have seen before that it does a shallow comparison of the state. It means that even if an array content changed, if the reference is the same, the component won't re-render. Use a `React.PureComponent` when your props/state are immutable.

### 4. `setState` has asynchronous actions but is a synchronous function

Developers can easily be overwhelmed when learning about `React` and `promises` at the same time. There is often confusion about `setState` synchronicity. Let's be clear: `setState` is a synchronous function.

When you call it, the execution is paused until `setState` returns. It doesn't mean that the `state` is updated when the function returns. `setState` queues the state update and returns. If you access `this.state` right after calling this method, you may be reading the value before you updated the state.

Let's consider this code:

```jsx
class TodoApp extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      items: [
        { text: "Learn React", id: 1 },
        { text: "Go fast", id: 2 },
      ],
    }
  }

  addEntry() {
    const entry1 = { text: "Break Things", id: this.state.items.length + 1 }
    this.setState({ items: [...this.state.items, entry1] })
    const entry2 = {
      text: "Too cool for school",
      id: this.state.items.length + 1,
    }
    this.setState({ items: [...this.state.items, entry2] })
  }

  render() {
    return (
      <div>
        {this.state.items.map(item => (
          <li key={item.id}>
            <span>{item.text}</span>
          </li>
        ))}
        <div onClick={() => this.addEntry()}>--Add Entry--</div>
      </div>
    )
  }
}

ReactDOM.render(<TodoApp />, document.querySelector("#app"))
```

What should be added to the list when you click on `--Add Entry--` ?

Well, only `Too cool for school` will be added. Why ?
When the first `setState` is executed, the function returns and the execution continues but the state isn't necessarily updated yet. When doing the second `setState` , we use the spread operator to re-use the `items`, which have not been updated yet, thus erasing the previous state update.

Thankfully, `setState` provides a callback function called when the state has really been updated. Our `addEntry` function now looks like this:

```jsx
addEntry() {
  	const entry1 = { text: "Break Things", id: this.state.items.length + 1};
    this.setState({items: [...this.state.items, entry1]}, () => {
      const entry2 = { text: "Too cool for school", id: this.state.items.length + 1};
      this.setState({items: [...this.state.items, entry2]})
    })
  }
```

### 5. Use `React.fragments` for a cleaner code

Ever had the following error `Parse Error: Adjacent JSX elements must be wrapped in an enclosing tag` ?

The easy fix is to add a `<div>` wrapping your code, but it can lead to all sorts of problems. An easier fix that I don't see often enough is to wrap your code into a `React.Fragment`, like this:

```jsx
class TodoApp extends React.PureComponent {
  render() {
    return (
      <React.Fragment>
        <h1>TodoApp</h1>
        <h2>Todos are amazing</h2>
      </React.Fragment>
    )
  }
}

ReactDOM.render(<TodoApp />, document.querySelector("#app"))
```

Or, even better, replace `<React.Fragment>` with `<>`

### 6. Do not use index as key for a map of components

I'm lazy and I assume you are too. When iterating over an array with elements to render, you sometimes do something like this, otherwise you'll see this warning in the console
`Warning: Each child in an array or iterator should have a unique “key” prop.`

```jsx
  render() {
    return (
      {this.state.items.map((item, index) => (
        <li key={index}>
          ...
        </li>
      ))}
	  )
  }
```

Per the documentation:

> Keys help React identify which items have changed, are added, or are removed.

I won't go into much details about WHY you need to have a key on your items that isn't a simple index, if you are interested you can [read this post about reconciliation](https://reactjs.org/docs/reconciliation.html#recursing-on-children) on Reactjs.org and this [in depth article](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) by Robin Porkony.

Simply put, it can break your application and display wrong data.

### 7. Lazy loading components with `react.lazy`

Lazy loading isn't new, but since `React 16.6.x` it can be done without the use of third party libraries. `React.lazy()` is easy to understand: render critical UI components first, render non-critical items later, for a better user experience.

So how does it work ? Let's see with an example:

```jsx
import React, { Suspense } from 'react';

const TodoList = React.lazy(() => import('./TodoList'));

function Todo() {
  return (
    <div>
      <Suspense fallback={</loader>}>
        <TodoList />
      </Suspense>
    </div>
  );
}
```

By doing this, React will first load the bundle with the core components of your app. By wrapping `TodoList` into `Suspense` we can display a fallback component (here, it's a loader) before the `TodoList` is finally loaded.

I have personally used this but I lack some strong real world large scale use. If you have any feedback, feel free to comment 🙂

One more thing: `React.lazy()` isn't available when using Server side rendering

### 8. Moment, lodash and taking advantage of tree shacking in webpack

The downfall of the junior developer is to `npm install` everything, even huge libraries and using them like this

```jsx
import lodash from 'lodash'

lodash.method()...
```

Most recent versions of widely used modules such as `lodash` are highly modular, meaning you can greatly reduce your bundle size by taking advantage of `webpack` 's tree shaking feature.

```jsx
import method from 'lodash/method'

method()...
```

This way, webpack will only include `method` and it's dependencies in your bundle and not the whole freaking library.

By the way, if you are using react-native, too bad, last time I checked the `metro` bundler [doesn't support tree shaking](https://github.com/facebook/metro/issues/227#issuecomment-583358386).

### Coming soon:

- Garbage collector optimizations
- Memoize everything !
- Avoid async stuff in componentWillMount()
- Using a CDN
- Server-side Rendering
- Web Workers
- Optimizing the Webpack bundle
