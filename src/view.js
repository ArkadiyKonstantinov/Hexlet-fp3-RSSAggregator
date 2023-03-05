import onChange from 'on-change';
import has from 'lodash/has.js';

const render = (state, elements) => (path, value, prevValue) => {
  switch (path) {
    case 'form.processState':
      switch (value) {
        case 'filling':
          elements.submitButton.classList.add('disabled');
          break;
        default:
          break;
    case 'form.valid':
      if (value) {
        elements.submitButton.classList.remove('disabled');
        break;
      }
      elements.submitButton.classList.add('disabled');
      break;
      }
    case 'form.errors':
      const error = value.rssUrl;
      const rssUrl = elements.fields.rssUrl;
      const rssUrlContainer = elements.form.parentElement;
      let feedbackEl = rssUrlContainer.querySelector('.feedback');
      const fieldHadError = has(prevValue,  'rssUrl');
      const fieldHasError = has(value, 'rssUrl');
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
      break;
    default:
      break;
  }
};

export default (state, elements) => {
  return onChange(state, render(state, elements));
}