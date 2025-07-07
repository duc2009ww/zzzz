//kiem tra trang thai dang nhap
function checKLoginStatus () {
    //lay button login + logut
    const loginBtn = document.getElementById("login-btn;")
    const logoutBtn = document.getElementById("logout-btn;")

    //kiem tra local storage co ton tai currentUser khong
    const currentUser = localStorage.getItem("currentUser")

    //neu da dang nhap -> tat login
    // ==: so sánh giá trị 1 == "1" (true)
  // ===: so sánh nghiêm ngặt (kiểm tra cả giá trị và kiểu dữ liệu) (1 === "1" (false))
    
    if (currentUser !== null) {
        loginBtn.style.display = "none"; // ấn nút đăng nhập
        logoutBtn.style.display = "block" // hiển thị nút đăng xuất
    } else {
        loginBtn.style.display = "bolck"
        logoutBtn.style.display = "none"
    }
}

document.addEventListener("DOMContentLoaded", checKLoginStatus);

// bat su kien cho logout
document.getElementById("logout-btn").addEventListener("click", function() {
    //xoa currentUser trong local storage
    localStorage.removeItem("currentUser")
});
 