import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";

const port = process.env.PORT || 5000;
const start = async () => {
  // connect to db;
  await connectDB();
  app.listen(port, () => {
    console.log(
      `server is running at ${port} in ${process.env.NODE_ENV} mode `,
    );
  });
};
start().catch((err) => {
  console.log("failed to start server", err);
  process.exit(1);
});
