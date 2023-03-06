import onChange from 'on-change';
import has from 'lodash/has.js';

const renderError = (elements, feedbackEl, error) => {
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

const removeError = (elements, feedbackEl) => {
  const { rssUrl } = elements.fields;
  const rssUrlContainer = elements.form.parentElement;
  rssUrl.classList.remove('is-invalid');
  if (feedbackEl) {
    feedbackEl.remove();
  }
};

const renderErrors = (elements, errors, prevErrors, state) => {
  const error = errors.rssUrl;
  const feedbackEl = document.querySelector('.feedback');
  const fieldHadError = has(prevErrors, 'rssUrl');
  const fieldHasError = has(errors, 'rssUrl');
  if (!fieldHadError && !fieldHasError) {
    return;
  }
  if (fieldHadError && !fieldHasError) {
    removeError(elements, feedbackEl);
    return;
  }
  if (state.form.fieldsUi.touched.rssUrl && fieldHasError) {
    renderError(elements, feedbackEl, error);
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
