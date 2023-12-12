import { CLI } from './CLI.js';
import { describe, test } from '../TestSuite.js';
import { expect } from '../expect/index.js'

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
    expect(args.argString).toEqual(["Hello"])
    expect(args.argBool).toEqual(["true"])
    expect(args.argNum).toEqual(["12"])
  })

  test("multiple args", () => {
    let include = ['file1.png', 'file2.lst', 'path/file3.xml'];
    let exclude = ['out/fileOut.png', 'node_modules/x.ts'];
    const cli = new CLI([
      "/bin/node", "program.js", "--include", ...include, "--exclude", ...exclude
    ])
    /**
     * @type {FilesArgs}
     */
    const args = cli.getArgs()
    expect(args.include).toEqual(include)
    expect(args.exclude).toEqual(exclude)
  })
})
