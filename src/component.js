import { EVENT_HANDLERS } from './events.js'

export default class JSXComponent {
  constructor(props) {
    this.props = props
    this.render = this.render.bind(this)
    this.ref = this.ref.bind(this, props)
    return this.render()
  }

  ref(node, props) {
    const events = Object.keys(props).filter(prop => EVENT_HANDLERS[prop])

    events.forEach(evt => {
      const event = evt.replace(/^on/, '').toLowerCase()

      node.addEventListener(event, props[evt])
    })
  }

  render() {}
}