// Authentication Functions
async function signup() {
    const signupMessage = document.getElementById("signupMessage");

    try {
        // Get form values
        const name = document.getElementById("name").value.trim();
        const rollNumber = document.getElementById("rollNumber").value.trim();
        const password = document.getElementById("password").value;
        const userType = localStorage.getItem("userType");

        // Clear previous error message
        signupMessage.innerText = "";
        signupMessage.style.color = "red";

        // Validate inputs
        if (!name || !rollNumber || !password) {
            signupMessage.innerText = "All fields are required!";
            return;
        }

        // Check if user type is selected
        if (!userType) {
            signupMessage.innerText = "Please select user type first";
            setTimeout(() => {
                window.location.href = "user_selection.html";
            }, 2000);
            return;
        }

        // Get existing users or initialize empty array
        let users = [];
        try {
            const existingUsers = localStorage.getItem("users");
            users = existingUsers ? JSON.parse(existingUsers) : [];
        } catch (e) {
            console.error("Error parsing users from localStorage:", e);
            users = [];
        }

        // Check if user already exists
        if (users.find(user => user.rollNumber === rollNumber)) {
            signupMessage.innerText = "User already exists with this roll number!";
            return;
        }

        // Create new user object
        const newUser = {
            name,
            rollNumber,
            password, // Store password directly for now
            userType,
            email: "",
            phone: "",
            profilePicture: "images/default-avatar.png",
            createdAt: new Date().toISOString()
        };

        // Add user to array
        users.push(newUser);

        // Save updated users array
        localStorage.setItem("users", JSON.stringify(users));

        // Show success message
        signupMessage.style.color = "green";
        signupMessage.innerText = "Signup successful! Redirecting to login...";

        // Set signup success flag and redirect
        localStorage.setItem('signupSuccess', 'true');
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);

    } catch (error) {
        console.error("Signup error:", error);
        signupMessage.innerText = "An error occurred during signup. Please try again.";
        throw error;
    }
}

async function login() {
    try {
        const rollNumber = document.getElementById("rollNumber").value.trim();
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("errorMessage");
        const userType = localStorage.getItem("userType");

        // Clear previous error
        errorMessage.innerText = "";

        // Validate inputs
        if (!rollNumber || !password) {
            errorMessage.innerText = "Please enter both roll number and password";
            return;
        }

        if (!userType) {
            errorMessage.innerText = "Please select user type first";
            setTimeout(() => {
                window.location.href = "user_selection.html";
            }, 2000);
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.rollNumber === rollNumber && u.userType === userType);

        if (!user) {
            errorMessage.innerText = `No ${userType} account found with this roll number. Please sign up first.`;
            return;
        }

        // Compare passwords directly
        if (user.password === password) {
            // Store user info in localStorage
            localStorage.setItem("loggedInUser", JSON.stringify(user));

            // Show loading message
            errorMessage.style.color = "green";
            errorMessage.innerText = "Login successful! Redirecting...";

            // Redirect based on user type
            setTimeout(() => {
                if (user.userType === "student") {
                    window.location.href = "student_dashboard.html";
                } else if (user.userType === "admin") {
                    window.location.href = "admin_dashboard.html";
                }
            }, 1000);
        } else {
            errorMessage.innerText = "Incorrect password";
        }
    } catch (error) {
        console.error("Login error:", error);
        errorMessage.innerText = "An error occurred during login";
        throw error;
    }
}

function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

// Dashboard Functions
document.addEventListener("DOMContentLoaded", function() {
    const currentPage = window.location.pathname;

    // Check if user is logged in
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!loggedInUser && !currentPage.includes("login.html") && !currentPage.includes("signup.html") && !currentPage.includes("user_selection.html")) {
        window.location.href = "login.html";
        return;
    }

    // Initialize appropriate dashboard
    if (currentPage.includes("student_dashboard.html")) {
        if (!loggedInUser || loggedInUser.userType !== "student") {
            window.location.href = "login.html";
            return;
        }
        initializeStudentDashboard(loggedInUser);
    } else if (currentPage.includes("admin_dashboard.html")) {
        if (!loggedInUser || loggedInUser.userType !== "admin") {
            window.location.href = "login.html";
            return;
        }
        initializeAdminDashboard(loggedInUser);
    }

    // Set up navigation if on a dashboard page
    setupDashboardNavigation();
});

function setupDashboardNavigation() {
    const navLinks = document.querySelectorAll('.sidebar nav a');
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('onclick')) return; // Skip for logout button

                e.preventDefault();
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                const sectionId = this.getAttribute('data-section');
                showSection(sectionId);
            });
        });
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function initializeStudentDashboard(user) {
    // Set welcome message
    const welcomeElement = document.getElementById("welcome");
    if (welcomeElement) {
        welcomeElement.innerText = `Welcome, ${user.name}!`;
    }

    // Load profile information
    loadProfileInfo(user);
    
    // Load room information
    loadRoomInfo(user);
    
    // Load fee information
    loadFeeInfo(user);
    
    // Load announcements
    loadAnnouncements();
}

function initializeAdminDashboard(user) {
    // Set welcome message
    const welcomeElement = document.getElementById("welcome");
    if (welcomeElement) {
        welcomeElement.innerText = `Welcome, Admin ${user.name}!`;
    }

    // Load admin functionalities
    loadAdminFunctionalities();
}
