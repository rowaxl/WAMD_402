const ERROR_MESSAGE = {
  '400': 'Invalid format. Please change it to YYYY-MM-DD format or empty.',
  '401': 'You are unauthorized. Please set your API KEY first.',
}

const bookItemURL = 'bookItems.html'

$(() => {
  // variables and selectors
  let API_KEY = '';
  const searchForm = $('#form-search-book');
  const searchInput = $('#search-query');
  const resultCard = $('#results');
  const resultText = $('#result-text');
  const resultList = $('#result-list');

  const inputKey = $('#input-key');
  const buttonSave = $('#btn-save-key');

  const categorySelect = $('#select-category');

  const favourited = localStorage.getItem('favourited') ? JSON.parse(localStorage.getItem('favourited')) : [];

  let categories = [];

  // functions
  async function searchBooks(e) {
    if (e) e.preventDefault();

    const query = searchInput.val();
    const selectedCategory = categorySelect.val();

    const result = await getBookList(query, selectedCategory)
      .catch((error) => {
        console.error(error)
        return renderError(error.status);
      });

    if (!result) return;

    renderResults(query, result);
  }

  function handleFavourite() {
    const target = $(this).data('book-isbn10')
    const index = favourited.findIndex(isbn => isbn === target)

    if (index > -1) {
      favourited.splice(index, 1);
      $(this).removeClass('favored');
    } else {
      favourited.push(target);
      $(this).addClass('favored');
    }


    localStorage.setItem('favourited', JSON.stringify(favourited));
  }

  function renderResults(query, results) {
    resultCard.removeClass('hide');
    resultText.removeClass('text-danger');

    const categoryText = categorySelect.val() ? $('#select-category option:selected').text() : "Hardcover Fiction";
    resultText.text(`Best sellers of ${categoryText} in ${query ? query : 'the latest'}:`);

    resultList.empty();

    results.forEach(book => {
      const bookItem = $(`<li></li>`);
      bookItem
        .attr('id', book.isbn10)
        .addClass('list-group-item')
        .html(`
        <div class="card border-none">
          <div class="row no-gutters">
            <div class="col-sm-5">
              <a class="book-img" href="${bookItemURL}?isbn=${book.isbn13}&title=${book.title}" target="_blank">
                <img class="card-img" src="${book.image}" alt="${book.title}">
              </a>
            </div>
            <div class="col-sm-7">
              <div class="card-body">
                <h4 class="card-title mr-4">
                  <span class="mr-2 rank-chip">#${String(book.rank).padStart(2, '0')}</span>
                  ${book.title}
                </h4>
                <h5 class="card-subtitle my-2">${book.author}</h5>
                <h6 class="card-text">${book.description}</h6>
              </div>
            </div>

            <button class="fav-btn btn rounded-circle ${book.isFavourite ? 'favored' : ''}" data-book-isbn10="${book.isbn10}">
              <svg width = "1em" height = "1em" viewBox = "0 0 16 16" class= "bi bi-heart-fill" fill = "currentColor" xmlns = "http://www.w3.org/2000/svg" >
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
            </button>
          </div>
        </div>
        `)

      resultList.append(bookItem);
    })

    $('.fav-btn').unbind().click(handleFavourite);
  }

  function renderError(errorStatus) {
    const errorMessage = ERROR_MESSAGE[errorStatus] ? ERROR_MESSAGE[errorStatus] : 'Unknown error occured. Please wait and try again later.';
    resultCard.removeClass('hide');
    resultText.text(errorMessage);
    resultText.addClass('text-danger');
    resultList.empty();
  }

  function getBookList(query, category) {
    const date = query.length > 0 ? query : 'current'
    const url = `https://api.nytimes.com/svc/books/v3/lists/${date}/${category ? category : 'hardcover-fiction'}.json?api-key=${API_KEY}`

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

  function getCategories() {
    const url = `https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${API_KEY}`

    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        dataType: 'json',
        success: (res) => {
          resolve(sanitizeCategoryData(res.results));
        },
        error: (res) => {
          reject(res)
        }
      })
    })
  }

  function isFavourited(isbn) {
    return favourited.includes(isbn)
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
        amazon_product_url: data.amazon_product_url,
        isbn10: data.primary_isbn10,
        isbn13: data.primary_isbn13,
        isFavourite: isFavourited(data.primary_isbn10)
      })).sort((a, b) => a.rank < b.rank)
    } catch (e) {
      console.error(e)
    }

    return books
  }

  function sanitizeCategoryData(results) {
    let categories = []

    try {
      categories = results.map(data => ({
        "display_name": data.display_name,
        "list_name_encoded": data.list_name_encoded
      }))
    } catch (e) {
      console.error(e)
    }

    return categories;
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

  async function setCategories() {
    categories = await getCategories();

    categories.forEach(category => {
      const categoryOption = $('<option></option>')

      categoryOption
        .text(category.display_name)
        .val(category.list_name_encoded)
      
      categorySelect.append(categoryOption)
    })
  }

  // execute when page loaded
  loadAPIKey();

  if (API_KEY) {
    searchBooks();
  }

  setCategories();

  // event listeners
  searchForm.on('submit', searchBooks);

  buttonSave.on('click', saveAPIKey);
})