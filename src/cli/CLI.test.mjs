import test, { describe } from 'node:test'
import assert from 'node:assert'
import { CLI } from './CLI.mjs';

/**
 * Testing files spec.
 *
 * @typedef {Object} SimpleArgs
 * @property {string} argString
 * @property {boolean} argBool
 * @property {number} argNum
 */

describe("CLI", () => {

  test("simple args", () => {
    const cli = new CLI([
      "/bin/node", "program.js", "--argString", "Hello", "--argBool", "true", "--argNum", "12"
    ])
    const args = cli.getArgs()
    assert.equal(args.argString, "Hello")
    assert.equal(args.argBool, "true")
    assert.equal(args.argNum, "12")
  })

  test("multiple args", () => {
    const include = ['file1.png']
    const exclude = ['out/fileOut.png']
    const cli = new CLI([
      "/bin/node", "program.js", "--include", ...include, "--exclude", ...exclude
    ])
    /**
     * @type {FilesArgs}
     */
    const args = cli.getArgs()
    assert.equal(args.include, include)
    assert.equal(args.exclude, exclude)
  })
})
