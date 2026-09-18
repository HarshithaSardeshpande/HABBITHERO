// ==========================================
// HABITHERO - CLEAN WORKING JAVASCRIPT
// ==========================================

let profile = loadData("habitHeroProfile", null);
let habits = loadData("habitHeroHabits", []);
let medicines = loadData("habitHeroMedicines", []);


// ==========================================
// STORAGE
// ==========================================

function loadData(key, defaultValue) {
    try {
        const saved = localStorage.getItem(key);

        if (saved === null) {
            return defaultValue;
        }

        return JSON.parse(saved);

    } catch (error) {
        console.error("Could not load:", key, error);
        return defaultValue;
    }
}


function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// ==========================================
// DATE
// ==========================================

function formatDate(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getToday() {
    return formatDate(new Date());
}


function getTodayShortName() {

    const days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];

    return days[new Date().getDay()];
}


// ==========================================
// NAVIGATION
// ==========================================

function scrollToSection(id) {

    const element = document.getElementById(id);

    if (element) {
        element.scrollIntoView({
            behavior: "smooth"
        });
    }
}


// ==========================================
// PROFILE
// ==========================================

function openProfileForm() {

    const modal = document.getElementById("profileModal");

    if (!modal) {
        console.error("profileModal not found");
        return;
    }

    modal.style.display = "flex";

    if (profile) {

        document.getElementById("profileNameInput").value =
            profile.name || "";

        document.getElementById("profileAge").value =
            profile.age || "";

        document.getElementById("profileGender").value =
            profile.gender || "";

        document.getElementById("profileWeight").value =
            profile.weight || "";

        document.getElementById("profileHeight").value =
            profile.height || "";
    }
}


function closeProfileForm() {

    const modal = document.getElementById("profileModal");

    if (modal) {
        modal.style.display = "none";
    }
}


function saveProfile() {

    const name =
        document.getElementById("profileNameInput").value.trim();

    const age =
        document.getElementById("profileAge").value;

    const gender =
        document.getElementById("profileGender").value;

    const weight =
        document.getElementById("profileWeight").value;

    const height =
        document.getElementById("profileHeight").value;


    if (
        name === "" ||
        age === "" ||
        gender === "" ||
        weight === "" ||
        height === ""
    ) {

        alert("Please fill in all profile details.");
        return;
    }


    profile = {
        name: name,
        age: age,
        gender: gender,
        weight: weight,
        height: height
    };


    saveData(
        "habitHeroProfile",
        profile
    );


    updateProfileDisplay();

    closeProfileForm();

    alert("Profile saved successfully! 🎉");
}


function updateProfileDisplay() {

    const nameElement =
        document.getElementById("profileName");

    const detailsElement =
        document.getElementById("profileDetails");

    const welcomeElement =
        document.getElementById("welcomeText");


    if (!nameElement || !detailsElement || !welcomeElement) {
        return;
    }


    if (!profile) {

        nameElement.textContent = "Your Profile";

        detailsElement.textContent =
            "Create your profile to get started.";

        welcomeElement.textContent =
            "Welcome to HabitHero";

        return;
    }


    nameElement.textContent =
        profile.name;


    detailsElement.textContent =
        `${profile.age} years • ${profile.gender} • ${profile.weight} kg • ${profile.height} cm`;


    welcomeElement.textContent =
        `Welcome, ${profile.name}! 👋`;
}


// ==========================================
// HABIT FORM
// ==========================================

function openHabitForm() {

    if (!profile) {

        alert("Please create your profile first.");

        openProfileForm();

        return;
    }


    const modal =
        document.getElementById("habitModal");


    if (modal) {
        modal.style.display = "flex";
    }
}


function closeHabitForm() {

    const modal =
        document.getElementById("habitModal");


    if (modal) {
        modal.style.display = "none";
    }
}


// ==========================================
// ADD HABIT
// ==========================================

function addHabit() {

    const name =
        document.getElementById("habitName").value.trim();

    const category =
        document.getElementById("habitCategory").value;

    const goal =
        document.getElementById("habitGoal").value.trim();

    const time =
        document.getElementById("habitTime").value;


    const selectedDays =
        Array.from(
            document.querySelectorAll(".habit-day:checked")
        ).map(function (checkbox) {
            return checkbox.value;
        });


    if (name === "") {

        alert("Please enter a habit name.");

        return;
    }


    if (selectedDays.length === 0) {

        alert("Please select at least one day.");

        return;
    }


    const newHabit = {

        id: Date.now(),

        name: name,

        category: category,

        goal: goal,

        time: time,

        weeklyDays: selectedDays,

        createdDate: getToday(),

        completedDates: []

    };


    habits.push(newHabit);


    saveData(
        "habitHeroHabits",
        habits
    );


    clearHabitForm();

    closeHabitForm();

    renderHabits();

    updateDashboard();


    alert("Habit added successfully! ✅");
}


function clearHabitForm() {

    const nameInput =
        document.getElementById("habitName");

    const goalInput =
        document.getElementById("habitGoal");

    const timeInput =
        document.getElementById("habitTime");


    if (nameInput) {
        nameInput.value = "";
    }

    if (goalInput) {
        goalInput.value = "";
    }

    if (timeInput) {
        timeInput.value = "";
    }


    document
        .querySelectorAll(".habit-day")
        .forEach(function (checkbox) {
            checkbox.checked = false;
        });
}


// ==========================================
// HABIT ICON
// ==========================================

function getCategoryIcon(category) {

    if (category === "Health") {
        return "💪";
    }

    if (category === "Study") {
        return "📚";
    }

    if (category === "Fitness") {
        return "🏃";
    }

    return "🌟";
}


// ==========================================
// DISPLAY HABITS
// ==========================================

function renderHabits() {

    const list =
        document.getElementById("habitList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    const today =
        getToday();

    const todayName =
        getTodayShortName();


    const todaysHabits =
        habits.filter(function (habit) {

            const days =
                Array.isArray(habit.weeklyDays) &&
                habit.weeklyDays.length > 0
                    ? habit.weeklyDays
                    : [
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                        "Sun"
                    ];


            return days.includes(todayName);

        });


    if (todaysHabits.length === 0) {

        list.innerHTML = `
            <div class="empty-box">
                <p>No habits scheduled for today.</p>
                <p>Add a habit to start your routine! 🌟</p>
            </div>
        `;

        return;
    }


    todaysHabits.forEach(function (habit) {

        if (!Array.isArray(habit.completedDates)) {
            habit.completedDates = [];
        }


        const completed =
            habit.completedDates.includes(today);


        const card =
            document.createElement("div");


        card.className =
            completed
                ? "habit-card completed-habit"
                : "habit-card";


        const days =
            Array.isArray(habit.weeklyDays)
                ? habit.weeklyDays.join(" • ")
                : "Every day";


        card.innerHTML = `

            <div class="habit-info">

                <div class="habit-icon">
                    ${getCategoryIcon(habit.category)}
                </div>


                <div>

                    <h3>
                        ${escapeHTML(habit.name)}
                    </h3>


                    <p>
                        ${escapeHTML(habit.category)}

                        ${
                            habit.goal
                                ? " • Goal: " +
                                  escapeHTML(habit.goal)
                                : ""
                        }

                        ${
                            habit.time
                                ? " • ⏰ " +
                                  habit.time
                                : ""
                        }
                    </p>


                    <small class="habit-days">
                        📅 ${days}
                    </small>

                </div>

            </div>


            <button
                class="complete-btn"
                onclick="completeHabit(${habit.id})"
            >
                ${
                    completed
                        ? "✅ Completed"
                        : "Mark Complete"
                }
            </button>

        `;


        list.appendChild(card);

    });
}


// ==========================================
// COMPLETE HABIT
// ==========================================

function completeHabit(id) {

    const habit =
        habits.find(function (item) {
            return item.id === id;
        });


    if (!habit) {
        return;
    }


    if (!Array.isArray(habit.completedDates)) {
        habit.completedDates = [];
    }


    const today =
        getToday();


    const index =
        habit.completedDates.indexOf(today);


    if (index === -1) {

        habit.completedDates.push(today);

    } else {

        habit.completedDates.splice(index, 1);

    }


    saveData(
        "habitHeroHabits",
        habits
    );


    renderHabits();

    updateDashboard();
}


// ==========================================
// MEDICINE FORM
// ==========================================

function openMedicineForm() {

    const modal =
        document.getElementById("medicineModal");


    if (modal) {
        modal.style.display = "flex";
    }
}


function closeMedicineForm() {

    const modal =
        document.getElementById("medicineModal");


    if (modal) {
        modal.style.display = "none";
    }
}


// ==========================================
// ADD MEDICINE
// ==========================================

function addMedicine() {

    const name =
        document.getElementById("medicineName").value.trim();

    const frequency =
        document.getElementById("medicineFrequency").value;

    const time =
        document.getElementById("medicineTime").value;

    const notes =
        document.getElementById("medicineNotes").value.trim();


    if (name === "") {

        alert("Please enter the medicine name.");

        return;
    }


    const newMedicine = {

        id: Date.now(),

        name: name,

        frequency: frequency,

        time: time,

        notes: notes,

        takenDates: []

    };


    medicines.push(newMedicine);


    saveData(
        "habitHeroMedicines",
        medicines
    );


    clearMedicineForm();

    closeMedicineForm();

    renderMedicines();

    updateDashboard();


    alert("Medicine added successfully! 💊");
}


function clearMedicineForm() {

    document.getElementById(
        "medicineName"
    ).value = "";

    document.getElementById(
        "medicineTime"
    ).value = "";

    document.getElementById(
        "medicineNotes"
    ).value = "";
}


// ==========================================
// DISPLAY MEDICINES
// ==========================================

function renderMedicines() {

    const list =
        document.getElementById("medicineList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    if (medicines.length === 0) {

        list.innerHTML = `
            <div class="empty-box">
                <p>No medicines added.</p>
                <p>Add your scheduled medicines here. 💊</p>
            </div>
        `;

        return;
    }


    const today =
        getToday();


    medicines.forEach(function (medicine) {

        if (!Array.isArray(medicine.takenDates)) {
            medicine.takenDates = [];
        }


        const taken =
            medicine.takenDates.includes(today);


        const card =
            document.createElement("div");


        card.className =
            taken
                ? "medicine-card medicine-taken"
                : "medicine-card";


        card.innerHTML = `

            <div class="medicine-info">

                <div class="medicine-icon">
                    💊
                </div>


                <div>

                    <h3>
                        ${escapeHTML(medicine.name)}
                    </h3>


                    <p>

                        ${escapeHTML(medicine.frequency)}

                        ${
                            medicine.time
                                ? " • ⏰ " +
                                  medicine.time
                                : ""
                        }

                    </p>


                    ${
                        medicine.notes
                            ? `
                                <small>
                                    ${escapeHTML(medicine.notes)}
                                </small>
                              `
                            : ""
                    }

                </div>

            </div>


            <button
                class="medicine-btn"
                onclick="toggleMedicine(${medicine.id})"
            >
                ${
                    taken
                        ? "✅ Taken"
                        : "Mark Taken"
                }
            </button>

        `;


        list.appendChild(card);

    });
}


// ==========================================
// TOGGLE MEDICINE
// ==========================================

function toggleMedicine(id) {

    const medicine =
        medicines.find(function (item) {
            return item.id === id;
        });


    if (!medicine) {
        return;
    }


    if (!Array.isArray(medicine.takenDates)) {
        medicine.takenDates = [];
    }


    const today =
        getToday();


    const index =
        medicine.takenDates.indexOf(today);


    if (index === -1) {

        medicine.takenDates.push(today);

    } else {

        medicine.takenDates.splice(index, 1);

    }


    saveData(
        "habitHeroMedicines",
        medicines
    );


    renderMedicines();

    updateDashboard();
}


// ==========================================
// DASHBOARD
// ==========================================

function updateDashboard() {

    const today =
        getToday();


    let completed =
        0;


    habits.forEach(function (habit) {

        if (!Array.isArray(habit.completedDates)) {
            habit.completedDates = [];
        }


        if (
            habit.completedDates.includes(today)
        ) {

            completed++;

        }

    });


    const progress =
        document.getElementById("progressValue");


    if (progress) {

        progress.textContent =
            `${completed} / ${habits.length}`;

    }


    let taken =
        0;


    medicines.forEach(function (medicine) {

        if (!Array.isArray(medicine.takenDates)) {
            medicine.takenDates = [];
        }


        if (
            medicine.takenDates.includes(today)
        ) {

            taken++;

        }

    });


    const medicineProgress =
        document.getElementById(
            "medicineProgressValue"
        );


    if (medicineProgress) {

        medicineProgress.textContent =
            `${taken} / ${medicines.length}`;

    }


    const streak =
        calculateStreak();


    const streakElement =
        document.getElementById(
            "streakValue"
        );


    if (streakElement) {

        streakElement.textContent =
            `${streak} Day${streak === 1 ? "" : "s"}`;

    }


    const consistency =
        calculateConsistency();


    const consistencyElement =
        document.getElementById(
            "consistencyValue"
        );


    if (consistencyElement) {

        consistencyElement.textContent =
            `${consistency}%`;

    }
}


// ==========================================
// STREAK
// ==========================================

function calculateStreak() {

    if (habits.length === 0) {
        return 0;
    }


    let streak = 0;

    const date =
        new Date();


    for (let i = 0; i < 365; i++) {

        const dayNameList = [
            "Sun",
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat"
        ];


        const dayName =
            dayNameList[date.getDay()];


        const dateKey =
            formatDate(date);


        const scheduledHabits =
            habits.filter(function (habit) {

                const days =
                    Array.isArray(habit.weeklyDays) &&
                    habit.weeklyDays.length > 0
                        ? habit.weeklyDays
                        : [
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun"
                        ];


                return days.includes(dayName);

            });


        if (scheduledHabits.length === 0) {

            date.setDate(
                date.getDate() - 1
            );

            continue;
        }


        let allCompleted = true;


        scheduledHabits.forEach(function (habit) {

            if (!Array.isArray(habit.completedDates)) {
                habit.completedDates = [];
            }


            if (
                !habit.completedDates.includes(
                    dateKey
                )
            ) {

                allCompleted = false;

            }

        });


        if (!allCompleted) {
            break;
        }


        streak++;


        date.setDate(
            date.getDate() - 1
        );

    }


    return streak;
}


// ==========================================
// 7-DAY CONSISTENCY
// ==========================================

function calculateConsistency() {

    if (habits.length === 0) {
        return 0;
    }


    const dayNames = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ];


    const today =
        new Date();


    let possible = 0;

    let completed = 0;


    habits.forEach(function (habit) {

        const days =
            Array.isArray(habit.weeklyDays) &&
            habit.weeklyDays.length > 0
                ? habit.weeklyDays
                : [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ];


        if (!Array.isArray(habit.completedDates)) {
            habit.completedDates = [];
        }


        for (let i = 0; i < 7; i++) {

            const checkDate =
                new Date(today);


            checkDate.setDate(
                today.getDate() - i
            );


            const dateKey =
                formatDate(checkDate);


            const dayName =
                dayNames[checkDate.getDay()];


            if (!days.includes(dayName)) {
                continue;
            }


            if (
                habit.createdDate &&
                dateKey < habit.createdDate
            ) {

                continue;
            }


            possible++;


            if (
                habit.completedDates.includes(
                    dateKey
                )
            ) {

                completed++;

            }

        }

    });


    if (possible === 0) {
        return 0;
    }


    return Math.round(
        (completed / possible) * 100
    );
}


// ==========================================
// NOTIFICATIONS
// ==========================================

function requestNotifications() {

    if (!("Notification" in window)) {

        showReminder(
            "Your browser does not support notifications.",
            "🔔 Notifications"
        );

        return;
    }


    Notification.requestPermission()
        .then(function (permission) {

            updateNotificationButton();


            if (permission === "granted") {

                showReminder(
                    "Notifications are enabled successfully.",
                    "✅ Notifications Enabled"
                );

            } else {

                showReminder(
                    "Notification permission was not enabled.",
                    "⚠️ Notifications"
                );

            }

        })
        .catch(function (error) {

            console.error(error);

            showReminder(
                "Could not enable notifications.",
                "⚠️ Notifications"
            );

        });
}


function updateNotificationButton() {

    const button =
        document.getElementById(
            "notificationButton"
        );


    if (!button) {
        return;
    }


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        button.textContent =
            "✅ Notifications Enabled";

    } else {

        button.textContent =
            "🔔 Enable Notifications";

    }
}


// ==========================================
// REMINDERS
// ==========================================

function showReminder(message, title) {

    const area =
        document.getElementById("reminderArea");


    if (!area) {
        return;
    }


    area.innerHTML = `

        <div class="reminder-box">

            <div class="reminder-content">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>

            <button
                class="dismiss-btn"
                onclick="dismissReminder()"
            >
                Dismiss
            </button>

        </div>

    `;
}


function dismissReminder() {

    const area =
        document.getElementById("reminderArea");


    if (area) {
        area.innerHTML = "";
    }
}


function testReminder() {

    showReminder(
        "This is a demo reminder from HabitHero.",
        "🧪 Test Reminder"
    );


    if (
        "Notification" in window &&
        Notification.permission === "granted"
    ) {

        new Notification(
            "HabitHero Test Reminder",
            {
                body:
                    "This is a demo reminder from HabitHero."
            }
        );

    }
}


// ==========================================
// REAL REMINDERS
// ==========================================

function checkReminders() {

    const now =
        new Date();


    const currentTime =
        String(now.getHours()).padStart(2, "0") +
        ":" +
        String(now.getMinutes()).padStart(2, "0");


    const today =
        getToday();


    const todayName =
        getTodayShortName();


    habits.forEach(function (habit) {

        const days =
            Array.isArray(habit.weeklyDays) &&
            habit.weeklyDays.length > 0
                ? habit.weeklyDays
                : [
                    "Mon",
                    "Tue",
                    "Wed",
                    "Thu",
                    "Fri",
                    "Sat",
                    "Sun"
                ];


        if (!days.includes(todayName)) {
            return;
        }


        if (!habit.time) {
            return;
        }


        if (!Array.isArray(habit.completedDates)) {
            habit.completedDates = [];
        }


        if (
            habit.time === currentTime &&
            !habit.completedDates.includes(today)
        ) {

            const key =
                `habitHeroHabitReminder_${habit.id}_${today}_${habit.time}`;


            if (!localStorage.getItem(key)) {

                showReminder(
                    `It's time for "${habit.name}".`,
                    "⏰ Habit Reminder"
                );


                if (
                    "Notification" in window &&
                    Notification.permission === "granted"
                ) {

                    new Notification(
                        "HabitHero Habit Reminder",
                        {
                            body:
                                `It's time for "${habit.name}".`
                        }
                    );

                }


                localStorage.setItem(
                    key,
                    "shown"
                );

            }

        }

    });


    medicines.forEach(function (medicine) {

        if (!medicine.time) {
            return;
        }


        if (!Array.isArray(medicine.takenDates)) {
            medicine.takenDates = [];
        }


        if (
            medicine.time === currentTime &&
            !medicine.takenDates.includes(today)
        ) {

            const key =
                `habitHeroMedicineReminder_${medicine.id}_${today}_${medicine.time}`;


            if (!localStorage.getItem(key)) {

                showReminder(
                    `It's time for your scheduled medicine: "${medicine.name}".`,
                    "💊 Medicine Reminder"
                );


                if (
                    "Notification" in window &&
                    Notification.permission === "granted"
                ) {

                    new Notification(
                        "HabitHero Medicine Reminder",
                        {
                            body:
                                `It's time for your scheduled medicine: "${medicine.name}".`
                        }
                    );

                }


                localStorage.setItem(
                    key,
                    "shown"
                );

            }

        }

    });

}


// ==========================================
// CLEAR DATA
// ==========================================

function clearSavedData() {

    const confirmed =
        confirm(
            "Clear your profile, habits, medicines and progress?"
        );


    if (!confirmed) {
        return;
    }


    localStorage.clear();


    profile = null;

    habits = [];

    medicines = [];


    alert(
        "All HabitHero data has been cleared."
    );


    location.reload();
}


// ==========================================
// SAFETY FOR USER TEXT
// ==========================================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ==========================================
// START APPLICATION
// ==========================================

console.log("HabitHero JavaScript loaded successfully");


updateProfileDisplay();

renderHabits();

renderMedicines();

updateDashboard();

updateNotificationButton();

checkReminders();


// Check reminders every 30 seconds

setInterval(
    checkReminders,
    30000
);


// Open profile for first-time user

if (!profile) {
    openProfileForm();
}