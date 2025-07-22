import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import TodoBoard from "./components/TodoBoard";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { useEffect, useState } from "react";
import api from "./utils/api";

function App() {
  const [todoList, setTodoList] = useState([]);
  const [todoValue, setTodoValue] = useState("");

  const getTasks = async () => {
    const response = await api.get("/tasks");
    setTodoList(response.data.data);
  };

  const addTask = async () => {
    try {
      const response = await api.post("/tasks", {
        task: todoValue,
        isComplete: false,
      });
      if (response.status === 200) {
        // 1. 입력한 값 사라지기
        setTodoValue("");
        // 2. 추가한 값이 바로 뜨기
        getTasks();
      } else {
        throw new Error("Task can not be added.");
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const task = todoList.find((item) => item._id === id);
      const response = await api.put(`/tasks/${id}`, {
        isComplete: !task.isComplete,
      });
      if (response.status === 200) {
        getTasks();
      } else {
        throw new Error("Task status can not be changed.");
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  const deleteItem = async(id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);
      if (response.status === 200) {
        getTasks();
      } else {
        throw new Error("Task can not be deleted.");
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container>
      <Row className="add-item-row">
        <Col xs={12} sm={10}>
          <input
            type="text"
            placeholder="할일을 입력하세요"
            className="input-box"
            value={todoValue}
            onChange={(event) => setTodoValue(event.target.value)}
          />
        </Col>
        <Col xs={12} sm={2}>
          <button className="button-add" onClick={addTask} >
            추가
          </button>
        </Col>
      </Row>

      <TodoBoard todoList={todoList} toggleComplete={toggleComplete} deleteItem={deleteItem}/>
    </Container>
  );
}

export default App;
