import React from 'react'

const Todo = ({ todo, toggleTodo }) => {
  const handleTodoClick = () => {
    toggleTodo(todo.id); // 親からもらった関数を叩く
  }

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={todo.completed} 
          readOnly={false}
          onChange={handleTodoClick} // これで完成！
        />
        {todo.name}
      </label>
    </div>
  )
}

export default Todo