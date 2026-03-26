import React from 'react'
import Todo from './Todo.jsx'

const TodoList = ({todos, toggleTodo}) => {
  return todos.map((todo) => <Todo todo={todo} key={todo.id} toggleTodo={toggleTodo}/>)
}

export default TodoList