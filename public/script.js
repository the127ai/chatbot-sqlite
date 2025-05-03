
let qnaData = [];

fetch('/api/data')
  .then(res => res.json())
  .then(data => qnaData = data);

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";

  const response = getBotResponse(message);
  setTimeout(() => {
    addMessage("bot", response);
  }, 500);
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const div = document.createElement("div");
  div.className = `message ${sender}`;
  div.textContent = `${sender === "bot" ? "Bot" : "Kamu"}: ${text}`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(message) {
  const lower = message.toLowerCase();
  for (let item of qnaData) {
    if (lower.includes(item.question.toLowerCase())) {
      return item.answer;
    }
  }
  return "Maaf, aku belum tahu jawabannya.";
}

function trainBot() {
  const question = document.getElementById("new-question").value.trim();
  const answer = document.getElementById("new-answer").value.trim();

  if (!question || !answer) return alert("Isi pertanyaan dan jawaban dulu ya!");

  fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, answer })
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    qnaData.push({ question, answer });
    document.getElementById("new-question").value = "";
    document.getElementById("new-answer").value = "";
  });
}
