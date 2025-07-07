const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showLoginFormBtn = document.getElementById("showLoginFormBtn");
const showSignupFormBtn = document.getElementById("showSignupFormBtn");

// chuyen form
function changeForm(isLogin) {
  if (isLogin) {
    loginForm.classList.add("d-block");
    signupForm.classList.remove("d-block");
    signupForm.classList.add("d-none");
    loginForm.classList.remove("d-none");
  } else {
    loginForm.classList.add("d-none");
    loginForm.classList.remove("d-block");
    signupForm.classList.remove("d-none");
    signupForm.classList.add("d-block");
  }
}
// bat su kien cho 2 link chuyen form
showSignupFormBtn.addEventListener("click", function () {
  // doi mau button
  this.classList.add("btn-primary");
  this.classList.remove("btn-outline-primary");
  // doi mau button khac
  showLoginFormBtn.classList.add("btn-outline-primary");
  showLoginFormBtn.classList.remove("btn-primary");

  changeForm(false); // chuyen sang dang ki
});

showLoginFormBtn.addEventListener("click", function () {
  this.classList.add("btn-primary");
  this.classList.remove("btn-outline-primary");

  // doi mau button khac
  showSignupFormBtn.classList.add("btn-outline-primary");
  showSignupFormBtn.classList.remove("btn-primary");
  changeForm(true); // chuyen sang dang nhap
});

// -----------------------------------------------------
// kiem tra form dang ki
function validateSignupForm(email, username, password) {
  // kiem tra username (>= 6 ky tu)
  if (username.length < 6) {
    alert("Username must be at least 6 characters long.");
    return false;
  }
  // password (>= 6 ky tu)
  if (password.length < 6) {
    alert("Password must be at least 6 characters long.");
    return false;
  }
  return true;
}

// -----------------------------------------------------
// kiem tra trung lap
function isEmailRegistered(email) {
  // kiem tra xem email da ton tai trong local storage chua
  if (localStorage.getItem(email) !== null) {
    alert("Email is already registered. Please use a different email.");
    return true;
  }
  return false;
}

// dang ki -> luu local storage
function signupToLocalStorage() {
  // lay du lieu tu form
  const email = document.getElementById("signupEmail").value;
  const username = document.getElementById("signupUsername").value;
  const password = document.getElementById("signupPassword").value;
  // kiem tra form
  const checked =
    validateSignupForm(email, username, password) && !isEmailRegistered(email);
  if (checked == true) {
    // luu vao local storage
    localStorage.setItem(email, password);
    // thong bao
    alert("Registration successful! You can now log in.");
    // chuyen sang dang nhap
    changeForm(true);
  }
}

// -----------------------------------------------------
// dang nhap -> chuyen home
function loginToHome() {
  // lay du lieu tu form
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  // kiem tra email da dang ki chua
  if (isEmailRegistered(email)) {
    // kiem tra password
    const passwordStored = localStorage.getItem(email);
    // so sanh password
    if (passwordStored === password) {
      // dang nhap thanh cong
      // luu current user vao local storage
      localStorage.setItem("currentUser", email);
      alert("Login successful! Redirecting to home page...");
      // chuyen trang
      window.location.href = "../index.html"; // chuyen den trang home
    } else {
      // mat khau khong dung
      alert("Incorrect password. Please try again.");
      return;
    }
  } else {
    // email chua dang ki
    alert("Email not registered. Please sign up first.");
    return;
  }
}

// -----------------------------------------------------
// bat su kien cho nut dang ki
document
  .getElementById("signupForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // ngan chan submit mac dinh (chuyen trang theo action/ sua url)
    signupToLocalStorage(); // goi ham dang ki
  });

// -----------------------------------------------------
// bat su kien cho nut dang nhap
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // ngan chan submit mac dinh (chuyen trang theo action/ sua url)
    loginToHome(); // goi ham dang nhap
  });