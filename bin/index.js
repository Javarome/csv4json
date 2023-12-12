#!/usr/bin/env node

import { CLI } from '../src/cli/CLI.js'
import { Converter } from '../src/index.js'

const args = new CLI().getArgs();
const converter = new Converter(args.input, args.output)
converter.run().then(result => {
  console.log('Written', result)
})
