export function css(el, prop, val) {
  let style = el && el.style
  if (style) {
    if (val === void 0) {
      if (document.defaultView && document.defaultView.getComputedStyle) {
        val = document.defaultView.getComputedStyle(el, '')
      } else if (el.currentStyle) {
        val = el.currentStyle
      }
      return prop === void 0 ? val : val[prop]
    } else {
      if (!(prop in style) && prop.indexOf('webkit') === -1) {
        prop = '-webkit-' + prop
      }
      style[prop] = val + (typeof val === 'string' ? '' : 'px')
    }
  }
}

export function assign(targetObj, obj) {
  Object.keys(obj).forEach((prop) => {
    if (targetObj.hasOwnProperty(prop) && typeof targetObj[prop] === 'object') {
      if (Array.isArray(obj[prop])) {
        targetObj[prop] = obj[prop];
      } else {
        assign(targetObj[prop], obj[prop]);
      }
    } else {
      targetObj[prop] = obj[prop];
    }
  })
  return targetObj
}

export function isSVG(element) {
  const patt = new RegExp(`^${element}$`, 'i')
  const SVGTags = ['path', 'svg', 'use', 'g']

  return SVGTags.some(tag => patt.test(tag))
}

export function createFragmentFrom(children) {
  // fragments will help later to append multiple children to the initial node
  const fragment = document.createDocumentFragment()

  function processDOMNodes(child) {
    if (
      child instanceof HTMLElement ||
      child instanceof SVGElement ||
      child instanceof Comment ||
      child instanceof DocumentFragment
    ) {
      fragment.appendChild(child)
    } else if (typeof child === 'string' || typeof child === 'number') {
      const textnode = document.createTextNode(child)
      fragment.appendChild(textnode)
    } else if (child instanceof Array) {
      child.forEach(processDOMNodes)
    } else if (child === false || child === null) {
      // expression evaluated as false e.g. {false && <Elem />}
      // expression evaluated as false e.g. {null && <Elem />}
    } else {
      // later other things could not be HTMLElement nor strings
    }
  }

  children.forEach(processDOMNodes)

  return fragment
}