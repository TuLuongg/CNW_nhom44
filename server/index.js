import express from "express";
import cors from "cors";
import { config } from "dotenv";
import mongoose from "mongoose";

config();

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", (req, res) => {
  res.send("Server on...");
});

mongoose
  .connect(
    "mongodb+srv://tk251002:KJ7h2HKPGdp283As@cluster0.rjugmb2.mongodb.net/ecommerce?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connect DB success!");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 8888;

app.listen(port, () => {
  console.log(`Server is running on the port: ${port}`);
});
