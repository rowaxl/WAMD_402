$(function () {
  const btnOpenLogin = $('#btn-login')

  btnOpenLogin.click(() => {
    const toOpen = $('.content').css('opacity') === '0'

    $('.content-wrap').animate({
      width: toOpen ? '500px' : '132px',
      height: toOpen ? '350px' : '72px',
    }, 1000)
    
    $('.content')
      .slideDown()
      .animate({
        opacity: toOpen ? 1 : 0,
      })

    $('.content-before').css({
      'background-color': toOpen ? '#3a4c61' : '#90b3DF',
      'color': toOpen ? '#FFF' : '#000',
      'border-bottom-left-radius': toOpen ? 0 : '5px',
      'border-bottom-right-radius': toOpen ? 0 : '5px',
    }, 1000)
  })
})
