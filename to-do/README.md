# TaskFlow - Responsive To-Do List Web App

A modern, feature-rich to-do list application built with vanilla HTML, CSS, and JavaScript. TaskFlow helps you organize your tasks, track deadlines, and boost productivity with an intuitive user interface and powerful task management capabilities.

## 🌟 Features

### Authentication
- 🔐 **Secure Login** - User authentication with email/username and password
- 👁️ **Password Visibility Toggle** - Show/hide password functionality
- 💾 **Remember Me** - Option to save login credentials
- 🚪 **Logout** - Secure logout with confirmation
- ⚠️ **Error Handling** - Comprehensive error messages and validation
- ⏳ **Loading States** - Visual feedback during authentication
- ♿ **Accessibility** - Full keyboard navigation and screen reader support

### Core Functionality
- ✅ **Create Tasks** - Add tasks with titles, categories, and due dates
- 📝 **Edit Tasks** - Update task details anytime with the edit modal
- 🗑️ **Delete Tasks** - Remove tasks individually or clear all completed tasks at once
- ✓ **Mark Complete** - Toggle task completion status with a single click
- 💾 **Auto-Save** - All data persists using browser localStorage

### Task Organization
- 🏷️ **Categories** - Organize tasks by custom categories (Work, Personal, Shopping, etc.)
- 📅 **Due Dates** - Assign and track task deadlines
- ⏳ **Task Status** - Track active and completed tasks separately
- 🚨 **Overdue Alerts** - Visual indicators for tasks past their due date

### Filtering & Sorting
- 📂 **Filter by Status** - View All, Active, or Completed tasks
- 🏷️ **Filter by Category** - Display tasks for specific categories
- 📅 **Sort Options**:
  - Due Date (Nearest First)
  - Due Date (Latest First)
  - Recently Created

### User Experience
- 📊 **Statistics Dashboard** - View total, active, and overdue task counts
- 🎨 **Clean UI Design** - Modern, intuitive interface with smooth animations
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile devices
- 🌙 **Dark Mode Support** - Automatic dark mode detection based on system preferences
- 🔔 **Toast Notifications** - Real-time feedback for all actions
- 📭 **Empty States** - Helpful messages when no tasks exist
- ✔️ **Input Validation** - Real-time error messages and validation
- ⚡ **Smooth Animations** - Polished transitions and interactions

### Code Structure
- **AuthManager** - Handles user authentication and session management
- **StorageManager** - Handles all localStorage operations
- **TaskManager** - Business logic for filtering, sorting, and statistics
- **UIManager** - All UI rendering and event handling
- **LoginManager** - Login page functionality and validation

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required!

### Installation

1. **Clone or download** the project files
2. **Open in browser** - Simply open `index.html` in your web browser
3. **Start using** - Begin adding and managing your tasks!

### File Structure
```
to-do/
├── index.html      # Main HTML structure
├── login.html      # Login page
├── styles.css      # All styling and responsive design
├── login.css       # Login page specific styles
├── script.js       # Application logic and functionality
├── login.js        # Login page functionality
└── README.md       # Documentation (this file)
```

## 🔐 Authentication

TaskFlow includes a complete login system with the following features:

### Login Features
- **Email/Username Input** - Flexible login with email or username
- **Password Input** - Secure password field with show/hide toggle
- **Remember Me** - Option to save login credentials locally
- **Form Validation** - Real-time client-side validation with helpful error messages
- **Loading States** - Visual feedback during authentication attempts
- **Error Handling** - Clear error messages for failed login attempts
- **Success Redirect** - Automatic redirect to main app after successful login
- **Accessibility** - Full keyboard support and screen reader compatibility

### Integration Ready
The login system is designed to easily integrate with popular authentication services:

#### Firebase Authentication
```javascript
// In login.js, replace the authenticateUser method
async authenticateUser(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, message: this.getFirebaseErrorMessage(error.code) };
    }
}
```

#### Auth0 Integration
```javascript
// Configure Auth0 SDK and replace authenticateUser method
async authenticateUser(email, password) {
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const data = await response.json();
            return { success: true, user: data.user, token: data.token };
        } else {
            throw new Error('Authentication failed');
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}
```

#### Custom Backend
```javascript
// Replace authenticateUser with your API endpoint
async authenticateUser(email, password) {
    const response = await fetch('https://your-api.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
        const data = await response.json();
        return { success: true, user: data.user };
    } else {
        const error = await response.json();
        return { success: false, message: error.message };
    }
}
```

### Session Management
- **Automatic Redirects** - Unauthenticated users are redirected to login
- **Session Persistence** - Login state persists across browser sessions
- **Secure Logout** - Complete session cleanup on logout

## 📖 Usage Guide

### Adding a Task
1. Enter your task title in the "What needs to be done?" field
2. (Optional) Add a category to organize your task
3. (Optional) Set a due date for the task
4. Click "Add Task" or press Enter

### Managing Tasks
- **Complete Task**: Click the checkbox to mark a task as done
- **Edit Task**: Click the ✏️ Edit button to modify task details
- **Delete Task**: Click the 🗑️ Delete button to remove a task
- **Clear Completed**: Click "🗑️ Clear Completed" to remove all finished tasks

### Filtering Tasks
- Click filter buttons (All, Active, Completed) to view specific task statuses
- Click category buttons in the sidebar to view tasks by category
- Combine filters to narrow down your task list

### Sorting Tasks
- Use the "Sort By" dropdown in the sidebar
- Choose between due date options or recently created

## 🎨 Features Showcase

### Smart Date Formatting
- "Today" for today's date
- "Tomorrow" for tomorrow's date
- "Month Day" format for other dates
- Automatic detection of overdue tasks

### Overdue Task Indicators
- Red left border on overdue tasks
- "Overdue" label next to due date
- Pulsing animation on overdue indicator
- Special styling for overdue tasks

### Statistics Dashboard
- Real-time task counts
- Active task tracking
- Overdue task monitoring
- Visual counter badges on filter buttons

### Responsive Design
- **Desktop**: Full sidebar layout with multi-column grids
- **Tablet**: Responsive grid sidebar below content
- **Mobile**: Single column layout, touch-optimized buttons
- **Font Scaling**: Optimized text sizes for all screen sizes

## 💾 Data Persistence

All tasks and categories are automatically saved to browser localStorage. Your tasks will:
- Persist after page refresh
- Remain available until explicitly deleted
- Sync across multiple tabs of the same domain
- Store up to 5-10MB of data (depending on browser)

**Note**: Data is stored locally in your browser. Clearing browser data will delete your tasks.

## 🔒 Input Validation

The app includes comprehensive validation:
- Task titles must be between 1-200 characters
- Due dates cannot be set in the past
- Categories are trimmed of whitespace
- HTML input is escaped to prevent XSS attacks
- Real-time error messages guide users

## 🌐 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;      /* Main accent color */
    --secondary-color: #10b981;    /* Success color */
    --danger-color: #ef4444;       /* Delete/overdue color */
    --warning-color: #f59e0b;      /* Warning color */
    /* ... more variables */
}
```

### Customizing Categories
Categories are created dynamically based on user input. Add default categories by modifying the StorageManager initialization in `script.js`.

### Adjusting Responsive Breakpoints
Media queries in `styles.css` control responsive behavior:
- 1024px: Tablet layout
- 768px: Small tablet/large mobile
- 480px: Small mobile devices

## 🚀 Future Improvements

### Planned Features
- 🔐 **User Authentication** - Sign in with email/password or social accounts
- ☁️ **Cloud Sync** - Sync tasks across devices using Firebase or similar backend
- 🏷️ **Priority Levels** - Add High/Medium/Low priority indicators
- ⏰ **Notifications** - Browser notifications for upcoming and overdue tasks
- 🎯 **Recurring Tasks** - Create tasks that repeat daily, weekly, monthly
- 🏷️ **Tags** - Add multiple tags to tasks for better organization
- 🔍 **Advanced Search** - Search tasks by title, date, category, tags
- 🎨 **Theme Customization** - Choose from preset themes or custom colors
- 📊 **Analytics** - Productivity charts and task completion statistics
- 📤 **Export/Import** - Export tasks to CSV/JSON and import from files
- 🤝 **Collaboration** - Share task lists with others
- 🔔 **Smart Reminders** - Configurable notification timing
- 📱 **PWA Support** - Install as standalone app on mobile
- 🌍 **Multi-Language** - Support for multiple languages
- ♿ **Enhanced Accessibility** - ARIA labels, keyboard navigation guides

### Performance Enhancements
- Virtual scrolling for large task lists
- Debounced search and filtering
- Optional Service Worker for offline support
- Asset compression and optimization

### Developer Features
- Unit tests with Jest
- API documentation
- Component library for reusability
- TypeScript version for type safety
- Storybook integration for UI component showcase

## 🐛 Troubleshooting

### Tasks Not Saving
- **Check local storage**: Open browser DevTools → Application → Local Storage
- **Clear browser cache** and reload the page
- **Disable browser extensions** that might block storage
- **Check available storage space** on your device

### Tasks Not Showing
- Ensure JavaScript is enabled in your browser
- Clear browser cache and reload
- Open DevTools console for any error messages
- Try a different browser to rule out compatibility issues

### Dates Not Working Correctly
- Ensure your system date/time is correct
- Use the date picker for consistent formats
- Check that due dates are not in the past

## 📝 Code Documentation

### StorageManager Class
Handles all localStorage operations:
- `getTasks()` - Retrieve all tasks
- `saveTasks(tasks)` - Save tasks to storage
- `getCategories()` - Retrieve all categories
- `saveCategories(categories)` - Save categories
- `addTask(task)` - Create new task
- `updateTask(id, data)` - Modify existing task
- `deleteTask(id)` - Remove task
- `addCategory(category)` - Add new category

### TaskManager Class
Business logic and data processing:
- `getFilteredTasks()` - Get tasks based on current filters
- `sortTasks(tasks, option)` - Sort tasks by specified option
- `getStats()` - Calculate task statistics
- `getFilterCounts()` - Get filter button counts
- `isOverdue(task)` - Check if task is overdue
- `formatDate(dateString)` - Format dates for display

### UIManager Class
Handles all user interface operations:
- `render()` - Full page render
- `renderTasks()` - Render task list
- `renderCategories()` - Render category sidebar
- `handleAddTask(e)` - Process task creation
- `handleEditTask(e)` - Process task editing
- `handleDeleteTask(id)` - Delete task with confirmation
- `handleToggleComplete(id)` - Toggle task completion
- Event handling for all user interactions

## 📄 License

This project is open source and available under the MIT License. Feel free to use, modify, and distribute this project.

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 💬 Feedback

Have suggestions or found a bug? Feel free to open an issue or reach out with feedback. Your input helps improve TaskFlow!

## 🎯 Quick Tips

- 💡 Use categories to organize work, personal, and shopping tasks
- ⏰ Set due dates for important deadlines to stay on track
- 🔔 Check the statistics dashboard for productivity insights
- 📱 Use on mobile for on-the-go task management
- 🌙 Switch to dark mode in your system settings for comfortable viewing
- 🗑️ Regularly clear completed tasks to keep your list fresh

---

**TaskFlow** - Stay organized and productive! 📋✨

Built with ❤️ using vanilla HTML, CSS, and JavaScript
