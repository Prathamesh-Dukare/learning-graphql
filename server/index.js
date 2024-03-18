const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const server = new ApolloServer({
    typeDefs: `
        type Todo {
            id: ID!
            title: String!
            completed: Boolean!
            user : User
        }

        type User {
            id: ID!
            name: String!
            email: String!
        }

        type Query {
            getTodos: [Todo]
            getTodosFromServer: [Todo]
            getUsers: [User]
        }  
    `,
    resolvers: {
      Todo: {
        user: async (todo) => {
          let user = await fetch(
            `https://jsonplaceholder.typicode.com/users/${todo.userId}`
          );
          return user.json();
        },
      },

      Query: {
        getTodos: () => {
          return [
            {
              id: 1,
              title: "Todo 1",
              completed: false,
            },
          ];
        },
        getTodosFromServer: async () => {
          let data = await fetch("https://jsonplaceholder.typicode.com/todos");
          let todos = await data.json();
          return todos;
        },
        getUsers: () => {
          return [];
        },
      },
    },
  });

  await server.start();
  app.use("/graphql", expressMiddleware(server));

  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

startServer();
