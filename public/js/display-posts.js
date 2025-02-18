document.addEventListener('DOMContentLoaded', async function() {
    console.log("Hei! Nettsiden din er nå lastet.");

    try {
        const response = await fetch('/data/posts.json');
        console.log('Fetch response:', response);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        console.log('Fetched data:', data);

        // Sort posts by date
        data.sort((a, b) => new Date(b.date) - new Date(a.date));

        const blogContainer = document.getElementById('blog-container');
        data.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-post';
            postElement.style.border = `2px solid ${post.color}`;

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
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to load posts. Please try again later.');
    }
});
