const postsContainer = document.getElementById('posts');
const loadingElement = document.getElementById('loading');
const blogForm = document.getElementById('blogForm');

async function fetchNews(query = '') {
    try {
        loadingElement.style.display = 'block';
        postsContainer.innerHTML = ''; 
        
        const url = query
            ? `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=12&apiKey=1bf5408b5bf44e88addcd01fd079cc9b`
            : `https://newsapi.org/v2/top-headlines?country=us&pageSize=12&apiKey=1bf5408b5bf44e88addcd01fd079cc9b`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'error') {
            throw new Error(data.message);
        }

        loadingElement.style.display = 'none';
        displayPosts(data.articles);
    } catch (error) {
        loadingElement.style.display = 'block';
        if (error.message.includes('Requests from the browser are not allowed')) {
            loadingElement.innerHTML = `
                <div class="error-message">
                    <p><strong>API Error:</strong> ${error.message}</p>
                    <p>To resolve this issue:</p>
                    <ol>
                        <li>Ensure you're running the app on localhost (current setup is correct)</li>
                        <li>Check if your API key is valid</li>
                        <li>Consider upgrading to a paid plan for production deployment</li>
                    </ol>
                    <p>For development, the app will continue to work with custom posts.</p>
                </div>
            `;
        } else {
            loadingElement.innerHTML = `
                <div class="error-message">
                    <p><strong>Error:</strong> ${error.message}</p>
                    <p>Please try again later or contact support if the issue persists.</p>
                </div>
            `;
        }
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
    
    const titleInput = document.getElementById('title');
    const bodyInput = document.getElementById('body');
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    
 
    if (!title || !body) {
        showFormError('Please fill in both title and content fields');
        return false;
    }

    if (title.length < 3) {
        showFormError('Title is too short. Please enter at least 3 characters.');
        titleInput.focus();
        return false;
    }

    if (body.length < 10) {
        showFormError('Content is too short. Please enter at least 10 characters.');
        bodyInput.focus();
        return false;
    }

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
    clearFormError();
});


function showFormError(message) {
    let errorDiv = document.getElementById('form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'form-error';
        errorDiv.classList.add('error-message');
        blogForm.insertBefore(errorDiv, blogForm.firstChild);
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearFormError() {
    const errorDiv = document.getElementById('form-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

fetchNews();