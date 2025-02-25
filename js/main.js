document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed.");

    // 🚀 Ensure buttons exist before adding event listeners
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const coursesBtn = document.getElementById("coursesBtn");

    if (loginBtn) {
        loginBtn.addEventListener("click", function () {
            console.log("Login button clicked.");
            window.location.href = "login.html"; // Redirect to login page
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener("click", function () {
            console.log("Signup button clicked.");
            window.location.href = "signup.html"; // Redirect to signup page
        });
    }

    if (coursesBtn) {
        coursesBtn.addEventListener("click", function () {
            console.log("Courses button clicked.");
            window.location.href = "courses.html"; // Redirect to courses page
        });
    }

    // 🚀 Handling Login Form
    if (document.getElementById("loginForm")) {
        document.getElementById("loginForm").addEventListener("submit", loginUser);
    }

    // 🚀 Handling Signup Form
    if (document.getElementById("signupForm")) {
        document.getElementById("signupForm").addEventListener("submit", signupUser);
    }

    // 🚀 Handle Welcome Page User Info
    if (document.getElementById("userName")) {
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (currentUser && currentUser.name) {
            document.getElementById("userName").textContent = currentUser.name;
        } else {
            window.location.href = "index.html";
        }
        document.getElementById("logoutBtn").addEventListener("click", logoutUser);
    }

    // 🚀 Load Courses on Courses Page
    if (document.getElementById("courseList")) {
        loadCourses();
    }

    // 🚀 Community Chat Page
    if (document.getElementById("chatForm")) {
        loadChatMessages();
        document.getElementById("chatForm").addEventListener("submit", sendMessage);
    }
});

// ✅ LOGIN FUNCTION
function loginUser(e) {
    e.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUser = users.find(user => user.email === email && user.password === password);

    if (currentUser) {
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        window.location.href = "welcome.html";
    } else {
        alert("Invalid email or password!");
    }
}

// ✅ SIGNUP FUNCTION
function signupUser(e) {
    e.preventDefault();
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let existingUser = users.find(user => user.email === email);

    if (existingUser) {
        alert("A user with this email already exists!");
        return;
    }

    let newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    alert("Sign up successful! Please login.");
    window.location.href = "index.html";
}

// ✅ LOGOUT FUNCTION
function logoutUser(e) {
    e.preventDefault();
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// ✅ LOAD COURSES
function loadCourses() {
    const courses = [
        { id: 1, title: "JavaScript Basics", description: "Learn JavaScript fundamentals." },
        { id: 2, title: "HTML & CSS", description: "Build beautiful websites." },
        { id: 3, title: "Advanced Web Development", description: "Take your web skills to the next level." }
    ];

    const courseListDiv = document.getElementById("courseList");
    courses.forEach(course => {
        const courseDiv = document.createElement("div");
        courseDiv.classList.add("course-item");
        courseDiv.innerHTML = `<h3>${course.title}</h3><p>${course.description}</p>`;
        courseListDiv.appendChild(courseDiv);
    });
}

// ✅ COMMUNITY CHAT FUNCTIONS
function loadChatMessages() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("courseId") || "general";

    let chatMessages = JSON.parse(localStorage.getItem("chat_" + courseId)) || [];
    const chatBox = document.getElementById("chatBox");
    chatBox.innerHTML = "";
    
    chatMessages.forEach(msg => {
        let msgDiv = document.createElement("div");
        msgDiv.classList.add("chat-message");
        msgDiv.innerHTML = `<strong>${msg.user}:</strong> ${msg.text}`;
        chatBox.appendChild(msgDiv);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage(e) {
    e.preventDefault();
    const chatInput = document.getElementById("chatInput");
    const message = chatInput.value.trim();
    if (message === "") return;

    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get("courseId") || "general";

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    let chatMessages = JSON.parse(localStorage.getItem("chat_" + courseId)) || [];
    chatMessages.push({ user: currentUser ? currentUser.name : "Guest", text: message });
    
    localStorage.setItem("chat_" + courseId, JSON.stringify(chatMessages));
    chatInput.value = "";
    loadChatMessages();
}

// ✅ GOOGLE SIGN-IN FUNCTION
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

try {

    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
    };

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    function signInWithGoogle() {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                console.log("User Info:", user);
                alert(`Welcome ${user.displayName}!`);
            })
            .catch((error) => {
                console.error("Error signing in:", error);
            });
    }

    const googleSignInBtn = document.getElementById("googleSignInBtn");
    if (googleSignInBtn) {
        googleSignInBtn.addEventListener("click", signInWithGoogle);
    }
} catch (err) {
    console.warn("Firebase import failed. Ensure it's running correctly.", err);
}
