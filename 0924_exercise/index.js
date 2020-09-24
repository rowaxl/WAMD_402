window.onload = () => {
  const toggleColapseButtons = document.querySelectorAll('button.toggle-collapse');

  function toggleCollapse() {
    const { targetid } = this.dataset

    const collapsable = document.getElementById(targetid)

    collapsable.classList.toggle('open')
    this.classList.toggle('open')
  }

  toggleColapseButtons.forEach(button => button.addEventListener('click', toggleCollapse))
}