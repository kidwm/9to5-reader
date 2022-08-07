const SITE_HOST = 'https://9to5google.com';
const PAGE_SIZE = 30;

const IGNORED_TERMS = ['Stadia', 'Deals:', 'deals of the day:', 'top stories:', 'OnePlus', 'Fitbit'];

browser.sidebarAction.setIcon({
    path: `${SITE_HOST}/favicon.ico`,
});

const template = document.querySelector('template');
const loadButton = document.querySelector('main + button');

let cursor;

const fetchArticles = time => {
    loadButton.disabled = true;
    fetch(`${SITE_HOST}/wp-json/wp/v2/posts/?per_page=${PAGE_SIZE}${time ? `&before=${time}` : ''}`)
        .then(response => response.json())
        .then(articles => {
            const fragment = document.createDocumentFragment();
            for (const article of articles) {
                const link = template.content.querySelector('h2 a');
                const title = article.title.rendered
                    .replaceAll(
                        /\&\#(\d+);/g,
                        (match, p1) => String.fromCharCode(p1)
                    );
                link.textContent = title;
                link.href = article.link;
                const time = template.content.querySelector('time');
                time.textContent = new Date(article.date).toLocaleString();
                const item = document.importNode(template.content, true);
                if (IGNORED_TERMS.some(term => title.includes(term))) {
                    item.querySelector('article').classList.add('ignore');
                }
                fragment.appendChild(item);
            }
            cursor = articles.at(-1).date;
            document.querySelector('main').appendChild(fragment);
        })
        .finally(() => {
            loadButton.disabled = false;
        });
}

loadButton.addEventListener('click', event => {
    if (cursor) {
        fetchArticles(cursor);
        cursor = undefined;
    }
});

fetchArticles();
