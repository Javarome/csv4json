import test, { beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import { Csv4Json } from './Csv4Json.mjs'

describe('Csv4Json', () => {

  describe('CSV to Array', () => {

    let converter
    beforeEach(() => {
      converter = new Csv4Json('../test/input.csv', '../test/output.json', ',', '\n')
    })

    test('basic values', async () => {
      const field1 = 'field1'
      const field2 = 'field2'
      const value1 = 'value1'
      const value2 = 'value2'
      assert.deepEqual(converter.csvToArray(`${field1},${field2}
${value1},${value2}`), [{ [field1]: value1, [field2]: value2 }])
    })

    test('with spaces', async () => {
      const field1 = 'first field'
      const field2 = 'second field'
      const value1 = 'first value with spaces'
      const value2 = 'second value with spaces'
      assert.deepEqual(converter.csvToArray(`${field1},${field2}
${value1},${value2}`), [{ [field1]: value1, [field2]: value2 }])
    })

    test('with commas', async () => {
      const field1 = 'first field, with comma'
      const field2 = 'second field, with comma'
      const value1 = 'first value, with comma'
      const value2 = 'second value, with comma'
      assert.deepEqual(converter.csvToArray(`"${field1}","${field2}"
"${value1}","${value2}"`), [{ [field1]: value1, [field2]: value2 }])
    })

    test('with quotes', async () => {
      const field1 = "first field"
      const field2 = 'second field, with ""quotes""'
      const value1 = `first value, <a href=""/user"">with quotes</a>!`
      const value2 = "This project is not available yet, we're working on it! <a href=\"\"/user\"\">Connect</a>, and we'll let you know as soon as it is."
      let result = converter.csvToArray(`"${field1}","${field2}"
"${value1}","${value2}"`)
      assert.deepEqual(result, [{ [field1]: `first value, <a href="/user">with quotes</a>!`, [`second field, with "quotes"`]: `This project is not available yet, we're working on it! <a href="/user">Connect</a>, and we'll let you know as soon as it is.` }])
    })
  })
})
