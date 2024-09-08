// بيانات تجريبية للمتصدرين
const leaderboardData = [
    { user: 'Alice', points: 1500 },
    { user: 'Bob', points: 1200 },
    { user: 'Charlie', points: 1000 },
    { user: 'David', points: 800 },
    { user: 'Eve', points: 600 }
];

// تحميل المتصدرين عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function () {
    loadLeaderboard();
});

// وظيفة لتحميل المتصدرين من LocalStorage أو استخدام بيانات تجريبية
function loadLeaderboard() {
    const leaderboardTable = document.getElementById('leaderboard');

    // إذا لم يكن هناك بيانات في LocalStorage، استخدم البيانات التجريبية
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || leaderboardData;

    // ترتيب المتصدرين بناءً على النقاط
    leaderboard.sort((a, b) => b.points - a.points);

    // إنشاء صف لكل متصدر
    leaderboard.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${entry.user}</td>
            <td>${entry.points}</td>
        `;
        leaderboardTable.appendChild(row);
    });
}

// وظيفة لحفظ المتصدرين في LocalStorage (يمكن استخدامها لاحقًا)
function saveLeaderboard(newEntry) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || leaderboardData;
    leaderboard.push(newEntry);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

// زر العودة الى الاعلى
window.addEventListener("scroll", function () {
    const scrollToTop = document.getElementById("scroll-to-top");
    if (window.scrollY > 100) {
        scrollToTop.classList.add("show");
    } else {
        scrollToTop.classList.remove("show");
    }
});


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
