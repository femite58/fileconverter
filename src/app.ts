import cors from "cors";
import express from "express";
import fetch from "cross-fetch";
import { baseUrl } from "./constants";
import fs from "fs";
import {
  pipe,
  gotenberg,
  convert,
  office,
  to,
  landscape,
  set,
  filename,
  please,
  adjust,
} from "gotenberg-js-client";

const toPDF = pipe(
  gotenberg(baseUrl),
  convert,
  office,
  adjust({
    // manually adjust endpoint
    url: "http://localhost:3000/forms/libreoffice/convert",
  }),
  please
);

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `${process.cwd()}/uploads`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

const app = express();
const port = 4000;
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(upload.single("file"));

app.post("/convert", (req: any, res) => {
  console.log(req.file);
  console.log(req.file.buffer);
  toPDF(fs.createReadStream(req.file.path)).then((pdf) => {
    fs.rm(req.file.path, (err) => {
      console.log(err);
    });
    pdf.pipe(res);
  });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
