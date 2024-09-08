let jsonFile; // تعريف متغير jsonFile في النطاق العام
let challengeId; // تعريف challengeId في النطاق العام

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    challengeId = urlParams.get('challenge'); // تحديث challengeId ليكون في النطاق العام
    const language = urlParams.get('lang') || 'python';

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
        alert('No challenge ID found in the URL. Please select a challenge from the homepage.');
        return; // إنهاء العملية إذا لم يتم العثور على challengeId
    }

    // بناء رابط الملف المناسب بناءً على اللغة
    jsonFile = (language === 'html') ? '../challenges-html.json' : '../challenges-python.json'; // تحديث jsonFile

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
                // إذا كان التحدي python، قم بتشغيل الكود وتوجيه الناتج إلى منطقة مخصصة
                else if (language === 'python') {
                    try {
                        // إعداد منطقة لعرض النتيجة المتوقعة
                        const outputBox = document.createElement('pre');
                        outputBox.id = 'expected-output';
                        outputBox.style.backgroundColor = '#f8f9fa';
                        outputBox.style.padding = '10px';
                        outputBox.style.border = '1px solid #ddd';
                        outputBox.style.borderRadius = '5px';
                        outputBox.style.overflowX = 'auto';
                        outputBox.style.whiteSpace = 'pre-wrap';

                        // استخدام eval لتشغيل الكود وتوجيه الناتج إلى منطقة العرض
                        const result = eval(challenge.solution);
                        outputBox.innerText = `Expected Output: ${result || 'No result'}`;
                        challengeResulteElement.appendChild(outputBox);
                    } catch (error) {
                        console.error('Error executing python:', error);
                        challengeResulteElement.innerHTML = 'Error executing Python.';
                    }
                }
            } else {
                challengeResulteElement.innerHTML = '<p>No expected result provided.</p>';
            }
        } else {
            alert('Challenge not found!');
        }
    })
    .catch(error => console.error('Error loading challenges:', error));

    // إعداد CodeMirror Editor
    const editor = CodeMirror.fromTextArea(document.getElementById('code-editor'), {
        lineNumbers: true,
        mode: (language === 'html') ? 'text/x-html' : 'python',
        theme: 'default'
    });

    // تعيين القالب الافتراضي بناءً على اللغة
    const defaultTemplate = {
        python: `// Write your python solution here\nfunction solve() {\n  // Your solution here\n}`,
        html: `<!-- Write your HTML solution here -->`
    };

    // تحميل القالب المناسب
    editor.setValue(defaultTemplate[language]);

    // زر تشغيل الكود
    const runCodeButton = document.getElementById('run-code');
    if (!runCodeButton) {
        console.error('Error: Run Code button is missing.');
        return;
    }

    runCodeButton.addEventListener('click', function () {
        const code = editor.getValue();
        document.getElementById('output').innerText = "Running your code...";

        if (language === 'python') {
            // تشغيل كود python
            try {
                eval(code);
                document.getElementById('output').innerText = "Code executed successfully!";
            } catch (error) {
                document.getElementById('output').innerText = `Error: ${error.message}`;
            }
        } else if (language === 'html') {
            // تشغيل كود HTML
            document.getElementById('output').innerHTML = code;
        }
    });
});

// وظيفة عرض الحل
document.getElementById('show-solution').addEventListener('click', function () {
    // تأكد من أن jsonFile و challengeId معرّفان
    if (!jsonFile || !challengeId) {
        console.error('Error: jsonFile or challengeId is undefined.');
        return;
    }

    fetch(jsonFile)
        .then(response => response.json())
        .then(challenges => {
            const challenge = challenges.find(c => c.id === challengeId);
            if (challenge && challenge.solution) {
                const solutionBox = document.getElementById('solution-box');

                // تأكد من مسح المحتوى السابق
                solutionBox.innerHTML = '';

                // إنشاء عنصر <pre> و <code> لعرض الحل
                const pre = document.createElement('pre');
                const code = document.createElement('code');
                code.textContent = challenge.solution; // تعيين الكود كـ نص

                // إضافة الأنماط اللازمة
                pre.style.backgroundColor = '#f8f9fa';
                pre.style.padding = '10px';
                pre.style.border = '1px solid #ddd';
                pre.style.borderRadius = '5px';
                pre.style.overflowX = 'auto';
                pre.style.textWrap = 'Wrap';

                // إرفاق العنصرين
                pre.appendChild(code);
                solutionBox.appendChild(pre);

                // إظهار عنصر الحل
                solutionBox.style.display = 'block';
            } else {
                alert('No solution available.');
            }
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
