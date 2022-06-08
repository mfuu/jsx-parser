import { css, isSVG, createFragmentFrom,  } from './utils.js'
import { EVENT_HANDLERS, EVENTS, HTML_TAGS, GLOBAL_ATTRIBUTES } from './event.js'

/**
 * The JSXTag will be unwrapped returning the html
 *
 * @param  {Function} JSXTag name as string, e.g. 'div', 'span', 'svg'
 * @param  {Object} elementProps custom jsx attributes e.g. fn, strings
 * @param  {Array} children html nodes from inside de elements
 * @return {Function} returns de 'h' (fn) executed, leaving the HTMLElement
 *
 * JSXTag:  function Comp(props) {
 *   return h("span", null, props.num);
 * }
 */
export function composeToFunction(JSXTag, elementProps, children) {
  const props = Object.assign({}, JSXTag.defaultProps || {}, elementProps, { children })
  const bridge = JSXTag.prototype.render ? new JSXTag(props).render : JSXTag
  const result = bridge(props)

  switch (result) {
    case 'FRAGMENT':
      return createFragmentFrom(children)

    // Portals are useful to render modals
    // allow render on a different element than the parent of the chain
    // and leave a comment instead
    case 'PORTAL':
      bridge.target.appendChild(createFragmentFrom(children))
      return document.createComment('Portal Used')
    default:
      return result
  }
}


/**
 * 创建Element
 *
 * @param  {String} tagName tag name: 'div', 'span', 'svg'
 * @param  {Object} props html attributes: data-, width, src
 * @param  {Array} children html nodes from inside de elements
 * @return {HTMLElement|SVGElement} html node with attrs
 */
export function createElement(tagName, props, ...children) {
  if (props === null) props = {}
  // 判断标签类型并取出标签中的attrs
  const tag = HTML_TAGS[tagName]
  const object = typeof tag === 'object'
  const tagType = object ? tag.name : tag
  const attributes = Object.assign({}, GLOBAL_ATTRIBUTES, object ? tag.attributes|| {} : {})

  const element = isSVG(tagType)
    ? document.createElementNS('http://www.w3.org/2000/svg', tagType)
    : document.createElement(tagType)
  const fragment = createFragmentFrom(children)
  element.appendChild(fragment)

  Object.keys(props || {}).forEach(prop => {
    if (prop in attributes) {
      element.setAttribute(attributes[prop], props[prop])
    }

    // style 样式
    if (prop === 'style') {
      let styles = props[prop]
      if (typeof props[prop] === 'string') {
        try {
          styles = JSON.parse(styles)
        } catch (e) {
          throw new Error(`Style expected "object" or "string" but received "${typeof styles}"`)
        }
      }
      Object.keys(styles).forEach(s => { css(element, s, styles[s]) })

    } else if (EVENT_HANDLERS[prop] !== undefined) { // 添加 e.g. onClick 事件
      const event = prop.replace(/^on/, '').toLowerCase()
      element.addEventListener(event, props[prop])

    } else if (prop === 'on') { // 添加 e.g. click 事件
      let events = props[prop]
      if (typeof events === 'string') {
        try {
          events = JSON.parse(events)
        } catch (e) {
          throw new Error(`On events expected "object" or "string" but received "${typeof styles}"`)
        }
      }
      Object.keys(events).forEach(evt => {
        if (EVENTS.includes(evt)) element.addEventListener(evt, events[evt])
      })

    } else if (prop === 'ref') {
      if (typeof props.ref === 'function') props.ref(element, props)
    } else if (prop === 'htmlFor') {
      element.setAttribute('for', props[prop])
    } else if (prop === 'xlinkHref') {
      element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', props[prop])
    } else if (prop === 'dangerouslySetInnerHTML') {
      element.innerHTML = props[prop].__html
    }
  })

  return element
}


export function h(element, attrs, ...children) {
  // Custom Components will be functions
  if (typeof element === 'function') {
    // e.g. const CustomTag = ({ w }) => <span width={w} />
    // will be used
    // e.g. <CustomTag w={1} />
    // becomes: CustomTag({ w: 1})
    return composeToFunction(element, attrs, children)
  }

  // regular html components will be strings to create the elements
  // this is handled by the babel plugins
  if (typeof element === 'string') {
    return createElement(element, attrs, children)
  }

  return console.error(`jsx-render does not handle ${typeof tag}`)
}


export default h