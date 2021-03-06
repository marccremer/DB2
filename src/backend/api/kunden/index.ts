/* eslint-disable prefer-const */
import express from "express";
import Knex from "knex";
import {
  Adresse,
  joinedKunde,
  Kontaktdaten,
  Kunde,
} from "../../../../db/models/schemas";
import configdb from "../configdb";

const db: Knex = Knex(configdb);

const router = express.Router({
  mergeParams: true,
});

// Spalten in der tabelle
// get all
router.get("/", async (req, res, next) => {
  try {
    db<Kunde>("Kunde")
      .select(
        "Kunde.id",
        "Vorname",
        "Nachname",
        "Alter",
        "Kontaktdaten_id",
        "Adresse_id",
        "EMail",
        "Telefonnummer",
        "strasse",
        "Hausnummer",
        "stadt",
        "zipcode"
      )
      .join("Kontaktdaten", { "Kontaktdaten.id": "Kunde.Kontaktdaten_id" })
      .join("Adresse", { "Adresse.id": "Kontaktdaten.Adresse_id" })
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    next(error);
  }
});

//get 1 by id
router.get("/:kundenid", async (req, res, next) => {
  try {
    const id = req.params.kundenid;
    // TODO: savety check if id is a Integer
    db<Kunde>("Kunde")
      .select(
        "Kunde.id",
        "Vorname",
        "Nachname",
        "Alter",
        "Kontaktdaten_id",
        "Adresse_id",
        "EMail",
        "Telefonnummer",
        "strasse",
        "Hausnummer",
        "stadt",
        "zipcode"
      )
      .join("Kontaktdaten", { "Kontaktdaten.id": "Kunde.Kontaktdaten_id" })
      .join("Adresse", { "Adresse.id": "Kontaktdaten.Adresse_id" })
      .where("Kunde.id", [id])
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
    const newItem: joinedKunde = req.body;
    const newAdress: Adresse = {
      strasse: newItem.strasse,
      Hausnummer: newItem.Hausnummer,
      stadt: newItem.stadt,
      zipcode: newItem.zipcode,
    };
    let [Adresse_id] = await db<Adresse>("Adresse").insert(newAdress);
    const newKontaktdaten: Kontaktdaten = {
      Adresse_id,
      EMail: newItem.EMail,
      Telefonnummer: newItem.Telefonnummer,
    };
    let [Kontaktdaten_id] = await db<Kontaktdaten>("Kontaktdaten").insert(
      newKontaktdaten
    );
    const newKunde: Kunde = {
      Nachname: newItem.Nachname,
      Vorname: newItem.Vorname,
      Alter: newItem.Alter,
      Kontaktdaten_id,
    };

    db<Kunde>("Kunde")
      .insert(newKunde)
      .then((result) => res.json(result))
      .catch((err) => next(err));
  } catch (error) {
    console.log(error);

    next(error);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const newItem: joinedKunde = req.body;
    const newAdress: Adresse = {
      id: newItem.Adresse_id,
      strasse: newItem.strasse,
      Hausnummer: newItem.Hausnummer,
      stadt: newItem.stadt,
      zipcode: newItem.zipcode,
    };
    let Adresse_id = await db<Adresse>("Adresse")
      .update(newAdress)
      .where({ id: newAdress.id });

    const newKontaktdaten: Kontaktdaten = {
      id: newItem.Kontaktdaten_id,
      Adresse_id: newItem.Adresse_id,
      EMail: newItem.EMail,
      Telefonnummer: newItem.Telefonnummer,
    };
    let Kontaktdaten_id = await db<Kontaktdaten>("Kontaktdaten")
      .update(newKontaktdaten)
      .where({ id: newKontaktdaten.id });

    const newKunde: Kunde = {
      Nachname: newItem.Nachname,
      Vorname: newItem.Vorname,
      Alter: newItem.Alter,
      Kontaktdaten_id: newItem.Kontaktdaten_id,
    };

    let result = await db<Kunde>("Kunde")
      .where("id", "=", newItem.id)
      .update(newKunde);
    res.json(result);
  } catch (error) {
    next(error);
  }
});
router.delete("/:kundenid", async (req, res, next) => {
  try {
    const id = req.params.kundenid;

    db<Kunde>("Kunde")
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
