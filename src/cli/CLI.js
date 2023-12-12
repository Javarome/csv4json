export class CLI {
  /**
   * @member {string[]}
   * @protected
   */
  #argv

  /**
   * @member {string}
   * @protected
   */
  #prefix

  /**
   * Set up a CLI args parser.
   *
   * @param argv The args array.
   * @param prefix The prefix to detect args ("-" by default)
   */
  constructor(argv = process.argv, prefix = '--') {
    this.#argv = argv
    this.#prefix = prefix
  }

  /**
   * @template T=Record<string,string>
   * @return {T} A record of args values for each "-arg" key.
   */
  getArgs() {
    const argv = this.#argv
    const args = {}
    for (let i = 2; i < argv.length; i++) {
      const param = this.#getParam(i)
      if (param) {
        args[param] = argv[++i]
      }
    }
    return args
  }

  /**
   * @protected
   * @param {number} i
   * @return {string | undefined}
   */
  #getParam(i)  {
    const arg = this.#argv[i];
    if (arg) {
      const dash = arg.lastIndexOf(this.#prefix);
      return dash >= 0 ? arg.substring(dash + this.#prefix.length) : undefined;
    }
  }
}
