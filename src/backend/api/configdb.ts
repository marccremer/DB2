import dotenv from "dotenv";

dotenv.config();
const configdb = {
  client: "mysql",
  connection: {
    host: process.env.DB_LOCAL_HOST,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PW,
    database: process.env.DB_LOCAL_NAME,
  },
  log: {
    warn(message) {
      console.log(message);
    },
    error(message) {
      console.log(message);
    },
    deprecate(message) {
      console.log(message);
    },
    debug(message) {
      console.log(message);
    },
  },
};

export default configdb;
