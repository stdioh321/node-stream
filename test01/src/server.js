import http from 'http'
import {
  Readable, pipeline
} from 'stream'

import {
  randomUUID
} from 'crypto'

import config from './config.js'

const PORT = process.env.PORT || 3000


const argName = process.argv[2]

function* run() {
  for (let index = 0; index <= 99; index++) {
    const data = {
      id: randomUUID(),
      name: `${argName ?? 'Mario'}-${index}`
    }
    yield data 
  }
}

async function handler(request, response) {
  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log('sending', data)
        this.push(JSON.stringify(data) + "\n")
      }

      this.push(null)
    }
  })

  // readable.pipe(response)
  pipeline(
    readable,
    response,
    (err) => {
      if(err)
        console.log(`Erro:`, err);
      else
        console.log(`Sucesso`);
    }
  )
}

http.createServer(handler)
  .listen(PORT)
  .on('listening', () => console.log(`server running at ${PORT}`))