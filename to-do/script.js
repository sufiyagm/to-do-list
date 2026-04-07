/* ===================================
   Authentication Manager
   =================================== */

class AuthManager {
    constructor() {
        this.authKey = 'taskflow_auth';
    }

    isAuthenticated() {
        try {
            const authData = localStorage.getItem(this.authKey);
            if (!authData) return false;

            const parsed = JSON.parse(authData);
            return parsed.isAuthenticated === true;
        } catch (error) {
            console.warn('Error checking authentication:', error);
            return false;
        }
    }

    logout() {
        try {
            localStorage.removeItem(this.authKey);
            localStorage.removeItem('taskflow_remember_email');
            window.location.href = 'login.html';
        } catch (error) {
            console.warn('Error during logout:', error);
        }
    }

    // Check authentication on page load
    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
}

// Initialize auth check
const authManager = new AuthManager();
authManager.checkAuth();

/* ===================================
   Storage Manager
   Local Storage Management & Persistence
   =================================== */

class StorageManager {
    constructor() {
        this.storageKey = 'taskflowTasks';
        this.categoriesKey = 'taskflowCategories';
    }

    // Get all tasks from localStorage
    getTasks() {
        try {
            const tasks = localStorage.getItem(this.storageKey);
            return tasks ? JSON.parse(tasks) : [];
        } catch (error) {
            console.error('Error reading tasks:', error);
            return [];
        }
    }

    // Save tasks to localStorage
    saveTasks(tasks) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    }

    // Get all categories from localStorage
    getCategories() {
        try {
            const categories = localStorage.getItem(this.categoriesKey);
            return categories ? JSON.parse(categories) : [];
        } catch (error) {
            console.error('Error reading categories:', error);
            return [];
        }
    }

    // Save categories to localStorage
    saveCategories(categories) {
        try {
            localStorage.setItem(this.categoriesKey, JSON.stringify(categories));
        } catch (error) {
            console.error('Error saving categories:', error);
        }
    }

    // Add a new task
    addTask(task) {
        const tasks = this.getTasks();
        task.id = Date.now().toString();
        task.createdAt = new Date().toISOString();
        tasks.push(task);
        this.saveTasks(tasks);
        return task;
    }

    // Update an existing task
    updateTask(id, updatedData) {
        const tasks = this.getTasks();
        const index = tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            tasks[index] = { ...tasks[index], ...updatedData };
            this.saveTasks(tasks);
            return tasks[index];
        }
        return null;
    }

    // Delete a task
    deleteTask(id) {
        const tasks = this.getTasks();
        const filteredTasks = tasks.filter(task => task.id !== id);
        this.saveTasks(filteredTasks);
    }

    // Add or update a category
    addCategory(category) {
        const categories = this.getCategories();
        if (!categories.includes(category)) {
            categories.push(category);
            this.saveCategories(categories);
        }
    }

    // Delete a category
    deleteCategory(category) {
        const categories = this.getCategories();
        const filtered = categories.filter(cat => cat !== category);
        this.saveCategories(filtered);
    }
}

/* ===================================
   Task Manager
   Business Logic for Tasks
   =================================== */

class TaskManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.currentFilter = 'all';
        this.currentCategory = null;
        this.currentSort = 'date-asc';
    }

    // Get filtered and sorted tasks
    getFilteredTasks() {
        let tasks = this.storage.getTasks();

        // Apply status filter
        if (this.currentFilter === 'active') {
            tasks = tasks.filter(task => !task.completed);
        } else if (this.currentFilter === 'completed') {
            tasks = tasks.filter(task => task.completed);
        }

        // Apply category filter
        if (this.currentCategory) {
            tasks = tasks.filter(task => task.category === this.currentCategory);
        }

        // Apply sorting
        tasks = this.sortTasks(tasks, this.currentSort);

        return tasks;
    }

    // Sort tasks based on sort option
    sortTasks(tasks, sortOption) {
        const tasksCopy = [...tasks];

        switch (sortOption) {
            case 'date-asc':
                return tasksCopy.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });

            case 'date-desc':
                return tasksCopy.sort((a, b) => {
                    if (!a.dueDate) return -1;
                    if (!b.dueDate) return 1;
                    return new Date(b.dueDate) - new Date(a.dueDate);
                });

            case 'created':
                return tasksCopy.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });

            default:
                return tasksCopy;
        }
    }

    // Get statistics
    getStats() {
        const allTasks = this.storage.getTasks();
        const activeTasks = allTasks.filter(task => !task.completed);
        const overdueTasks = activeTasks.filter(task => this.isOverdue(task));

        return {
            total: allTasks.length,
            active: activeTasks.length,
            completed: allTasks.filter(task => task.completed).length,
            overdue: overdueTasks.length,
        };
    }

    // Get filter counts
    getFilterCounts() {
        const allTasks = this.storage.getTasks();
        return {
            all: allTasks.length,
            active: allTasks.filter(task => !task.completed).length,
            completed: allTasks.filter(task => task.completed).length,
        };
    }

    // Check if task is overdue
    isOverdue(task) {
        if (!task.dueDate || task.completed) return false;
        return new Date(task.dueDate) < new Date().setHours(0, 0, 0, 0);
    }

    // Format date for display
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const tomorrowOnly = new Date(
            tomorrow.getFullYear(),
            tomorrow.getMonth(),
            tomorrow.getDate()
        );

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return 'Today';
        } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
            return 'Tomorrow';
        }

        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: dateOnly.getFullYear() !== todayOnly.getFullYear() ? 'numeric' : undefined,
        });
    }
}

/* ===================================
   UI Manager
   UI Rendering & User Interface
   =================================== */

class UIManager {
    constructor(taskManager) {
        this.taskManager = taskManager;
        this.editingTaskId = null;
        this.initElements();
        this.attachEventListeners();
    }

    // Initialize DOM elements
    initElements() {
        this.form = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.categoryInput = document.getElementById('categoryInput');
        this.dueDateInput = document.getElementById('dueDateInput');
        this.tasksList = document.getElementById('tasksList');
        this.emptyState = document.getElementById('emptyState');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.categoryList = document.getElementById('categoryList');
        this.sortSelect = document.getElementById('sortSelect');
        this.clearBtn = document.getElementById('clearBtn');
        this.toast = document.getElementById('toast');
        this.modal = document.getElementById('editModal');
        this.closeModalBtn = document.getElementById('closeModal');
        this.editForm = document.getElementById('editForm');
        this.editTaskInput = document.getElementById('editTaskInput');
        this.editCategoryInput = document.getElementById('editCategoryInput');
        this.editDueDateInput = document.getElementById('editDueDateInput');
        this.cancelEditBtn = document.getElementById('cancelEdit');
        this.statsTotal = document.getElementById('statTotal');
        this.statsActive = document.getElementById('statActive');
        this.statsOverdue = document.getElementById('statOverdue');
        this.tasksTitle = document.getElementById('tasksTitle');
        this.countAll = document.getElementById('count-all');
        this.countActive = document.getElementById('count-active');
        this.countCompleted = document.getElementById('count-completed');
        this.taskError = document.getElementById('taskError');
    }

    // Attach event listeners
    attachEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => this.handleAddTask(e));

        // Filter buttons
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // Sort select
        this.sortSelect.addEventListener('change', (e) => this.handleSort(e));

        // Category selection
        this.categoryList.addEventListener('click', (e) => this.handleCategoryFilter(e));

        // Clear completed
        this.clearBtn.addEventListener('click', () => this.handleClearCompleted());

        // Modal
        this.closeModalBtn.addEventListener('click', () => this.closeModal());
        this.cancelEditBtn.addEventListener('click', () => this.closeModal());
        this.editForm.addEventListener('submit', (e) => this.handleEditTask(e));
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        // Input validation
        this.taskInput.addEventListener('input', () => {
            this.clearError();
        });
    }

    // Validation
    validateTaskInput(title) {
        if (!title.trim()) {
            this.showError('Please enter a task title');
            return false;
        }
        if (title.trim().length > 200) {
            this.showError('Task title cannot exceed 200 characters');
            return false;
        }
        return true;
    }

    showError(message) {
        this.taskError.textContent = message;
        this.taskError.classList.add('show');
        this.taskInput.classList.add('error');
    }

    clearError() {
        this.taskError.classList.remove('show');
        this.taskInput.classList.remove('error');
    }

    // Handle task submission
    handleAddTask(e) {
        e.preventDefault();

        const title = this.taskInput.value.trim();
        if (!this.validateTaskInput(title)) return;

        const category = this.categoryInput.value.trim();
        const dueDate = this.dueDateInput.value;

        // Validate due date is not in the past
        if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
            this.showError('Due date cannot be in the past');
            return;
        }

        const newTask = {
            title,
            category: category || 'General',
            dueDate,
            completed: false,
        };

        this.taskManager.storage.addTask(newTask);

        // Add category if new
        if (category) {
            this.taskManager.storage.addCategory(category);
        }

        this.form.reset();
        this.clearError();
        this.showToast(`Task "${title}" added successfully`, 'success');
        this.render();
    }

    // Handle filter selection
    handleFilter(e) {
        const filterBtn = e.currentTarget;
        const filter = filterBtn.dataset.filter;

        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        filterBtn.classList.add('active');

        this.taskManager.currentFilter = filter;
        this.taskManager.currentCategory = null;

        // Remove active state from category buttons
        const categoryBtns = this.categoryList.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => btn.classList.remove('active'));

        const filterLabels = {
            all: 'All Tasks',
            active: 'Active Tasks',
            completed: 'Completed Tasks',
        };

        this.tasksTitle.textContent = filterLabels[filter];
        this.render();
    }

    // Handle category filter
    handleCategoryFilter(e) {
        if (!e.target.classList.contains('category-btn')) return;

        const categoryBtns = this.categoryList.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        this.taskManager.currentCategory = e.target.dataset.category;
        this.taskManager.currentFilter = 'all';

        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        const allBtn = Array.from(this.filterBtns).find(btn => btn.dataset.filter === 'all');
        if (allBtn) allBtn.classList.add('active');

        this.tasksTitle.textContent = `${e.target.textContent.trim()} Tasks`;
        this.render();
    }

    // Handle sort selection
    handleSort(e) {
        this.taskManager.currentSort = e.target.value;
        this.render();
    }

    // Handle task completion toggle
    handleToggleComplete(taskId) {
        const tasks = this.taskManager.storage.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            this.taskManager.storage.updateTask(taskId, { completed: !task.completed });
            this.showToast(
                `Task "${task.title}" ${!task.completed ? 'completed' : 'marked as active'}`,
                'success'
            );
            this.render();
        }
    }

    // Handle task deletion
    handleDeleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            const tasks = this.taskManager.storage.getTasks();
            const task = tasks.find(t => t.id === taskId);
            this.taskManager.storage.deleteTask(taskId);
            this.showToast(`Task "${task.title}" deleted`, 'success');
            this.render();
        }
    }

    // Handle task edit
    handleEditClick(taskId) {
        const tasks = this.taskManager.storage.getTasks();
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            this.editingTaskId = taskId;
            this.editTaskInput.value = task.title;
            this.editCategoryInput.value = task.category || '';
            this.editDueDateInput.value = task.dueDate || '';
            this.openModal();
        }
    }

    // Handle edit form submission
    handleEditTask(e) {
        e.preventDefault();

        const title = this.editTaskInput.value.trim();
        const category = this.editCategoryInput.value.trim();
        const dueDate = this.editDueDateInput.value;

        if (!title) {
            alert('Please enter a task title');
            return;
        }

        if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
            alert('Due date cannot be in the past');
            return;
        }

        this.taskManager.storage.updateTask(this.editingTaskId, {
            title,
            category: category || 'General',
            dueDate,
        });

        if (category) {
            this.taskManager.storage.addCategory(category);
        }

        this.showToast('Task updated successfully', 'success');
        this.closeModal();
        this.render();
    }

    // Handle clear completed tasks
    handleClearCompleted() {
        const tasks = this.taskManager.storage.getTasks();
        const completedCount = tasks.filter(t => t.completed).length;

        if (completedCount === 0) {
            this.showToast('No completed tasks to clear', 'error');
            return;
        }

        if (confirm(`Delete ${completedCount} completed task(s)?`)) {
            const activeTasks = tasks.filter(t => !t.completed);
            this.taskManager.storage.saveTasks(activeTasks);
            this.showToast(`Deleted ${completedCount} completed task(s)`, 'success');
            this.render();
        }
    }

    // Open modal
    openModal() {
        this.modal.classList.remove('hidden');
        document.body.classList.add('no-scroll');
    }

    // Close modal
    closeModal() {
        this.modal.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        this.editingTaskId = null;
        this.editForm.reset();
    }

    // Show toast notification
    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.classList.remove('hidden');

        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 3000);
    }

    // Render categories in sidebar
    renderCategories() {
        const categories = this.taskManager.storage.getCategories();
        this.categoryList.innerHTML = '';

        if (categories.length === 0) {
            this.categoryList.innerHTML = '<li style="color: var(--text-light); padding: 0.5rem; text-align: center; font-size: 0.875rem;">No categories yet</li>';
            return;
        }

        categories.forEach(category => {
            const li = document.createElement('li');
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.dataset.category = category;
            btn.innerHTML = `
                <span class="filter-icon">🏷️</span>
                <span>${category}</span>
            `;
            li.appendChild(btn);
            this.categoryList.appendChild(li);
        });
    }

    // Render tasks
    renderTasks() {
        const filteredTasks = this.taskManager.getFilteredTasks();
        this.tasksList.innerHTML = '';

        if (filteredTasks.length === 0) {
            this.emptyState.classList.add('show');
            this.tasksList.style.display = 'none';
            return;
        }

        this.emptyState.classList.remove('show');
        this.tasksList.style.display = 'flex';

        filteredTasks.forEach(task => {
            const li = document.createElement('li');
            const isOverdue = this.taskManager.isOverdue(task);

            li.className = 'task-item';
            if (task.completed) li.classList.add('completed');
            if (isOverdue) li.classList.add('overdue');

            const dueDate = this.taskManager.formatDate(task.dueDate);

            li.innerHTML = `
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? 'checked' : ''}
                    data-id="${task.id}"
                >
                <div class="task-content">
                    <div class="task-title">${this.escapeHtml(task.title)}</div>
                    <div class="task-meta">
                        ${
                            task.category
                                ? `<span class="task-category">🏷️ ${this.escapeHtml(task.category)}</span>`
                                : ''
                        }
                        ${
                            task.dueDate
                                ? `<span class="task-due ${isOverdue ? 'overdue' : ''}">
                                       <span class="due-icon">📅</span>
                                       ${dueDate}
                                       ${isOverdue ? '<strong> (Overdue)</strong>' : ''}
                                   </span>`
                                : ''
                        }
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn" title="Edit" data-id="${task.id}">✏️</button>
                    <button class="task-btn delete-btn" title="Delete" data-id="${task.id}">🗑️</button>
                </div>
            `;

            // Add event listeners
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => this.handleToggleComplete(task.id));

            const editBtn = li.querySelector('.edit-btn');
            editBtn.addEventListener('click', () => this.handleEditClick(task.id));

            const deleteBtn = li.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => this.handleDeleteTask(task.id));

            this.tasksList.appendChild(li);
        });
    }

    // Update statistics
    updateStats() {
        const stats = this.taskManager.getStats();
        const counts = this.taskManager.getFilterCounts();

        this.statsTotal.textContent = stats.total;
        this.statsActive.textContent = stats.active;
        this.statsOverdue.textContent = stats.overdue;

        this.countAll.textContent = counts.all;
        this.countActive.textContent = counts.active;
        this.countCompleted.textContent = counts.completed;

        // Update clear button state
        this.clearBtn.disabled = stats.completed === 0;
    }

    // Escape HTML to prevent XSS
    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // Full render
    render() {
        this.renderCategories();
        this.renderTasks();
        this.updateStats();
    }
}

/* ===================================
   Application Initialization
   =================================== */

document.addEventListener('DOMContentLoaded', () => {
    const storageManager = new StorageManager();
    const taskManager = new TaskManager(storageManager);
    const uiManager = new UIManager(taskManager);

    // Setup logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                authManager.logout();
            }
        });
    }

    // Initial render
    uiManager.render();

    // Expose for testing (optional)
    window.app = {
        storageManager,
        taskManager,
        uiManager,
        authManager,
    };
});
