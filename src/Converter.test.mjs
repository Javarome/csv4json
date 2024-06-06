import test, { beforeEach, describe } from 'node:test'
import assert from 'node:assert'
import { Converter } from './Converter.mjs'

describe('Converter', () => {

  describe('CSV to Array', () => {

    let converter
    beforeEach(() => {
      converter = new Converter('../test/input.csv', '../test/output.json', ',', '\n')
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
  })
})
