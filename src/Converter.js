import fs from 'fs'
import { pipeline } from 'node:stream/promises'
import path from 'node:path'

export class Converter {
  #input
  #output
  #fields
  #separator
  #lineFeed = '\r\n'

  /**
   *
   * @param {string} input
   * @param {string} output
   * @param {string} separator
   */
  constructor (input, output, separator = ',') {
    this.#input = input
    this.#output = output
    this.#separator = separator
  }

  async run () {
    const processChunk = this.#input.endsWith('.csv') ? this.csvToJson.bind(this) : this.jsonToCsv.bind(this)
    console.log('Reading', path.resolve(this.#input))
    await pipeline(
      fs.createReadStream(this.#input),
      async function * (source) {
        source.setEncoding('utf8')  // Work with strings rather than `Buffer`s.
        for await (const chunk of source) {
          yield await processChunk(chunk)
        }
      },
      fs.createWriteStream(this.#output)
    )
    console.log('Written', path.resolve(this.#output))
  }

  async jsonToCsv (chunk) {
    const objs = JSON.parse(chunk)
    let header = ''
    if (!this.#fields) {
      this.#fields = Object.keys(objs[0])
      header = this.#fields.join(this.#separator) + this.#lineFeed
    }
    return header + objs
      .map(obj => Object.values(obj).join(this.#separator))
      .join(this.#lineFeed)
  }

  async csvToJson (chunk, info) {
    const lines = chunk.split(this.#lineFeed)
    if (!this.#fields) {
      this.#fields = lines.splice(0, 1)[0].split(this.#separator)
    }
    const arr = []
    for (const line of lines) {
      const values = line.split(this.#separator)
      const entries = this.#fields.map((field, i) => [field, values[i]])
      arr.push(Object.fromEntries(entries))
    }
    return JSON.stringify(arr)
  }
}
