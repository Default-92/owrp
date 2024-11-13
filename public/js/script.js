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

            const editButton = document.createElement('button');
            editButton.className = 'edit-button';
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editPost(post.id, post));

            const deleteButton = document.createElement('button');
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deletePost(post.id));

            postElement.appendChild(titleElement);
            postElement.appendChild(dateElement);
            postElement.appendChild(contentElement);
            postElement.appendChild(editButton);
            postElement.appendChild(deleteButton);

            blogContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to load posts. Please try again later.');
    }

    function editPost(id, post) {
        document.getElementById('title').value = post.title;
        document.getElementById('date').value = post.date;
        document.getElementById('content').value = post.content;
        document.getElementById('color').value = post.color;

        document.getElementById('blog-form').onsubmit = async function(event) {
            event.preventDefault();

            const updatedPost = {
                id: post.id,
                title: document.getElementById('title').value,
                date: document.getElementById('date').value,
                content: document.getElementById('content').value,
                color: document.getElementById('color').value
            };

            try {
                const response = await fetch(`/api/posts/${id}`, {
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

    async function deletePost(id) {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Network response was not ok');

            alert('Post deleted successfully!');
            location.reload(); // Reload the page to see the updated list of posts
        } catch (error) {
            console.error('Error deleting post:', error);
            alert('Failed to delete post. Please try again later.');
        }
    }
});
