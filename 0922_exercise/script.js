const TAX = {
  'ab': 0.05,  // %
  'bc': 0.12,
  'qc': 0.15
}

onload = function () {
  const form = document.querySelector('form')
  const item = form.querySelector('#item')
  const options = item.querySelectorAll('option')
  const quantityForm = form.querySelector('#quantity')
  const stateForm = form.querySelector('#state')
  const deliveryMethods = form.querySelectorAll('input[type="radio"]')
  const report = document.querySelector('#report')

  report.innerHTML = '<ul class="list-group"></ul>'
  const reportList = report.querySelector('ul')

  function addToCart(e) {
    e.preventDefault();

    const price = item.value
    let label = null;
    options.forEach(option => {
      if (option.selected) {
        label = option.text.match(/^([\w\s]*)/g)[0]
      }
    })

    const quantity = quantityForm.value
    const state = stateForm.value
    let deliveryFee = null;

    deliveryMethods.forEach(option => {
      if (option.checked) {
        deliveryFee = option.value
      }
    })

    if (!price || !quantity || deliveryFee === null) {
      return alert('Please fill up all the form')
    }

    const newItem = {
      label,
      quantity,
      price,
      tax: TAX[state],
      deliveryFee
    }

    form.reset()

    updateCartItems(newItem)
  }

  function currencyFormat(number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'CAD' }).format(number)
  }

  function updateCartItems(item) {
    const subtotal = item.price * item.quantity;
    const taxAmount = item.tax * subtotal;
    const newItem = document.createElement('li')
    newItem.classList.add('list-group-item')
    newItem.innerHTML = `
      <p>${item.label} * ${item.quantity}: ${currencyFormat(subtotal)}</p>
      <p>Tax: ${currencyFormat(taxAmount)}</p>
      <p>Delevery Fee: ${currencyFormat(item.deliveryFee)}</p>
      <p>Total: ${currencyFormat(subtotal + taxAmount + item.deliveryFee)}</p>
    `

    reportList.appendChild(newItem)
  }

  form.addEventListener('submit', addToCart)
}