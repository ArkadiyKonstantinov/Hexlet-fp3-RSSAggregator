import onChange from 'on-change';
import has from 'lodash/has.js';

const renderError = (elements, errors, prevErrors, state) => {
  const error = errors.rssUrl;
  const { rssUrl } = elements.fields;
  const rssUrlContainer = elements.form.parentElement;
  const feedbackEl = rssUrlContainer.querySelector('.feedback');
  const fieldHadError = has(prevErrors, 'rssUrl');
  const fieldHasError = has(errors, 'rssUrl');
  if (!fieldHadError && !fieldHasError) {
    return;
  }
  if (fieldHadError && !fieldHasError) {
    rssUrl.classList.remove('is-invalid');
    if (feedbackEl) {
      feedbackEl.remove();
    }
    return;
  }
  if (state.form.fieldsUi.touched.rssUrl && fieldHasError) {
    if (feedbackEl) {
      feedbackEl.textContent = error.message;
      return;
    }
    rssUrl.classList.add('is-invalid');
    const newFeedbackEl = document.createElement('div');
    newFeedbackEl.classList.add('feedback', 'text-danger');
    newFeedbackEl.textContent = error.message;
    rssUrlContainer.append(newFeedbackEl);
  }
};

const render = (state, elements) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      break;
    case 'form.valid':
      break;
    case 'form.errors': {
      renderError(elements, value, prevValue, state);
      break;
    }
    default:
      break;
  }
};

export default (state, elements) => onChange(state, render(state, elements));
