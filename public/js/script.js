document.getElementById('blog-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const content = document.getElementById('content').value;
    const color = document.getElementById('color').value;

    const postData = { title, date, content, color };

    try {
        const response = await fetch('/api/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        });

        if (!response.ok) throw new Error('Network response was not ok');

        alert('Post submitted successfully!');
        document.getElementById('blog-form').reset();
    } catch (error) {
        console.error('Error submitting post:', error);
        alert('Failed to submit post. Please try again later.');
    }
});

document.addEventListener('DOMContentLoaded', async function() {
    console.log("Hei! Nettsiden din er nå lastet.");

    try {
        const response = await fetch('/data/posts.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const blogContainer = document.getElementById('blog-container');
        data.forEach(post => {
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
