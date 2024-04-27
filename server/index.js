import dotenv from "dotenv";

dotenv.config();

import connectDB from "./db/index.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.error("App error: ", error);
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("App couldnot communicate with the database: ", error);
    process.exit(1);
  });