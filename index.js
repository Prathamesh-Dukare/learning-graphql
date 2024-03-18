const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

async function startServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs: `
        type Todo {
            id: ID!
            title: String!
            completed: Boolean!
        }

        type Query {
            getTodos: [Todo]
            getTodosFromServer: [Todo]
        }
    
    
    `,
    resolvers: {
      Query: {
        getTodos: () => {
          return [
            {
              id: 1,
              title: "Todo 1",
              completed: false,
            },
            {
              id: 2,
              title: "Todo 2",
              completed: true,
            },
          ];
        },

        getTodosFromServer: async () => {
          let data = await fetch("https://jsonplaceholder.typicode.com/todos");
          let todos = await data.json();
          return todos;
        },
      },
    },
  });

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  //   app.use(expressMiddleware(server));

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

startServer();
