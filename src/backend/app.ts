import express from "express";
import morgan from 'morgan';
import compression from "compression";
import helmet from 'helmet';
import middlewares from "./middlewares";
import api from './api'

// Initialize the app
const app = express();
const port = 3000

app.use(morgan('tiny'));
app.use(compression());
app.use(helmet());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Wrong site bub");
});
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

