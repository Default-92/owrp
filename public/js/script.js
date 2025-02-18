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
    console.log('Editing post:', post); // Debugging log
    document.getElementById('title').value = post.title;
    document.getElementById('date').value = post.date;
    document.getElementById('content').value = post.content;
    document.getElementById('color').value = post.color;

    const form = document.getElementById('blog-form');

    // Remove existing onsubmit event listener
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

        console.log('Updated post:', updatedPost); // Debugging log

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedPost)
            });

            if (!response.ok) throw new Error('Network response was not ok');

            // Update the post in the local array
            const postIndex = posts.findIndex(p => p.id === id);
            if (postIndex !== -1) {
                posts[postIndex] = updatedPost;
            }

            console.log('Posts after update:', posts); // Debugging log

            alert('Post updated successfully!');
            document.getElementById('blog-form').reset();
            displayPosts(); // Update the displayed posts
            createPaginationControls(); // Update pagination controls

            // Reset the form's onsubmit event to the default create functionality
            newForm.onsubmit = createPost;
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again later.');
        }
    };
}

async function createPost(event) {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const date = document.getElementById('date').value;
    const content = document.getElementById('content').value;
    const color = document.getElementById('color').value;

    const newId = posts.length ? Math.max(...posts.map(post => post.id)) + 1 : 1;

    const newPost = {
        id: newId,
        title,
        date,
        content,
        color
    };

    console.log('New post:', newPost); // Debugging log

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

        posts.push(newPost);

        console.log('Posts after adding new post:', posts); // Debugging log

        createPaginationControls();
        displayPosts();
    } catch (error) {
        console.error('Error submitting post:', error);
        alert('Failed to submit post. Please try again later.');
    }
}

// Set the default form submission to createPost
document.getElementById('blog-form').addEventListener('submit', createPost);



    async function deletePost(id) {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await fetch(`/api/posts/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Network response was not ok');

            // Remove the post from the local array
            posts = posts.filter(post => post.id !== id);

            alert('Post deleted successfully!');
            displayPosts(); // Update the displayed posts
            createPaginationControls(); // Update pagination controls
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

    // Generate a unique ID
    const newId = posts.length ? Math.max(...posts.map(post => post.id)) + 1 : 1;

    const newPost = {
        id: newId,
        title,
        date,
        content,
        color
    };

    console.log('New post:', newPost); // Debugging log

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

        console.log('Posts after adding new post:', posts); // Debugging log

        // Update pagination controls and display posts
        createPaginationControls();
        displayPosts();
    } catch (error) {
        console.error('Error submitting post:', error);
        alert('Failed to submit post. Please try again later.');
    }
  });
});