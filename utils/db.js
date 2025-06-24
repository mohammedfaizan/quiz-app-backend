// import mongoose from "mongoose";
// import "dotenv/config";

// const db = () => {
//   mongoose
//     .connect(process.env.MONGODB_URI)
//     .then(() => {
//       console.log("Mongodb connected...");
//     })
//     .catch(() => console.log("error while connecting mongoDB"));
// };

// export default db;

//commonjs format

const { connect } = require("mongoose");
require("dotenv").config();

const db = () => {
  connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDb connected 😎...");
    })
    .catch((error) => console.log("Error in connecting Mongodb...", error));
};

module.exports = db;
