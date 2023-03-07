import onChange from 'on-change';
import has from 'lodash/has.js';

const renderText = (lng, i18n) => {
  const textElemente = {
    header: document.querySelector('h1'),
    slogan: document.querySelector('p.lead'),
    example: document.querySelector('p.text-muted'),
    label: document.querySelector('label'),
  };

  i18n.changeLanguage(lng);

  textElemente.header.textContent = i18n.t('text.header');
  textElemente.slogan.textContent = i18n.t('text.slogan');
  textElemente.example.textContent = i18n.t('text.example');
  textElemente.label.textContent = i18n.t('text.label');
};

const renderError = (elements, error, i18n) => {
  const feedbackEl = document.querySelector('.feedback');
  const { rssUrl } = elements.fields;
  const rssUrlContainer = elements.form.parentElement;
  if (feedbackEl) {
    feedbackEl.textContent = error.errors.map((e) => i18n.t(e.key));
    return;
  }
  rssUrl.classList.add('is-invalid');
  const newFeedbackEl = document.createElement('div');
  newFeedbackEl.classList.add('feedback', 'text-danger');
  newFeedbackEl.textContent = error.errors.map((e) => i18n.t(e.key));
  rssUrlContainer.append(newFeedbackEl);
};

const removeError = (elements) => {
  const feedbackEl = document.querySelector('.feedback');
  const { rssUrl } = elements.fields;
  rssUrl.classList.remove('is-invalid');
  if (feedbackEl) {
    feedbackEl.remove();
  }
};

const renderErrors = (state, elements, errors, prevErrors, i18n) => {
  const error = errors.rssUrl;
  const fieldHadError = has(prevErrors, 'rssUrl');
  const fieldHasError = has(errors, 'rssUrl');
  if (!fieldHadError && !fieldHasError) {
    return;
  }
  if (fieldHadError && !fieldHasError) {
    removeError(elements);
    return;
  }
  if (state.form.fieldsUi.touched.rssUrl && fieldHasError) {
    renderError(elements, error, i18n);
  }
};

const render = (state, elements, i18n) => (path, value, prevValue) => {
  switch (path) {
    case 'lng':
      renderText(value, i18n);
      break;
    case 'form.processState':
      break;
    case 'form.valid':
      break;
    case 'form.errors': {
      renderErrors(state, elements, value, prevValue, i18n);
      break;
    }
    default:
      break;
  }
};

export default (state, elements, i18next) => onChange(state, render(state, elements, i18next));
