# Usage

```js
import JSX from 'dist/index.js'

class Comp {
  constructor() {
    ...
  }

  handleClick() {

  }

  render() {
    return JSX`
      <div className="jsx">
        <span>jsx complier</span>
        <button onClick=${ (e) => this.handleClick(e) }>click me</button>
      </div>
    `
  }
}
```