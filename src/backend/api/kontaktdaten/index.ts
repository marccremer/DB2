import express from "express";
import Knex from "knex";
import { Kontaktdaten } from "../../../../db/models/schemas";
import configdb from "../configdb";


const db: Knex = Knex(configdb);

const router = express.Router({
  mergeParams: true,
});

// Spalten in der tabelle

// get all
router.get("/", async (req, res, next) => {
  try {
    db<Kontaktdaten>("Kontaktdaten")
      .select("*")
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

//get 1 by id
router.get("/:kontaktdatenid", async (req, res, next) => {
  try {
    const id = req.params.kundendatenid;
    // TODO: savety check if id is a Integer
    db<Kontaktdaten>("Kontaktdaten")
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
    const newItem: Kontaktdaten = req.body;
    db<Kontaktdaten>("Kontaktdaten")
      .insert(newItem)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

export default router;