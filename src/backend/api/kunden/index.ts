import express from "express";
import Knex from "knex";
require('dotenv').config();

const util = require('util')
const configdb = {
  client: 'mysql',
  connection: {
    host: process.env.DB_LOCAL_HOST,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PW,
    database: process.env.DB_LOCAL_NAME,
  }
};
interface Kunde {
  id: number;
  name: string;
  Kontaktdaten_id: number;
  Kundentyp_id: number;
}
const db : Knex = require('knex')(configdb);



const router = express.Router({
  mergeParams: true,
});

router.get('/', async (req, res, next) => {
  try {
    db.raw('select * from Kunde')
    .then((kunde : Kunde) => { 
      res.json(kunde);
    });
    
  } catch (error) {
    next(error);
  }
});
router.get('/:kundenid', async (req, res, next) => {
  try {
    db.raw('select * from Kunde where id = ?', [1])
    .then((kunde : Kunde) => { 
      res.json(kunde);
    });
    
  } catch (error) {
    next(error);
  }
});


export default router;