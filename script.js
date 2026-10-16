
// 1. Event Details
const events = [
    {
        id: 1,
        name: "Web Development Workshop",
        category: "Technical",
        date: "2026-11-10",
        venue: "Computer Lab",
        icon: "💻"
    },
    {
        id: 2,
        name: "Coding Competition",
        category: "Technical",
        date: "2026-11-15",
        venue: "Seminar Hall",
        icon: "👩‍💻"
    },
    {
        id: 3,
        name: "College Cultural Fest",
        category: "Cultural",
        date: "2026-11-20",
        venue: "College Auditorium",
        icon: "🎤"
    },
    {
        id: 4,
        name: "Sports Day",
        category: "Sports",
        date: "2026-11-25",
        venue: "College Ground",
        icon: "🏆"
    },
    {
        id: 5,
        name: "Project Expo",
        category: "Technical",
        date: "2026-12-05",
        venue: "Innovation Centre",
        icon: "🚀"
    },
    {
        id: 6,
        name: "Dance Competition",
        category: "Cultural",
        date: "2026-12-10",
        venue: "Main Stage",
        icon: "💃"
    }
];

// 2. Selected Event
let selectedEventId = null;

// 3. Load Registrations from Browser
let registrations = [];

try {
    registrations = JSON.parse(
        localStorage.getItem("campusRegistrations") || "[]"
    );

    if (!Array.isArray(registrations)) {
        registrations = [];
    }
} catch (error) {
    registrations = [];
}

// 4. Display Events
function displayEvents() {
    const searchInput = document.getElementById("search");
    const categoryInput = document.getElementById("category");
    const eventList = document.getElementById("eventList");

    const searchText = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryInput.value;

    const filteredEvents = events.filter(function(event) {
        const matchesName = event.name.toLowerCase()
            .includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            event.category === selectedCategory;

        return matchesName && matchesCategory;
    });

    eventList.replaceChildren();

    if (filteredEvents.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No matching events found.";
        eventList.appendChild(message);
        return;
    }

    filteredEvents.forEach(function(event) {
        const card = document.createElement("article");
        card.className = "card";

        const icon = document.createElement("div");
        icon.className = "event-icon";
        icon.textContent = event.icon;

        const title = document.createElement("h3");
        title.textContent = event.name;

        const category = document.createElement("p");
        category.textContent = "Category: " + event.category;

        const date = document.createElement("p");
        date.textContent = "Date: " + event.date;

        const venue = document.createElement("p");
        venue.textContent = "Venue: " + event.venue;

        const button = document.createElement("button");
        button.textContent = "Register Now";
        button.type = "button";

        button.addEventListener("click", function() {
            openForm(event.id);
        });

        card.append(icon, title, category, date, venue, button);
        eventList.appendChild(card);
    });
}

// 5. Explore Events Button
function goToEvents() {
    document.getElementById("events").scrollIntoView({
        behavior: "smooth"
    });
}

// 6. Open Registration Form
function openForm(id) {
    selectedEventId = id;

    const event = events.find(function(item) {
        return item.id === id;
    });

    if (!event) {
        return;
    }

    document.getElementById("selectedEvent").textContent =
        "Selected Event: " + event.name;

    document.getElementById("register").classList.remove("hidden");

    document.getElementById("register").scrollIntoView({
        behavior: "smooth"
    });
}

// 7. Close Registration Form
function closeForm() {
    document.getElementById("register").classList.add("hidden");
}

// 8. Save Student Registration
document.getElementById("registrationForm")
    .addEventListener("submit", function(event) {
        event.preventDefault();

        const selectedEvent = events.find(function(item) {
            return item.id === selectedEventId;
        });

        if (!selectedEvent) {
            return;
        }

        const studentName = document
            .getElementById("studentName").value.trim();

        const email = document
            .getElementById("email").value.trim().toLowerCase();

        const department = document
            .getElementById("department").value.trim();

        const message = document.getElementById("message");

        if (!studentName || !email || !department) {
            message.textContent = "Please fill in all the fields.";
            return;
        }

        // Prevent duplicate registration for the same event
        const alreadyRegistered = registrations.some(function(item) {
            return item.eventId === selectedEventId &&
                item.email.toLowerCase() === email;
        });

        if (alreadyRegistered) {
            message.textContent =
                "This email is already registered for this event.";
            return;
        }

        const registration = {
            eventId: selectedEventId,
            eventName: selectedEvent.name,
            name: studentName,
            email: email,
            department: department
        };

        registrations.push(registration);

        try {
            localStorage.setItem(
                "campusRegistrations",
                JSON.stringify(registrations)
            );
        } catch (error) {
            registrations.pop();

            message.textContent =
                "Unable to save registration in this browser.";
            return;
        }

        message.textContent =
            "Registration successful! 🎉";

        this.reset();
        closeForm();
        displayRegistrations();
    });

// 9. Display My Registrations
function displayRegistrations() {
    const registrationList =
        document.getElementById("registrationList");

    registrationList.replaceChildren();

    if (registrations.length === 0) {
        registrationList.textContent =
            "No registrations yet.";
        return;
    }

    registrations.forEach(function(item, index) {
        const card = document.createElement("article");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = item.eventName;

        const name = document.createElement("p");
        name.textContent = "Student: " + item.name;

        const email = document.createElement("p");
        email.textContent = "Email: " + item.email;

        const department = document.createElement("p");
        department.textContent = "Department: " + item.department;

        const cancelButton = document.createElement("button");
        cancelButton.textContent = "Cancel Registration";
        cancelButton.type = "button";

        cancelButton.addEventListener("click", function() {
            cancelRegistration(index);
        });

        card.append(
            title,
            name,
            email,
            department,
            cancelButton
        );

        registrationList.appendChild(card);
    });
}

// 10. Cancel Registration
function cancelRegistration(index) {
    const removedRegistration = registrations.splice(index, 1)[0];

    try {
        localStorage.setItem(
            "campusRegistrations",
            JSON.stringify(registrations)
        );
    } catch (error) {
        registrations.splice(index, 0, removedRegistration);

        document.getElementById("message").textContent =
            "Unable to update registrations.";
        return;
    }

    document.getElementById("message").textContent =
        "Registration cancelled successfully.";

    displayRegistrations();
}

// 11. Run When Website Opens
displayEvents();
displayRegistrations();
