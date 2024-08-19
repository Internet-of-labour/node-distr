function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

document.addEventListener('DOMContentLoaded', function() {
    const contentUrl = getUrlParameter('h');
    const titleText = getUrlParameter('t');

    if (titleText) {
        document.getElementById('title').textContent = titleText;
    }

    if (contentUrl) {
        fetch(contentUrl)
            .then(response => {
                if (!response.ok) {
                    alert('Network response was not ok');
                    return;
                }
                return response.text();
            })
            .then(data => {
                document.getElementById('content').innerHTML = data;
            })
            .catch(error => {
                document.getElementById('content').innerHTML = '<p>Failed to load content.</p>';
            });
    } else {
        document.getElementById('content').innerHTML = '<p>No content URL provided.</p>';
    }
});
