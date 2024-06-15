import fs from "fs"
import { pipeline } from "node:stream/promises"
import path from "node:path"
import assert from "node:assert"

export class Csv4Json {
  /**
   * @member {string}
   */
  #input

  /**
   * @member {string}
   */
  #output

  /**
   * @member {string[]}
   */
  #fields

  /**
   * @member {string}
   */
  #separator

  /**
   * @member {string}
   */
  #lineFeed

  /**
   * @member {boolean}
   */
  #inputCsv

  /**
   *
   * @param {string} input
   * @param {string} output
   * @param {string} separator
   * @param {string} lineFeed
   */
  constructor (input, output, separator = ",", lineFeed = "\r\n") {
    assert.ok(input, "--input <csv or json file> expected")
    this.#input = input
    const ext = path.extname(input)
    this.#inputCsv = ext === ".csv"
    if (output) {
      this.#output = output
    } else {
      this.#output = input.replace(/\.\w+$/, this.#inputCsv ? ".json" : ".csv")
    }
    this.#separator = separator
    this.#lineFeed = lineFeed
    this.regex = new RegExp(`("(?:[^"]|"")*"|[^${this.#separator}]*)`, "g")
  }

  async run () {
    const processChunk = this.#inputCsv ? this.csvToJson.bind(this) : this.jsonToCsv.bind(this)
    console.log("Reading", path.resolve(this.#input))
    await pipeline(
      fs.createReadStream(this.#input),
      async function * (source) {
        source.setEncoding("utf8")  // Work with strings rather than `Buffer`s.
        for await (const chunk of source) {
          yield processChunk(chunk)
        }
      },
      fs.createWriteStream(this.#output)
    )
    return path.resolve(this.#output)
  }

  jsonToCsv (chunk) {
    const objs = JSON.parse(chunk)
    let header = ""
    if (!this.#fields) {
      this.#fields = Object.keys(objs[0])
      header = this.#fields.join(this.#separator) + this.#lineFeed
    }
    return header + objs
      .map(obj => Object.values(obj).join(this.#separator))
      .join(this.#lineFeed)
  }

  csvToJson (chunk) {
    const arr = this.csvToArray(chunk)
    return JSON.stringify(arr)
  }

  /**
   *
   * @param {string} str
   * @return {string}
   */
  unquote (str) {
    const end = str.length - 1
    let quoted = str.charAt(0) === "\"" && str.charAt(end) === "\""
    if (quoted) {
      str = str.substring(1, end)
      str = str.replaceAll("\"\"", "\"")
    }
    return str
  }

  /**
   *
   * @param {string} csvContents The CSV lines, separated by \n
   * @return {object[]}
   */
  csvToArray (csvContents) {
    const lines = csvContents.split(this.#lineFeed)
    if (!this.#fields) {
      this.#fields = this.parse(lines.splice(0, 1)[0])
    }
    /** @type {object[]} */
    const arr = []
    for (const line of lines) {
      if (line.trim()) {
        const values = this.parse(line)
        const entries = this.#fields.map((field, i) => [this.unquote(field), this.unquote(values[i])])
        arr.push(Object.fromEntries(entries))
      }
    }
    return arr
  }

  /**
   * @param {string} line
   * @return {string[]}
   */
  parse (line) {
    const values = []
    let m
    while ((m = this.regex.exec(line)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === this.regex.lastIndex) {
        this.regex.lastIndex++
      }
      // The result can be accessed through the `m`-variable.
      m.forEach((match, groupIndex) => {
        if (groupIndex && match)
          values.push(match)
      })
    }
    return values
  }
}
