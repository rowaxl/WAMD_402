$(() => {
  const searchForm = $('#form-search-book');
  const searchInput = $('#search-query');

  async function searchBooks(e) {
    e.preventDefault();

    const query = searchInput.val();
    const result = await getBookList(query)
      .catch((error) => {
        console.log(error)
      });

    if (!result) {
      return console.log('show error')
    }

    console.log(result)
  }

  function getBookList(query) {
    const date = query.length > 0 ? query : 'current'
    const url = `https://api.nytimes.com/svc/books/v3/lists/${date}/hardcover-fiction.json?api-key=${API_KEY}`

    return new Promise((resovle, reject) => {
      $.ajax({
        url,
        dataType: 'json',
        success: (res) => {
          resovle(res.results.books);
        },
        error: (res) => {
          reject(res)
        }
      })
    })
  }

  searchForm.on('submit', searchBooks);
})