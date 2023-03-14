import './styles.scss';
import 'bootstrap';

// import keyBy from 'lodash/keyBy.js';
import uniqueId from 'lodash/uniqueId.js';
import i18next from 'i18next';
import axios from 'axios';
// import validate from './validator.js';
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

const pars = (XMLdata, url) => {
  const rss = new window.DOMParser().parseFromString(XMLdata, 'text/xml');
  if (!rss.querySelector('channel')) { throw new Error('Parse error!'); }
  const feed = {
    id: uniqueId(),
    url,
    title: rss.querySelector('title').textContent,
    description: rss.querySelector('description').textContent,
    pubDate: new Date(rss.querySelector('pubDate').textContent),
  };
  const rssItems = Array.from(rss.querySelectorAll('item'));
  const posts = rssItems.map((item) => ({
    id: feed.id,
    postId: uniqueId(),
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
    pubDate: new Date(item.querySelector('pubDate').textContent),
  }));
  return { feed, posts };
};

const updateFeeds = (state) => {
  state.feeds.forEach((feed) => {
    const url = proxifyUrl(feed.url);
    axios.get(url)
      .then((response) => pars(response.data.contents, feed.url))
      .then(({ feed: newFeed, posts: newPosts }) => {
        if (newFeed.pubDate > feed.pubDate) {
          feed.pubDate = newFeed.pubDate;
          const filtredPosts = newPosts.filter((post) => post.pubDate >= feed.pubDate);
          state.posts.unshift(...filtredPosts);
        }
      })
      .catch((error) => { throw error; })
      .then(() => setTimeout(() => updateFeeds(state), 5000));
  });
};

const defaultElements = {
  form: document.querySelector('.rss-form'),
  submitButton: document.querySelector('[type="submit"]'),
  fields: {
    rssUrl: document.getElementById('url-input'),
  },
};

const defaultState = {
  feeds: [],
  posts: [],
  form: {
    lng: '',
    processState: 'filling',
    // processError: null,
    processFeedback: {
      key: '',
      type: '',
    },
    valid: true,
    // errors: {},
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
        const { feed, posts } = pars(contents, url);
        watchedState.feeds.unshift(feed);
        watchedState.posts.unshift(...posts);
        watchedState.form.processFeedback = { key: 'feedback.success.feedAdded', type: 'success' };
        watchedState.form.processState = 'success';
        // console.dir(watchedState);
      })
      .then(() => setTimeout(() => updateFeeds(watchedState), 5000))
      .catch((error) => {
        if (error.name === 'ValidationError') {
          // watchedState.form.errors = keyBy(error.inner, 'path');
          watchedState.form.processFeedback = error.message;
          watchedState.form.valid = false;
          console.dir(error);
          throw error;
        }
        if (error.message === 'Already exists!') {
          watchedState.form.processFeedback = { key: 'feedback.error.alreadyExists', type: 'error' };
          watchedState.form.processState = 'errors';
          throw error;
        }
        if (error.message === 'Network Error') {
          watchedState.form.processFeedback = { key: 'feedback.error.netError', type: 'error' };
          watchedState.form.processState = 'errors';
          throw error;
        }
        if (error.message === 'Parse error!') {
          watchedState.form.processFeedback = { key: 'feedback.error.parsingError', tyep: 'error' };
          watchedState.form.processState = 'errors';
          throw error;
        }
        throw error;
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
