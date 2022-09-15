const express = require("express");

const dotenv = require("dotenv");
dotenv.config();

const colors = require("colors");

const connectDB = require("./config/db");

const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");

const port = process.env.PORT || 5000;

const app = express();

//Accept JSON data in the body
app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === "dev" ? true : false,
  })
);

//Connect to DB
connectDB();

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
