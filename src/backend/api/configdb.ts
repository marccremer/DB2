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
};

export default configdb