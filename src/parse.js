export default (XMLdata) => {
  const rss = new window.DOMParser().parseFromString(XMLdata, 'text/xml');
  if (rss.querySelector('parsererror')) { throw new Error('Parse error!'); }

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
