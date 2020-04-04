import express from 'express';
import http from 'http';
import { Router } from 'express';
import cors from 'cors';
import parser from 'body-parser';
import exchangeRoute from './routes/covid.route'

export const handleCors = (router: Router) =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router) => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json());
};

const router = express();
handleCors(router)
handleBodyRequestParsing(router)
router.use(exchangeRoute)


const { PORT = 3000 } = process.env;
const server = http.createServer(router);

server.listen(PORT, () =>
  console.log(`Server is running in port ${PORT}...`)
);