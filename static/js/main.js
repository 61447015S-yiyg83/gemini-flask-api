function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        btn.innerText = "切換淺色模式";
    } else {
        btn.innerText = "切換深色模式";
    }
}

function handleKeyPress(event) {
    if (event.key === "Enter") sendMessage();
}

async function sendMessage() {
    const inputField = document.getElementById("message-input");
    const message = inputField.value.trim();
    if (!message) return;

    const chatBox = document.getElementById("chat-box");
    
    chatBox.innerHTML += `<div class="msg-bubble user-msg">${message}</div>`;
    inputField.value = "";
    
    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `<div class="msg-bubble bot-msg loading" id="${loadingId}">Gemini 運算中...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},            
            body: JSON.stringify({ message: message })
        });
        const data = await response.json();
        
        document.getElementById(loadingId).remove();
        
        if (response.ok && data.response) {
            const parsedHTML = marked.parse(data.response);
            chatBox.innerHTML += `<div class="msg-bubble bot-msg">${parsedHTML}</div>`;
        } else {
            chatBox.innerHTML += `<div class="msg-bubble bot-msg" style="color:red;">錯誤：${data.error}</div>`;
        }
    } catch (error) {
        document.getElementById(loadingId).remove();
        chatBox.innerHTML += `<div class="msg-bubble bot-msg" style="color:red;">連線失敗，請檢查伺服器狀態。</div>`;
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
}