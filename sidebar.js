const PAGE_SIZE = 30;

const template = document.querySelector('template');
const loadButton = document.querySelector('main + button');
const navTabs = document.querySelector('nav');

let obscureTerms;
let cursor;
let site;

const fetchArticles = time => {
    loadButton.disabled = true;
    fetch(`https://9to5${site}.com/wp-json/wp/v2/posts/?per_page=${PAGE_SIZE}${time ? `&before=${time}` : ''}`)
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
                if (obscureTerms.some(term => Boolean(term) && title.includes(term))) {
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

const switchSite = nextSite => {
    site = nextSite;
    cursor = undefined;

    browser.sidebarAction.setIcon({
        path: `https://9to5${site}.com/favicon.ico`,
    });

    const currentTab = document.querySelector('nav [aria-current="true"]');
    if (currentTab) {
        currentTab.removeAttribute('aria-current')
    }
    document.querySelector(`nav a[href="#${site}"`).setAttribute('aria-current', true);

    document.querySelector('main').replaceChildren();
    
    fetchArticles();
};

loadButton.addEventListener('click', event => {
    if (cursor) {
        fetchArticles(cursor);
        cursor = undefined;
    }
});

navTabs.addEventListener('click', event => {
    if (event.target.href) {
        switchSite(event.target.href.split('#').pop());
    }
});

browser.storage.sync.get({
    obscureTargets: [],
    defaultSite: 'linux',
})
    .then(result => {
        obscureTerms = result.obscureTargets;
        switchSite(result.defaultSite);
    })
    .catch(error => console.log(`Error: ${error}`));
