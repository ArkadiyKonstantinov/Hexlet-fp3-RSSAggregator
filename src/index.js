import './styles.scss';
import 'bootstrap';
import initApp from './init.js';

const defaultElements = {
  form: document.querySelector('.rss-form'),
  urlInput: document.getElementById('url-input'),
  submitButton: document.querySelector('[type="submit"]'),
  feedsContainer: document.querySelector('.feeds'),
  postsContainer: document.querySelector('.posts'),
  feedback: document.querySelector('.feedback'),
  fields: {
    rssUrl: document.getElementById('url-input'),
  },
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

initApp(defaultState, defaultElements);
