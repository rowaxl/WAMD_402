window.onload = () => {
  const newTodoForm = document.querySelector('#form-new-todo')
  const todoInput = newTodoForm.querySelector('input[type=text]')
  const addButton = newTodoForm.querySelector('button[type=submit]')
  const todoList = document.querySelector('#todos ul')

  const todos = []

  function handleInput() {
    const { value } = this

    addButton.disabled = !value
  }

  function addNewTodo(e) {
    e.preventDefault();
    todos.push({
      text: todoInput.value,
      done: false
    })

    updateTodos()

    this.reset()
  }

  function updateTodos() {
    todoList.innerHTML = todos.map((todo, i) => `
      <li class="list-group-item" id="todo${i}">
        <input class="mr-2" type="checkbox" data-index=${i} ${todo.done ? 'checked' : ''} />
        <label>${todo.text}</label>
      </li>
    `).join('')
  }

  function toggleDone(e) {
    if (!e.target.matches('input')) return;

    const targetIndex = e.target.dataset.index;
    todos[targetIndex].done = !todos[targetIndex].done

    const targetTodo = todoList.querySelector(`#todo${targetIndex}`)
    targetTodo.classList.toggle('done')
  } 

  todoInput.addEventListener('change', handleInput)
  todoInput.addEventListener('keyup', handleInput)

  newTodoForm.addEventListener('submit', addNewTodo)
  todoList.addEventListener('click', toggleDone)
}