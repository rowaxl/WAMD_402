const ERROR_MESSAGE = {
  fname: 'Frist name cannot be empty!',
  lname: 'Last name cannot be empty!',
  city: 'City cannot be empty!',
  availability: 'One or more availability have to be set!',
  fname: 'Frist name cannot be empty!',
  email: 'Invalid e-mail address!',
  date: 'Cannot choose the future date!',
  postal: 'Invalid post code!',
};

$(function () {
  $(".datepicker").datepicker();

  const form = $('#form-new-employ');
  const showList = $('#btn-show-list');
  const columns = ['id', 'fname', 'lname', 'email', 'date', 'address', 'availability']
  const formData = {
    id: '',
    fname: '',
    lname: '',
    email: '',
    date: '',
    city: '',
    postal: '',
    availability: [],

    reset: () => {
      this.fname = '';
      this.lname = '';
      this.email = '';
      this.date = '';
      this.city = '';
      this.postal = '';
      this.availability = [];
    }
  };

  const errors = [];
  const employees = [];

  function validate(type, value) {
    switch (type) {
      case 'email':
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g.test(value);
      case 'date':
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(value) <= today;
      case 'postal':
        return /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/g.test(value)
      default:
        return value.length > 0
    }
  }

  function handleValue(type, value) {
    if (!validate(type, value)) {
      if (errors.findIndex(error => error === ERROR_MESSAGE[type]) < 0) {
        errors.push(ERROR_MESSAGE[type]);
      }
      return;
    }

    const i = errors.findIndex(error => error === ERROR_MESSAGE[type])

    if (i > -1) {
      // remove resolved error
      errors.splice(i, 1)
    }

    formData[type] = value;

    showErrors();
  }

  function formatValue(type, value) {
    switch (type) {
      case 'availability':
        const toStr = value.join(', ')
        return toStr.substring(0, toStr.length);
      case 'date':
        return new Date(value).toLocaleDateString();
      default:
        return value;
    }
  }

  function showErrors() {
    const errorMassages = $('#error-messages');
    errorMassages.empty();

    if (errors.length < 1) return

    errors.forEach(error => {
      errorMassages.append(`
        <p class="text-danger">${error}</p>
      `);
    });
  }

  function updateEmployList() {
    if (employees.length < 1) return

    const tbody = $('.employee-list tbody');

    tbody.empty();
    employees.forEach(e => {
      const row = document.createElement('tr');
      row.dataset.target = e.id;

      row.innerHTML = columns.map(type => {
        if (type === 'address') {
          return `<td>${e.city} ${e.postal}</td>`
        }

        return `<td>${formatValue(type, e[type])}</td>`
      }).join('');

      const deleteBtnTd = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-delete';
      deleteBtn.dataset.target = e.id;
      deleteBtn.textContent = 'X';
      deleteBtn.addEventListener('click', function () {
        $(`tr[data-target=${this.dataset.target}]`).remove();
        const t = employees.findIndex(e => e.id === this.dataset.target);
        employees.splice(t, 1);
      });
      deleteBtnTd.appendChild(deleteBtn);
      row.appendChild(deleteBtnTd)

      tbody.append(row);
    })
    
  }

  $('.form-control').each(function () {
    $(this).on('change', function() {
      handleValue($(this).data('type'), $(this).val())
    });
  })

  form.on('submit', (e) => {
    e.preventDefault();

    let formValid = true;
    errors.length = 0;

    $('.form-control').each(function () {
      const target = $(this)
      formValid = formValid && validate(target.data('type'), target.val());

      if (!validate(target.data('type'), target.val())) {
        errors.push(ERROR_MESSAGE[target.data('type')]);
      }
    })

    if (!formValid) {
      showErrors();
      return;
    }

    formData['id'] = `${Date.now() + Math.floor(Math.random() * 20)}`;
    employees.push(Object.assign({}, formData));
    console.table(employees)
    form.trigger('reset');
    formData.reset();
    updateEmployList();
  });

  showList.on('click', () => {
    if (employees.length < 1) {
      return alert('There are no employee yet!');
    }

    const wrap = $('#employee-list-wrap');
    wrap.slideToggle().toggleClass('hide');

    if (wrap.hasClass('hide')) {
      showList.text('Show Employee List');
    } else {
      showList.text('Hide Employee List');
    }
  })
});