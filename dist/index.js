/*!
 * jsx-parser v0.0.1
 * open source under the MIT license
 * https://github.com/mfuu/jsx-component#readme
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.JSXParser = {}));
})(this, (function (exports) { 'use strict';

  function css(el, prop, val) {
    let style = el && el.style;

    if (style) {
      if (val === void 0) {
        if (document.defaultView && document.defaultView.getComputedStyle) {
          val = document.defaultView.getComputedStyle(el, '');
        } else if (el.currentStyle) {
          val = el.currentStyle;
        }

        return prop === void 0 ? val : val[prop];
      } else {
        if (!(prop in style) && prop.indexOf('webkit') === -1) {
          prop = '-webkit-' + prop;
        }

        style[prop] = val + (typeof val === 'string' ? '' : 'px');
      }
    }
  }
  function assign(targetObj, obj) {
    Object.keys(obj).forEach(prop => {
      if (targetObj.hasOwnProperty(prop) && typeof targetObj[prop] === 'object') {
        if (Array.isArray(obj[prop])) {
          targetObj[prop] = obj[prop];
        } else {
          assign(targetObj[prop], obj[prop]);
        }
      } else {
        targetObj[prop] = obj[prop];
      }
    });
    return targetObj;
  }
  function isSVG(element) {
    const patt = new RegExp(`^${element}$`, 'i');
    const SVGTags = ['path', 'svg', 'use', 'g'];
    return SVGTags.some(tag => patt.test(tag));
  }
  function createFragmentFrom(children) {
    // fragments will help later to append multiple children to the initial node
    const fragment = document.createDocumentFragment();

    function processDOMNodes(child) {
      if (child instanceof HTMLElement || child instanceof SVGElement || child instanceof Comment || child instanceof DocumentFragment) {
        fragment.appendChild(child);
      } else if (typeof child === 'string' || typeof child === 'number') {
        const textnode = document.createTextNode(child);
        fragment.appendChild(textnode);
      } else if (child instanceof Array) {
        child.forEach(processDOMNodes);
      } else ;
    }

    children.forEach(processDOMNodes);
    return fragment;
  }

  const HTML_TAGS = {
    a: {
      name: 'a',
      attributes: {
        download: 'download',
        href: 'href',
        hrefLang: 'hreflang',
        ping: 'ping',
        referrerPolicy: 'referrerpolicy',
        rel: 'rel',
        target: 'target',
        type: 'type'
      }
    },
    abbr: 'abbr',
    address: 'address',
    area: 'area',
    article: 'article',
    aside: 'aside',
    audio: {
      name: 'audio',
      attributes: {
        autoPlay: 'autoplay',
        autoBuffer: 'autobuffer',
        buffered: 'buffered',
        controls: 'controls',
        loop: 'loop',
        muted: 'muted',
        played: 'played',
        preload: 'preload',
        src: 'src',
        volume: 'volume'
      }
    },
    blockquote: 'blockquote',
    b: 'b',
    base: 'base',
    bdi: 'bdi',
    bdo: 'bdo',
    br: 'br',
    button: {
      name: 'button',
      attributes: {
        autoFocus: 'autofocus',
        disabled: 'disabled',
        form: 'form',
        formAction: 'formaction',
        formMethod: 'formmethod',
        formType: 'formtype',
        formValidate: 'formvalidate',
        formTarget: 'formtarget',
        type: 'type',
        value: 'value'
      }
    },
    canvas: {
      name: 'canvas',
      attributes: {
        height: 'height',
        width: 'width'
      }
    },
    caption: 'caption',
    cite: 'cite',
    code: 'code',
    col: 'col',
    colgroup: 'colgroup',
    data: {
      name: 'data',
      attributes: {
        value: 'value'
      }
    },
    datalist: 'datalist',
    dfn: 'dfn',
    div: 'div',
    dd: 'dd',
    del: 'del',
    details: {
      name: 'details',
      attributes: {
        open: 'open'
      }
    },
    dl: 'dl',
    dt: 'dt',
    em: 'em',
    embed: {
      name: 'embed',
      attributes: {
        height: 'height',
        src: 'src',
        type: 'type',
        width: 'width'
      }
    },
    fieldset: {
      name: 'fieldset',
      attributes: {
        disabled: 'disabled',
        form: 'form',
        name: 'name'
      }
    },
    figcaption: 'figcaption',
    figure: 'figure',
    footer: 'footer',
    form: {
      name: 'form',
      attributes: {
        acceptCharset: 'accept-charset',
        action: 'action',
        autocomplete: 'autocomplete',
        enctype: 'enctype',
        method: 'method',
        name: 'name',
        noValidate: 'novalidate',
        target: 'target'
      }
    },
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    head: 'head',
    header: 'header',
    hgroup: 'hgroup',
    hr: 'hr',
    i: 'i',
    input: {
      name: 'input',
      attributes: {
        accept: 'accept',
        autoFocus: 'autofocus',
        autoComplete: 'autocomplete',
        checked: 'checked',
        disabled: 'disabled',
        form: 'form',
        formAction: 'formaction',
        formMethod: 'formmethod',
        formType: 'formtype',
        formValidate: 'formvalidate',
        formTarget: 'formtarget',
        height: 'height',
        list: 'list',
        max: 'max',
        maxLength: 'maxlength',
        min: 'min',
        minLength: 'minlength',
        multiple: 'multiple',
        name: 'name',
        placeholder: 'placeholder',
        readOnly: 'readonly',
        required: 'required',
        size: 'size',
        src: 'src',
        step: 'step',
        type: 'type',
        value: 'value',
        width: 'width'
      }
    },
    img: {
      name: 'img',
      attributes: {
        alt: 'alt',
        crossOrigin: 'crossorigin',
        height: 'height',
        isMap: 'ismap',
        longDesc: 'longdesc',
        referrerPolicy: 'referrerpolicy',
        sizes: 'sizes',
        src: 'src',
        srcset: 'srcset',
        width: 'width',
        useMap: 'usemap'
      }
    },
    ins: 'ins',
    kbd: 'kbd',
    label: {
      name: 'label',
      attributes: {
        htmlFor: 'for'
      }
    },
    legend: 'legend',
    li: 'li',
    link: 'link',
    main: 'main',
    map: {
      name: 'map',
      attributes: {
        name: 'name'
      }
    },
    mark: 'mark',
    meta: 'meta',
    meter: {
      name: 'meter',
      attributes: {
        form: 'form',
        high: 'high',
        low: 'low',
        min: 'min',
        max: 'max',
        optimum: 'optimum',
        value: 'value'
      }
    },
    nav: 'nav',
    ol: 'ol',
    object: {
      name: 'object',
      attributes: {
        form: 'form',
        height: 'height',
        name: 'name',
        type: 'type',
        typeMustmatch: 'typemustmatch',
        useMap: 'usemap',
        width: 'width'
      }
    },
    optgroup: {
      name: 'optgroup',
      attributes: {
        disabled: 'disabled',
        label: 'label'
      }
    },
    option: {
      name: 'option',
      attributes: {
        disabled: 'disabled',
        label: 'label',
        selected: 'selected',
        value: 'value'
      }
    },
    output: {
      name: 'output',
      attributes: {
        htmlFor: 'for',
        form: 'form',
        name: 'name'
      }
    },
    p: 'p',
    param: {
      name: 'param',
      attributes: {
        name: 'name',
        value: 'value'
      }
    },
    pre: 'pre',
    progress: {
      name: 'progress',
      attributes: {
        max: 'max',
        value: 'value'
      }
    },
    rp: 'rp',
    rt: 'rt',
    rtc: 'rtc',
    ruby: 'ruby',
    s: 's',
    samp: 'samp',
    section: 'section',
    select: {
      name: 'select',
      attributes: {
        autoFocus: 'autofocus',
        disabled: 'disabled',
        form: 'form',
        multiple: 'multiple',
        name: 'name',
        required: 'required',
        size: 'size'
      }
    },
    small: 'small',
    source: {
      name: 'source',
      attributes: {
        media: 'media',
        sizes: 'sizes',
        src: 'src',
        srcset: 'srcset',
        type: 'type'
      }
    },
    span: 'span',
    strong: 'strong',
    style: 'style',
    sub: 'sub',
    sup: 'sup',
    table: 'table',
    tbody: 'tbody',
    th: 'th',
    thead: 'thead',
    textarea: {
      name: 'textarea',
      attributes: {
        autoComplete: 'autocomplete',
        autoFocus: 'autofocus',
        cols: 'cols',
        disabled: 'disabled',
        form: 'form',
        maxLength: 'maxlength',
        minLength: 'minlength',
        name: 'name',
        placeholder: 'placeholder',
        readOnly: 'readonly',
        required: 'required',
        rows: 'rows',
        selectionDirection: 'selectionDirection',
        wrap: 'wrap'
      }
    },
    td: 'td',
    tfoot: 'tfoot',
    tr: 'tr',
    track: {
      name: 'track',
      attributes: {
        htmlDefault: 'default',
        kind: 'kind',
        label: 'label',
        src: 'src',
        srclang: 'srclang'
      }
    },
    time: 'time',
    title: 'title',
    u: 'u',
    ul: 'ul',
    video: {
      name: 'video',
      attributes: {
        autoPlay: 'autoplay',
        buffered: 'buffered',
        controls: 'controls',
        crossOrigin: 'crossorigin',
        height: 'height',
        loop: 'loop',
        muted: 'muted',
        played: 'played',
        poster: 'poster',
        preload: 'preload',
        src: 'src',
        width: 'width'
      }
    }
  };
  const GLOBAL_ATTRIBUTES = {
    accessKey: 'accesskey',
    className: 'class',
    class: 'class',
    contentEditable: 'contenteditable',
    contextMenu: 'contextmenu',
    dir: 'dir',
    draggable: 'draggable',
    dropZone: 'dropzone',
    hidden: 'hidden',
    id: 'id',
    itemId: 'itemid',
    itemProp: 'itemprop',
    itemRef: 'itemref',
    itemScope: 'itemscope',
    itemType: 'itemtype',
    lang: 'lang',
    spellCheck: 'spellcheck',
    tabIndex: 'tabindex',
    title: 'title',
    translate: 'translate'
  };
  const EVENT_HANDLERS = {
    onClick: 'click',
    onFocus: 'focus',
    onBlur: 'blur',
    onChange: 'change',
    onSubmit: 'submit',
    onInput: 'input',
    onResize: 'resize',
    onScroll: 'scroll',
    onWheel: 'mousewheel',
    onMouseDown: 'mousedown',
    onMouseUp: 'mouseup',
    onMouseDown: 'mousedown',
    onMouseMove: 'mousemove',
    onMouseEnter: 'mouseenter',
    onMouseOver: 'mouseover',
    onMouseOut: 'mouseout',
    onMouseLeave: 'mouseleave',
    onTouchStart: 'touchstart',
    onTouchEnd: 'touchend',
    onTouchCancel: 'touchcancel',
    onContextMenu: 'Ccntextmenu',
    onDoubleClick: 'dblclick',
    onDrag: 'drag',
    onDragEnd: 'dragend',
    onDragEnter: 'dragenter',
    onDragExit: 'dragexit',
    onDragLeave: 'dragleave',
    onDragOver: 'dragover',
    onDragStart: 'Dragstart',
    onDrop: 'drop',
    onLoad: 'load',
    onCopy: 'copy',
    onCut: 'cut',
    onPaste: 'paste',
    onCompositionEnd: 'compositionend',
    onCompositionStart: 'compositionstart',
    onCompositionUpdate: 'compositionupdate',
    onKeyDown: 'keydown',
    onKeyPress: 'keypress',
    onKeyUp: 'keyup',
    onAbort: 'Abort',
    onCanPlay: 'canplay',
    onCanPlayThrough: 'canplaythrough',
    onDurationChange: 'durationchange',
    onEmptied: 'emptied',
    onEncrypted: 'encrypted ',
    onEnded: 'ended',
    onError: 'error',
    onLoadedData: 'loadeddata',
    onLoadedMetadata: 'loadedmetadata',
    onLoadStart: 'Loadstart',
    onPause: 'pause',
    onPlay: 'play ',
    onPlaying: 'playing',
    onProgress: 'progress',
    onRateChange: 'ratechange',
    onSeeked: 'seeked',
    onSeeking: 'seeking',
    onStalled: 'stalled',
    onSuspend: 'suspend ',
    onTimeUpdate: 'timeupdate',
    onVolumeChange: 'volumechange',
    onWaiting: 'waiting',
    onAnimationStart: 'animationstart',
    onAnimationEnd: 'animationend',
    onAnimationIteration: 'animationiteration',
    onTransitionEnd: 'transitionend'
  };
  const EVENTS = ['click', 'focus', 'blur', 'change', 'submit', 'input', 'resize', 'scroll', 'mousewheel', 'mousedown', 'mouseup', 'mousedown', 'mousemove', 'mouseenter', 'mouseover', 'mouseout', 'mouseleave', 'touchstart', 'touchend', 'touchcancel', 'Ccntextmenu', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'Dragstart', 'drop', 'load', 'copy', 'cut', 'paste', 'compositionend', 'compositionstart', 'compositionupdate', 'keydown', 'keypress', 'keyup', 'Abort', 'canplay', 'canplaythrough', 'durationchange', 'emptied', 'encrypted ', 'ended', 'error', 'loadeddata', 'loadedmetadata', 'Loadstart', 'pause', 'play ', 'playing', 'progress', 'ratechange', 'seeked', 'seeking', 'stalled', 'suspend ', 'timeupdate', 'volumechange', 'waiting', 'animationstart', 'animationend', 'animationiteration', 'transitionend'];

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

  function composeToFunction(JSXTag, elementProps, children) {
    const props = Object.assign({}, JSXTag.defaultProps || {}, elementProps, {
      children
    });
    const bridge = JSXTag.prototype.render ? new JSXTag(props).render : JSXTag;
    const result = bridge(props);

    switch (result) {
      case 'FRAGMENT':
        return createFragmentFrom(children);
      // Portals are useful to render modals
      // allow render on a different element than the parent of the chain
      // and leave a comment instead

      case 'PORTAL':
        bridge.target.appendChild(createFragmentFrom(children));
        return document.createComment('Portal Used');

      default:
        return result;
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

  function createElement$1(tagName, props, ...children) {
    if (props === null) props = {}; // 判断标签类型并取出标签中的attrs

    const tag = HTML_TAGS[tagName];
    const object = typeof tag === 'object';
    const tagType = object ? tag.name : tag;
    const attributes = Object.assign({}, GLOBAL_ATTRIBUTES, object ? tag.attributes || {} : {});
    const element = isSVG(tagType) ? document.createElementNS('http://www.w3.org/2000/svg', tagType) : document.createElement(tagType);
    const fragment = createFragmentFrom(children);
    element.appendChild(fragment);
    Object.keys(props || {}).forEach(prop => {
      if (prop in attributes) {
        element.setAttribute(attributes[prop], props[prop]);
      } // style 样式


      if (prop === 'style') {
        let styles = props[prop];

        if (typeof props[prop] === 'string') {
          try {
            styles = JSON.parse(styles);
          } catch (e) {
            throw new Error(`Style expected "object" or "string" but received "${typeof styles}"`);
          }
        }

        Object.keys(styles).forEach(s => {
          css(element, s, styles[s]);
        });
      } else if (EVENT_HANDLERS[prop] !== undefined) {
        // 添加 e.g. onClick 事件
        const event = prop.replace(/^on/, '').toLowerCase();
        element.addEventListener(event, props[prop]);
      } else if (prop === 'on') {
        // 添加 e.g. click 事件
        let events = props[prop];

        if (typeof events === 'string') {
          try {
            events = JSON.parse(events);
          } catch (e) {
            throw new Error(`On events expected "object" or "string" but received "${typeof styles}"`);
          }
        }

        Object.keys(events).forEach(evt => {
          if (EVENTS.includes(evt)) element.addEventListener(evt, events[evt]);
        });
      } else if (prop === 'ref') {
        if (typeof props.ref === 'function') props.ref(element, props);
      } else if (prop === 'htmlFor') {
        element.setAttribute('for', props[prop]);
      } else if (prop === 'xlinkHref') {
        element.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', props[prop]);
      } else if (prop === 'dangerouslySetInnerHTML') {
        element.innerHTML = props[prop].__html;
      }
    });
    return element;
  }
  function h(element, attrs, ...children) {
    // Custom Components will be functions
    if (typeof element === 'function') {
      // e.g. const CustomTag = ({ w }) => <span width={w} />
      // will be used
      // e.g. <CustomTag w={1} />
      // becomes: CustomTag({ w: 1})
      return composeToFunction(element, attrs, children);
    } // regular html components will be strings to create the elements
    // this is handled by the babel plugins


    if (typeof element === 'string') {
      return createElement$1(element, attrs, children);
    }

    return console.error(`jsx-render does not handle ${typeof tag}`);
  }

  /* eslint-disable */

  function html (n) {
    for (var l, e, s = arguments, t = 1, r = '', u = '', a = [0], c = function (n) {
      t === 1 && (n || (r = r.replace(/^\s*\n\s*|\s*\n\s*$/g, ''))) ? a.push(n ? s[n] : r) : t === 3 && (n || r) ? (a[1] = n ? s[n] : r, t = 2) : t === 2 && r === '...' && n ? a[2] = assign(a[2] || {}, s[n]) : t === 2 && r && !n ? (a[2] = a[2] || {})[r] = !0 : t >= 5 && (t === 5 ? ((a[2] = a[2] || {})[e] = n ? r ? r + s[n] : s[n] : r, t = 6) : (n || r) && (a[2][e] += n ? r + s[n] : r)), r = '';
    }, h = 0; h < n.length; h++) {
      h && (t === 1 && c(), c(h));

      for (let i = 0; i < n[h].length; i++) l = n[h][i], t === 1 ? l === '<' ? (c(), a = [a, '', null], t = 3) : r += l : t === 4 ? r === '--' && l === '>' ? (t = 1, r = '') : r = l + r[0] : u ? l === u ? u = '' : r += l : l === '"' || l === "'" ? u = l : l === '>' ? (c(), t = 1) : t && (l === '=' ? (t = 5, e = r, r = '') : l === '/' && (t < 5 || n[h][i + 1] === '>') ? (c(), t === 3 && (a = a[0]), t = a, (a = a[0]).push(this.apply(null, t.slice(1))), t = 0) : l === ' ' || l === '\t' || l === '\n' || l === '\r' ? (c(), t = 2) : r += l), t === 3 && r === '!--' && (t = 4, a = a[0]);
    }

    return c(), a.length > 2 ? a.slice(1) : a[1];
  }

  var index = html.bind(h);
  const JSX = html.bind(h);
  const createElement = createElement$1;

  exports.JSX = JSX;
  exports.createElement = createElement;
  exports["default"] = index;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
