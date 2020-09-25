const todoForm = $('#form-new-todo')
const input = $('#form-new-todo input')
const addButton = $('#btn-add')
const todos = $('#todos ul')

addButton.attr('disabled', 'disabled')

function addTodo(e) {
  e.preventDefault();

  const text = input.val()

  this.reset();
  const i = todos.children().length;

  todos.append(`
    <li class="list-group-item" id="todo${i}">
      <input class="mr-2" type="checkbox" data-index=${i} />
      <label>${text}</label>
      <button class="btn-delete btn btn-danger" data-index=${i}>X</button>
    </li>
  `)

  updateCheckboxHandler()
}

function handleChangeInput() {
  const { value } = this

  if (value.length > 0) {
    addButton.removeAttr('disabled');
  } else {
    addButton.attr('disabled', 'disabled')
  }
}

function updateCheckboxHandler() {
  const checkboxes = $('input[type=checkbox]')
  checkboxes.unbind('change') // prevent bind with multiple event listener
  checkboxes.change(handleCheck)

  const deleteButtons = $('button.btn-delete')
  deleteButtons.unbind()
  deleteButtons.click(handleDelete)
}

function handleCheck() {
  const { index } = this.dataset

  const target = $('#todo' + index);

  target.toggleClass('done')
}

function handleDelete() {
  const { index } = this.dataset

  const target = $('#todo' + index);
  console.log(target)
  target.remove()
}


todoForm.submit(addTodo)

input.change(handleChangeInput)
input.keyup(handleChangeInput)