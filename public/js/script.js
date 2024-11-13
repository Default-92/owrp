document.addEventListener('DOMContentLoaded', async function() {
    console.log("Hei! Nettsiden din er nå lastet.");

    const postsPerPage = 5; // Number of posts per page
    let currentPage = 1;
    let posts = [];

    try {
        const response = await fetch('/data/posts.json');
        console.log('Fetch response:', response);
        if (!response.ok) throw new Error('Network response was not ok');
        
        posts = await response.json();
        console.log('Fetched data:', posts);

        // Sort posts by date
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        displayPosts();
        createPaginationControls();
    } catch (error) {
        console.error('Error fetching posts:', error);
        alert('Failed to load posts. Please try again later.');
    }

    function displayPosts() {
        const blogContainer = document.getElementById('blog-container');
        blogContainer.innerHTML = ''; // Clear previous posts

        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const paginatedPosts = posts.slice(start, end);

        paginatedPosts.forEach((post) => {
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
    }

    function createPaginationControls() {
        const paginationContainer = document.getElementById('pagination-controls');
        paginationContainer.innerHTML = ''; // Clear previous controls

        const totalPages = Math.ceil(posts.length / postsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = 'page-button';
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayPosts();
                createPaginationControls();
            });

            paginationContainer.appendChild(pageButton);
        }
    }

    function editPost(id, post) {
        document.getElementById('title').value = post.title;
        document.getElementById('date').value = post.date;
        document.getElementById('content').value = post.content;
        document.getElementById('color').value = post.color;

        // Remove existing onsubmit event listener
        const form = document.getElementById('blog-form');
        const newForm = form.cloneNode(true);
        form.parentNode.replaceChild(newForm, form);

        newForm.onsubmit = async function(event) {
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

    document.getElementById('blog-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const date = document.getElementById('date').value;
        const content = document.getElementById('content').value;
        const color = document.getElementById('color').value;

        const newPost = {
            id: posts.length ? posts[posts.length - 1].id + 1 : 1, // Generate a new ID
            title,
            date,
            content,
            color
        };

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newPost)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            alert('Post submitted successfully!');
            document.getElementById('blog-form').reset();

            // Add the new post to the posts array
            posts.push(newPost);

            // Update pagination controls and display posts
            createPaginationControls();
            displayPosts();
        } catch (error) {
            console.error('Error submitting post:', error);
            alert('Failed to submit post. Please try again later.');
        }
    });
});
