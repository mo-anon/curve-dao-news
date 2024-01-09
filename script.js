let articles = [];
                
function loadRSS() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            parseFeed(this);
        }
    };
    xhr.open("GET", "feed.xml", true);
    xhr.send();
}

function parseFeed(xml) {
    const xmlDoc = xml.responseXML;
    const items = xmlDoc.getElementsByTagName("item");
    articles = [];
    for (let i = 0; i < items.length; i++) {
        const title = items[i].getElementsByTagName("title")[0].childNodes[0].nodeValue;
        const description = items[i].getElementsByTagName("description")[0].childNodes[0].nodeValue;
        const link = items[i].getElementsByTagName("link")[0].childNodes[0].nodeValue;
        const pubDate = new Date(items[i].getElementsByTagName("pubDate")[0].childNodes[0].nodeValue);
        articles.push({ title, description, link, pubDate });
    }
    displayArticles(articles);
}


function displayArticles(articlesToDisplay) {
    let html = "";
    for (let article of articlesToDisplay) {
        html += `
            <article>
                <h1>${article.title}</h1>
                <p>${article.description}</p>
                <a href="${article.link}">Proposal</a>
            </article>
        `;
    }
    document.getElementById("rss-feed").innerHTML = html;
}

function searchArticles() {
    const query = document.getElementById("search-field").value.toLowerCase();
    const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(query) || 
        article.description.toLowerCase().includes(query)
    );
    displayArticles(filteredArticles);
}

loadRSS();

function filterArticles(period) {
    const now = new Date();
    let filteredArticles = articles.filter(article => {
        if (!article.pubDate) return false; // Skip if no publication date
        const articleDate = new Date(article.pubDate);

        switch (period) {
            case '1d':
                return articleDate >= new Date(now.getTime() - 86400000);
            case '7d':
                return articleDate >= new Date(now.getTime() - 604800000);
            case '30d':
                return articleDate >= new Date(now.getTime() - 2592000000);
            default:
                return true;
        }
    });

    displayArticles(filteredArticles);
}



// Add event listener for the Enter key
document.getElementById("search-field").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchArticles();
    }
});

// Function for live search
document.getElementById("search-field").addEventListener("input", function() {
    searchArticles();
});

