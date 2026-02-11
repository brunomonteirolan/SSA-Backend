import mongoose from "mongoose";
import { mongo } from "../constants/configConstants";

mongoose.connect(mongo.url);

mongoose.connection.on("error", (err) => {
  console.error("> [ERROR] Failed to connect to MongoDB, retrying", err);

  setTimeout(() => {
    mongoose.connect(mongo.url);
  }, 3000);
});

mongoose.Promise = global.Promise;

export default mongoose;
