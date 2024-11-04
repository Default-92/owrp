document.addEventListener('DOMContentLoaded', function() {
    console.log("Hei! Nettsiden din er nå lastet.");

    fetch('/data/posts.json')
        .then(response => response.json())
        .then(data => {
            const blogContainer = document.getElementById('blog-container');
            data.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'blog-post';

                const titleElement = document.createElement('h3');
                titleElement.textContent = post.title;

                const dateElement = document.createElement('p');
                dateElement.className = 'post-date';
                dateElement.textContent = `Publisert: ${post.date}`;

                const contentElement = document.createElement('p');
                contentElement.className = 'post-content';
                contentElement.textContent = post.content;

                postElement.appendChild(titleElement);
                postElement.appendChild(dateElement);
                postElement.appendChild(contentElement);

                blogContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});
