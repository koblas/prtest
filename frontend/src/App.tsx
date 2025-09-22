import React from "react";
import { Container } from "@mantine/core";
import { TodoList } from "./components/TodoList";

function App() {
  return (
    <Container size="xl" py="xl">
      <TodoList />
    </Container>
  );
}

export default App;
