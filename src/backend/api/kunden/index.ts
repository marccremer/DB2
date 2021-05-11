import express from "express";
import Knex from "knex";
require("dotenv").config();

const configdb = {
  client: "mysql",
  connection: {
    host: process.env.DB_LOCAL_HOST,
    user: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PW,
    database: process.env.DB_LOCAL_NAME,
  },
};
const db: Knex = require("knex")(configdb);

const router = express.Router({
  mergeParams: true,
});

// Spalten in der tabelle
interface Kunde {
  id?: number;
  name: string;
  Kontaktdaten_id: number;
  Kundentyp_id: number;
}

// get all
router.get("/", async (req, res, next) => {
  try {
    db<Kunde>("Kunde")
      .select("*")
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

//get 1 by id
router.get("/:kundenid", async (req, res, next) => {
  try {
    let id = req.params.kundenid;
    // TODO: savety check if id is a Integer
    db<Kunde>("Kunde")
      .select(db.raw("*"))
      .where(db.raw("id = ?", [id]))
      .then((result) => {
        res.json(result);
      })
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

// create 1
router.post("/", async (req, res, next) => {
  try {
    let newItem: Kunde = req.body;
    db<Kunde>("Kunde")
      .insert(newItem)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

export default router;
