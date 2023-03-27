export default (XMLdata) => {
  const rss = new window.DOMParser().parseFromString(XMLdata, 'text/xml');
  const error = rss.querySelector('parsererror');
  if (error) {
    const message = new Error('Parse error!');
    message.parseError = error.textContent;
    console.dir(message);
    throw message;
  }

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
