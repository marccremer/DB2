import express from "express";
import Knex from "knex";
import { coronaInfo } from "../../../../db/models/schemas";
import configdb from "../configdb";
import * as date from "date-and-time";

const datformater = (oldformat :string) => {
  return  date.format(oldformat,'YYYY/MM/DD HH:mm:ss')

}

const db: Knex = Knex(configdb);

const router = express.Router({
  mergeParams: true,
});

// Spalten in der tabelle

// get all
router.get("/", async (req, res, next) => {
  try {
    db<coronaInfo>("CoronaInfo")
      .select("*")
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

//get 1 by id
router.get("/:infoid", async (req, res, next) => {
  try {
    const id = req.params.infoid;
    // TODO: savety check if id is a Integer
    db<coronaInfo>("CoronaInfo")
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

// create 1 2021-06-12T10:16:20.000Z
router.post("/", async (req, res, next) => {
  try {
    const newItem: coronaInfo = req.body;
    console.log(newItem.Datum);
    
    //newItem.Datum = datformater(newItem.Datum)
    db<coronaInfo>("CoronaInfo")
      .insert(newItem)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;

    db<coronaInfo>("CoronaInfo")
      .where("id", [id])
      .del()
      .then((result) => res.json(result))
      .catch((err) => {
        console.log(err);
        next(err);
      });
  } catch (error) {
    next(error);
  }
});

export default router;