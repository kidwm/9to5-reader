function saveOptions(event) {
    event.preventDefault();
    browser.storage.sync.set({
        defaultSite: event.target.elements['site'].value,
        obscureTargets: event.target.elements['keywords'].value
            .split(',')
            .map(word => word.trim())
    });
}

function restoreOptions() {
    browser.storage.sync.get({
        obscureTargets: [],
        defaultSite: 'linux',
    })
        .then(result => {
            const { elements } = document.querySelector('form');
            elements['keywords'].value = result.obscureTargets.join(', ');
            elements['site'].value = result.defaultSite;
        })
        .catch(error => console.log(`Error: ${error}`));
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
  