class FitTracker {
  constructor() {
    this.currentDate = new Date();
    this.selectedDate = null;
    this.routines = [];
    this.workouts = {};
    this.editingRoutineId = null;

    this.initializeApp();
  }

  initializeApp() {
    this.loadFromLocalStorage();
    this.setupEventListeners();
    this.renderCalendar();
    this.renderRoutines();
    this.updateStats();
    this.applyTheme();

    // Initialize with example routines if none exist
    if (this.routines.length === 0) {
      this.initializeExampleRoutines();
    }
  }

  initializeExampleRoutines() {
    const exampleRoutines = [
      { id: "strength", name: "💪 Strength Training", color: "#3b82f6" }, // Blue
      { id: "cardio", name: "🏃 Cardio Blast", color: "#10b981" }, // Green
      { id: "yoga", name: "🧘 Yoga Flow", color: "#8b5cf6" }, // Purple
      { id: "hiit", name: "🔥 HIIT Training", color: "#ef4444" }, // Red
      { id: "stretching", name: "🤸 Stretching", color: "#f59e0b" }, // Amber
      { id: "swimming", name: "🏊 Swimming", color: "#06b6d4" }, // Cyan
      { id: "rest", name: "😴 Rest Day", color: "#6b7280" }, // Gray
    ];

    this.routines = exampleRoutines;
    this.saveToLocalStorage();
    this.renderRoutines();
  }

  setupEventListeners() {
    // Calendar navigation
    document.getElementById("prev-month").addEventListener("click", () => {
      this.previousMonth();
    });

    document.getElementById("next-month").addEventListener("click", () => {
      this.nextMonth();
    });

    // Enter key for routine input
    document
      .getElementById("routine-name-input")
      .addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveRoutine();
        }
      });

    // Initialize color selection after DOM is ready
    setTimeout(() => {
      const defaultColorOption = document.querySelector(
        '.color-option[data-color="#3b82f6"]'
      );
      if (defaultColorOption) {
        defaultColorOption.classList.add("border-primary");
      }
    }, 100);
  }

  renderCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Update header
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    document.getElementById(
      "current-month-year"
    ).textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Get today's date for highlighting
    const today = new Date();
    const isCurrentMonth =
      today.getFullYear() === year && today.getMonth() === month;
    const todayDate = today.getDate();

    const calendarDays = document.getElementById("calendar-days");
    calendarDays.innerHTML = "";

    // Add previous month's trailing days
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const dayElement = this.createDayElement(day, true, year, month - 1);
      calendarDays.appendChild(dayElement);
    }

    // Add current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === todayDate;
      const dayElement = this.createDayElement(
        day,
        false,
        year,
        month,
        isToday
      );
      calendarDays.appendChild(dayElement);
    }

    // Add next month's leading days
    const totalCells = calendarDays.children.length;
    const remainingCells = 42 - totalCells;

    for (let day = 1; day <= remainingCells && remainingCells < 7; day++) {
      const dayElement = this.createDayElement(day, true, year, month + 1);
      calendarDays.appendChild(dayElement);
    }

    this.updateStats();
  }

  createDayElement(day, isOtherMonth, year, month, isToday = false) {
    const dayElement = document.createElement("div");
    dayElement.className =
      "calendar-day flex items-center justify-center rounded-xl cursor-pointer transition-all duration-200 text-sm font-medium border-2 border-transparent hover:border-primary/30 hover:scale-105 relative";
    dayElement.textContent = day;

    const date = new Date(year, month, day);
    const dateKey = this.getDateKey(date);
    const today = new Date();

    // Add classes based on state
    if (isOtherMonth) {
      dayElement.className +=
        " text-base-content/30 cursor-default hover:border-transparent hover:scale-100";
    }

    if (isToday) {
      dayElement.className +=
        " ring-2 ring-primary ring-offset-2 ring-offset-base-100 font-bold bg-primary/10 animate-bounce-subtle";
    }

    // Check if date is in the future
    const isFuture = date > today;
    if (isFuture && !isOtherMonth) {
      dayElement.className +=
        " text-base-content/40 cursor-not-allowed hover:border-transparent hover:scale-100";
    }

    // Check if date has a workout
    if (this.workouts[dateKey]) {
      const routine = this.routines.find(
        (r) => r.id === this.workouts[dateKey]
      );
      if (routine) {
        dayElement.style.backgroundColor = routine.color;
        dayElement.className +=
          " text-white font-bold shadow-lg hover:shadow-xl";
        dayElement.title = routine.name;

        // Add workout indicator
        const indicator = document.createElement("div");
        indicator.className = "workout-indicator";
        dayElement.appendChild(indicator);
      }
    } else if (!isOtherMonth) {
      dayElement.className += " bg-base-200 hover:bg-base-300";
    }

    // Add click event for current month days only
    if (!isOtherMonth) {
      dayElement.addEventListener("click", () => {
        if (isFuture) {
          this.showToast(
            "You can't log workouts for the future! ⏰",
            "warning"
          );
          return;
        }
        this.selectDate(date);
      });
    }

    return dayElement;
  }

  selectDate(date) {
    this.selectedDate = date;
    this.showWorkoutModal();
  }

  showWorkoutModal() {
    const modal = document.getElementById("workout-modal");
    const dateKey = this.getDateKey(this.selectedDate);
    const currentWorkout = this.workouts[dateKey];

    // Update selected date display
    const selectedDateElement = document.getElementById("selected-date");
    const dateStr = this.selectedDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    selectedDateElement.textContent = dateStr;

    // Render workout options
    this.renderWorkoutOptions();

    // Show/hide clear button
    const clearBtn = document.getElementById("clear-workout-btn");
    clearBtn.style.display = currentWorkout ? "block" : "none";

    // Show modal
    modal.showModal();
  }

  renderWorkoutOptions() {
    const container = document.getElementById("workout-options");
    const dateKey = this.getDateKey(this.selectedDate);
    const currentWorkout = this.workouts[dateKey];

    if (this.routines.length === 0) {
      container.innerHTML = `
        <div class="text-center p-6 text-base-content/60 bg-base-200 rounded-lg">
          <i data-lucide="dumbbell" class="w-8 h-8 mx-auto mb-2 opacity-50"></i>
          <p>No routines available. Please add a routine first.</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    // Show current selection if exists
    if (currentWorkout) {
      const selectedRoutine = this.routines.find(
        (r) => r.id === currentWorkout
      );
      if (selectedRoutine) {
        container.innerHTML =
          `
          <div class="bg-primary/10 border-2 border-primary rounded-xl p-4 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full shadow-sm" style="background-color: ${
                selectedRoutine.color
              }"></div>
              <div class="flex-1">
                <span class="font-medium text-primary">${this.escapeHtml(
                  selectedRoutine.name
                )}</span>
                <p class="text-xs text-primary/70">Currently selected</p>
              </div>
              <i data-lucide="check-circle" class="w-5 h-5 text-primary"></i>
            </div>
          </div>
          <div class="divider my-4">Or choose different workout</div>
        ` +
          this.routines
            .filter((routine) => routine.id !== currentWorkout)
            .map(
              (routine) => `
          <div class="group cursor-pointer transition-all duration-200 hover:scale-[1.02]" onclick="app.selectWorkout('${
            routine.id
          }')">
            <div class="bg-base-200 hover:bg-base-300 border border-base-300 hover:border-primary/50 rounded-xl p-4 hover:shadow-md">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full shadow-sm" style="background-color: ${
                  routine.color
                }"></div>
                <span class="font-medium flex-1">${this.escapeHtml(
                  routine.name
                )}</span>
                <i data-lucide="arrow-right" class="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"></i>
              </div>
            </div>
          </div>
        `
            )
            .join("");
      }
    } else {
      // No workout selected, show all options
      container.innerHTML = this.routines
        .map(
          (routine) => `
        <div class="group cursor-pointer transition-all duration-200 hover:scale-[1.02]" onclick="app.selectWorkout('${
          routine.id
        }')">
          <div class="bg-base-200 hover:bg-base-300 border border-base-300 hover:border-primary/50 rounded-xl p-4 hover:shadow-md">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full shadow-sm" style="background-color: ${
                routine.color
              }"></div>
              <span class="font-medium flex-1">${this.escapeHtml(
                routine.name
              )}</span>
              <i data-lucide="arrow-right" class="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity"></i>
            </div>
          </div>
        </div>
      `
        )
        .join("");
    }

    lucide.createIcons();
  }

  selectWorkout(routineId) {
    const dateKey = this.getDateKey(this.selectedDate);
    this.workouts[dateKey] = routineId;
    this.saveToLocalStorage();
    this.renderCalendar();
    this.closeWorkoutModal();

    const routine = this.routines.find((r) => r.id === routineId);
    this.showToast(`Workout "${routine.name}" logged! 🎉`, "success");
  }

  clearWorkout() {
    const dateKey = this.getDateKey(this.selectedDate);
    delete this.workouts[dateKey];
    this.saveToLocalStorage();
    this.renderCalendar();
    this.closeWorkoutModal();

    this.showToast("Workout cleared! ✨", "success");
  }

  closeWorkoutModal() {
    const modal = document.getElementById("workout-modal");
    modal.close();
    this.selectedDate = null;
  }

  renderRoutines() {
    const container = document.getElementById("routines-list");

    if (this.routines.length === 0) {
      container.innerHTML = `
        <div class="text-center p-6 text-base-content/60 bg-base-100 rounded-lg border-2 border-dashed border-base-300">
          <i data-lucide="dumbbell" class="w-8 h-8 mx-auto mb-3 opacity-50"></i>
          <p class="font-medium">No routines yet</p>
          <p class="text-xs">Add your first routine below!</p>
        </div>
      `;
      lucide.createIcons();
      return;
    }

    container.innerHTML = this.routines
      .map(
        (routine) => `
      <div class="group bg-base-100 rounded-lg border border-base-300 hover:border-primary/30 transition-all duration-200 hover:shadow-sm">
        <div class="p-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full shadow-sm" style="background-color: ${
                routine.color
              }"></div>
              <span class="font-medium text-sm">${this.escapeHtml(
                routine.name
              )}</span>
            </div>
            <div class="dropdown dropdown-end opacity-0 group-hover:opacity-100 transition-opacity">
              <div tabindex="0" role="button" class="btn btn-ghost btn-xs btn-circle">
                <i data-lucide="more-vertical" class="w-3 h-3"></i>
              </div>
              <ul tabindex="0" class="dropdown-content z-[1] menu p-1 shadow-lg bg-base-100 rounded-box w-32 border border-base-300">
                <li><a onclick="app.editRoutine('${
                  routine.id
                }')" class="text-xs py-2">
                  <i data-lucide="edit" class="w-3 h-3"></i> Edit
                </a></li>
                <li><a onclick="app.deleteRoutine('${
                  routine.id
                }')" class="text-xs py-2 text-error">
                  <i data-lucide="trash-2" class="w-3 h-3"></i> Delete
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    lucide.createIcons();
  }

  editRoutine(id) {
    const routine = this.routines.find((r) => r.id === id);
    if (!routine) return;

    this.editingRoutineId = id;
    document.getElementById("modal-title").textContent = "Edit Routine";
    document.getElementById("routine-name-input").value = routine.name;
    document.getElementById("selected-color").value = routine.color;

    // Update color selection UI
    document.querySelectorAll(".color-option").forEach((el) => {
      el.classList.remove("border-primary");
      if (el.dataset.color === routine.color) {
        el.classList.add("border-primary");
      }
    });

    // Show modal without resetting editingRoutineId
    document.getElementById("routine-modal").showModal();
  }

  deleteRoutine(id) {
    const routine = this.routines.find((r) => r.id === id);
    if (!routine) return;

    const deleteModal = document.getElementById("delete-modal");
    document.getElementById("confirm-delete-btn").onclick = () => {
      this.routines = this.routines.filter((r) => r.id !== id);

      Object.keys(this.workouts).forEach((date) => {
        if (this.workouts[date] === id) {
          delete this.workouts[date];
        }
      });

      this.saveToLocalStorage();
      this.renderRoutines();
      this.renderCalendar();
      deleteModal.close();

      this.showToast("Routine deleted! 🗑️", "success");
    };

    deleteModal.showModal();
  }

  updateStats() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Count workouts in current month
    let workoutsThisMonth = 0;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateKey = this.getDateKey(date);
      if (this.workouts[dateKey]) {
        workoutsThisMonth++;
      }
    }

    // Calculate current streak
    let streak = 0;
    const today = new Date();
    let checkDate = new Date(today);

    while (checkDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      const dateKey = this.getDateKey(checkDate);
      if (this.workouts[dateKey]) {
        streak++;
      } else if (checkDate < today) {
        break;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    document.getElementById("workouts-count").textContent = workoutsThisMonth;
    document.getElementById("streak-count").textContent = streak;
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.renderCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.renderCalendar();
  }

  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container");

    const toast = document.createElement("div");
    const alertClass =
      type === "success"
        ? "alert-success"
        : type === "error"
        ? "alert-error"
        : type === "warning"
        ? "alert-warning"
        : "alert-info";

    toast.className = `alert ${alertClass} shadow-lg mb-2 max-w-sm`;

    toast.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-sm">${message}</span>
      </div>
    `;

    toastContainer.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  applyTheme() {
    const savedTheme = localStorage.getItem("fittracker-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  getDateKey(date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  saveToLocalStorage() {
    const data = {
      routines: this.routines,
      workouts: this.workouts,
    };
    localStorage.setItem("fittracker-data", JSON.stringify(data));
  }

  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem("fittracker-data");
      if (data) {
        const parsed = JSON.parse(data);
        this.routines = parsed.routines || [];
        this.workouts = parsed.workouts || {};
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      this.routines = [];
      this.workouts = {};
    }
  }
}

// Global functions
function openRoutineModal() {
  app.editingRoutineId = null;
  document.getElementById("modal-title").textContent = "Add New Routine";
  document.getElementById("routine-name-input").value = "";
  document.getElementById("selected-color").value = "#3b82f6";

  // Reset color selection
  document.querySelectorAll(".color-option").forEach((el) => {
    el.classList.remove("border-primary");
  });
  document
    .querySelector('.color-option[data-color="#3b82f6"]')
    .classList.add("border-primary");

  document.getElementById("routine-modal").showModal();
}

function selectColor(color, element) {
  document.querySelectorAll(".color-option").forEach((el) => {
    el.classList.remove("border-primary");
  });
  element.classList.add("border-primary");
  document.getElementById("selected-color").value = color;
}

function saveRoutine() {
  const name = document.getElementById("routine-name-input").value.trim();
  const color = document.getElementById("selected-color").value;

  if (!name) {
    app.showToast("Please enter a routine name", "error");
    return;
  }

  if (app.editingRoutineId) {
    // Edit existing routine
    const routine = app.routines.find((r) => r.id === app.editingRoutineId);
    if (routine) {
      // Check for duplicate names (excluding current routine)
      if (
        app.routines.some(
          (r) =>
            r.id !== app.editingRoutineId &&
            r.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        app.showToast("A routine with this name already exists", "error");
        return;
      }

      routine.name = name;
      routine.color = color;
      app.showToast("Routine updated! ✨", "success");
    }
  } else {
    // Add new routine
    if (app.routines.some((r) => r.name.toLowerCase() === name.toLowerCase())) {
      app.showToast("A routine with this name already exists", "error");
      return;
    }

    const routine = {
      id: Date.now().toString(),
      name: name,
      color: color,
    };

    app.routines.push(routine);
    app.showToast("Routine added! 🎉", "success");
  }

  app.saveToLocalStorage();
  app.renderRoutines();
  app.renderCalendar();
  document.getElementById("routine-modal").close();
}

function changeTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("fittracker-theme", theme);
  app.showToast(`Theme changed to ${theme}! 🎨`, "success");
}

function exportData() {
  const data = {
    routines: app.routines,
    workouts: app.workouts,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `fittracker-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  app.showToast("Data exported! 💾", "success");
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);

        // Validate data structure
        if (!data.routines || !data.workouts) {
          app.showToast("Invalid backup file format!", "error");
          return;
        }

        // Show confirmation modal
        const importModal = document.getElementById("import-modal");
        document.getElementById("import-details").innerHTML = `
          <div class="space-y-2">
            <p><span class="font-semibold">Routines:</span> ${
              data.routines.length
            }</p>
            <p><span class="font-semibold">Workouts:</span> ${
              Object.keys(data.workouts).length
            }</p>
            <p><span class="font-semibold">Export Date:</span> ${
              data.exportDate
                ? new Date(data.exportDate).toLocaleDateString()
                : "Unknown"
            }</p>
          </div>
          <div class="alert alert-warning mt-4">
            <i data-lucide="alert-triangle" class="w-4 h-4"></i>
            <span class="text-sm">This will replace all current data!</span>
          </div>
        `;

        document.getElementById("confirm-import-btn").onclick = () => {
          app.routines = data.routines;
          app.workouts = data.workouts;
          app.saveToLocalStorage();
          app.renderRoutines();
          app.renderCalendar();
          app.updateStats();
          importModal.close();
          app.showToast("Data imported successfully! 🎉", "success");
        };

        lucide.createIcons();
        importModal.showModal();
      } catch (error) {
        app.showToast("Error reading backup file!", "error");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

// Initialize the application
let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new FitTracker();
});
