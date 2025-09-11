# FlowFit - Modern Workout Calendar ⚡

A beautiful, aesthetic single-page web application for tracking your workout routines with a modern calendar interface. Built with Tailwind CSS and DaisyUI for a sleek, responsive design with **9 stunning themes** including a unique **GitHub contribution graph style**.

## 🌐 Live Demo

**Try it now:** [https://workoutcalendar.pages.dev/](https://workoutcalendar.pages.dev/)

_Experience the full functionality without any installation - just click and start tracking your workouts!_

![FitTracker Screenshot](screenshot.png)

## ✨ Features

### 🎨 **9 Beautiful Themes Including GitHub Style**

Choose from professionally designed themes:

- **Light** - Clean, modern light theme
- **Dark** - Sleek dark theme for low-light environments
- **Cupcake** - Soft, pastel colors
- **Cyberpunk** - Neon, futuristic styling
- **Valentine** - Romantic pink tones
- **Aqua** - Cool blue color palette
- **Luxury** - Rich, elegant gold accents
- **Dracula** - Dark theme with purple highlights
- **🔥 GitHub** - **NEW!** Contribution graph style with 2-month view, rounded squares, and authentic GitHub green color levels

### 💪 **Advanced Routine Management**

- Create custom workout routines with personalized names and colors
- **7 Distinguishable Colors**: Blue, Green, Purple, Red, Amber, Cyan, Gray
- **Theme-aware color picker**: Shows GitHub green shades in GitHub theme while preserving original colors
- Edit existing routines with inline editing
- Delete routines with confirmation dialog
- **Example Routines**: Strength Training, Cardio Blast, Yoga Flow, HIIT Training, Stretching, Swimming, Rest Day

### 📅 **Dual Calendar Experience**

#### Standard Calendar View

- Monthly calendar view with smooth navigation
- Click any past or current date to log workouts
- **Visual workout indicators** with colored backgrounds and tooltips
- **Today's date highlighted** with animated ring
- Future dates disabled with warning alerts

#### 🆕 GitHub Contribution Calendar

- **Authentic 2-month side-by-side layout** mimicking GitHub's contribution graph
- **Rounded squares** with proper GitHub-style spacing
- **5 intensity levels** of green based on workout completion
- **Seamless design** with no borders between months
- **Larger desktop-optimized** interface for better usability
- **Proper navigation** through months while maintaining 2-month view

### 🔄 **Smart Workout Selection**

- **Enhanced Modal Interface** for workout selection
- **Currently selected workout displayed prominently** with visual indicators
- Easy switching between different workouts
- **Improved Clear functionality** with larger, more accessible button
- Color-coded options for easy identification
- **Future date protection** with consistent warning alerts across all themes

### 📊 **Workout Statistics**

- **Monthly workout count** - Track your consistency
- **Current streak** - See your consecutive workout days
- Real-time updates as you log workouts
- Visual progress indicators

### 💾 **Data Management**

- **Export functionality** - Download your data as JSON backup
- **Import functionality** - Restore from backup files with preview
- Import confirmation dialog showing routine and workout counts
- All data stored locally in browser (no internet required)
- Data persists between sessions

### 📱 **Modern Responsive Design**

- **Professional sidebar layout** on desktop
- **Collapsible mobile navigation** for smaller screens
- **Glass-morphism effects** and smooth animations
- **Lucide Icons** for consistent, modern iconography
- **Inter font** for professional typography

## 🛠 Technology Stack

- **HTML5** - Semantic markup structure
- **Tailwind CSS 3.4.1** - Utility-first CSS framework for responsive design
- **DaisyUI 4.12.10** - Component library with enhanced 9-theme system
- **JavaScript (ES6+)** - Vanilla JavaScript with modern class structure
- **Lucide Icons** - Beautiful, consistent icon set
- **Google Fonts (Inter)** - Professional typography
- **Local Storage API** - Client-side data persistence
- **Custom CSS Variables** - Advanced GitHub theme implementation

## 🚀 Getting Started

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser
3. **Choose your preferred theme** (try the new GitHub theme!)
4. **Start tracking** your workouts immediately!

No build process, dependencies, or server setup required - just open and use!

## 📖 Usage Guide

### Adding Workout Routines

1. Click the **"Add Routine"** button in the navigation or sidebar
2. Enter a descriptive routine name (e.g., "Morning Cardio")
3. Choose from **7 distinguishable colors** (automatically adapts to GitHub green shades in GitHub theme)
4. Click **"Save"** to add the routine

### Logging Workouts

1. Click on any **past or current date** on the calendar
2. **View current selection** if a workout is already logged
3. Select a different routine or click **"Clear Workout"** to remove
4. See immediate visual feedback on the calendar
5. **Future dates protected** - clicking shows warning toast in all themes

### Exploring the GitHub Theme

1. Click the **theme button** (🎨) in navigation
2. Select **"GitHub"** theme
3. Experience the **2-month contribution graph layout**
4. Navigate between months using the arrow buttons
5. See workout intensity in **authentic GitHub green levels**

### Managing Your Data

4. Click **"Save"** to add the routine

### Logging Workouts

1. Click on any **past or current date** on the calendar
2. **View current selection** if a workout is already logged
3. Select a different routine or click **"Clear Workout"** to remove
4. See immediate visual feedback on the calendar

### Managing Your Data

#### Export Data

- Click the **Export** button in navigation
- Download a timestamped JSON backup file
- Keep backups of your workout history

#### Import Data

- Click the **Import** button in navigation
- Select a previously exported JSON file
- Review the import preview before confirming
- All current data will be replaced

### Customizing Appearance

- Click the **theme button** (🎨) in the top navigation
- Choose from **9 beautiful themes** including the new GitHub contribution style
- Theme preference automatically saved and applies correctly on first load
- **GitHub theme features**:
  - 2-month side-by-side calendar view
  - Rounded contribution squares
  - Authentic GitHub green color intensity levels
  - Seamless month transitions with no borders
  - Desktop-optimized larger interface

## 🎯 Key Features in Detail

### Revolutionary GitHub Theme

- **Authentic contribution graph experience** inspired by GitHub's activity overview
- **Dual-month layout** showing current and previous month side-by-side
- **5 intensity levels** of green representing workout frequency/intensity
- **Rounded squares** with proper spacing for modern aesthetic
- **Borderless design** creating one unified calendar experience
- **Enhanced navigation** maintaining 2-month view while browsing
- **Theme-aware color mapping** preserving original routine colors

### Enhanced Workout Selection

- **Visual current selection** - See exactly what workout is logged
- **"Currently selected" indicator** with check mark
- **Easy switching** between different routines
- **Prominent clear button** for removing workouts
- **Consistent future date protection** across all themes with warning toasts

### Professional UI/UX

- **Sidebar layout** keeps routines organized and accessible
- **Toast notifications** provide immediate feedback for all actions
- **Smooth animations** and hover effects throughout
- **Consistent spacing** and visual hierarchy
- **Responsive design** adapting from desktop to mobile seamlessly
- **Glass-morphism effects** for modern visual appeal

### Data Safety

- **Local storage backup** ensures data persistence
- **Import/Export system** for data portability
- **Confirmation dialogs** prevent accidental deletions
- **Data validation** on import to prevent corruption

## 📱 Browser Compatibility

Works perfectly in all modern browsers supporting:

- ES6+ JavaScript (Classes, Arrow Functions, Template Literals)
- CSS Grid and Flexbox
- Local Storage API
- CSS Custom Properties (Variables)
- Modern DOM APIs

**Recommended browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

## 📁 Project Structure

```
WorkoutCalendar/
│
├── index.html          # Main application with modern HTML structure
├── script.js           # Complete JavaScript functionality
└── README.md          # Project documentation
```

## 🔧 Advanced Features

### Modern JavaScript Architecture

- **Class-based design** with FitTracker main class
- **Comprehensive error handling** and data validation
- **Modular functions** for easy maintenance and extension
- **Event-driven architecture** for responsive interactions

### Professional Design System

- **Consistent color palette** with 7 distinguishable routine colors
- **Typography hierarchy** using Inter font family
- **Spacing system** following design best practices
- **Accessibility considerations** with proper contrast and sizing

### Performance Optimizations

- **Vanilla JavaScript** for minimal overhead and fast loading
- **Efficient DOM manipulation** with targeted updates
- **Local storage optimization** for instant data access
- **CSS animations** using hardware acceleration

## 🎨 Customization Options

### Adding New Themes

The application uses DaisyUI's theme system. To add custom themes:

1. Follow DaisyUI's theme customization guide
2. Add new theme options to the theme dropdown in HTML
3. Themes automatically work with all components

### Extending Functionality

The modular design makes it easy to add features like:

- **Detailed workout tracking** (sets, reps, weight)
- **Progress photos** and measurements
- **Workout templates** and programs
- **Calendar integration** with external services
- **Social sharing** and progress reports

## 🤝 Contributing

This project welcomes contributions! Areas for improvement:

- Additional theme designs
- Enhanced statistics and analytics
- Mobile app companion
- Integration with fitness APIs
- Accessibility improvements

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for fitness enthusiasts who appreciate beautiful, functional web applications.**

_FlowFit - Where fitness meets aesthetic design ⚡✨_

```
WorkoutCalendar/
│
├── index.html          # Main HTML structure
├── styles.css          # Complete CSS with all themes
├── script.js           # JavaScript functionality
└── README.md          # This documentation
```

## Key Features Implementation

### Theme System

- CSS custom properties (variables) for easy theme switching
- Three distinct, professionally designed color palettes
- Smooth transitions between themes

### Data Management

- Object-oriented JavaScript design
- Comprehensive error handling
- Data validation and sanitization
- Backup and restore capabilities

### User Experience

- Intuitive interface design
- Helpful feedback messages
- Keyboard shortcuts (ESC to close modals)
- Responsive design for all devices

### Performance

- Vanilla JavaScript for minimal overhead
- Efficient DOM manipulation
- Local storage for instant data access
- Optimized for smooth animations

## Customization

### Adding New Themes

1. Add new CSS custom properties in the `:root` selector
2. Create a new `[data-theme="your-theme"]` selector
3. Add the theme option to the HTML select element

### Extending Functionality

The application is built with a modular class structure, making it easy to add new features like:

- Workout statistics
- Exercise details
- Import/export to different formats
- Integration with fitness APIs

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Created with ❤️ for fitness enthusiasts who love beautiful, functional web applications.**

_FlowFit - Where fitness meets aesthetic design ⚡✨_
