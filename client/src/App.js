// import "./App.css";
import { gql, useQuery } from "@apollo/client";

const query = gql`
  query MainQueryTodos {
    getTodosFromServer {
      id
      completed
      title
      user {
        id
        name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(query);

  console.log({
    loading,
    error,
    data,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="App">
      <h1>Todos</h1>

      <ul>
        {data.getTodosFromServer.map((todo) => (
          <li key={todo.id}>
            {todo.title} - {todo.user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
