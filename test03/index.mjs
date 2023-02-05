import { pipeline, Transform } from 'stream'
import { promisify } from 'util'
import { createReadStream, createWriteStream } from 'fs'

const transform = new Transform({
  objectMode: true,
  transform(chunk, encoding, cb){
      const data = chunk.toString()
      console.log(`chunk: ${data}`);
      cb(null, data.toUpperCase())
  }
})

// pipeline(
//   // createReadStream('in_NOT_FOUND.txt'),
//   createReadStream('in.txt'),
//   transform,
//   createWriteStream('out.txt'),
//   (err) => {
//     if(err) console.log("Tudo errado: ", err);
//     else console.log("Sucesso");
//   }
// )

const promisedPipeline = promisify(pipeline)

try {
  await promisedPipeline(
    createReadStream('in.txt', { highWaterMark: 5 }),
    transform,
    createWriteStream('out.txt')
    )
    console.log("Sucesso")
} catch (err) {
  console.log("Tudo errado: ", err);
}