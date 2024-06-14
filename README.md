# csv4json

Converts CSV to JSON, and vice versa.

Vanilla JS, no dependencies.

## Setup
Either install it globally:
```
npm install -g @javarome/csv4json
```
or locally:
```
npm install @javarome/csv4json
```

## Usage

### CLI
```
csv4json --input <csv or json file> --output <json or csv file>
````

### API

#### Convert file
```js
const converter = new Csv4Json('../test/input.csv', '../test/output.json', ',', '\n')
converter.run().then(result => {
  console.log('Written', result)
})
```
#### Convert contents
```js
const converter = new Csv4Json('../test/input.csv', '../test/output.json', ',', '\n')
converter.run().then(result => {
  console.log('Written', result)
})
```
