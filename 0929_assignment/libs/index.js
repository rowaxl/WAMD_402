const ERROR_MESSAGE = {
  fname: 'Frist name cannot be empty!',
  lname: 'Last name cannot be empty!',
  city: 'City cannot be empty!',
  availability: 'One or more availability have to be set!',
  fname: 'Frist name cannot be empty!',
  email: 'Invalid e-mail address!',
  date: 'Cannot choose date before today!',
  postal: 'Invalid post code!',
}

$(function () {
  $(".datepicker").datepicker();

  const form = $('#form-new-employ');

  const fname = $('#fname');
  const lname = $('#lname');
  const email = $('#email');
  const joinDate = $('#date');
  const city = $('#city');
  const postal = $('#postal');
  const availability = $('#availability');

  const errors = [];

  function validate(type, value) {
    switch (type) {
      case 'email':
        return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/g.test(value);
      case 'date':
        return new Date(value) >= new Date()
      case 'postal':
        return /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/g.test(value)
      default:
        return value.length > 0
    }
  }

  function handleValue(type, value) {
    if (!validate(type, value)) {
      errors.push(ERROR_MESSAGE[type]);
    } else {
      const i = errors.findIndex(ERROR_MESSAGE[type])

      if (i > -1) {
        // when value changed and error resolved
        errors.splice(i, 1)
      }
    }

    showErrors();
  }

  function showErrors() {
    const errorMassages = $('#error-messages');

    if (errors.length < 1) {
      errorMassages.empty();
      return;
    }

    errors.forEach(error => {
      errorMassages.append(`<p class="txt-danger">${error}</p>`);
    });
  }



  form.on('submit', (e) => {
    e.preventDefault();

    let formValid = true;

    $('.form-control').each(input => {
      const target = $(input)
      formValid = formValid && validate(target.data('type'), target.val());

      if (!validate(target.data('type'), target.val())) {
        errors.push(ERROR_MESSAGE[target.data('type')]);
      }
    })

    if (!formValid) {
      showErrors();
      return;
    }

    /// TODO: add to emplist
    form.reset();
  })
});