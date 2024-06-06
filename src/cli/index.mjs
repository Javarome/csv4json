#!/usr/bin/env node

import { CLI } from "./CLI.mjs"
import { Converter } from "../Converter.mjs"

const args = new CLI().getArgs();
const converter = new Converter(args.input, args.output)
converter.run().then(result => {
  console.log('Written', result)
})
