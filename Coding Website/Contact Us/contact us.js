document.addEventListener('DOMContentLoaded', function () {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const loginStatusElement = document.getElementById('accountName');
    const contentElement = document.getElementById('content');
    const notLoggedInElement = document.getElementById('not-logged-in');
    const logoutBtn = document.getElementById('logout-btn');

    if (loggedInUser) {
        // عرض اسم المستخدم المسجل
        if (loginStatusElement) {
            loginStatusElement.innerText = loggedInUser.name || 'User';
        }

        // عرض المحتوى الرئيسي
        if (contentElement) {
            contentElement.style.display = "block";
        }

        // إخفاء رسالة "غير مسجل"
        if (notLoggedInElement) {
            notLoggedInElement.style.display = "none";
        }

        // إظهار زر تسجيل الخروج
        if (logoutBtn) {
            logoutBtn.style.display = "block";
        }

        // تفعيل عملية تسجيل الخروج
        logoutBtn.addEventListener('click', () => {
            // إزالة معلومات تسجيل الدخول فقط وليس حذف المستخدم
            localStorage.removeItem('loggedInUser');

            // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
            window.location.href = '../Account/Account.html';
        });

    } else {
        // في حالة عدم تسجيل الدخول - إخفاء المحتوى الرئيسي
        if (contentElement) {
            contentElement.style.display = "none";
        }

        // عرض رسالة "يجب تسجيل الدخول"
        if (notLoggedInElement) {
            notLoggedInElement.style.display = "block";
        }

        // إخفاء زر تسجيل الخروج
        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }
    }
});
