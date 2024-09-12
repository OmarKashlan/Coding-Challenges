let editor; // تعريف المتغير في النطاق العام
let jsonFile; // تعريف متغير jsonFile في النطاق العام
let challengeId; // تعريف challengeId في النطاق العام

document.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    challengeId = urlParams.get('challenge'); // تحديث challengeId ليكون في النطاق العام
    const language = urlParams.get('lang') || 'javascript';


    // التحقق من وجود العناصر قبل التعامل معها
    const challengeTitleElement = document.getElementById('challenge-title');
    const challengeDescriptionElement = document.getElementById('challenge-description');
    const challengeDifficultyElement = document.getElementById('challenge-difficulty');
    const challengePointsElement = document.getElementById('challenge-points');
    const challengeInstructionsElement = document.getElementById('challenge-instructions');
    const challengeResulteElement = document.getElementById('challenge-resulte'); // عنصر الناتج المتوقع

    if (!challengeTitleElement || !challengeDescriptionElement || !challengeDifficultyElement || !challengePointsElement || !challengeInstructionsElement || !challengeResulteElement) {
        console.error('Error: Some elements are missing from the HTML.');
        return;
    }

    // التحقق من وجود challengeId
    if (!challengeId) {
        console.error('Error: No challenge ID provided in the URL.');
        alert('لم يتم العثور على معرف التحدي في عنوان URL. يرجى تحديد التحدي من الصفحة الرئيسية.');
        return; // إنهاء العملية إذا لم يتم العثور على challengeId
    }

    // بناء رابط الملف المناسب بناءً على اللغة
    jsonFile = (language === 'html') ? '../challenges-html.json' : '../challenges-javascript.json'; // تحديث jsonFile

    // جلب التحديات من ملف JSON
    fetch(jsonFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading file: ${response.statusText}`);
            }
            return response.json();
        })
        .then(challenges => {
            const challenge = challenges.find(c => c.id === challengeId);

            if (challenge) {
                // تحميل معلومات التحدي
                challengeTitleElement.innerText = challenge.title;
                challengeDescriptionElement.innerText = challenge.description;
                challengeDifficultyElement.innerText = challenge.difficulty;
                challengePointsElement.innerText = challenge.points;
                challengeInstructionsElement.innerHTML = challenge.instructions || 'No specific instructions.';

                // تحميل الناتج المتوقع إذا كان موجودًا
                const challengeResulteElement = document.getElementById('challenge-resulte');
                if (challenge.solution) {
                    // إذا كان التحدي HTML، قم بتضمين الكود مباشرة
                    if (language === 'html') {
                        challengeResulteElement.innerHTML = challenge.solution;
                    }
                } else {
                    challengeResulteElement.innerHTML = '<p>No expected result provided.</p>';
                }
            } else {
                alert('لم يتم العثور على التحدي!');
            }
        })
        .catch(error => console.error('Error loading challenges:', error));

    // إعداد CodeMirror Editor بناءً على اللغة
    let mode = (language === 'html') ? 'htmlmixed' : 'javascript';
    editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: mode, // التبديل بين HTML و JavaScript
        theme: 'default',
        extraKeys: {
            "Ctrl-Space": "autocomplete" // لتفعيل الإكمال التلقائي عند الضغط على Ctrl + Space
        }
    });

    editor.on('keyup', function (cm, event) {
        if (!cm.state.completionActive && (event.keyCode >= 65 && event.keyCode <= 90 || event.keyCode === 190 || event.keyCode === 60)) {
            CodeMirror.commands.autocomplete(cm, null, {
                completeSingle: false
            });
        }
    });


    document.addEventListener('DOMContentLoaded', function () {
        const urlParams = new URLSearchParams(window.location.search);
        const language = urlParams.get('lang') || 'javascript';

        if (language === 'javascript') {
            // انتظار 15 ثانية قبل عرض الـ popup
            setTimeout(function () {
                var modal = new bootstrap.Modal(document.getElementById('pointsModal'));
                modal.show();
            }, 2000); // 15 ثانية
        }
    });


    // تعيين القالب الافتراضي بناءً على اللغة
    const defaultTemplate = {
        javascript: `// Write your JavaScript solution here\n`,
        html: `<!-- Write your HTML solution here -->`
    };

    // تحميل القالب المناسب
    editor.setValue(defaultTemplate[language]);


    // تعريف loggedInUser أولاً
    let loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
        alert('يجب عليك تسجيل الدخول لاستكمال التحديات.');
        throw new Error('User is not logged in.');
    }

    localStorage.setItem(`attempts_${loggedInUser.name}_${challengeId}`, JSON.stringify(0));
    let userAttempts = 0;

    // زر "عرض الحل" يكون معطلاً في البداية فقط إذا كانت المحاولات أقل من 3
    const showSolutionButton = document.getElementById('show-solution');
    if (userAttempts < 3) {
        showSolutionButton.disabled = true;
    } else {
        showSolutionButton.disabled = false;
    }


    // زر تشغيل الكود
    const runCodeButton = document.getElementById('run-code');
    if (!runCodeButton) {
        console.error('Error: Run Code button is missing.');
        return;
    }

    runCodeButton.addEventListener('click', function () {
        const code = editor.getValue();
        document.getElementById('output').innerText = "Running your code...";

        userAttempts++;
        localStorage.setItem(`attempts_${loggedInUser.name}_${challengeId}`, JSON.stringify(userAttempts));

        // تحديث حالة زر "عرض الحل" بعد محاولة التشغيل
        if (userAttempts >= 3) {
            showSolutionButton.disabled = false;
        }

        // التحقق من اللغة
        if (language === 'javascript') {
            try {
                // تشغيل كود JavaScript المدخل من المستخدم
                let result = eval(code); // استخدام eval لتنفيذ الكود
                document.getElementById('output').innerText = result !== undefined ? result : 'Code executed successfully!';
            } catch (error) {
                // عرض رسالة خطأ في حال وجود خطأ في الكود
                document.getElementById('output').innerText = `Error: ${error.message}`;
            }

        } else if (language === 'html') {
            document.getElementById('output').innerHTML = code;

            fetch(jsonFile)
                .then(response => response.json())
                .then(challenges => {
                    const challenge = challenges.find(c => c.id === challengeId);
                    if (challenge) {
                        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                        if (!loggedInUser) {
                            alert('يجب عليك تسجيل الدخول لاستكمال التحديات.');
                            return;
                        }

                        let userCompletedChallenges = JSON.parse(localStorage.getItem(`completedChallenges_${loggedInUser.name}`)) || {};
                        if (!userCompletedChallenges[challengeId]) {
                            if (code.trim() === challenge.solution.trim()) {
                                alert('الحل الصحيح!');
                                addPointsToUser(challenge.points);
                                userCompletedChallenges[challengeId] = true;
                                localStorage.setItem(`completedChallenges_${loggedInUser.name}`, JSON.stringify(userCompletedChallenges));
                            } else {
                                alert('الحل غير صحيح. يرجى المحاولة مرة أخرى.');
                            }
                        } else {
                            alert('لقد قمت بالفعل بحل هذا التحدي. لن يتم منحك أي نقاط إضافية.');
                        }
                    }
                })
                .catch(error => console.error('Error loading challenges:', error));
        }
    });


    // وظيفة عرض الحل
    document.getElementById('show-solution').addEventListener('click', function () {
        if (!jsonFile || !challengeId) {
            console.error('Error: jsonFile or challengeId is undefined.');
            return;
        }

        const showSolutionButton = document.getElementById('show-solution');
        if (userAttempts < 3) {
            showSolutionButton.disabled = true;
        } else {
            showSolutionButton.disabled = false;
        }

        if (userAttempts < 3) {
            alert('يجب عليك المحاولة ثلاث مرات على الأقل قبل عرض الحل.');
            return;
        }


        fetch(jsonFile)
            .then(response => response.json())
            .then(challenges => {
                const challenge = challenges.find(c => c.id === challengeId);
                if (challenge && challenge.solution) {
                    const solutionBox = document.getElementById('solution-box');

                    solutionBox.innerHTML = '';

                    const pre = document.createElement('pre');
                    const code = document.createElement('code');
                    code.textContent = challenge.solution;

                    pre.style.backgroundColor = '#f8f9fa';
                    pre.style.padding = '10px';
                    pre.style.border = '1px solid #ddd';
                    pre.style.borderRadius = '5px';

                    pre.appendChild(code);
                    solutionBox.appendChild(pre);

                    solutionBox.style.display = 'block';
                } else {
                    alert('لا يوجد حل متاح.');
                }
            });
    });
});


// إضافة النقاط للمستخدم
function addPointsToUser(points) {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
        alert('يجب عليك تسجيل الدخول لكسب النقاط.');
        return;
    }

    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const userIndex = leaderboard.findIndex(entry => entry.user === loggedInUser.name);

    if (userIndex >= 0) {
        leaderboard[userIndex].points += points;
    } else {
        leaderboard.push({
            user: loggedInUser.name,
            points: points
        });
    }

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    alert(`تهانينا! لقد أجبت بشكل صحيح. حصلت على ${points} من النقاط. تفقد ترتيبك في لوحة المتصدرين!`);
}







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