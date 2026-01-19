const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = "en-IN";

let finalText = "";

const chatArea = document.getElementById("chatArea");
const waveform = document.getElementById("waveform");

/* Speech result */
recognition.onresult = (event) => {
    let text = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
    }

    text = punctuate(text);
    finalText += text + " ";

    logSession(text);
    typeMessage(text);
};

/* Typing animation */
function typeMessage(text) {
    const msg = document.createElement("div");
    msg.className = "message user";
    chatArea.appendChild(msg);

    let i = 0;
    const interval = setInterval(() => {
        msg.textContent += text.charAt(i);
        i++;
        chatArea.scrollTop = chatArea.scrollHeight;
        if (i >= text.length) clearInterval(interval);
    }, 20);
}

/* Start / Stop */
function startListening() {
    recognition.start();
    waveform.classList.add("active");
}

function stopListening() {
    recognition.stop();
    waveform.classList.remove("active");
}

/* Restart */
function restart() {
    stopListening();
    finalText = "";
    chatArea.innerHTML = `<div class="message system">Click Start and speak.</div>`;
}

/* Theme */
function toggleTheme() {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
}

/* Language */
function changeLanguage() {
    recognition.lang = document.getElementById("language").value;
}

/* Punctuation correction */
function punctuate(text) {
    text = text.trim();
    text = text.charAt(0).toUpperCase() + text.slice(1);
    if (!/[.!?]$/.test(text)) text += ".";
    return text;
}

/* Summarization (heuristic) */
function summarizeText() {
    const sentences = finalText.split(".");
    const summary = sentences.slice(0, 3).join(".") + ".";
    typeMessage("Summary: " + summary);
}

/* Backend logging (localStorage) */
function logSession(text) {
    const logs = JSON.parse(localStorage.getItem("speechLogs")) || [];
    logs.push({
        time: new Date().toLocaleString(),
        lang: recognition.lang,
        text: text
    });
    localStorage.setItem("speechLogs", JSON.stringify(logs));
}

/* Export PDF */
function exportPDF() {
    const win = window.open("", "", "width=800,height=600");
    win.document.write(`<pre>${finalText}</pre>`);
    win.print();
}

/* Export DOCX */
function exportDOC() {
    const blob = new Blob([finalText], { type: "application/msword" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "speech.docx";
    link.click();
}
