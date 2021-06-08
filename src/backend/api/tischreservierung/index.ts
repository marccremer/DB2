import express from "express";
import Knex from "knex";
import { Tischreservierung } from "../../../../db/models/schemas";
import configdb from "../configdb";


const db: Knex = Knex(configdb);

const router = express.Router({
  mergeParams: true,
});

// Spalten in der tabelle

// get all
router.get("/", async (req, res, next) => {
  try {
    db<Tischreservierung>("tischreservierung")
      .select("*")
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

//get 1 by id
router.get("/:tischid", async (req, res, next) => {
  try {
    const id = req.params.tischreservierungid;
    // TODO: savety check if id is a Integer
    db<Tischreservierung>("Tischreservierung")
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
    const newItem: Tischreservierung = req.body;
    db<Tischreservierung>("Tischreservierung")
      .insert(newItem)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

export default router;