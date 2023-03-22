import uniqueId from 'lodash/uniqueId.js';
import i18next from 'i18next';
import axios from 'axios';
import * as yup from 'yup';
import resources from './locales/index.js';
import watch from './view.js';
import parse from './parse.js';

const errorsMap = new Map([
  ['Must be valid', { key: 'feedback.error.notValidURL', type: 'error' }],
  ['Input is empty', { key: 'feedback.error.urlRequired', type: 'error' }],
  ['Already exists', { key: 'feedback.error.alreadyExists', type: 'error' }],
  ['Network Error', { key: 'feedback.error.netError', type: 'error' }],
  ['Parse error!', { key: 'feedback.error.parsingError', type: 'error' }],
]);

const proxifyUrl = (rssUrl) => {
  const url = new URL('/get', 'https://allorigins.hexlet.app/');
  url.searchParams.set('disableCache', true);
  url.searchParams.set('url', rssUrl);
  return url;
};

const validate = (state, url) => {
  yup.setLocale({
    string: {
      url: () => ('Must be valid'),
    },
    mixed: {
      required: () => ('Input is empty'),
      notOneOf: () => ('Already exists'),
    },
  });

  const schema = yup.string().url().required().notOneOf(state.feeds.map((f) => f.url));
  return schema.validate(url);
};

const updateFeed = (feed, state) => {
  const url = proxifyUrl(feed.url);
  axios.get(url)
    .then((response) => parse(response.data.contents))
    .then((parsedData) => {
      const newPosts = parsedData.items
        .filter((item) => !state.posts.find((post) => post.title === item.title))
        .map((item) => ({ ...item, feedId: feed.feedId, postId: uniqueId() }));
      if (newPosts) {
        state.posts.unshift(...newPosts);
      }
    })
    .then(() => setTimeout(() => updateFeed(feed, state), 5000))
    .catch((error) => { throw error; });
};

const app = (initialState, elements, i18n) => {
  const watchedState = watch(initialState, elements, i18n);
  watchedState.lng = i18n.lng;

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const url = elements.urlInput.value;
    validate(watchedState, url)
      .then(() => {
        watchedState.form.processState = 'adding';
      })
      .then(() => axios.get(proxifyUrl(url)).then((response) => response.data.contents))
      .then((contents) => {
        const parsedData = parse(contents);
        const feed = {
          feedId: uniqueId(),
          url,
          title: parsedData.title,
          description: parsedData.description,
        };
        const posts = parsedData.items.map((item) => ({
          feedId: feed.feedId,
          postId: uniqueId(),
          ...item,
        }));
        watchedState.feeds.unshift(feed);
        watchedState.posts.unshift(...posts);
        watchedState.form.processFeedback = { key: 'feedback.success.feedAdded', type: 'success' };
        watchedState.form.processState = 'filling';
        return feed;
      })
      .then((feed) => updateFeed(feed, watchedState))
      .catch((error) => {
        watchedState.form.processFeedback = errorsMap.get(error.message);
        watchedState.form.processState = 'failed';
      });
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    if (!id) {
      return;
    }
    watchedState.ui.modalPostId = id;
    watchedState.ui.readPosts.push(id);
  });
};

export default () => {
  const defaultElements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    submitButton: document.querySelector('[type="submit"]'),
    feedsContainer: document.querySelector('.feeds'),
    postsContainer: document.querySelector('.posts'),
    feedback: document.querySelector('.feedback'),
  };

  const defaultState = {
    feeds: [],
    posts: [],
    ui: {
      modalPostId: null,
      readPosts: [],
    },
    form: {
      lng: '',
      processState: 'filling',
      processFeedback: {
        key: '',
        type: '',
      },
    },
  };
  const i18nInstance = i18next.createInstance();
  i18nInstance
    .init({
      lng: 'ru',
      resources,
    })
    .then(() => app(defaultState, defaultElements, i18nInstance));
};
