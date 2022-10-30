function saveOptions(event) {
    event.preventDefault();
    browser.storage.sync.set({
        obscureTargets: event.target.elements['keywords'].value
            .split(',')
            .map(word => word.trim())
    });
}

function restoreOptions() {
    browser.storage.sync.get("obscureTargets")
        .then(result => {
            document.querySelector('form').elements['keywords'].value = result.obscureTargets.join(', ');
        })
        .catch(error => console.log(`Error: ${error}`));
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
  