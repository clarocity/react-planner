
export default class StyleVar {
  constructor (address, def) {
    this.address = address;
    this.default = def;
    this.delimiter = ' ';
  }

  fetch (tk, key) {
    if (Array.isArray(this.address)) {
      return this.address.map((subaddress) => {
        if (subaddress === key) throw new Error('StyleVar target is same as destination.');
        if (subaddress instanceof StyleVar) {
          return subaddress.fetch(tk);
        }
        return subaddress;
      }).join(this.delimiter);
    }

    if (this.address === key) throw new Error('StyleVar target is same as destination.');
    const result = tk.lookup(this.address, this.default);
    if (result instanceof StyleVar) {
      return result.fetch(tk);
    }
    return result;
  }
}
