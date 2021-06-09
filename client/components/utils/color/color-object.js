function colorValues(str, type) {
  return str
    .split(str.indexOf(',') > -1 ? ',' : str.indexOf(' ') > -1 ? ' ' : '')
    .map((v, i) => {
    v = v.trim();
    if (type === 'rgb') {
      if (i < 3) {
        return v.indexOf('%') > -1 ? Math.round(v.substr(0, v.length - 1) / 100 * 255) : Math.max(0, Math.min(255, parseFloat(v)));
      }
    }
    else {
      if (i === 0) {
        return Math.max(0, Math.min(360, parseFloat(v)));
      }
      else if (i < 3) {
        return Math.max(0, Math.min(100, parseFloat(v)));
      }
    }
    if (v.indexOf('%') > -1) {
      return parseFloat(v) / 100;
    }
    return parseFloat(v);
  })
    .filter(v => !isNaN(v));
}
function betweenParens(str) { return str.substring(str.lastIndexOf("(") + 1, str.lastIndexOf(")")); }
function numberToHex(value) { return `0${value.toString(16)}`.slice(-2); }
function rgbToHex(r, g, b, a) { return `#${numberToHex(r)}${numberToHex(g)}${numberToHex(b)}${a === 1 ? '' : numberToHex(Math.round(a * 255))}`.toUpperCase(); }
function rgbToHslObject(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  const channelMin = Math.min(r, g, b);
  const channelMax = Math.max(r, g, b);
  const channelDelta = channelMax - channelMin;
  let h = Math.round(60 * (channelDelta === 0 ?
    0 :
    channelMax === r ?
      ((g - b) / channelDelta) % 6 :
      channelMax === g ?
        (b - r) / channelDelta + 2 :
        channelMax === b ?
          (r - g) / channelDelta + 4 :
          0));
  if (h < 0) {
    h += 360;
  }
  const l = ((channelMax + channelMin) / 2);
  return {
    h,
    l: l * 100,
    s: (channelDelta == 0 ? 0 : channelDelta / (1 - Math.abs(2 * l - 1))) * 100
  };
}
export function ColorType(color = '') {
  color = color.trim();
  return color.indexOf('rgb') === 0 ? 'rgb' : color.indexOf('hsl') === 0 ? 'hsl' : color.indexOf('#') === 0 ? 'hex' : '';
}
export default function ColorObject(color = '') {
  color = color.trim();
  const result = {
    r: 0, g: 0, b: 0, h: 0, s: 0, l: 0, a: 1, hex: '',
    toHex() { return this.hex; },
    toHsl() { return `hsl(${this.h}deg, ${this.s}%, ${this.l}%)`; },
    toHsla() { return `hsla(${this.h}deg, ${this.s}%, ${this.l}%, ${this.a})`; },
    toRgb() { return `rgb(${this.r}, ${this.g}, ${this.b})`; },
    toRgba() { return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`; },
  };
  if (!color) {
    return result;
  }
  const type = ColorType(color);
  if (!type) {
    return result;
  }
  const hexVal = color.slice(1);
  const colors = ['rgb', 'hsl'].indexOf(type) > -1 ?
    colorValues(betweenParens(color), type) :
    hexVal.length === 3 ?
      hexVal.split('').map(v => `${v}${v}`.trim()).filter(v => !!v) :
      hexVal.match(/.{1,2}/g);
  result.a = colors.length < 4 ? 1 : type === 'hex' ? `0x${colors[3]}` / 255 : colors[3];
  if (type === 'rgb') {
    result.r = colors[0];
    result.g = colors[1];
    result.b = colors[2];
    const hsl = rgbToHslObject(result.r, result.g, result.b);
    result.h = hsl.h;
    result.s = hsl.s;
    result.l = hsl.l;
    result.hex = rgbToHex(result.r, result.g, result.b, result.a);
  }
  if (type === 'hsl') {
    result.h = colors[0];
    result.s = colors[1];
    result.l = colors[2];
    const l = result.l / 100;
    const c = (1 - Math.abs(2 * l - 1)) * (result.s / 100);
    const x = c * (1 - Math.abs((result.h / 60) % 2 - 1));
    const m = (result.l / 100) - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;
    if (0 <= result.h && result.h < 60) {
      r = c;
      g = x;
      b = 0;
    }
    else if (60 <= result.h && result.h < 120) {
      r = x;
      g = c;
      b = 0;
    }
    else if (120 <= result.h && result.h < 180) {
      r = 0;
      g = c;
      b = x;
    }
    else if (180 <= result.h && result.h < 240) {
      r = 0;
      g = x;
      b = c;
    }
    else if (240 <= result.h && result.h < 300) {
      r = x;
      g = 0;
      b = c;
    }
    else if (300 <= result.h && result.h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    result.r = Math.round((r + m) * 255);
    result.g = Math.round((g + m) * 255);
    result.b = Math.round((b + m) * 255);
    result.hex = rgbToHex(result.r, result.g, result.b, result.a);
  }
  if (type === 'hex') {
    result.hex = `#${colors.join('')}`;
    result.r = parseInt(`0x${colors[0]}`);
    result.g = parseInt(`0x${colors[1]}`);
    result.b = parseInt(`0x${colors[2]}`);
    const hsl = rgbToHslObject(result.r, result.g, result.b);
    result.h = hsl.h;
    result.s = hsl.s;
    result.l = hsl.l;
  }
  result.hex = result.hex.toUpperCase();
  return result;
}
