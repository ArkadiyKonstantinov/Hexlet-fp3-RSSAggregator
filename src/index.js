// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './styles.scss';
import 'bootstrap';

import keyBy from 'lodash/keyBy.js';
import i18next from 'i18next';
import axios from 'axios';
import validate from './validator.js';
import resources from './locales/index.js';
import watch from './view.js';

const defaultElements = {
  form: document.querySelector('.rss-form'),
  submitButton: document.querySelector('input[type="submit"]'),
  fields: {
    rssUrl: document.getElementById('url-input'),
  },
};

// ```mermaid
// stateDiagram-v2
//     filling --> adding:valid
//     adding --> succes:Feed added
//     adding --> errors:Feed already exist, network errors
//     errors --> filling
//     succes --> filling
// ```

const defaultState = {
  feeds: [],
  posts: [],
  form: {
    lng: '',
    processState: 'filling',
    processError: null,
    valid: true,
    errors: {},
    fields: {
      rssUrl: '',
    },
    fieldsUi: {
      touched: {
        rssUrl: false,
      },
    },
  },
};

const app = (initialState, elements, i18n) => {
  fetch(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent('https://ru.hexlet.io/lessons.rss')}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => console.log(data.contents));

  const watchedState = watch(initialState, elements, i18n);
  watchedState.lng = i18n.lng;

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = elements.fields.rssUrl;
    watchedState.form.fields.rssUrl = value;
    watchedState.form.fieldsUi.touched.rssUrl = true;
    validate(watchedState)
      .then(() => {
        watchedState.form.errors = {};
        watchedState.form.valid = true;
      })
      .catch((errors) => {
        watchedState.form.errors = keyBy(errors.inner, 'path');
        watchedState.form.valid = false;
      });
  });
};

const initApp = (state, elements) => {
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      resources,
    })
    .then(() => app(state, elements, i18nInstance));
};

initApp(defaultState, defaultElements);
