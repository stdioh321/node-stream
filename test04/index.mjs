// getting-started.js
import mongoose from 'mongoose'
import { PassThrough, Transform, Writable } from 'stream';
import {v4} from 'uuid'
import { createWriteStream } from 'fs'


main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb://127.0.0.1:30001/test`);
  const Person = mongoose.model('Person', new mongoose.Schema({ name: {
    type: String,
    required: true,
    minlength: 3
  } }));
  // Person.watch()
  //   .on('change', data => console.log({data}));
try {
    await Person.create({
      name: `Mario-${v4()}`
    })
    const cursor = Person.find().cursor()
  let headers = ['id', 'name']
  let total = 0
  cursor
    .pipe(
      new Transform({
        objectMode: true,
        transform(chunk, encoding, cb){
          const data = `${chunk._id},${chunk.name}\n`
          cb(null, data)
        }
      })
    )
    .pipe(
      new Transform({
        objectMode: true,
        transform(chunk, encoding, cb){
          this.counter = this.counter ?? 0
          if(this.counter > 0) return cb(null, chunk)
          this.counter++
          const data = `${headers.join(',')}\n`.concat(`${chunk}`)
          cb(null, data)
        }
      })
    )
    .pipe(new PassThrough({transform(chunk, encoding, cb){
      total++
      cb(null, chunk)
    }}))
    .on('finish', function (data){
      console.log({total})
    })
    .pipe(createWriteStream('out.csv'))
    // .pipe(
    //   new Writable({
    //     objectMode: true,
    //     write(chunk, encoding, cb){
    //       // console.log(chunk);
    //       cb()
    //     }
    //   })
    // )
    console.log(`Person created`);
  } catch (error) {
    console.log(error);
  }
}
