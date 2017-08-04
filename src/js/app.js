import $ from 'jquery';
import 'owl.carousel';
import FontFaceObserver from 'fontfaceobserver';
import MoveTo from 'moveto';
import Tooltip from 'tooltip.js';
import noUiSlider from 'nouislider';
import styleSelect from 'styleselect';

import isInt from 'validator/lib/isInt';


// FontFaceObserver
(() => {
  if (!window.Promise || sessionStorage.getItem('fontsLoaded')) return;

  const fontName = 'TeX Gyre Heros';
  const fonts = [];

  const addFont = (name, options) => fonts.push(new FontFaceObserver(name, options).load());

  [400, 700].forEach((weight) => {
    addFont(fontName, { weight });
    addFont(fontName, { weight, style: 'italic' });
  });

  Promise.all(fonts)
    .then(() => {
      sessionStorage.setItem('fontsLoaded', true);
      document.documentElement.classList.add('fonts-loaded');
    })
    .catch(() => {
      document.documentElement.classList.add('fonts-loaded');
    });
})();


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

    // eslint-disable-next-line no-param-reassign
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
  const classNameInvalid = 'invalid';
  const HIDE_TOOLTIP_TIMEOUT = 5000;

  const isFieldValid = (field, validationType) => {
    switch (validationType) {
      case 'isRequired': return field.element.value.trim() !== '';
      case 'isInteger':  return isInt(field.element.value, field.rules.isInteger);
      default: return false;
    }
  };

  const buildTooltip = (elem, title) => new Tooltip(elem, { title, trigger: '' });

  const createTooltip = (field, validationType) => {
    switch (validationType) {
      case 'isRequired': {
        return buildTooltip(field.element, 'Это обязательное поле');
      }
      case 'isInteger': {
        const min = field.rules.isInteger.min;
        const max = field.rules.isInteger.max;

        if (min === undefined && max === undefined) return null;

        const limits = [];
        if (min !== undefined) limits.push(`больше ${min}`);
        if (max !== undefined) limits.push(`меньше ${max}`);

        const title = `Пожалуйста, введите число ${limits.join(' и ')}.`;

        return buildTooltip(field.element, title);
      }
      default: return null;
    }
  };

  const createFormValidator = (formContainer, formFields) => {
    const fields = formFields.map((field) => {
      const element = formContainer.querySelector(field.element);
      if (element === null) return null;

      const rules = { ...field.rules };

      if (rules.isInteger === true) {
        rules.isInteger = {};

        const attrMin = element.getAttribute('min');
        const attrMax = element.getAttribute('max');

        if (attrMin !== '' && attrMin !== null) rules.isInteger.min = Number(attrMin);
        if (attrMax !== '' && attrMax !== null) rules.isInteger.max = Number(attrMax);
      }

      return { element, rules, tooltips: {} };
    }).filter(field => field !== null);

    const handleOnFucus = (field) => {
      field.element.classList.remove(classNameInvalid);
      Object.keys(field.tooltips).forEach(key => field.tooltips[key].hide());
    };

    fields.forEach(
      field => field.element.addEventListener('focus', handleOnFucus.bind(null, field)),
    );

    const validateForm = () => fields.every(
      field => Object.keys(field.rules).every((validationType) => {
        if (!isFieldValid(field, validationType)) {
          field.element.classList.add(classNameInvalid);

          if (field.tooltips[validationType] === undefined) {
            // eslint-disable-next-line no-param-reassign
            field.tooltips[validationType] = createTooltip(field, validationType);
          }

          field.tooltips[validationType].show();
          setTimeout(() => {
            field.tooltips[validationType].hide();
          }, HIDE_TOOLTIP_TIMEOUT);

          return false;
        }
        return true;
      }),
    );

    return validateForm;
  };


  const circleForm = {
    container: '.js-circle-form',
    fields: [
      {
        element: 'input[name=name]',
        rules: {
          isRequired: true,
        },
      },
      {
        element: 'input[name=tel]',
        rules: {
          isRequired: true,
        },
      },
    ],
  };

  const form = {
    container: '.js-form',
    fields: [
      {
        element: 'input[name=address]',
        rules: {
          isRequired: true,
        },
      },
      {
        element: 'input[name=square-number]',
        rules: {
          isRequired: true,
          isInteger: true,
        },
      },
      {
        element: 'input[name=rooms-number]',
        rules: {
          isRequired: true,
          isInteger: true,
        },
      },
      {
        element: 'input[name=year-built]',
        rules: {
          isRequired: true,
          isInteger: true,
        },
      },
    ],
  };

  const createCircleFormHandleSubmit = (formContainer) => {
    const isFormValid = createFormValidator(formContainer, circleForm.fields);

    return (e) => {
      e.preventDefault();

      if (!isFormValid()) return;

      formContainer.classList.add('success');
    };
  };

  const createMainFormHandleSubmit = (formContainer) => {
    const isFormValid = createFormValidator(formContainer, form.fields);

    return (e) => {
      e.preventDefault();

      if (!isFormValid()) return;

      global.togglePopupForm();
    };
  };

  Array.prototype.forEach.call(
    document.querySelectorAll(circleForm.container),
    formContainer => formContainer.addEventListener(
      'submit',
      createCircleFormHandleSubmit(formContainer),
    ),
  );

  Array.prototype.forEach.call(
    document.querySelectorAll(form.container),
    formContainer => formContainer.addEventListener(
      'submit',
      createMainFormHandleSubmit(formContainer),
    ),
  );
})();


// popups
(() => {
  const popups = [
    {
      container: '.js-popup-form',
      openButton: 'js-popup-form-open',
    },
    {
      container: '.js-popup-privacy',
      openButton: 'js-popup-privacy-open',
    },
  ];

  const initializePopup = (popupParams) => {
    const popup = document.querySelector(popupParams.container);
    if (popup === null) return;

    const classNameActive    = 'active';
    const classNameBodyPopup = 'popup-open';

    const togglePopup = () => {
      const popupCountAttr = document.body.getAttribute('data-popup-count');
      let popupCount = (popupCountAttr === '' || popupCountAttr === null)
        ? 0
        : Number(popupCountAttr);

      if (popup.classList.contains('active')) {
        popupCount -= 1;
        if (popupCount < 1) {
          document.body.classList.remove(classNameBodyPopup);
        }
      } else {
        popupCount += 1;
        document.body.classList.add(classNameBodyPopup);
      }

      document.body.setAttribute('data-popup-count', popupCount);

      popup.classList.toggle(classNameActive);
    };

    if (popupParams.container === '.js-popup-form') {
      global.togglePopupForm = togglePopup;
    }

    popup.addEventListener('click', (e) => {
      if (e.target === popup) togglePopup();
    });

    Array.prototype.forEach.call(
      document.getElementsByClassName(popupParams.openButton),
      elem => elem.addEventListener('click', (e) => {
        togglePopup();
        e.preventDefault();
      }),
    );

    const popupClose = popup.querySelector('.js-popup-close');
    if (popupClose === null) return;

    popupClose.addEventListener('click', togglePopup);
  };

  popups.forEach(initializePopup);
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

      if (slider !== null && slider.noUiSlider !== undefined) {
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

      // eslint-disable-next-line no-param-reassign
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
