async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatBox = document.getElementById("chatBox");
  const message = input.value.trim();

  if (!message) return;

  // 사용자 메시지 표시
  appendMessage("user", message);
  input.value = "";

  // 로딩 표시
  const loadingEl = appendMessage("ai", "입력 중...");

  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: message })
    });

    const data = await response.json();

    // 로딩 제거 후 응답 표시
    loadingEl.remove();
    appendMessage("ai", data.reply || "오류가 발생했습니다.");

  } catch (error) {
    loadingEl.remove();
    appendMessage("ai", "서버에 연결할 수 없습니다. server.py가 실행 중인지 확인하세요.");
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendMessage(role, text) {
  const chatBox = document.getElementById("chatBox");
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}
