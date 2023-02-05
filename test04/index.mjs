// getting-started.js
import mongoose from 'mongoose'
import {v4} from 'uuid'


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
    console.log(`Person created`);
  } catch (error) {
    console.log(error);
  }
}
