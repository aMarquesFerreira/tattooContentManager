document.addEventListener("DOMContentLoaded", function() {
    console.log("Simple Page Loaded");

    // Mostrar as seções de comentários por padrão
    showCommentsSection();  // Esta função mostra ambas as seções de comentários
    
    fetchComments();
    fetchAcceptedComments();
    fetchImages();

    // Configurar navegação
    document.getElementById('comments-tab').addEventListener('click', function(e) {
        e.preventDefault();
        showCommentsSection();  // Mostrar ambas as seções de comentários
    });

    document.getElementById('images-tab').addEventListener('click', function(e) {
        e.preventDefault();
        showSection('images-section');  // Mostrar apenas a seção de fotografias
    });

    // Configurar upload de imagens
    const uploadForm = document.getElementById('upload-form');
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        uploadImage();
    });
});

// Função para mostrar ambas as seções de comentários
function showCommentsSection() {
    document.getElementById('comments-section').style.display = 'block';
    document.getElementById('accepted-comments-section').style.display = 'block';
    document.getElementById('images-section').style.display = 'none';
}

// Função para mostrar uma seção específica e esconder as outras
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = (section.id === sectionId) ? 'block' : 'none';
    });
}

// Funções existentes para comentários
function fetchComments() {
    fetch('https://tattoobackend.onrender.com/api/comments')
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
    fetch('https://tattoobackend.onrender.com/api/accepted-comments')
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
        rating.textContent = `${comment.rating} Estrelas`;
        
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
    fetch(`https://tattoobackend.onrender.com/api/accepted-comments/${commentId}`, {
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
        rating.textContent = `${comment.rating} Estrelas`;
        
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
    fetch('https://tattoobackend.onrender.com/api/accepted-comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(comment)
    })
    .then(response => {
        if (response.ok) {
            return fetch(`https://tattoobackend.onrender.com/api/comments/${comment.id}`, {
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
    fetch(`https://tattoobackend.onrender.com/api/comments/${commentId}`, {
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



// Funções para gerir imagens

function fetchImages() {
    fetch('http://localhost:8080/api/images')
        .then(response => response.json())
        .then(images => {
            console.log('Images fetched successfully', images);
            displayImages(images);
        })
        .catch(error => {
            console.error('Error fetching images', error);
        });
}

function displayImages(images) {
    const imageList = document.getElementById('image-list');
    imageList.innerHTML = ''; // Limpar a lista existente

    images.forEach(image => {
        const imageDiv = document.createElement('div');
        imageDiv.classList.add('image-item');
        
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = image.name;
        img.style.width = '200px'; // Ajuste conforme necessário
        img.style.cursor = 'pointer';

        // Adicionar evento de clique para substituir a imagem
        img.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';

            fileInput.addEventListener('change', function() {
                const file = fileInput.files[0];
                if (file) {
                    uploadNewImage(file, image.id);
                }
            });

            // Simular clique no input de arquivo
            fileInput.click();
        });

        const name = document.createElement('p');
        name.textContent = image.name;

        imageDiv.appendChild(img);
        imageDiv.appendChild(name);
        imageList.appendChild(imageDiv);
    });
}

function uploadNewImage(file, imageId) {
    const formData = new FormData();
    formData.append('image', file);

    fetch(`http://localhost:8080/api/images/${imageId}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Image replaced successfully');
            location.reload();
        } else {
            throw new Error('Failed to replace image');
        }
    })
    .catch(error => {
        console.error('Error replacing image:', error);
    });
}

function uploadImage() {
    const imageInput = document.getElementById('image-upload');
    const file = imageInput.files[0];
    if (!file) {
        alert('Por favor, selecione uma imagem para fazer upload.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    fetch('http://localhost:8080/api/images', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.ok) {
            console.log('Image uploaded successfully');
            location.reload();
        } else {
            throw new Error('Failed to upload image');
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
    });
}

function deleteImage(imageId) {
    if (confirm('Tem certeza que deseja apagar esta imagem?')) {
        fetch(`http://localhost:8080/api/images/${imageId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log('Image deleted successfully');
                location.reload();
            } else {
                throw new Error('Failed to delete image');
            }
        })
        .catch(error => {
            console.error('Error deleting image:', error);
        });
    }
}
