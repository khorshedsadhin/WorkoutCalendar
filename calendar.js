const monthYearElement = document.getElementById('monthYear');
const calendarDaysElement = document.getElementById('calendarDays');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const routineModal = document.getElementById('routineModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalDateElement = document.getElementById('modalDate');
const routineSelect = document.getElementById('routineSelect');
const saveRoutineBtn = document.getElementById('saveRoutineBtn');
const removeRoutineBtn = document.getElementById('removeRoutineBtn');

const routinesPanel = document.getElementById('routinesPanel');
const addEditRoutineTitle = document.getElementById('addEditRoutineTitle');
const newRoutineNameInput = document.getElementById('newRoutineName');
const newRoutineColorInput = document.getElementById('newRoutineColor');
const addOrUpdateRoutineBtn = document.getElementById('addOrUpdateRoutineBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const definedRoutinesList = document.getElementById('definedRoutinesList');

const statsContent = document.getElementById('statsContent');

let currentDate = new Date();
let selectedDayElement = null;
let selectedDateString = '';
let editingRoutineIndex = -1;

// --- Utility Functions ---
function getContrastingTextColor(hexcolor) {
    if (!hexcolor) return 'var(--text-primary)';
    hexcolor = hexcolor.replace("#", "");
    if (hexcolor.length === 3) {
        hexcolor = hexcolor.split('').map(char => char + char).join('');
    }
    if (hexcolor.length !== 6) return 'var(--text-primary)';

    const r = parseInt(hexcolor.substr(0, 2), 16);
    const g = parseInt(hexcolor.substr(2, 2), 16);
    const b = parseInt(hexcolor.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
}

function checkIfToday(dateStr) {
    const today = new Date();
    const [year, month, day] = dateStr.split('-').map(Number);
    return year === today.getFullYear() && (month - 1) === today.getMonth() && day === today.getDate();
}

// --- Local Storage ---
let definedRoutines = JSON.parse(localStorage.getItem('definedRoutines')) || [
    { name: 'Rest Day', color: '#ffadad' },
    { name: 'Upper Body', color: '#ffd6a5' },
    { name: 'Lower Body', color: '#fdffb6' },
    { name: 'Full Body', color: '#caffbf' },
    { name: 'Cardio', color: '#9bf6ff' }
];
let savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || {};

function saveToLocalStorage() {
    localStorage.setItem('definedRoutines', JSON.stringify(definedRoutines));
    localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
}

// --- Routine Management UI ---
function populateRoutineSelect() {
    routineSelect.innerHTML = '<option value="">-- Select Routine --</option>';
    definedRoutines.forEach(routine => {
        const option = document.createElement('option');
        option.value = routine.name;
        option.textContent = routine.name;
        routineSelect.appendChild(option);
    });
}

function resetAddEditForm() {
    addEditRoutineTitle.textContent = "Manage Workout Routines";
    newRoutineNameInput.value = '';
    newRoutineColorInput.value = '#3498db';
    addOrUpdateRoutineBtn.textContent = 'Add Routine';
    editingRoutineIndex = -1;
    cancelEditBtn.style.display = 'none';
    newRoutineNameInput.focus();
}

function displayDefinedRoutines() {
    definedRoutinesList.innerHTML = '';
    if (definedRoutines.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'No routines defined yet.';
        li.style.textAlign = 'center';
        li.style.color = 'var(--text-secondary)';
        definedRoutinesList.appendChild(li);
        return;
    }

    definedRoutines.forEach((routine, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="routine-name-display">
                <span class="routine-color-indicator" style="background-color: ${routine.color};"></span>
                ${routine.name}
            </span>
            <span class="actions">
                <button class="edit-routine-btn" data-index="${index}" title="Edit routine">✏️</button>
                <button class="delete-routine-btn" data-index="${index}" title="Delete routine">🗑️</button>
            </span>
        `;
        li.querySelector('.edit-routine-btn').addEventListener('click', () => {
            editingRoutineIndex = index;
            const routineToEdit = definedRoutines[index];
            addEditRoutineTitle.textContent = "Edit Workout Routine";
            newRoutineNameInput.value = routineToEdit.name;
            newRoutineColorInput.value = routineToEdit.color;
            addOrUpdateRoutineBtn.textContent = 'Update Routine';
            cancelEditBtn.style.display = 'inline-block';
            newRoutineNameInput.focus();
            if (routinesPanel) routinesPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        li.querySelector('.delete-routine-btn').addEventListener('click', () => {
            const confirmDelete = confirm(`Are you sure you want to delete the routine "${routine.name}"? This will also remove its assignments from the calendar.`);
            if (confirmDelete) {
                const routineNameToDelete = definedRoutines[index].name;
                for (const dateKey in savedWorkouts) {
                    if (savedWorkouts[dateKey].name === routineNameToDelete) {
                        delete savedWorkouts[dateKey];
                    }
                }
                definedRoutines.splice(index, 1);
                if (editingRoutineIndex === index) {
                    resetAddEditForm();
                } else if (editingRoutineIndex > index) {
                    editingRoutineIndex--;
                }
                saveToLocalStorage();
                renderCalendar();
                populateRoutineSelect();
                displayDefinedRoutines();
                calculateAndDisplayStats();
            }
        });

        definedRoutinesList.appendChild(li);
    });
}

// --- Add/Edit Routine Logic ---
cancelEditBtn.addEventListener('click', resetAddEditForm);

addOrUpdateRoutineBtn.addEventListener('click', () => {
    const routineName = newRoutineNameInput.value.trim();
    const routineColor = newRoutineColorInput.value;

    if (routineName === "") {
        alert("Please enter a routine name.");
        newRoutineNameInput.focus();
        return;
    }

    if (editingRoutineIndex !== -1) {
        const originalRoutine = definedRoutines[editingRoutineIndex];
        const oldName = originalRoutine.name;

        if (
            routineName.toLowerCase() !== oldName.toLowerCase() &&
            definedRoutines.some((r, idx) => idx !== editingRoutineIndex && r.name.toLowerCase() === routineName.toLowerCase())
        ) {
            alert("Another routine with this name already exists.");
            newRoutineNameInput.focus();
            return;
        }

        definedRoutines[editingRoutineIndex] = { name: routineName, color: routineColor };
        if (routineName !== oldName) {
            for (const dateKey in savedWorkouts) {
                if (savedWorkouts[dateKey].name === oldName) {
                    savedWorkouts[dateKey].name = routineName;
                }
            }
        }
        alert("Routine updated successfully!");
    } else {
        if (definedRoutines.some(r => r.name.toLowerCase() === routineName.toLowerCase())) {
            alert("A routine with this name already exists.");
            newRoutineNameInput.focus();
            return;
        }
        definedRoutines.push({ name: routineName, color: routineColor });
        alert("Routine added successfully!");
    }

    saveToLocalStorage();
    populateRoutineSelect();
    displayDefinedRoutines();
    renderCalendar();
    calculateAndDisplayStats();
    resetAddEditForm();
});

// --- Statistics ---
function calculateAndDisplayStats() {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const stats = {};
    definedRoutines.forEach(r => { stats[r.name] = 0; });
    let daysWithEntriesThisMonth = 0;

    for (const dateKey in savedWorkouts) {
        const [year, monthDb] = dateKey.split('-').map(Number);
        if (year === currentYear && (monthDb - 1) === currentMonth) {
            const workout = savedWorkouts[dateKey];
            const routineDefinition = definedRoutines.find(r => r.name === workout.name);
            if (routineDefinition && stats[workout.name] !== undefined) {
                stats[workout.name]++;
            }
            daysWithEntriesThisMonth++;
        }
    }

    const daysInCurrentCalMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysNoEntry = daysInCurrentCalMonth - daysWithEntriesThisMonth;
    statsContent.innerHTML = '';

    if (definedRoutines.length === 0 && Object.keys(savedWorkouts).filter(dateKey => {
        const [year, monthDb] = dateKey.split('-').map(Number);
        return year === currentYear && (monthDb - 1) === currentMonth;
    }).length === 0) {
        statsContent.innerHTML = '<p>No routines defined and no workouts logged this month.</p>';
        return;
    }

    definedRoutines.forEach(routine => {
        const p = document.createElement('p');
        p.innerHTML = `
            <span class="routine-color-indicator" style="background-color: ${routine.color};"></span>
            ${routine.name}: <strong>${stats[routine.name] || 0} day(s)</strong>`;
        statsContent.appendChild(p);
    });

    const pNoEntry = document.createElement('p');
    pNoEntry.innerHTML = `Days with no entry: <strong>${daysNoEntry < 0 ? 0 : daysNoEntry}</strong>`;
    statsContent.appendChild(pNoEntry);
}

// --- Calendar Rendering & Day Styling ---
function renderCalendar() {
    calendarDaysElement.innerHTML = '';
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    monthYearElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyCell = document.createElement('div');
        emptyCell.classList.add('calendar-day', 'empty');
        calendarDaysElement.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('calendar-day');
        dayCell.textContent = day;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        dayCell.dataset.date = dateStr;
        applyDayStyles(dayCell, dateStr);

        dayCell.addEventListener('click', () => {
            selectedDayElement = dayCell;
            selectedDateString = dateStr;
            modalDateElement.textContent = `Workout for ${new Date(year, month, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;
            routineSelect.value = savedWorkouts[selectedDateString]?.name || "";
            routineModal.style.display = 'flex';
        });

        calendarDaysElement.appendChild(dayCell);
    }

    calculateAndDisplayStats();
}

function applyDayStyles(element, dateString) {
    element.style.backgroundColor = '';
    element.style.color = '';
    element.title = '';
    element.classList.remove('current-day');

    const workoutEntry = savedWorkouts[dateString];
    if (workoutEntry) {
        const routineDefinition = definedRoutines.find(r => r.name === workoutEntry.name);
        if (routineDefinition) {
            element.style.backgroundColor = routineDefinition.color;
            element.style.color = getContrastingTextColor(routineDefinition.color);
            element.title = routineDefinition.name;
        } else {
            element.style.color = 'var(--text-secondary)';
            element.title = `${workoutEntry.name} (Routine Deleted)`;
        }
    } else {
        element.style.color = 'var(--text-primary)';
    }

    if (checkIfToday(dateString)) {
        element.classList.add('current-day');
        if (!workoutEntry) {
            element.style.color = 'var(--text-primary)';
        }
    }
}

// --- Event Listeners ---
prevMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});
nextMonthBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});
closeModalBtn.addEventListener('click', () => {
    routineModal.style.display = 'none';
});
window.addEventListener('click', (event) => {
    if (event.target === routineModal) {
        routineModal.style.display = 'none';
    }
});

saveRoutineBtn.addEventListener('click', () => {
    const selectedRoutineName = routineSelect.value;
    const selectedRoutine = definedRoutines.find(r => r.name === selectedRoutineName);

    if (selectedDayElement && selectedRoutine) {
        savedWorkouts[selectedDateString] = { name: selectedRoutine.name };
    } else if (selectedDayElement && !selectedRoutineName) {
        delete savedWorkouts[selectedDateString];
    } else if (!selectedRoutine && selectedRoutineName !== "") {
        alert("An error occurred. Selected routine not found.");
        return;
    } else if (!selectedRoutineName && selectedDayElement) {
        delete savedWorkouts[selectedDateString];
    } else {
        alert("Please select a routine or close the dialog.");
        return;
    }

    if (selectedDayElement) {
        applyDayStyles(selectedDayElement, selectedDateString);
        saveToLocalStorage();
        calculateAndDisplayStats();
    }
    routineModal.style.display = 'none';
});

removeRoutineBtn.addEventListener('click', () => {
    if (selectedDayElement && savedWorkouts[selectedDateString]) {
        delete savedWorkouts[selectedDateString];
        applyDayStyles(selectedDayElement, selectedDateString);
        saveToLocalStorage();
        calculateAndDisplayStats();
    } else {
        alert("No workout to remove for this day.");
    }
    routineModal.style.display = 'none';
});

// --- Initial Setup ---
function initializeApp() {
    populateRoutineSelect();
    displayDefinedRoutines();
    renderCalendar();
}
initializeApp();
