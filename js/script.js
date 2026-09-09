import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_cqQRr1r2G-4uqdQ9vth6u5DCzNh5SIg",
    authDomain: "adminaenefh.firebaseapp.com",
    projectId: "adminaenefh",
    storageBucket: "adminaenefh.firebasestorage.app",
    messagingSenderId: "485207199782",
    appId: "1:485207199782:web:b06fe331ebdb63d05a96e7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const quizData = [
    {
        question: "Apa makanan kesukaaku?",
        options: ["Nasi Goreng", "Bakso", "Mie Ayam", "mi instan"],
        correct: 3
    },
    {
        question: "Apa warna favoritku?",
        options: ["Merah", "Biru", "Hitam", "Hijau"],
        correct: 2
    },
    {
        question: "tempat tinggalku dimana?",
        options: ["bjn", "surabaya", "kalimantan", "jaksel"],
        correct: 0
    },
    {
        question: "apa pekerjaanku?",
        options: ["guru", "penganguran", "polici", "tni"],
        correct: 0
    },
    {
        question: "Minuman favorit saat santai?",
        options: ["Kopi", "Teh", "Es", "Air"],
        correct: 0
    },
    {
        question:
            "pribadi hanya pernah cedita sama teman dekat,.aku pernah di tolak berapa kali?",
        options: ["1", "2", "3", "4"],
        correct: 3
    },
    {
        question:
            "pribadi hanya pernah cerita sama teman dekat,.pernah punya pacar berapa kali?",
        options: ["1", "2", "3", "4"],
        correct: 0
    },
    {
        question: "Brand HP pertama yang saya pakai?",
        options: ["Samsung", "Xiaomi", "OPPO", "Vivo"],
        correct: 1
    },
    {
        question:
            "negara yang pengen sekali di capai tapi saya tidak bisa mencapai nya?",
        options: ["china", "korea", "wni", "jepang"],
        correct: 3
    },
    {
        question: "saat mau tidur saya selalu mengucapkan......ke teman saya",
        options: ["turu sek", "oyasumi", "bobok", "ngak tahu"],
        correct: 1
    }
];

let playerName = "";
let currentQuestionIndex = 0;
let score = 0;
let typingInterval = null;

const envelopeSection = document.getElementById("envelope-section");
const nameSection = document.getElementById("name-section");
const quizSection = document.getElementById("quiz-section");
const resultSection = document.getElementById("result-section");

const openEnvelopeBtn = document.getElementById("open-envelope");
const startBtn = document.getElementById("start-btn");
const playerNameInput = document.getElementById("player-name");

const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score-display");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");

const resultMessage = document.getElementById("result-message");
const finalScore = document.getElementById("final-score");
const restartBtn = document.getElementById("restart-btn");
const bgMusic = document.getElementById("bg-music");

function switchCard(hideElement, showElement) {
    hideElement.classList.add("fade-out");
    setTimeout(() => {
        hideElement.classList.add("hidden");
        hideElement.classList.remove("fade-out");
        showElement.classList.remove("hidden");
    }, 300);
}

openEnvelopeBtn.addEventListener("click", () => {
    if (bgMusic) {
        bgMusic.play().catch(error => {
            console.log("Autoplay dicegah browser:", error);
        });
    }

    openEnvelopeBtn.classList.add("open");
    setTimeout(() => {
        switchCard(envelopeSection, nameSection);
    }, 400);
});

startBtn.addEventListener("click", () => {
    const name = playerNameInput.value.trim();
    if (name === "") {
        alert("Mohon masukkan nama kamu dulu ya!");
        return;
    }
    playerName = name;
    switchCard(nameSection, quizSection);
    loadQuestion();
});

function loadQuestion() {
    if (typingInterval) clearInterval(typingInterval);

    quizSection.classList.remove("fade-in-content");
    void quizSection.offsetWidth;
    quizSection.classList.add("fade-in-content");

    const currentQuiz = quizData[currentQuestionIndex];
    questionCounter.textContent = `Soal ${currentQuestionIndex + 1} dari ${quizData.length}`;
    scoreDisplay.textContent = `Poin: ${score}`;

    questionText.textContent = "";
    optionsContainer.innerHTML = "";

    const fullText = currentQuiz.question;
    let charIndex = 0;

    typingInterval = setInterval(() => {
        if (charIndex < fullText.length) {
            questionText.textContent += fullText.charAt(charIndex);
            charIndex++;
        } else {
            clearInterval(typingInterval);
            renderOptions(currentQuiz.options);
        }
    }, 35);
}

function renderOptions(options) {
    optionsContainer.innerHTML = "";
    options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-btn");
        button.addEventListener("click", () => selectAnswer(index, button));
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex, selectedButton) {
    const currentQuiz = quizData[currentQuestionIndex];

    const allButtons = optionsContainer.querySelectorAll(".option-btn");
    allButtons.forEach(btn => (btn.disabled = true));

    if (selectedIndex === currentQuiz.correct) {
        score += 10;
        selectedButton.style.backgroundColor = "#2ed573";
        selectedButton.style.color = "white";
        selectedButton.style.borderColor = "#2ed573";
    } else {
        selectedButton.style.backgroundColor = "#ff4757";
        selectedButton.style.color = "white";
        selectedButton.style.borderColor = "#ff4757";

        allButtons[currentQuiz.correct].style.backgroundColor = "#2ed573";
        allButtons[currentQuiz.correct].style.color = "white";
        allButtons[currentQuiz.correct].style.borderColor = "#2ed573";
    }

    currentQuestionIndex++;

    setTimeout(() => {
        if (currentQuestionIndex < quizData.length) {
            loadQuestion();
        } else {
            switchCard(quizSection, resultSection);
            showResult();
            saveScoreToFirebase(playerName, score);
        }
    }, 600);
}

function showResult() {
    resultMessage.textContent = `Hebat, ${playerName}! Kamu sudah menyelesaikan kuis tentang saya.`;
    finalScore.textContent = `Total Skor: ${score} / 100`;

    let customRemark = "";
    if (score >= 10 && score <= 20) {
        customRemark = "Kita tidak terlalu kenal ternyata";
    } else if (score >= 30 && score <= 40) {
        customRemark = "Ternyata kita sudah agak saling kenal ya";
    } else if (score >= 50 && score <= 70) {
        customRemark = "Kita lumayan deket ya";
    } else if (score >= 80 && score <= 100) {
        customRemark =
            "Kalo kamu cewe kita harus pacaran kita udah deket, kalo kamu cowo kita juga harus pacaran udah se deket ini lo👉👈";
    } else {
        customRemark = "asing nih wkwk!";
    }

    let remarkElement = document.getElementById("custom-remark");
    if (!remarkElement) {
        remarkElement = document.createElement("p");
        remarkElement.id = "custom-remark";
        remarkElement.style.fontWeight = "bold";
        remarkElement.style.color = "#444";
        remarkElement.style.marginTop = "15px";
        remarkElement.style.marginBottom = "20px";
        finalScore.insertAdjacentElement("afterend", remarkElement);
    }
    remarkElement.textContent = customRemark;
}

async function saveScoreToFirebase(name, finalScore) {
    try {
        await addDoc(collection(db, "skor_kuis"), {
            nama: name,
            skor: finalScore,
            waktu: new Date().toISOString()
        });
        console.log("Data skor berhasil disimpan ke Firebase!");
    } catch (e) {
        console.error("Gagal menyimpan data ke Firebase: ", e);
    }
}

restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    playerNameInput.value = "";
    openEnvelopeBtn.classList.remove("open");
    switchCard(resultSection, envelopeSection);
});
