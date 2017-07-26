import Tooltip from 'tooltip.js';
import $ from 'jquery';
import 'owl.carousel';


// mobile menu
(() => {
  const navbarContainer = document.querySelector('.js-navbar');
  if (navbarContainer === null) return;

  const menuToggle  = navbarContainer.querySelector('.js-menu-toggle');
  const menuOverlay = navbarContainer.querySelector('.js-menu-overlay');
  if (menuToggle === null || menuOverlay === null) return;

  const classNameActive = 'active';

  const toggleMenu = () => navbarContainer.classList.toggle(classNameActive);

  [menuToggle, menuOverlay].forEach(elem => elem.addEventListener('click', toggleMenu));
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

    const reviewPopupClose = reviewPopup.querySelector('.js-review-close');
    if (reviewPopupClose !== null) {
      reviewPopupClose.addEventListener('click', togglePopup);
    }

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
  nav: true,
  navText: ['', ''],
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
    1200: {
      items: 4,
    },
  },
});


// form validation
(() => {
  Array.prototype.forEach.call(
    document.querySelectorAll('.form'),
    (form) => {
      const validatedItems = [
        form.querySelector('input[name=name]'),
        form.querySelector('input[name=tel]'),
      ].filter(item => item !== null);

      const tooltips = validatedItems.map(item => new Tooltip(item, {
        title: 'Это обязательное поле',
        trigger: '',
      }));

      const classNameInvalid = 'invalid';

      // remove invalid class on focus
      validatedItems.forEach((elem, index) => {
        elem.addEventListener('focus', () => {
          elem.classList.remove(classNameInvalid);
          tooltips[index].hide();
        });
      });

      const validateTextInput = value => value.trim() !== '';

      form.addEventListener('submit', (e) => {
        const isFormValid = validatedItems.every((item, index) => {
          const isItemValid = validateTextInput(item.value);
          if (!isItemValid) {
            item.classList.add(classNameInvalid);
            tooltips[index].show();
          }
          return isItemValid;
        });

        if (!isFormValid) {
          e.preventDefault();
          return;
        }

        form.classList.add('success');
        e.preventDefault();
      });
    },
  );
})();


// popup form
(() => {
  const popup = document.querySelector('.js-popup');
  if (popup === null) return;

  const classNameActive = 'active';

  const togglePopup = () => popup.classList.toggle(classNameActive);

  popup.addEventListener('click', (e) => {
    if (e.target === popup) togglePopup();
  });

  Array.prototype.forEach.call(
    document.getElementsByClassName('js-popup-open'),
    elem => elem.addEventListener('click', togglePopup),
  );

  const popupClose = popup.querySelector('.js-popup-close');
  if (popupClose === null) return;

  popupClose.addEventListener('click', togglePopup);
})();
