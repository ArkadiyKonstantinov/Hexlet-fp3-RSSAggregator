import onChange from 'on-change';
import has from 'lodash/has.js';

const renderError = (elements, error) => {
  const feedbackEl = document.querySelector('.feedback');
  const { rssUrl } = elements.fields;
  const rssUrlContainer = elements.form.parentElement;
  if (feedbackEl) {
    feedbackEl.textContent = error.message;
    return;
  }
  rssUrl.classList.add('is-invalid');
  const newFeedbackEl = document.createElement('div');
  newFeedbackEl.classList.add('feedback', 'text-danger');
  newFeedbackEl.textContent = error.message;
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

const renderErrors = (elements, errors, prevErrors, state) => {
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
    renderError(elements, error);
  }
};

const render = (state, elements) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      break;
    case 'form.valid':
      break;
    case 'form.errors': {
      renderErrors(elements, value, prevValue, state);
      break;
    }
    default:
      break;
  }
};

export default (state, elements) => onChange(state, render(state, elements));
