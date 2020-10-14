const ERROR_MESSAGE = {
  '400': 'Invalid format. Please change it to YYYY-MM-DD format or empty.',
  '401': 'You are unauthorized. Please set your API KEY first.',
}

$(() => {
  let API_KEY = '';
  const searchForm = $('#form-search-book');
  const searchInput = $('#search-query');
  const resultCard = $('#results');
  const resultText = $('#result-text');
  const resultList = $('#result-list');

  const inputKey = $('#input-key');
  const buttonSave = $('#btn-save-key');

  async function searchBooks(e) {
    e.preventDefault();

    const query = searchInput.val();
    const result = await getBookList(query)
      .catch((error) => {
        console.error(error)
        return renderError(error.status);
      });

    if (!result) return;

    renderResults(query, result);
  }

  function renderResults(query, results) {
    resultCard.removeClass('hide');
    resultText.removeClass('text-danger');
    resultText.text(`Best sellers of ${query ? query : 'the latest'}:`);

    resultList.empty();

    results.forEach(book => {
      const bookItem = $('<li></li>');
      bookItem
        .addClass('list-group-item')
        .html(`
        <div class="card border-none">
          <div class="row no-gutters">
            <div class="col-sm-5">
              <a class="book-img" href="${book.amazon_product_url}" target="_blank">
                <img class="card-img" src="${book.image}" alt="${book.title}">
              </a>
            </div>
            <div class="col-sm-7">
              <div class="card-body">
                <h4 class="card-title"><span class="mr-2 rank-chip">#${String(book.rank).padStart(2, '0')}</span> ${book.title}</h4>
                <h5 class="card-subtitle my-2">${book.author}</h5>
                <h6 class="card-text">${book.description}</h6>
              </div>
            </div>
          </div>
        </div>
        `)

      resultList.append(bookItem);
    })
  }

  function renderError(errorStatus) {
    const errorMessage = ERROR_MESSAGE[errorStatus] ? ERROR_MESSAGE[errorStatus] : 'Unknown error occured. Please wait and try again later.';
    resultCard.removeClass('hide');
    resultText.text(errorMessage);
    resultText.addClass('text-danger');
    resultList.empty();
  }

  function getBookList(query) {
    const date = query.length > 0 ? query : 'current'
    const url = `https://api.nytimes.com/svc/books/v3/lists/${date}/hardcover-fiction.json?api-key=${API_KEY}`

    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        dataType: 'json',
        success: (res) => {
          resolve(sanitizeBookData(res.results.books));
        },
        error: (res) => {
          reject(res)
        }
      })
    })
  }

  function sanitizeBookData(results) {
    let books = []
    try {
      books = results.map(data => ({
        title: data.title,
        author: data.author,
        image: data.book_image,
        description: data.description,
        rank: data.rank,
        amazon_product_url: data.amazon_product_url
      })).sort((a, b) => a.rank < b.rank)
    } catch (e) {
      console.error(e)
    }

    return books
  }

  function saveAPIKey() {
    localStorage.setItem('nyt-api-key', inputKey.val());

    $('.modal').removeClass('show');
    $('.modal-backdrop').remove();

    loadAPIKey();
    inputKey.val('');
  }

  function loadAPIKey() {
    API_KEY = localStorage.getItem('nyt-api-key');

    if (API_KEY) {
      $("#btn-auth").removeClass('btn-warning').addClass('btn-success').text('Authorized')
    } else {
      $("#btn-auth").removeClass('btn-success').addClass('btn-warning').text('Authorize')
    }
  }

  loadAPIKey();

  searchForm.on('submit', searchBooks);

  buttonSave.on('click', saveAPIKey);
})