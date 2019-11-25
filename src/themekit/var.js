
class StyleVar {
  resolve () {
    throw new Error('StyleVar is an abstract class, you should not be using it directly.');
  }
}

class StyleAlias extends StyleVar {
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
        if (subaddress instanceof StyleVar) {
          return subaddress.resolve(tk);
        }
        return subaddress;
      }).join(this.delimiter);
    }

    if (this.address === key) throw new Error('StyleVar target is same as destination.');
    const result = tk.lookup(this.address, this.default);
    if (result instanceof StyleVar) {
      return result.resolve(tk);
    }
    return result;
  }
}

class CompoundStyle extends StyleVar {
  constructor (template, def) {
    super();
    this.template = template;
    this.default = def;
  }

  resolve (tk, key) {
    return this.template.replace(/\$\{([^}]+)\}/g, (match, address) => {
      const sv = new StyleAlias(address);
      const result = sv.resolve(tk, key);
      if (result === undefined || result === null) return '';
      return result;
    });
  }
}

export default {
  StyleVar,
  StyleAlias,
  CompoundStyle
}

export {
  StyleVar,
  StyleAlias,
  CompoundStyle
}
