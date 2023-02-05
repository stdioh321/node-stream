import { Readable, Transform, Writable, pipeline } from 'stream'
import { createWriteStream } from 'fs'
import { promisify } from 'util'

const pipelineAsync = promisify(pipeline)
{

const readableStream = Readable({
  read(){
    this.push("Hello Dude!")
    this.push("Hello Dude!!")
    this.push("Hello Dude!!!")
    this.push(null)
  }
})
const writableStream = Writable({
  write(chunk, encoding, cb){
    console.log(chunk);
    console.log(`content: ${chunk.toString()}`);
    cb()
  }
})
await pipelineAsync(
  readableStream,
  // process.stdout
  writableStream
)

console.log('Processo 01 acabou');
}
{
  const writableMapToCSV = new Transform({
    objectMode: true,
    transform(chunk, encoding, cb){
      const data = JSON.parse(chunk)
      const result = `"${data.id}","${data.name.toUpperCase()}"\n`
      cb(null, result)
    }
  })
  
  const setHeader = new Transform({
    objectMode: true,
    transform(chunk, encoding, cb){
      this.counter = this.counter ?? 0
      if(this.counter > 0) return cb(null, chunk)
      this.counter++
      cb(null, `"id","name"\n`.concat(chunk))
    }
  })

  const readableStream = Readable({
    read(){
      for(let index = 0; index < 1e5; index++){
        const person = {id: Date.now() + index, name: `Mario-${index}`}
        const data = JSON.stringify(person)
        this.push(data)
      }
      this.push(null)
    }
  })
  const time = Date.now()
  await pipelineAsync(
    readableStream,
    writableMapToCSV,
    setHeader,
    createWriteStream('out.csv')
  )
  console.log(`Took: ${(Date.now() - time)/1000}s`)
  console.log('Processo 02 acabou');
}