import {isObject, isString, merge} from '../utils';

export class StyleVar {
  resolve () {
    throw new Error('StyleVar is an abstract class, you should not be using it directly.');
  }
}

export function isStyleVar (input) {
  return input instanceof StyleVar;
}

StyleVar.isStyleVar = isStyleVar;

export class StyleAlias extends StyleVar {
  constructor (address, def) {
    super();
    this.address = address;
    this.default = def;
    this.delimiter = ' ';
  }

  resolve (tk, key) {
    if (Array.isArray(this.address)) {
      return this.address.map((subaddress) => {
        if (subaddress === key) throw new Error('StyleVar target is same as destination.');
        if (isStyleVar(subaddress)) {
          return subaddress.resolve(tk);
        }
        return subaddress;
      }).join(this.delimiter);
    }

    if (this.address === key) throw new Error('StyleVar target is same as destination.');
    const result = tk.lookup(this.address, this.default);
    if (isStyleVar(result)) {
      return result.resolve(tk, key);
    }
    return result;
  }
}

export class CompoundStyle extends StyleVar {
  constructor (template, def) {
    super();
    this.template = template;
    this.default = def;
    this.delimiter = ' ';
  }

  parseArray (input) {
    return input.map((part) => {
      if (part[0] === '$' && part[1] !== '{') return '${' + part.slice(1) + '}';
      return String(part);
    }).filter(Boolean).join(this.delimiter);
  }

  resolve (tk, key) {
    const template = Array.isArray(this.template) ? this.parseArray(this.template) : this.template;

    return template.replace(/\$\{([^}]+)\}/g, (match, address) => {
      const sv = new StyleAlias(address);
      const result = sv.resolve(tk, key);
      if (result === undefined || result === null) return '';
      return result;
    });
  }
}

export function BorderStyle ({ width = '1px', style = 'solid', color = '#000'}) {
  return new CompoundStyle([width, style, color]);
}

export function ShadowStyle ({ inset = false, x = '0px', y = '1px', blur = '1px', color = '#000'}) {
  return new CompoundStyle([ !!inset && 'inset', x, y, blur, color]);
}

export class StyleMerge extends StyleVar {
  constructor (...sources) {
    super();
    this.sources = sources;
  }

  resolve (tk, key) {

    const stack = this.sources.map((source) => {
      if (isString(source)) {
        const sv = new StyleAlias(source);
        const result = sv.resolve(tk, key);
        if (!result) return null;
        if (!isObject(result)) throw new Error('StyleMerge resolved a non object.');
        return result;
      }

      if (isStyleVar(source)) {
        return source.resolve(tk, key);
      }

      if (isObject(source)) {
        return source;
      }

      return null;
    });

    return merge(...stack);
  }
}

export default {
  StyleVar,
  StyleAlias,
  CompoundStyle,
  BorderStyle,
  ShadowStyle,
  StyleMerge,
}
