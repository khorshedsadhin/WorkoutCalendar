document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const monthYearElement = document.getElementById('monthYear');
    const calendarDaysElement = document.getElementById('calendarDays');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const logModal = document.getElementById('logModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalDateElement = document.getElementById('modalDate');
    const workoutOptionsContainer = document.getElementById('workout-options');
    const saveBtn = document.getElementById('saveBtn');
    const removeBtn = document.getElementById('removeBtn');
    const monthlySummaryContainer = document.getElementById('monthlySummary');

    // App State
    let currentDate = new Date();
    let selectedDateString = '';
    let savedWorkouts = JSON.parse(localStorage.getItem('savedWorkouts')) || {};

    const WORKOUT_TYPES = {
        'Chest':     { color: 'var(--c-chest)' },
        'Back':      { color: 'var(--c-back)' },
        'Shoulders': { color: 'var(--c-shoulders)' },
        'Legs':      { color: 'var(--c-legs)' },
        'Forearm':   { color: 'var(--c-forearm)' },
        'Core':      { color: 'var(--c-core)' },
        'Cardio':    { color: 'var(--c-cardio)' },
    };

    const saveToLocalStorage = () => {
        localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
    };

    const renderCalendar = () => {
        calendarDaysElement.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const today = new Date();

        monthYearElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDayOfMonth; i++) {
            calendarDaysElement.appendChild(document.createElement('div')).classList.add('calendar-day', 'empty');
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('calendar-day');

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            dayCell.dataset.date = dateStr;

            if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                dayCell.classList.add('today');
            }

            dayCell.innerHTML = `<span class="date-number">${day}</span><div class="dots-container"></div>`;
            applyDayStyles(dayCell, dateStr);

            dayCell.addEventListener('click', () => openLogModal(dateStr, day));
            calendarDaysElement.appendChild(dayCell);
        }
        updateMonthlySummary();
    };

    const applyDayStyles = (dayCell, dateStr) => {
        const dotsContainer = dayCell.querySelector('.dots-container');
        dotsContainer.innerHTML = '';
        const workoutData = savedWorkouts[dateStr];

        if (workoutData && workoutData.length > 0) {
            workoutData.forEach(type => {
                if (WORKOUT_TYPES[type]) {
                    const dot = document.createElement('div');
                    dot.classList.add('dot');
                    dot.style.backgroundColor = WORKOUT_TYPES[type].color;
                    dotsContainer.appendChild(dot);
                }
            });
        }
    };

    const updateMonthlySummary = () => {
        monthlySummaryContainer.innerHTML = '';
        const summaryCounts = {};

        for (const type in WORKOUT_TYPES) {
            summaryCounts[type] = 0;
        }

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        for (const dateStr in savedWorkouts) {
            if (dateStr.startsWith(`${year}-${String(month).padStart(2, '0')}`)) {
                savedWorkouts[dateStr].forEach(type => {
                    if (summaryCounts[type] !== undefined) {
                        summaryCounts[type]++;
                    }
                });
            }
        }

        for (const type in WORKOUT_TYPES) {
            const item = document.createElement('div');
            item.classList.add('summary-item');
            item.innerHTML = `
                <div class="summary-item-name">
                    <div class="summary-item-dot" style="background-color: ${WORKOUT_TYPES[type].color};"></div>
                    <span>${type}</span>
                </div>
                <span class="summary-item-count">${summaryCounts[type]}</span>
            `;
            monthlySummaryContainer.appendChild(item);
        }
    };

    const openLogModal = (dateStr, day) => {
        selectedDateString = dateStr;
        const [year, month] = dateStr.split('-');
        const dateObj = new Date(year, month - 1, day);
        modalDateElement.textContent = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

        workoutOptionsContainer.innerHTML = '';
        const loggedWorkouts = savedWorkouts[dateStr] || [];

        for (const type in WORKOUT_TYPES) {
            const option = document.createElement('div');
            option.classList.add('option');
            option.dataset.type = type;
            if (loggedWorkouts.includes(type)) {
                option.classList.add('selected');
            }

            option.innerHTML = `
                <div class="option-dot" style="background-color: ${WORKOUT_TYPES[type].color};"></div>
                <span>${type}</span>
            `;

            option.addEventListener('click', () => {
                option.classList.toggle('selected');
            });
            workoutOptionsContainer.appendChild(option);
        }
        logModal.style.display = 'flex';
    };

    const closeModal = () => {
        logModal.style.display = 'none';
    };

    saveBtn.addEventListener('click', () => {
        const selectedOptions = workoutOptionsContainer.querySelectorAll('.option.selected');
        const selectedTypes = Array.from(selectedOptions).map(opt => opt.dataset.type);

        if (selectedTypes.length > 0) {
            savedWorkouts[selectedDateString] = selectedTypes;
        } else {
            delete savedWorkouts[selectedDateString];
        }

        saveToLocalStorage();
        const dayCell = document.querySelector(`.calendar-day[data-date='${selectedDateString}']`);
        if (dayCell) applyDayStyles(dayCell, selectedDateString);

        updateMonthlySummary();
        closeModal();
    });

    removeBtn.addEventListener('click', () => {
        delete savedWorkouts[selectedDateString];
        saveToLocalStorage();
        const dayCell = document.querySelector(`.calendar-day[data-date='${selectedDateString}']`);
        if (dayCell) applyDayStyles(dayCell, selectedDateString);
        updateMonthlySummary();
        closeModal();
    });

    // Event Listeners for navigation and closing modal
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => { if (event.target === logModal) closeModal(); });

    // Initial Load
    renderCalendar();
});
