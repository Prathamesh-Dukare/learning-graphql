const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const data = require("./data.json");

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
        user: (todo) => {
          let user = data.users.find((user) => user.id === todo.userId);
          return user;
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

        getTodosFromServer: () => {
          return data.todos;
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
