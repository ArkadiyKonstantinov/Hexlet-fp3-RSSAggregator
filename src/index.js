import './styles.scss';
import 'bootstrap';

import uniqueId from 'lodash/uniqueId.js';
import i18next from 'i18next';
import axios from 'axios';
import * as yup from 'yup';
import resources from './locales/index.js';
import watch from './view.js';

const proxifyUrl = (rssUrl) => {
  const url = new URL('https://allorigins.hexlet.app/');
  url.pathname = '/get';
  url.search = `disableCache=true&url=${encodeURIComponent(rssUrl)}`;
  return url;
};

const validate = (state) => {
  yup.setLocale({
    string: {
      url: () => ({ key: 'feedback.error.notValidURL', type: 'error' }),
    },
  });

  const schema = yup.object().shape(
    {
      rssUrl: yup.string().url(),
    },
  );

  return schema.validate(state.form.fields, { abortEarly: false });
};

const pars = (XMLdata) => {
  const rss = new window.DOMParser().parseFromString(XMLdata, 'text/xml');
  if (!rss.querySelector('channel')) { throw new Error('Parse error!'); }

  return {
    title: rss.querySelector('title').textContent,
    description: rss.querySelector('description').textContent,
    items: [...rss.querySelectorAll('item')].map((item) => ({
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    })),
  };
};

const updateFeed = (feed, state) => {
  const url = proxifyUrl(feed.url);
  axios.get(url)
    .then((response) => pars(response.data.contents))
    .then((parsedData) => {
      const filtred = parsedData.items
        .filter((item) => !state.posts.find((post) => post.title === item.title))
        .map((item) => ({ ...item, feedId: feed.feedId, postId: uniqueId() }));
      if (filtred) {
        state.posts.unshift(...filtred);
      }
    })
    .then(() => setTimeout(() => updateFeed(feed, state), 5000))
    .catch((error) => { throw error; });
};

const defaultElements = {
  form: document.querySelector('.rss-form'),
  submitButton: document.querySelector('[type="submit"]'),
  postsContainer: document.querySelector('.posts'),
  fields: {
    rssUrl: document.getElementById('url-input'),
  },
};

const defaultState = {
  feeds: [],
  posts: [],
  stateUi: {
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
    valid: true,
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
        watchedState.form.processState = 'adding';
      })
      .then(() => {
        const findFeed = initialState.feeds
          .find((feed) => feed.url === watchedState.form.fields.rssUrl);
        if (findFeed) {
          throw new Error('Already exists!');
        }
      })
      .then(() => {
        const url = proxifyUrl(initialState.form.fields.rssUrl);
        return axios.get(url)
          .then((response) => response.data.contents);
      })
      .then((contents) => {
        const url = initialState.form.fields.rssUrl;
        const parsedData = pars(contents);
        const feed = {
          feedId: uniqueId(),
          url,
          title: parsedData.title,
          description: parsedData.title,
        };
        const posts = parsedData.items.map((item) => ({
          feedId: feed.feedId,
          postId: uniqueId(),
          ...item,
        }));
        watchedState.feeds.unshift(feed);
        watchedState.posts.unshift(...posts);
        watchedState.form.processFeedback = { key: 'feedback.success.feedAdded', type: 'success' };
        watchedState.form.processState = 'success';
        return feed;
      })
      .then((feed) => updateFeed(feed, watchedState))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          watchedState.form.processFeedback = error.message;
          watchedState.form.valid = false;
          console.dir(error);
          throw error;
        } else {
          switch (error.message) {
            case 'Already exists':
              watchedState.form.processFeedback = { key: 'feedback.error.alreadyExists', type: 'error' };
              break;
            case 'Network Error':
              watchedState.form.processFeedback = { key: 'feedback.error.netError', type: 'error' };
              break;
            case 'Parse error!':
              watchedState.form.processFeedback = { key: 'feedback.error.parsingError', tyep: 'error' };
              break;
            default:
              throw error;
          }
          watchedState.form.processState = 'errors';
          throw error;
        }
      });
  });

  elements.postsContainer.addEventListener('click', (e) => {
    const { id } = e.target.dataset;
    if (!id) {
      return;
    }
    watchedState.stateUi.modalPostId = id;
    watchedState.stateUi.readPosts.push(id);
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
