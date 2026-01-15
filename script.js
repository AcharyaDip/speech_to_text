const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-IN";
recognition.continuous = true;

recognition.onresult = function (event) {
    let text = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
    }
    document.getElementById("output").value = text;
};

function startListening() {
    recognition.start();
}

function saveText() {
    const text = document.getElementById("output").value;
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "speech_text.txt";
    link.click();
}
