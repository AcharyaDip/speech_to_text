let recognition;
let listening = false;

const speechBox = document.getElementById("speechText");
const summaryBox = document.getElementById("summaryText");

/* ================= SPEECH ================= */

function initSpeech() {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = document.getElementById("language").value;

    recognition.onresult = (event) => {
        let finalText = "";
        let interimText = "";

        for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalText += event.results[i][0].transcript + " ";
            } else {
                interimText += event.results[i][0].transcript + " ";
            }
        }

        speechBox.innerHTML =
            finalText +
            `<span class="live-highlight">${interimText}</span>`;
    };
}

function startListening() {
    if (!recognition) initSpeech();
    recognition.start();
    listening = true;
}

function stopListening() {
    if (recognition && listening) {
        recognition.stop();
        listening = false;
    }
}

/* ================= LANGUAGE ================= */

function changeLanguage() {
    if (recognition) {
        recognition.lang = document.getElementById("language").value;
    }
}

/* ================= SUMMARY ================= */

function summarizeText() {
    const text = speechBox.innerText.trim();
    if (!text) return;

    /* Offline fallback summary */
    const summary =
        text.split(".").slice(0, 3).join(".") + ".";

    summaryBox.innerText = summary;
}

/* ================= AUTO-SAVE ================= */

summaryBox.addEventListener("input", () => {
    localStorage.setItem("savedSummary", summaryBox.innerHTML);
});

window.addEventListener("load", () => {
    const saved = localStorage.getItem("savedSummary");
    if (saved) summaryBox.innerHTML = saved;
});

/* ================= FORMAT ================= */

function formatText(cmd) {
    document.execCommand(cmd, false, null);
}

function setAlignment(value) {
    summaryBox.style.textAlign = value;
}

function setFontSize(size) {
    summaryBox.style.fontSize = size + "px";
}

/* ================= EXPORT ================= */

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    pdf.text(summaryBox.innerText, 10, 10);
    pdf.save("summary.pdf");
}

function exportDOC() {
    const text = summaryBox.innerText;

    const doc = new docx.Document({
        sections: [{
            children: [new docx.Paragraph(text)]
        }]
    });

    docx.Packer.toBlob(doc).then(blob => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "summary.docx";
        link.click();
    });
}

/* ================= RESET ================= */

function restartAll() {
    stopListening();
    speechBox.innerHTML = "Click <strong>Start</strong> and speak.";
    summaryBox.innerHTML = "Summary will appear here. You can edit manually.";
    localStorage.removeItem("savedSummary");
}

/* ================= UI ================= */

function toggleTheme() {
    document.body.classList.toggle("dark");
}

function toggleAcademicMode() {
    document.body.classList.toggle("academic-mode");
}
/* ================= THEME TOGGLE ================= */
function toggleTheme() {
    if (document.body.classList.contains('dark')) {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
    } else {
        document.body.classList.remove('light');
        document.body.classList.add('dark');
    }
}

function setHighContrast() {
    document.body.classList.remove('dark','light','blue-theme','purple-theme','green-theme');
    document.body.classList.add('high-contrast');
}

function setPreset(color) {
    document.body.classList.remove('dark','light','high-contrast','blue-theme','purple-theme','green-theme');
    document.body.classList.add(`${color}-theme`);
}
