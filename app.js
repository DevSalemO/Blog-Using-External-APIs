const postsContainer = document.getElementById('posts');
const loadingElement = document.getElementById('loading');
const blogForm = document.getElementById('blogForm');

async function fetchNews(query = '') {
    try {
        loadingElement.style.display = 'block';
        postsContainer.innerHTML = ''; 
        
        const url = query
            ? "https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=12&apiKey=1bf5408b5bf44e88addcd01fd079cc9b"
            : "https://newsapi.org/v2/top-headlines?country=us&pageSize=12&apiKey=1bf5408b5bf44e88addcd01fd079cc9b";

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        loadingElement.style.display = 'none';
        displayPosts(data.articles);
    } catch (error) {
        loadingElement.textContent = `Error: ${error.message}. Please try again later.`;
        console.error('Error:', error);
    }
}

function displayPosts(articles) {
    articles.forEach(article => {
        const postElement = createPostElement(article);
        postsContainer.appendChild(postElement);
    });
}

function createPostElement(article) {
    const postDiv = document.createElement('div');
    postDiv.classList.add('post');
    
    if (article.urlToImage) {
        const image = document.createElement('img');
        image.src = article.urlToImage;
        image.alt = article.title;
        image.classList.add('post-image');
        image.onerror = () => image.style.display = 'none';
        postDiv.appendChild(image);
    }
    
   
    const title = document.createElement('h2');
    title.textContent = article.title;
    postDiv.appendChild(title);
    
   
    if (article.description) {
        const description = document.createElement('p');
        description.textContent = article.description;
        postDiv.appendChild(description);
    }
    

    return postDiv;
}


blogForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    
    const newPost = {
        title,
        description: body,
        publishedAt: new Date().toISOString(),
        source: { name: 'Custom Post' },
        url: '#',
        urlToImage: null
    };
    

    const postElement = createPostElement(newPost);
    postsContainer.insertBefore(postElement, postsContainer.firstChild);
    blogForm.reset();
});

fetchNews();