function handleDragStart(e) {
  e.dataTransfer.setData('text/plain', e.target.id);
  e.currentTarget.style.backgroundColor = 'yellow';
}

function handleDragEnd(e) {
  e.dataTransfer.clearData();
  e.currentTarget.style.backgroundColor = 'bisque';
}

function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.style.backgroundColor = 'white';
}

function handleDragLeave(e) {
  e.currentTarget.style.backgroundColor = 'lightgreen';
}

function handleDrop(e) {
  e.preventDefault();

  if (!e.target.classList.contains('droppable')) return;

  const id = e.dataTransfer.getData('text/plain');
  e.target.appendChild(document.getElementById(id));
  e.dataTransfer.clearData();
  e.currentTarget.style.backgroundColor = 'lightgreen';
}

onload = function () {
  const draggables = document.querySelectorAll('.draggable');
  draggables.forEach(elem => {
    elem.setAttribute('draggable', true)
    elem.addEventListener('dragstart', handleDragStart);
    elem.addEventListener('dragend', handleDragEnd);
  });

  const droppable = document.querySelectorAll('.droppable');
  droppable.forEach(elem => {
    elem.addEventListener('drop', handleDrop)
    elem.addEventListener('dragover', handleDragOver);
    elem.addEventListener('dragleave', handleDragLeave);
  });


}