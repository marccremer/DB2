import express from "express";
import kunden from "./kunden";
import reservierungen from "./reservierung";

const router = express.Router();
router.get("/", async (req, res, next) => {
  res.json({ message: "noo" });
});

router.use("/kunden", kunden);
router.use("/reservierungen", reservierungen);

export default router;
