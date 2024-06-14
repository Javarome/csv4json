#!/usr/bin/env node

import { CLI } from "./CLI.mjs"
import { Csv4Json } from "../Csv4Json.mjs"

const args = new CLI().getArgs();
const converter = new Csv4Json(args.input, args.output)
converter.run().then(result => {
  console.log('Written', result)
})
