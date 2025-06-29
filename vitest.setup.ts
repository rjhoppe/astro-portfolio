import "@testing-library/jest-dom";

import { JSDOM } from "jsdom";
import { TextDecoder } from "node:util";
import { TextEncoder } from "util";

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
global.document = dom.window.document;
Object.defineProperty(global, "navigator", {
  value: dom.window.navigator,
  writable: true,
  configurable: true,
});
(global as any).window = dom.window;
global.TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;
global.Element = dom.window.Element;
