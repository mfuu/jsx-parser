import h, { createElement as CE } from './dom.js';
import html from './html.js';

export default html.bind(h);
export const JSX = html.bind(h);
export const createElement = CE;