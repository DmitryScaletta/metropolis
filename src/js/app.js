import $ from 'jquery';
import 'owl.carousel';


// mobile menu
(() => {
  const menuContainer = document.querySelector('.js-menu');
  const menuToggle    = document.querySelector('.js-menu-toggle');
  if (menuContainer === null || menuToggle === null) return;

  const classNameActive = 'active';

  const toggleMenu = () => menuContainer.classList.toggle(classNameActive);

  menuToggle.addEventListener('click', toggleMenu);
})();


// video lazy load
(() => {
  Array.prototype.forEach.call(
    document.getElementsByClassName('js-youtube'),
    (youtube) => {
      const dataEmbed = youtube.getAttribute('data-embed');

      const image = document.createElement('img');
      image.src = `https://img.youtube.com/vi/${dataEmbed}/sddefault.jpg`;
      image.width = '0'; // ie10 fix
      image.addEventListener('load', () => youtube.appendChild(image));

      const removeAllChildNodes = (elem) => {
        while (elem.hasChildNodes()) elem.removeChild(elem.firstChild);
      };

      const handleClick = () => {
        const iframe = document.createElement('iframe');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${dataEmbed}?rel=0&showinfo=0&autoplay=1`);

        removeAllChildNodes(youtube);
        youtube.appendChild(iframe);
      };

      youtube.addEventListener('click', handleClick);
    },
  );
})();


// review popups
(() => {
  const reviewPopup = document.querySelector('.js-review-popup');
  if (reviewPopup === null) return;

  const reviews = Array.prototype.slice.call(
    document.getElementsByClassName('js-review-item'),
  );
  if (reviews.length === 0) return;

  const togglePopup = () => reviewPopup.classList.toggle('active');

  const removeAllChildNodes = (elem) => {
    while (elem.hasChildNodes()) elem.removeChild(elem.firstChild);
  };

  reviewPopup.addEventListener('click', (e) => {
    if (e.target === reviewPopup) togglePopup();
  });

  const showReviewPopup = (review) => {
    removeAllChildNodes(reviewPopup);
    reviewPopup.appendChild(review.cloneNode(true));
    togglePopup();
  };

  reviews.forEach((review) => {
    const button = review.querySelector('.js-review-full');
    if (button === null) return;
    button.addEventListener('click', () => showReviewPopup(review));
  });
})();


// reviews slider
$('.js-slider-reviews').owlCarousel({
  // loop: true,
  margin: 15,
  nav: true,
  navText: ['', ''],
  dots: true,
  responsive: {
    0: {
      items: 1,
    },
    768: {
      items: 2,
    },
    992: {
      items: 3,
    },
  },
});


// partners sider
$('.js-slider-partners').owlCarousel({
  // loop: true,
  autoWidth: true,
  nav: true,
  navText: ['', ''],
  responsive: {
    0: {
      items: 1,
      margin: 15,
    },
    576: {
      margin: 10,
    },
    768: {
      items: 2,
      margin: 100,
    },
    992: {
      items: 3,
      margin: 100,
    },
    1200: {
      items: 4,
      margin: 80,
    },
  },
});
