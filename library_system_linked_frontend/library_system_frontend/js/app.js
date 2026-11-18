/**
 * LibraryDesk - Library Management System
 * Shared JavaScript for Modals, Tables, Forms, and Search Filtering
 */

document.addEventListener('DOMContentLoaded', () => {
  initModals();
  initTableSearch();
  initEditButtons();
  initFormActions();
});

/**
 * Open a modal by ID or element
 * @param {string|HTMLElement} modalTarget
 */
function openModal(modalTarget) {
  const modal = typeof modalTarget === 'string' 
    ? document.getElementById(modalTarget.replace(/^#/, '')) 
    : modalTarget;

  if (!modal) return;

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  // Auto-focus first input in the modal if available
  const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea');
  if (firstInput) {
    setTimeout(() => firstInput.focus(), 120);
  }
}

/**
 * Close a modal by ID or element
 * @param {string|HTMLElement} modalTarget
 */
function closeModal(modalTarget) {
  const modal = typeof modalTarget === 'string' 
    ? document.getElementById(modalTarget.replace(/^#/, '')) 
    : modalTarget;

  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');

  // Check if any other modal is still open before restoring body scroll
  if (!document.querySelector('.modal-backdrop.active')) {
    document.body.style.overflow = '';
  }
}

/**
 * Close all open modals
 */
function closeAllModals() {
  document.querySelectorAll('.modal-backdrop.active').forEach((modal) => {
    closeModal(modal);
  });
}

/**
 * Initialize all modal triggers, close buttons, backdrop click, and Escape key
 */
function initModals() {
  // Trigger open by data-open-modal or data-modal-target attribute (except edit buttons handled separately)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-modal]:not(.btn-edit), [data-modal-target]:not(.btn-edit)');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal') || trigger.getAttribute('data-modal-target');
      openModal(modalId);
    }
  });

  // Trigger close by data-close-modal or .modal-close button
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('[data-close-modal], .modal-close');
    if (closeBtn) {
      e.preventDefault();
      const modal = closeBtn.closest('.modal-backdrop');
      if (modal) {
        closeModal(modal);
      }
    }
  });

  // Close when clicking directly on the backdrop (outside modal-card)
  document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal(backdrop);
      }
    });
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeAllModals();
    }
  });
}

/**
 * Handle Edit button clicks to prefill edit modals
 */
function initEditButtons() {
  document.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.btn-edit');
    if (!editBtn) return;

    e.preventDefault();
    const modalId = editBtn.getAttribute('data-open-modal') || editBtn.getAttribute('data-modal-target');
    const modal = document.getElementById(modalId?.replace(/^#/, ''));
    if (!modal) return;

    // Loop through dataset attributes on the button to prefill form fields
    for (const [key, val] of Object.entries(editBtn.dataset)) {
      if (key === 'openModal' || key === 'modalTarget') continue;
      
      // Look for input by id, name, or data-field
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const input = modal.querySelector(
        `#edit-${kebabKey}, [name="${key}"], [name="${kebabKey}"], [data-field="${key}"], [data-field="${kebabKey}"]`
      );

      if (input) {
        input.value = val;
      }
    }

    openModal(modal);
  });
}

/**
 * Initialize live search filtering on tables
 */
function initTableSearch() {
  const searchInputs = document.querySelectorAll('.toolbar .search, .topbar .top-search');
  searchInputs.forEach((input) => {
    input.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const table = document.querySelector('table');
      if (!table) return;

      const rows = table.querySelectorAll('tbody tr');
      rows.forEach((row) => {
        const text = row.textContent.toLowerCase();
        if (text.includes(query)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Form interaction feedback (demo feedback for create/update/delete)
 */
function initFormActions() {
  // Listen for delete button clicks
  document.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.btn-delete');
    if (deleteBtn) {
      e.preventDefault();
      const row = deleteBtn.closest('tr');
      const itemTitle = row ? (row.querySelector('strong')?.textContent || 'this record') : 'this record';
      
      if (confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
        if (row) {
          row.style.transition = 'all 0.3s ease';
          row.style.opacity = '0';
          row.style.transform = 'scale(0.95)';
          setTimeout(() => {
            row.remove();
            showToast(`"${itemTitle}" was deleted.`);
          }, 250);
        }
      }
    }
  });

  // Handle Save / Update button clicks inside modals
  document.addEventListener('click', (e) => {
    const saveBtn = e.target.closest('.btn-save');
    if (saveBtn) {
      e.preventDefault();
      const modal = saveBtn.closest('.modal-backdrop');
      const actionType = saveBtn.getAttribute('data-action') || 'Saved';
      
      if (modal) {
        closeModal(modal);
        showToast(`${actionType} successfully!`);
      }
    }
  });

  // Handle standard form submissions inside modals
  document.addEventListener('submit', (e) => {
    const form = e.target.closest('.modal-backdrop form');
    if (form) {
      e.preventDefault();
      const modal = form.closest('.modal-backdrop');
      if (modal) {
        closeModal(modal);
        showToast('Changes saved successfully!');
      }
    }
  });
}

/**
 * Simple Toast Notification helper
 * @param {string} message
 */
function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✓</span> <div>${message}</div>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Make functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.showToast = showToast;
