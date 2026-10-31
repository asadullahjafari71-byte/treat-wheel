const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

const spinButton = document.getElementById("spinButton");
const resultModal = document.getElementById("resultModal");
const closeModal = document.getElementById("closeModal");

const resultTask = document.getElementById("resultTask");
const resultRussian = document.getElementById("resultRussian");

const formspreeURL = "https://formspree.io/f/xoeqoejb";

const tasks = [
    {
        short: "ROMANTIC SONG",
        russianShort: "РОМАНТИЧНАЯ ПЕСНЯ",
        english: "Send me a 15-second voice note singing a romantic song. Bonus points if you sing it as though you're serenading me. 🎶",
        russian: "Отправь мне голосовое сообщение, спев 15 секунд романтической песни. Дополнительные баллы, если будешь петь так, будто посвящаешь её мне. 🎶"
    },
    {
        short: "FUNNY SELFIE",
        russianShort: "СМЕШНОЕ СЕЛФИ",
        english: "Send me a selfie with your funniest or most ridiculous expression. No filters, no professional photography — I want the real you! 😂",
        russian: "Отправь мне селфи со своим самым смешным или нелепым выражением лица. Без фильтров и фотосессий — хочу увидеть настоящую тебя! 😂"
    },
    {
        short: "SWEETEST LOOK",
        russianShort: "МИЛАЯ УЛЫБКА",
        english: "Send me a cute selfie wearing your hijab, with your prettiest smile. I have a feeling this one will be hard to beat. 🥰 (Only if you're comfortable!)",
        russian: "Отправь мне милое селфи в хиджабе со своей самой красивой улыбкой. Мне кажется, этот снимок будет трудно превзойти. 🥰 (Только если тебе комфортно!)"
    },
    {
        short: "THE FULL PACKAGE",
        russianShort: "ПОЛНЫЙ КОМПЛЕКТ",
        english: "THE FULL PACKAGE! Complete the three original challenges: sing a romantic song, send a funny selfie, and send a cute hijab selfie. No escaping this one! 😈",
        russian: "ПОЛНЫЙ КОМПЛЕКТ! Выполни три первоначальных задания: спой романтическую песню, отправь смешное селфи и милое селфи в хиджабе. На этот раз не отвертишься! 😈"
    },
    {
        short: "FIRST IMPRESSION",
        russianShort: "ПЕРВОЕ ВПЕЧАТЛЕНИЕ",
        english: "Tell me honestly: what was your very first impression of me? Don't edit your answer just to make me feel better. I can handle the truth! 👀",
        russian: "Скажи честно: какое было твоё самое первое впечатление обо мне? Не меняй свой ответ только для того, чтобы мне было приятнее. Я выдержу правду! 👀"
    },
    {
        short: "THREE VOICES",
        russianShort: "ТРИ ИНТОНАЦИИ",
        english: "Send me a voice note saying my name in three different ways: sweet, dramatic, and annoyed. I need to hear all three performances! 😂",
        russian: "Отправь мне голосовое сообщение, произнеся моё имя тремя разными способами: нежно, драматично и раздражённо. Я хочу услышать все три исполнения! 😂"
    },
    {
        short: "SURPRISE ME",
        russianShort: "УДИВИ МЕНЯ",
        english: "Surprise me with something unexpected. It can be a picture, a song, a voice note, or anything you think would make my day. I'm leaving this one entirely to your imagination! ✨",
        russian: "Удиви меня чем-нибудь неожиданным. Это может быть фотография, песня, голосовое сообщение или что угодно, что, по твоему мнению, сделает мой день лучше. Здесь я полностью полагаюсь на твою фантазию! ✨"
    }
];

const colors = [
    "#dca9a5",
    "#aab7a0",
    "#e7c77a",
    "#9eb7c4",
    "#c5a6bd",
    "#d6b69a",
    "#a7b9ae"
];

const numberOfSegments = tasks.length;
const arc = (Math.PI * 2) / numberOfSegments;

let currentRotation = 0;
let spinning = false;


// DRAW THE WHEEL

function drawWheel() {
    const center = canvas.width / 2;
    const radius = center - 5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numberOfSegments; i++) {
        const startAngle = currentRotation + i * arc;
        const endAngle = startAngle + arc;
        const middleAngle = startAngle + arc / 2;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = colors[i];
        ctx.fill();

        ctx.strokeStyle = "#f5f0e8";
        ctx.lineWidth = 5;
        ctx.stroke();

        // Draw segment labels
        ctx.save();

        ctx.translate(center, center);
        ctx.rotate(middleAngle);

        // Position labels inside the segment
        ctx.translate(radius * 0.66, 0);

        // Keep labels readable instead of upside down
        if (Math.cos(middleAngle) < 0) {
            ctx.rotate(Math.PI);
        }

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillStyle = "#39312d";
        ctx.font = "bold 15px Arial";
        ctx.fillText(tasks[i].short, 0, -9, 125);

        ctx.fillStyle = "#554741";
        ctx.font = "11px Arial";
        ctx.fillText(tasks[i].russianShort, 0, 11, 125);

        ctx.restore();
    }
}

drawWheel();


// SPIN ANIMATION

function easeOut(t) {
    return 1 - Math.pow(1 - t, 4);
}

function spinWheel() {
    if (spinning) return;

    spinning = true;

    spinButton.disabled = true;
    spinButton.textContent = "SPINNING...";

    const startRotation = currentRotation;

    // At least six full turns, plus a random amount
    const extraRotation =
        (Math.PI * 2 * 6) + Math.random() * Math.PI * 2;

    const targetRotation = startRotation + extraRotation;

    const duration = 5000;
    const startTime = performance.now();

    function animate(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = easeOut(progress);

        currentRotation =
            startRotation +
            (targetRotation - startRotation) * easedProgress;

        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            finishSpin();
        }
    }

    requestAnimationFrame(animate);
}


// DETERMINE WINNING TASK

function finishSpin() {
    currentRotation = currentRotation % (Math.PI * 2);

    // Pointer position: top of the wheel
    const pointerAngle = -Math.PI / 2;

    let relativeAngle =
        (pointerAngle - currentRotation) % (Math.PI * 2);

    if (relativeAngle < 0) {
        relativeAngle += Math.PI * 2;
    }

    const winningIndex = Math.floor(relativeAngle / arc);
    const selectedTask = tasks[winningIndex];

    drawWheel();

    resultTask.textContent = selectedTask.english;
    resultRussian.textContent = selectedTask.russian;

    resultModal.classList.add("show");

    // Send email notification
    sendSpinNotification(selectedTask);

    // Celebrate the result
    showConfetti();

    spinning = false;

    spinButton.disabled = false;
    spinButton.textContent = "SPIN AGAIN";
}


// EMAIL NOTIFICATION

function sendSpinNotification(task) {
    const now = new Date();

    const localDateTime = now.toLocaleString();

    const formData = new FormData();

    formData.append(
        "subject",
        "Someone spun The Treat Department!"
    );

    formData.append("Selected task", task.english);
    formData.append("Russian translation", task.russian);
    formData.append("Date and time", localDateTime);

    formData.append(
        "Status",
        "Wheel spun and task selected. Task completion has not been verified."
    );

    fetch(formspreeURL, {
        method: "POST",
        body: formData,
        headers: {
            "Accept": "application/json"
        }
    })
    .then(response => {
        if (response.ok) {
            console.log("Spin notification sent.");
        } else {
            console.error("Email notification could not be sent.");
        }
    })
    .catch(error => {
        console.error("Notification error:", error);
    });
}


// CONFETTI EFFECT

function showConfetti() {
    const pieces = 65;

    for (let i = 0; i < pieces; i++) {
        const confetti = document.createElement("div");

        confetti.style.position = "fixed";
        confetti.style.left = Math.random() * 100 + "vw";
        confetti.style.top = "-15px";
        confetti.style.width = "8px";
        confetti.style.height = "12px";

        confetti.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        confetti.style.zIndex = "100";
        confetti.style.pointerEvents = "none";

        document.body.appendChild(confetti);

        const fallDuration = 2000 + Math.random() * 2000;

        confetti.animate(
            [
                {
                    transform: "translateY(0) rotate(0deg)",
                    opacity: 1
                },
                {
                    transform:
                        `translateY(${window.innerHeight + 50}px) rotate(${Math.random() * 900}deg)`,
                    opacity: 0
                }
            ],
            {
                duration: fallDuration,
                easing: "ease-out"
            }
        );

        setTimeout(() => {
            confetti.remove();
        }, fallDuration);
    }
}


// BUTTON EVENTS

spinButton.addEventListener("click", spinWheel);

closeModal.addEventListener("click", () => {
    resultModal.classList.remove("show");
});

resultModal.addEventListener("click", (event) => {
    if (event.target === resultModal) {
        resultModal.classList.remove("show");
    }
});