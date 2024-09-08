// تحديث العرض للعناصر بناءً على الصعوبة
function filterChallenges(difficulty) {
    const challenges = document.querySelectorAll(".challenge-card");
    challenges.forEach(function (challenge) {
        challenge.classList.add("fade-out");
    });

    setTimeout(function () {
        challenges.forEach(function (challenge) {
            if (
                difficulty === "all" ||
                challenge.getAttribute("data-difficulty") === difficulty
            ) {
                challenge.style.display = "block";
                challenge.classList.remove("fade-out");
                challenge.classList.add("fade-in");
            } else {
                challenge.style.display = "none";
            }
        });
    }, 300); // مدة الانتقال (مطابقة لمدة الأنيميشن في CSS)
}

// تحميل التحديات من ملف JSON بناءً على اللغة المختارة
document.addEventListener("DOMContentLoaded", function () {
    let selectedLanguage = "python"; // اللغة الافتراضية هي python
    const languageSelect = document.getElementById("languageSelect");
    const challengeList = document.getElementById("challengeList");
    const loadingSpinner = document.getElementById("loadingSpinner"); // الـ Spinner

    function loadChallenges(language) {
        // إظهار الـ Spinner قبل البدء في جلب البيانات
        loadingSpinner.style.display = "flex";

        fetch(`challenges-${language}.json`)
            .then((response) => response.json())
            .then((challenges) => {
                challengeList.innerHTML = "";
                challenges.forEach((challenge) => {
                    let difficultyClass;
                    if (challenge.difficulty === "Easy") {
                        difficultyClass = "text-success"; // لون أخضر للصعوبة السهلة
                    } else if (challenge.difficulty === "Medium") {
                        difficultyClass = "text-warning"; // لون أصفر للصعوبة المتوسطة
                    } else if (challenge.difficulty === "Hard") {
                        difficultyClass = "text-danger"; // لون أحمر للصعوبة الصعبة
                    }

                    const challengeCard = document.createElement("div");
                    challengeCard.classList.add("col-md-4", "mb-4", "challenge-card");
                    challengeCard.setAttribute("data-difficulty", challenge.difficulty);
                    challengeCard.innerHTML = `
                        <div class="card h-100">
                            <div class="card-body">
                                <h5 class="card-title">${challenge.title}</h5>
                                <p class="card-text">${challenge.description}</p>
                                <p class="text-muted"><strong>Difficulty:</strong> <span class="${difficultyClass}">${challenge.difficulty}</span></p>
                                <p><strong>Points:</strong> ${challenge.points}</p>
                                 <a href="challenge/challenge.html?challenge=${challenge.id}&lang=${language}" class="btn btn-primary" style="display: flex;align-items: center;justify-content: center;">Start Challenge
        <lord-icon lord-icon src="https://cdn.lordicon.com/yhwigecd.json" trigger="loop" state="loop-cycle"
            colors="primary:#121331,secondary:#ffffff" style="width:25px;height:25px;margin-left:10px;">
        </lord-icon></a>
                            </div>
                        </div>
                    `;
                    challengeList.appendChild(challengeCard);
                });
            })
            .catch((error) => console.error("Error loading challenges:", error))
            .finally(() => {
                // إضافة تأخير زمني قدره 2 ثانية قبل إخفاء الـ Spinner
                setTimeout(() => {
                    loadingSpinner.style.display = "none";
                }, 2000); // 2000 ميلي ثانية = 2 ثانية
            });
    }

    // تحميل التحديات الافتراضية عند التحميل الأولي
    loadChallenges(selectedLanguage);

    // عند تغيير اللغة
    languageSelect.addEventListener("change", function () {
        selectedLanguage = this.value;
        loadChallenges(selectedLanguage);
    });
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
            window.location.href = 'Account/Account.html';
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
