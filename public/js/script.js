document.addEventListener('DOMContentLoaded', async function() {
    console.log("Hei! Nettsiden din er nå lastet.");

    try {
        const response = await fetch('/data/posts.json');
        console.log('Fetch response:', response);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        console.log('Fetched data:', data);

        const blogContainer = document.getElementById('blog-container');
        data.forEach((post, index) => {
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

            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editPost(index, post));

            postElement.appendChild(titleElement);
            postElement.appendChild(dateElement);
            postElement.appendChild(contentElement);
            postElement.appendChild(editButton);

            blogContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to load posts. Please try again later.');
    }

    function editPost(index, post) {
        document.getElementById('title').value = post.title;
        document.getElementById('date').value = post.date;
        document.getElementById('content').value = post.content;
        document.getElementById('color').value = post.color;

        document.getElementById('blog-form').onsubmit = async function(event) {
            event.preventDefault();

            const updatedPost = {
                title: document.getElementById('title').value,
                date: document.getElementById('date').value,
                content: document.getElementById('content').value,
                color: document.getElementById('color').value
            };

            try {
                const response = await fetch(`/api/posts/${index}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedPost)
                });

                if (!response.ok) throw new Error('Network response was not ok');

                alert('Post updated successfully!');
                document.getElementById('blog-form').reset();
                location.reload(); // Reload the page to see the updated post
            } catch (error) {
                console.error('Error updating post:', error);
                alert('Failed to update post. Please try again later.');
            }
        };
    }
});
