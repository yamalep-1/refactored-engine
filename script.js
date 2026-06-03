document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const addNoteBtn = document.getElementById('add-note-btn');
    const modal = document.getElementById('note-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const notesGrid = document.getElementById('notes-grid');
    const emptyState = document.getElementById('empty-state');

    // Notes Array
    let notes = JSON.parse(localStorage.getItem('notesApp_data')) || [];

    // Initialize App
    function init() {
        renderNotes();
    }

    // Save notes to LocalStorage
    function saveNotes() {
        localStorage.setItem('notesApp_data', JSON.stringify(notes));
    }

    // Format Date
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }

    // Render all notes
    function renderNotes() {
        notesGrid.innerHTML = '';
        
        if (notes.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
            
            // Sort by newest first
            const sortedNotes = [...notes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            
            sortedNotes.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.classList.add('note-card', 'glass-effect');
                noteElement.dataset.id = note.id;
                
                noteElement.innerHTML = `
                    <div class="note-header">
                        <h3 class="note-title">${escapeHTML(note.title) || 'Без заголовка'}</h3>
                        <div class="note-actions">
                            <button class="icon-btn delete-btn" aria-label="Удалить заметку" onclick="deleteNote('${note.id}')">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                    <div class="note-content">${escapeHTML(note.content)}</div>
                    <div class="note-footer">
                        <span class="note-date">${formatDate(note.createdAt)}</span>
                    </div>
                `;
                
                notesGrid.appendChild(noteElement);
            });
        }
    }

    // Add new note
    function addNote() {
        const title = noteTitleInput.value.trim();
        const content = noteContentInput.value.trim();
        
        if (!title && !content) return;
        
        const newNote = {
            id: generateId(),
            title: title,
            content: content,
            createdAt: new Date().toISOString()
        };
        
        notes.push(newNote);
        saveNotes();
        renderNotes();
        closeModal();
    }

    // Delete note (exposing to global scope for inline onclick)
    window.deleteNote = function(id) {
        if (confirm('Вы уверены, что хотите удалить эту заметку?')) {
            notes = notes.filter(note => note.id !== id);
            saveNotes();
            
            // Adding a small fade out animation to the element before removing
            const noteCard = document.querySelector(`.note-card[data-id="${id}"]`);
            if (noteCard) {
                noteCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                noteCard.style.opacity = '0';
                noteCard.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    renderNotes();
                }, 300);
            } else {
                renderNotes();
            }
        }
    }

    // Utility: Generate ID
    function generateId() {
        return Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
    }

    // Utility: Escape HTML to prevent XSS
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Event Listeners
    addNoteBtn.addEventListener('click', () => {
        noteTitleInput.value = '';
        noteContentInput.value = '';
        modal.classList.remove('hidden');
        setTimeout(() => noteTitleInput.focus(), 100);
    });

    closeModalBtn.addEventListener('click', closeModal);
    
    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    saveNoteBtn.addEventListener('click', addNote);

    function closeModal() {
        modal.classList.add('hidden');
    }

    // Run
    init();
});
