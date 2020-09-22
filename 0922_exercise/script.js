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

  const items = []

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
        deliveryFee = parseFloat(option.value)
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

    items.push(newItem)
    updateCartItems()
  }

  function currencyFormat(number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'CAD' }).format(number)
  }

  function updateCartItems() {
    const reportList = report.querySelector('ul')

    reportList.innerHTML = items.map(item => {
      const subtotal = item.price * item.quantity
      const taxAmount = item.tax * subtotal

      const date = new Date().toLocaleString()

      return `
        <li class="list-group-item">
          <p>Item: ${item.label}</p>
          <p>Quantity: ${item.quantity}</p>
          <p>Ordered at: ${date}</p>
          <p class="mb-4"><strong>Subtotal: ${currencyFormat(subtotal)}</strong></p>
          <p>Tax: ${currencyFormat(taxAmount)}</p>
          <p>Delevery Fee: ${currencyFormat(item.deliveryFee)}</p>
          <p><strong>Total: ${currencyFormat(subtotal + taxAmount + item.deliveryFee)}</strong></p>
        </li>
      `
    }).join('')
  }

  form.addEventListener('submit', addToCart)
}