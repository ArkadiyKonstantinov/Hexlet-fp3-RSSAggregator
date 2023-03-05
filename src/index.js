import  '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import  'bootstrap';
import view from './view.js';

import keyBy from 'lodash/keyBy.js';
import * as yup from 'yup';

const schema = yup.object().shape(
  {
    rssUrl: yup.string().url('Ссылка должна быть валидным URL'),
  }
);
let result = {};
const validate = (state) => {
  return schema.validate(state.form.fields, { abortEarly: false })
    // .then(() => { return [state, {}] })
    // .catch((errors) => { return [state, errors] }); 
};

const app = () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    submitButton: document.querySelector('input[type="submit"]'),
    fields: {
      rssUrl: document.getElementById('url-input'),
    },
  };

  const initialState = {
    form: {
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
        }
      }
      
    }
  }

  const state = view(initialState, elements);

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = elements.fields.rssUrl.value;
    state.form.fields.rssUrl = value;
    state.form.fieldsUi.touched.rssUrl = true;
    validate(state)
      .then(() => {
        state.form.errors = {};
        state.form.valid = true;
      })
      .catch((errors) => {
        state.form.errors = keyBy(errors.inner, 'path');
        state.form.valid = false;
      }); 
  })
};

app();
