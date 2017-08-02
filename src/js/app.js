import $ from 'jquery';
import 'owl.carousel';
import MoveTo from 'moveto';
import Tooltip from 'tooltip.js';
import noUiSlider from 'nouislider';
import styleSelect from 'styleselect';


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


  // moveto fix
  const handleClick = () => {
    if (navbarContainer.classList.contains(classNameActive)) toggleMenu();
  };

  Array.prototype.forEach.call(
    navbarContainer.getElementsByClassName('js-move-to'),
    elem => elem.addEventListener('click', handleClick),
  );
})();


// video lazy load
(() => {
  const youtubeLazyLoad = (youtube) => {
    const dataEmbed = youtube.getAttribute('data-embed');

    youtube.style.backgroundImage = `url('https://img.youtube.com/vi/${dataEmbed}/sddefault.jpg')`;

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
  };

  Array.prototype.forEach.call(
    document.getElementsByClassName('js-youtube'),
    youtube => youtubeLazyLoad(youtube),
  );
})();


// review popups
(() => {
  const cardPopup = document.querySelector('.js-card-popup');
  const cardsList = document.querySelector('.js-card-popup-list');
  if (cardPopup === null || cardsList === null) return;

  const cardPopupContent = cardPopup.querySelector('.js-card-popup-content');
  if (cardPopupContent === null) return;

  const cards = Array.prototype.slice.call(
    cardsList.getElementsByClassName('js-card-item'),
  );
  if (cards.length === 0) return;

  const togglePopup = () => {
    cardPopup.classList.toggle('active');
    document.body.classList.toggle('popup-open');
  };

  const removeAllChildNodes = (elem) => {
    while (elem.hasChildNodes()) elem.removeChild(elem.firstChild);
  };

  cardPopup.addEventListener('click', (e) => {
    if (e.target === cardPopup) togglePopup();
  });

  const cardPopupClose = cardPopup.querySelector('.js-card-popup-close');
  if (cardPopupClose !== null) {
    cardPopupClose.addEventListener('click', togglePopup);
  }

  const showCardPopup = (card) => {
    removeAllChildNodes(cardPopupContent);
    cardPopupContent.appendChild(card.cloneNode(true));
    togglePopup();
  };

  cards.forEach((card) => {
    const button = card.querySelector('.js-card-popup-open');
    if (button === null) return;
    button.addEventListener('click', () => showCardPopup(card));
  });
})();


// reviews slider
$('.js-slider-cards').owlCarousel({
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


// moveTo
(() => {
  const moveTo = new MoveTo();
  Array.prototype.forEach.call(
    document.querySelectorAll('.js-move-to'),
    elem => moveTo.registerTrigger(elem),
  );
})();


// form validation
(() => {
  Array.prototype.forEach.call(
    document.querySelectorAll('.js-form'),
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

  const togglePopup = () => {
    popup.classList.toggle(classNameActive);
    document.body.classList.toggle('popup-open');
  };

  popup.addEventListener('click', (e) => {
    if (e.target === popup) togglePopup();
  });

  Array.prototype.forEach.call(
    document.getElementsByClassName('js-popup-open'),
    elem => elem.addEventListener('click', (e) => {
      togglePopup();
      e.preventDefault();
    }),
  );

  const popupClose = popup.querySelector('.js-popup-close');
  if (popupClose === null) return;

  popupClose.addEventListener('click', togglePopup);
})();


// noui slider
(() => {
  Array.prototype.forEach.call(
    document.getElementsByClassName('js-noui-slider'),
    (elem) => {
      const dataOptions = elem.getAttribute('data-options');
      if (dataOptions === '' || dataOptions === null) return;

      const options = JSON.parse(dataOptions);

      noUiSlider.create(elem, {
        ...options,
        connect: true,
        margin: options.step,
      });
    },
  );
})();


// styleselect
(() => {
  Array.prototype.forEach.call(
    document.querySelectorAll('select.js-styleselect'),
    select => styleSelect(select),
  );
})();


// custom inputs
(() => {
  const classNameActive = 'active';

  const isAncestorOf = (elem, container) => {
    let parent = elem.parentNode;

    if (container === elem) return true;

    while (parent && parent.nodeType && parent.nodeType === 1) {
      if (parent === container) return true;
      parent = parent.parentNode;
    }
    return false;
  };

  const round = n => Math.ceil(Number(n));

  const initializeCustomInput = (customInput) => {
    const toggleCustomInput = () => customInput.classList.toggle(classNameActive);

    customInput.addEventListener('click', (e) => {
      if (e.target === customInput) {
        toggleCustomInput();
      }
    });

    document.body.addEventListener('click', (e) => {
      if (!isAncestorOf(e.target, customInput)) {
        customInput.classList.remove(classNameActive);
      }
    });

    const slider     = customInput.querySelector('.js-noui-slider');
    const checkboxes = customInput.querySelectorAll('input[type=checkbox]');

    const updateInputValue = () => {
      const value = [];

      if (slider !== null) {
        const sliderValue = slider.noUiSlider.get();

        const result = (typeof sliderValue === 'string')
          ? round(sliderValue)
          : sliderValue.map(round).join(' - ');

        value.push(result);
      }

      if (checkboxes.length > 0) {
        const checkboxesValue = Array.prototype.map.call(
          checkboxes,
          checkbox => (checkbox.checked ? checkbox.nextElementSibling.textContent : null),
        ).filter(v => v !== null);

        if (checkboxesValue.length > 0) value.push(checkboxesValue.join(', '));
      }

      customInput.firstElementChild.value = value.join(', ');
    };

    updateInputValue(customInput);

    if (slider !== null) {
      slider.noUiSlider.on('update', updateInputValue);
    }

    if (checkboxes.length > 0) {
      Array.prototype.forEach.call(
        checkboxes,
        checkbox => checkbox.addEventListener('change', updateInputValue),
      );
    }
  };

  Array.prototype.forEach.call(
    document.getElementsByClassName('js-custom-input'),
    customInput => initializeCustomInput(customInput),
  );
})();
