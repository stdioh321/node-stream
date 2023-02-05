import * as dotenv from 'dotenv'


function configDotenv(){
  const envPath = `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`
  dotenv.config({
    path: envPath
  })
}
configDotenv()
export default {
  configDotenv
}