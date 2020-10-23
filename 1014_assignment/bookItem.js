$(() => {
  let API_KEY = null;
  const buttonSave = $('#btn-save-key');
  const reviewList = $('#result-list');
  const titleSpan = $('#book-title')

  const query = new URLSearchParams(window.location.search)

  const isbn = query.get('isbn');
  const title = query.get('title');
  titleSpan.text(title);

  if (!isbn) {
    return console.error('invalid ISBN')
  }

  function getReviews(isbn) {
    const url = `https://api.nytimes.com/svc/books/v3/reviews.json?api-key=${API_KEY}&isbn=${isbn}`

    return new Promise((resolve, reject) => {
      $.ajax({
        url,
        dataType: 'json',
        success: (res) => {
          resolve(sanitizeReviewData(res.results));
        },
        error: (res) => {
          reject(res)
        }
      })
    })
  }

  function sanitizeReviewData(data) {
    return data.map(res => ({
      url: res.url,
      byline: res.byline,
      book_title: res.book_title,
      book_author: res.book_author,
      summary: res.summary,
      isbn13: res.isbn13
    }))
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

  async function loadReviews() {
    const reviews = await getReviews(isbn);

    renderReviews(reviews);
  }

  function renderReviews(reviews) {
    reviewList.empty();

    if (!reviews.length) {
      reviewList.remove();
      $("#results div.card-body").append('<h4>There\'s no reviews yet</h4>')
    }

    reviews.forEach(rev => {
      const review = $('<li></li>');
      review
        .attr('id', rev.isbn13[0])
        .addClass('list-group-item')
        .html(`
        <div class="card border-none">
          <div class="row no-gutters">
            <div class="card-body">
              <h4 class="card-title mr-4">
                ${rev.book_title}
              </h4>
              <h5 class="card-subtitle my-2">${rev.book_author}</h5>
              <h6 class="card-text">${rev.summary}</h6>
              <h6 class="card-text">${rev.byline}</h6>
            </div>
          </div>
        </div>
        `)

        reviewList.append(review);
    })
  }

  // execute when page loaded
  loadAPIKey();
  loadReviews();

  buttonSave.on('click', saveAPIKey);
})