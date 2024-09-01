document.addEventListener("DOMContentLoaded", function() {
    console.log("Simple Page Loaded");
    fetchComments();
    fetchAcceptedComments()
});

function fetchComments() {
    fetch('http://localhost:8080/api/comments')
        .then(response => response.json())
        .then(comments => {
            console.log('Comments fetched successfully', comments);
            displayComments(comments);
        })
        .catch(error => {
            console.error('Error fetching comments', error);
        });
}

function fetchAcceptedComments() {
    fetch('http://localhost:8080/api/accepted-comments')
        .then(response => response.json())
        .then(comments => {
            console.log('Comments fetched successfully', comments);
            displayAcceptedComments(comments);
        })
        .catch(error => {
            console.error('Error fetching comments', error);
        });
}


function displayAcceptedComments(comments) {
    const section = document.querySelector('.accepted-comments');
    
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        
        const name = document.createElement('h3');
        name.textContent = comment.name;
        
        const rating = document.createElement('p');
        rating.textContent = `${comment.rating} Stars`;
        
        const description = document.createElement('p');
        description.textContent = comment.description;

        // Botão Apagar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Apagar';
        deleteButton.classList.add('decline'); // reutilizando a classe decline para o estilo vermelho
        deleteButton.addEventListener('click', () => deleteAcceptedComment(comment.id));
        
        commentDiv.appendChild(name);
        commentDiv.appendChild(rating);
        commentDiv.appendChild(description);
        commentDiv.appendChild(deleteButton);
        
        section.appendChild(commentDiv);
    });
}


function deleteAcceptedComment(commentId) {
    fetch(`http://localhost:8080/api/accepted-comments/${commentId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Accepted comment deleted successfully');
            location.reload();
        } else {
            throw new Error('Failed to delete accepted comment');
        }
    })
    .catch(error => {
        console.error('Error deleting accepted comment:', error);
    });
}




function displayComments(comments) {
    const section = document.querySelector('.comments');
    
    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        
        const name = document.createElement('h3');
        name.textContent = comment.name;
        
        const rating = document.createElement('p');
        rating.textContent = `${comment.rating} Stars`;
        
        const description = document.createElement('p');
        description.textContent = comment.description;
        
        // Botões de Aceitar e Não Aceitar
        const acceptButton = document.createElement('button');
        acceptButton.textContent = 'Aceitar';
        acceptButton.classList.add('accept');
        acceptButton.addEventListener('click', () => acceptComment(comment));
        
        const declineButton = document.createElement('button');
        declineButton.textContent = 'Não Aceitar';
        declineButton.classList.add('decline');
        declineButton.addEventListener('click', () => declineComment(comment.id));
        
        commentDiv.appendChild(name);
        commentDiv.appendChild(rating);
        commentDiv.appendChild(description);
        commentDiv.appendChild(acceptButton);
        commentDiv.appendChild(declineButton);
        
        section.appendChild(commentDiv);
    });
}

function acceptComment(comment) {
    fetch('http://localhost:8080/api/accepted-comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    })
    .then(response => {
        if (response.ok) {
            location.reload();
            return fetch(`http://localhost:8080/api/comments/${comment.id}`, {
                method: 'DELETE'
            });
        } else {
            throw new Error('Failed to accept comment');
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Comment accepted and deleted successfully');
            location.reload();
        } else {
            throw new Error('Failed to delete original comment');
        }
    })
    .catch(error => {
        console.error('Error processing comment:', error);
    });
}

function declineComment(commentId) {
    fetch(`http://localhost:8080/api/comments/${commentId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Comment declined and deleted successfully');
            location.reload();
        } else {
            throw new Error('Failed to delete comment');
        }
    })
    .catch(error => {
        console.error('Error declining comment:', error);
    });
}
