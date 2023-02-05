// import { Transform, Readable } from 'stream'
// const _transform = new Transform({
//   objectMode: true,
//   transform(chk,enc,cb) {
//     const d = chk.toString().toUpperCase().trim()
//     cb(null, d)
//   }
// })
// process.stdin
//   // Readable.from(['abc', '123'])
//   .pipe(
//     _transform
//   )
//   .pipe(
//     process.stdout
//   )
//   .on('data', (d)=>{
//     console.log(`data: ${d}`);
//   })


const stdin = process.stdin
  .on('data', (d)=>console.log(`entrada: ${d.toString()}`))

const stdout = process.stdout
  .on('data', (d)=>console.log(`saida: ${d.toString()}`))

stdin.pipe(stdout)

import http from 'http'
import { readFileSync, createReadStream } from 'fs'
import { Transform } from 'stream'
// node -e "process.stdout.write(crypto.randomBytes(1e10))" > big.file
http.createServer((req, res)=>{
  // const file = readFileSync('big.file')
  // res.write(file)
  // res.end()
  const rStream = createReadStream('big.file', {
    
  })
  rStream
    .pipe(new Transform({
      objectMode: true,
      transform(chk, enc, cb){
          console.log(`chunk: ${chk.length}`  );
          cb(null, chk)
      }
    }))
    .pipe(res)

}).listen(3000, () => {console.log('runnung at 3000')})