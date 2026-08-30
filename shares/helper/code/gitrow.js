
let urlParams;

let tryAfter = 5;

let targetUrl = '';

const contentDiv = document.getElementById('content');

let timer;

function getUrlParameter(name) {
    if (!urlParams) {
        urlParams = new URLSearchParams(window.location.search);
    }
    return urlParams.get(name);
}

async function getContent() {
    const response = await fetch(targetUrl);

    if (!response.ok) {
        if (tryAfter > 4) {

            contentDiv.innerHTML = `
                    <div class="error">
                        <strong>Error:</strong> Failed to fetch: ${response.status} ${response.statusText}<br>
                        <br>
                        Next attemption after ${tryAfter} seconds.
                    </div>
                `;

            timer = setInterval(()=>{
                tryAfter--;

                if (tryAfter < 1){
                    getContent();
                    clearInterval(timer);
                    return;
                }

                contentDiv.innerHTML = `
                    <div class="error">
                        <strong>Error:</strong> Failed to fetch: ${response.status} ${response.statusText}<br>
                        <br>
                        Next attemption after ${tryAfter} seconds.
                    </div>
                `;
            }, 1000)
        } else {
            contentDiv.innerHTML = `
                    <div class="error">
                        <strong>Error:</strong> Failed to fetch: ${response.status} ${response.statusText}.</div>
                `;
        }

    }

    contentDiv.innerHTML = await response.text();

    contentDiv.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');

        if (href && href.startsWith('#')) {
            event.preventDefault();
            const targetId = href.substring(1);
            const targetEl = contentDiv.querySelector(`[id="${CSS.escape(targetId)}"]`);

            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}

async function run() {

    const titleText = getUrlParameter('t');

    if (titleText) {
        document.getElementById('title').textContent = titleText;
    }

    try {
        // 1. Get the path after /gitraw/
        // Example: mydomain.net/gitraw/user/repo/file.txt
        // pathname will be /gitraw/user/repo/file.txt
        const currentPath = window.location.pathname;
        const pathParts = currentPath.split('/gitraw/');

        // Get everything after the directory name
        let subPath = pathParts.length > 1 ? pathParts[1] : '';

        if (!subPath) {
            contentDiv.innerHTML = "Check the path after /gitraw/.";
            return;
        }

        const defaultLng = 'en';

        let suppLngs = [];

        try{
            suppLngs = JSON.parse(getUrlParameter('l')) || []
        }catch (e) {}


        const browserLang = navigator.language || navigator.userLanguage;
        const iso2Code = browserLang.split('-')[0].toLowerCase();

        if (iso2Code !== defaultLng && suppLngs.includes(iso2Code)){
            subPath = subPath.replace('/'+defaultLng+'/', '/'+iso2Code+'/');
        }

        // 2. Construct the new URL
        targetUrl = `https://raw.githubusercontent.com/${subPath}`;

        getContent();

    } catch (error) {
        contentDiv.innerHTML = `
                    <div class="error">
                        <strong>Error:</strong> ${error.message}
                    </div>
                `;
    }
}

// Initialize on load
window.onload = run;
