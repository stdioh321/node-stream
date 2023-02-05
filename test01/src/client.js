import {
  Transform,
  Writable,
} from 'stream'

import axios from 'axios'

async function consume() {
  const response = await axios({
    url,
    method: 'get',
    responseType: 'stream'
  })
  
  return response.data
}
import * as dotenv from 'dotenv'
dotenv.config()
const PORT = process.env.PORT || 3000
const url = `http://localhost:${PORT}`

const stream = await consume()
stream
  .pipe(
    Transform({
      transform(chunk, e, cb) {
        const item = JSON.parse(chunk)
        const number = /\d+/.exec(item.name)[0]
        let name = item.name

        if (number % 2 === 0) name = name.concat(' é par')
        else name = name.concat(' é impar')

        item.name = name
        cb(null, JSON.stringify(item))
      }
    })
  )

  .pipe(
    Writable({
      write(chunk, e, cb) {
        console.log('chegou!', chunk.toString())
        cb()
      }
    })
  )