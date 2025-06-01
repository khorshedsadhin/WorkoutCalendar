# Workout Calendar - Chrome Extension

A personal, browser-based workout calendar to help you track your fitness routines, view monthly progress, and stay motivated! This Chrome extension provides a sleek dark-themed interface to manage and log your workouts.

## Features

* **Interactive Calendar:** Easily view your workouts month by month.
* **Custom Workout Routines:**
    * Add new workout routines with custom names and assign a unique color to each.
    * Edit existing routine names and colors.
    * Delete routines you no longer need.
* **Daily Logging:** Click on any day in the calendar to select and log a workout you performed. The day will be colored according to the routine.
* **Monthly Statistics:** Get an overview of your activity for the current month, including:
    * Number of days each specific workout routine was performed.
    * Number of days with no workout entry.
* **Persistent Data:** Your workout routines and logged entries are saved locally in your browser using `localStorage`.
* **Dark Theme:** A modern, premium-looking dark interface.
* **Three-Column Layout:**
    * **Left Panel:** Manage your workout routines (add, edit, view list).
    * **Center Panel:** The main workout calendar.
    * **Right Panel:** Monthly statistics.
* **Easy Access:** Click the extension icon in your Chrome toolbar to open the Workout Calendar in a new tab (or focus it if it's already open).

## Installation (Sideloading for Development/Personal Use)

Since this extension isn't on the Chrome Web Store (yet!), you'll need to load it manually:

1.  **Download the Extension Files:**
    * Clone this repository or download it as a ZIP file and extract it to a folder on your computer (e.g., `WorkoutCalendarExtension`).
    * Ensure you have the following file structure:
        ```
        WorkoutCalendarExtension/
        ├── manifest.json
        ├── background.js
        ├── calendar.html
        ├── calendar.js  <-- Make sure your JS file is named this (or adjust if you used calender.js)
        └── icons/
            ├── icon16.png
            ├── icon48.png
            └── icon128.png
        ```

2.  **Open Chrome Extensions Page:**
    * Open Google Chrome.
    * Type `chrome://extensions` in the address bar and press Enter.

3.  **Enable Developer Mode:**
    * In the top-right corner of the Extensions page, turn on the **"Developer mode"** toggle.

4.  **Load the Extension:**
    * Click the **"Load unpacked"** button that appears.
    * Navigate to the `WorkoutCalendarExtension` folder you created/downloaded.
    * Select the folder and click "Select Folder" (or "Open").

5.  **Done!**
    * The "Workout Calendar" extension should now appear in your list of extensions.
    * You should see its icon in the Chrome toolbar (you might need to click the puzzle piece icon to find and pin it).

## How to Use

1.  **Open the Calendar:** Click the Workout Calendar extension icon in your Chrome toolbar. This will open the calendar in a new tab.
2.  **Manage Routines (Left Panel):**
    * **Add a new routine:** Enter a routine name, pick a color using the color picker, and click "Add Routine."
    * **View defined routines:** Your created routines will be listed below the form.
    * **Edit a routine:** Click the "✏️" (pencil) icon next to a routine. The form will populate with its details. Change the name/color and click "Update Routine." Click "Cancel Edit" to discard changes.
    * **Delete a routine:** Click the "🗑️" (trash) icon next to a routine. This will also remove its logged instances from the calendar.
3.  **Log a Workout (Center Panel):**
    * Navigate to the desired month using the "< Prev" and "Next >" buttons.
    * Click on a specific day in the calendar.
    * A modal (pop-up) will appear. Select the workout routine you performed from the dropdown.
    * Click "Save Workout." The day will be colored accordingly.
    * To remove a workout from a day, click the day, and in the modal, you can either select "-- Select Routine --" and "Save Workout," or click "Remove Workout."
4.  **View Statistics (Right Panel):**
    * The "Monthly Statistics" panel shows how many times each routine was logged in the currently displayed month, along with the number of days you didn't log any workout.
    * These stats update automatically as you log workouts or change months.

## Folder Structure

The extension is organized as follows:

* `manifest.json`: Defines the extension's properties, permissions, and behavior.
* `background.js`: Handles the logic for opening the calendar tab when the extension icon is clicked.
* `calendar.html`: The main HTML file that displays the calendar interface. Contains all the CSS.
* `calendar.js`: Contains all the JavaScript logic for the calendar's functionality, routine management, and statistics.
    *(**Note:** Ensure this filename matches the one linked in `calendar.html`)*.
* `icons/`: Contains the icons for the extension (16x16, 48x48, 128x128 pixels).

---

Enjoy tracking your workouts!
