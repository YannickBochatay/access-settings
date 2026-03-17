import { toDashCase, getInitialFontSize, getInitialLineHeight } from "./utils.js";

const root = document.documentElement;

function setValue(prop, value) {
  const prevValue = this["_"+prop];

  if (prevValue !== value) {
    this["_"+prop] = value;
    this.triggerChange(prop, value, prevValue);
  }
}

function setBooleanValue(prop, value) {
  if (typeof value !== "boolean") throw new TypeError(`${prop} value must be a boolean`);
  
  if (value) root.classList.add(prop);
  else root.classList.remove(prop);

  setValue.call(this, prop, value);
}

function setNumberValue(prop, value, unit="") {
  if (typeof value !== "number") throw new TypeError(`${prop} value must be a number`);

  const bounds = this.bounds[prop];
  if (value < bounds[0] || value > bounds[1]) {
    throw new RangeError(`${prop} value must be between ${bounds[0]} and ${bounds[1]}`);
  }

  root.classList.add(prop);
  root.style.setProperty(`--access-${toDashCase(prop)}`, String(value) + unit);

  setValue.call(this, prop, value);
}

const initialValues = {
  dyslexicFont : false,
  invertColors : false,
  contrast : 100,
  fontSize : getInitialFontSize(),
  lineHeight : getInitialLineHeight()
};

export const settings = new EventTarget();

Object.defineProperties(settings, {
  bounds : {
    value : {
      contrast : [50, 150],
      lineHeight : [0.8, 3],
      fontSize : [6, 40]
    }
  },
  initialValues : { value : initialValues },

  _dyslexicFont : { writable : true, value : initialValues.dyslexicFont },
  _invertColors : { writable : true, value : initialValues.invertColors },
  _contrast : { writable : true, value : initialValues.contrast },
  _fontSize : { writable : true, value : initialValues.fontSize },
  _lineHeight : { writable : true, value : initialValues.lineHeight },

  _important : { writable : true, value : false },

  important : {
    get() { return this._important; },
    set(value) {
      if (typeof value !== "boolean") throw new TypeError("value important must be a boolean");
      this._important = value;
      root.classList[value ? "add" : "remove"]("important");
    }
  },

  dyslexicFont : {
    enumerable:true,
    get() { return this._dyslexicFont },
    set(value) { setBooleanValue.call(this, "dyslexicFont", value); }
  },
  invertColors : {
    enumerable:true,
    get() { return this._invertColors },
    set(value) { setBooleanValue.call(this, "invertColors", value); }
  },
  contrast : {
    enumerable:true,
    get() { return this._contrast },
    set(value) { setNumberValue.call(this, "contrast", value, "%"); }
  },
  lineHeight : {
    enumerable:true,
    get() { return this._lineHeight },
    set(value) { setNumberValue.call(this, "lineHeight", value); }
  },
  fontSize : {
    enumerable:true,
    get() { return this._fontSize },
    set(value) { setNumberValue.call(this, "fontSize", value, "px"); }
  },

  reset : {
    value : function(prop) {
      if (!prop) {
        for (let key in initialValues) this.reset(key);
        return;
      }
      if (!(prop in initialValues)) throw new Error(prop + " is not a known setting property");

      this[prop] = initialValues[prop];
      root.classList.remove(prop);
    }
  },

  triggerChange : {
    value : function(prop, value, prevValue) {
      settings.dispatchEvent(
        new CustomEvent("change", {
          detail : { prop, value, prevValue }
        })
      );
    }
  },

  // redefine EventTarget methods to make them not enumerable
  dispatchEvent : {
    value : EventTarget.prototype.dispatchEvent
  },
  addEventListener : {
    value : EventTarget.prototype.addEventListener
  },
  removeEventListener : {
    value : EventTarget.prototype.removeEventListener
  }
});
 
export default settings;