import express from "express";
import Knex from "knex";
import { Begleiter, Reservierung, ReservierungHilfe } from "../../../../db/models/schemas";
import configdb from "../configdb";


const db: Knex = Knex(configdb);

const router = express.Router({
  mergeParams: true,
});

// Spalten in der tabelle

// get all
router.get("/", async (req, res, next) => {
  try {
    db<Reservierung>("Reservierung")
      .select("*")
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

//get 1 by id
router.get("/:reservierungid", async (req, res, next) => {
  try {
    const id = req.params.reservierungid;
    // TODO: savety check if id is a Integer
    db<Reservierung>("Reservierung")
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
    const newItem: ReservierungHilfe = req.body;
    const newReservierung: Reservierung = {
      Datumszeit:newItem.Datumszeit,
      reservierer_id:newItem.reservierer_id
    }
    let [neueReserviererungsId] = await db<Reservierung>("Reservierung").insert(newReservierung);
    const newAllBegleiter:Begleiter[]=[]
    console.log(newItem.Kundennummern);
    for(const id of newItem.Kundennummern){
      const newBegleiter : Begleiter={
        Kunde_id:id,
        Reservierung_id:neueReserviererungsId
      }
      newAllBegleiter.push(newBegleiter);
    }
    console.log(newAllBegleiter);
    db<Begleiter>("Begleiter")
      .insert(newAllBegleiter)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

router.delete("/:reservierungId", async (req, res, next) => {
  try {
    const id = req.params.reservierungId;

    db<Reservierung>("Reservierung")
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