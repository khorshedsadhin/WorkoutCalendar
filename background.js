// background.js

// Function to open or focus the calendar tab
function openOrFocusCalendarTab() {
  const calendarUrl = chrome.runtime.getURL("calendar.html");

  // Query for existing calendar tabs
  chrome.tabs.query({ url: calendarUrl }, (tabs) => {
    if (tabs.length > 0) {
      // Calendar tab already exists, focus it
      const existingTab = tabs[0];
      chrome.tabs.update(existingTab.id, { active: true });
      // Optional: Also focus the window if it's not focused
      if (existingTab.windowId) {
        chrome.windows.update(existingTab.windowId, { focused: true });
      }
    } else {
      // No calendar tab exists, create a new one
      chrome.tabs.create({ url: calendarUrl });
    }
  });
}

// Listen for when the browser action (extension icon) is clicked
chrome.action.onClicked.addListener((tab) => {
  openOrFocusCalendarTab();
});
