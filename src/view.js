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

const renderFeedback = (feedback, i18n, elements) => {
  const feedbackEl = document.querySelector('.feedback');
  const fromContainer = elements.form.parentElement;
  const feedbackClass = feedback.type === 'success' ? 'text-success' : 'text-danger';
  if (feedbackEl) {
    feedbackEl.remove();
  }
  const newFeedbackEl = document.createElement('div');
  newFeedbackEl.classList.add('feedback', feedbackClass);
  newFeedbackEl.textContent = i18n.t(feedback.key);
  fromContainer.append(newFeedbackEl);
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

const renderFeeds = (state) => {
  const feedsList = document.createElement('ul');
  feedsList.classList.add('list-group', 'border-0', 'rounded-0');
  state.feeds.forEach((feed) => {
    const feedEl = document.createElement('li');
    feedEl.classList.add('list-group-item', 'border-0', 'border-end-0');

    const feedTitle = document.createElement('h3');
    feedTitle.classList.add('h6', 'm0');
    feedTitle.textContent = feed.title;

    const feedDescription = document.createElement('p');
    feedDescription.classList.add('m-0', 'small', 'text-black-50');
    feedDescription.textContent = feed.description;

    feedEl.append(feedTitle, feedDescription);
    feedsList.append(feedEl);
  });

  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  const feedCardBody = document.createElement('div');
  feedCardBody.classList.add('card-body');
  const feedBodyTitle = document.createElement('h2');
  feedBodyTitle.classList.add('card-title', 'h4');
  feedBodyTitle.textContent = 'Фиды';

  feedCardBody.append(feedBodyTitle);
  feedsCard.append(feedCardBody, feedsList);

  const feedsContainer = document.querySelector('.feeds');
  const oldFeedsCard = feedsContainer.querySelector('.card');
  if (oldFeedsCard) { oldFeedsCard.remove(); }
  feedsContainer.append(feedsCard);
};

const renderPosts = (state) => {
  const postsList = document.createElement('ul');
  postsList.classList.add('list-group', 'border-0', 'rounded-0');
  state.posts.forEach((post) => {
    const postEl = document.createElement('li');
    postEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-start', 'border-0', 'border-end-0');

    const postTitle = document.createElement('a');
    postTitle.classList.add('fw-bold');
    postTitle.href = post.link;
    postTitle.setAttribute('data-id', post.postId);
    postTitle.setAttribute('target', '_blank');
    postTitle.rel = 'noopener noreferrer';
    postTitle.textContent = post.title;

    const postButton = document.createElement('button');
    postButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    postButton.type = 'button';
    postButton.setAttribute('data-id', post.postId);
    postButton.setAttribute('data-bs-target', '#modal');
    postButton.textContent = 'Просмотр';

    postEl.append(postTitle, postButton);
    postsList.append(postEl);
  });

  const postsCard = document.createElement('div');
  postsCard.classList.add('card', 'border-0');
  const postCardBody = document.createElement('div');
  postCardBody.classList.add('card-body');
  const postBodyTitle = document.createElement('h2');
  postBodyTitle.classList.add('card-title', 'h4');
  postBodyTitle.textContent = 'Посты';

  postCardBody.append(postBodyTitle);
  postsCard.append(postCardBody, postsList);

  const postsContainer = document.querySelector('.posts');
  const oldPostsCard = postsContainer.querySelector('.card');
  if (oldPostsCard) { oldPostsCard.remove(); }
  postsContainer.append(postsCard);
};

const handleProcessState = (state, elements, i18n, processState) => {
  switch (processState) {
    case 'filling':
      break;
    case 'adding':
      elements.fields.rssUrl.classList.add('disabled');
      elements.submitButton.classList.add('disabled');
      break;
    case 'errors':
      elements.fields.rssUrl.classList.remove('disabled');
      elements.submitButton.classList.remove('disabled');
      elements.fields.rssUrl.focus();
      renderFeedback(state.form.processFeedback, i18n, elements);
      break;
    case 'success':
      elements.fields.rssUrl.classList.remove('disabled');
      elements.submitButton.classList.remove('disabled');
      elements.form.reset();
      elements.fields.rssUrl.focus();
      renderFeedback(state.form.processFeedback, i18n, elements);
      break;
    default:
      break;
  }
};

const render = (state, elements, i18n) => (path, value, prevValue) => {
  switch (path) {
    case 'lng':
      renderText(value, i18n);
      break;
    case 'form.processState':
      handleProcessState(state, elements, i18n, value);
      break;
    case 'form.valid':
      break;
    case 'form.errors':
      renderErrors(state, elements, value, prevValue, i18n);
      break;
    case 'feeds':
      renderFeeds(state);
      break;
    case 'posts':
      renderPosts(state);
      break;
    default:
      break;
  }
};

export default (state, elements, i18next) => onChange(state, render(state, elements, i18next));
