/*!
 * MAAC Chat Widget
 * Single File Embeddable Widget
 * Usage:
 *
 * <script src="chat-widget.js"></script>
 * <script>
 *   MAACChatWidget.init({
 *     sap_codes: [1004138, 1004180, 1004712],
 *     p_source: "Center",
 *     s_source: "CL"
 *   });
 * </script>
 */

(function (window, document) {
  "use strict";

  // ========================================
  // CONFIG
  // ========================================

  const WS_URL =
    "wss://6v265hlzxc.execute-api.ap-south-1.amazonaws.com/prod/";

  let widgetConfig = {
    sap_codes: [],
    p_source: "Center",
    s_source: "CL",
  };

  let ws = null;
  let reconnectTimeout = null;
  let heartbeatInterval = null;

  let isTyping = false;
  let isMaximized = false;
  let botMessageBuffer = "";

  let messages = [
    {
      type: "bot",
      text: `How may I assist you?<br />
      <span>
        By sharing your details, you agree that our team may contact you via call, SMS, or email.
      </span>`,
      buttons: [],
      time: new Date(),
    },
  ];

  const botIcon =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' rx='24' fill='%23ecb011'/%3E%3Cpath d='M27 39c0-9.4 7.6-17 17-17h8c9.4 0 17 7.6 17 17v11c0 9.4-7.6 17-17 17H40L27 76V39z' fill='%23000'/%3E%3Ccircle cx='41' cy='45' r='4' fill='%23ecb011'/%3E%3Ccircle cx='56' cy='45' r='4' fill='%23ecb011'/%3E%3Cpath d='M39 56c5.7 3.3 12.3 3.3 18 0' stroke='%23ecb011' stroke-width='4' stroke-linecap='round' fill='none'/%3E%3C/svg%3E";
  const sendIcon =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%23ecb011'/%3E%3Cpath d='M13 24 35 13 29 35l-5-9-11-2z' fill='%23000'/%3E%3C/svg%3E";

  // ========================================
  // LOAD EXTERNAL LIBS
  // ========================================

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement("script");

      script.src = src;
      script.async = true;

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  // ========================================
  // INIT
  // ========================================

  async function init(config = {}) {
    widgetConfig = {
      ...widgetConfig,
      ...config,
    };

    await loadScript(
      "https://cdn.jsdelivr.net/npm/marked/marked.min.js"
    );

    await loadScript(
      "https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.min.js"
    );

    injectStyles();

    injectHTML();

    bindEvents();

    connectWebSocket();

    renderMessages();
  }

  // ========================================
  // HTML
  // ========================================

  function injectHTML() {
    const wrapper = document.createElement("div");

    wrapper.id = "maac-chat-widget-wrapper";

    wrapper.innerHTML = `
    
      <div class="chat-container">

        <!-- Floating Icon -->
        <div class="chatbot" id="chatToggle">

          <img
            src="${botIcon}"
            alt="Chatbot"
            class="bot-icon"
          />

          <div class="bubble">
            Ask<br />
            Me
          </div>

        </div>

        <!-- Chat UI -->
        <div class="chat-ui" id="chatUI">

          <div class="chat-header" id="chatHeader">

            <div class="chat-header-left">

              <img
                src="${botIcon}"
                class="chat-header-icon"
              />

              <div>
                <h4>Hello!</h4>
                <p>Ask MAAC Mate</p>
              </div>

            </div>

            <div class="chat-header-right">

              <div class="status-wrapper">
                <span
                  class="status-dot connecting"
                  id="statusDot"
                ></span>

                <span
                  class="status-text"
                  id="statusText"
                >
                  Reconnecting...
                </span>
              </div>

              <button id="minimizeBtn">—</button>

              <button id="maximizeBtn">⬜</button>

              <button id="closeBtn">×</button>

            </div>

          </div>

          <div
            class="chat-messages"
            id="chatMessages"
          ></div>

          <div class="chat-input">

            <input
              type="text"
              id="chatInput"
              placeholder="Type your message here"
            />

            <img
              src="${sendIcon}"
              id="sendBtn"
              alt="Send"
            />

          </div>

          <div class="chat-disclaimer">
            MAAC Mate is learning, smart,
            speedy, and doing its best.
          </div>

        </div>

      </div>
    `;

    document.body.appendChild(wrapper);
  }

  // ========================================
  // STYLES
  // ========================================

  function injectStyles() {
    const style = document.createElement("style");

    style.innerHTML = `
    
    #maac-chat-widget-wrapper *{
      box-sizing:border-box;
      font-family:"Raleway",sans-serif;
    }

    .chat-container{
      position:fixed;
      bottom:0;
      right:0;
      z-index:999999;
    }

    .chat-container p{
      margin:0;
      padding:0;
      min-width:45px;
    }

    .chat-container .chat-ui{
      position:absolute;
      bottom:90px;
      right:30px;
      width:50vh;
      min-width:340px;
      height:80vh;
      background:#fff;
      box-shadow:0 4px 20px rgba(0,0,0,.3);
      flex-direction:column;
      overflow:hidden;
      transition:all .3s ease;
      animation:fadeInUp .3s ease;
      z-index:999999;
      display:none;
      border-radius:16px;
    }

    .chat-ui{
      opacity:0;
      visibility:hidden;
      transform:translateY(20px);
      transition:all .3s ease;
    }
    
    .chat-ui {
        animation: fadeInUp 0.3s ease;
    }

    @keyframes fadeInUp {
        from {
        transform: translateY(20px);
        opacity: 0;
        }
        to {
        transform: translateY(0);
        opacity: 1;
        }
    }

    .chat-ui.open{
      opacity:1;
      visibility:visible;
      transform:translateY(0);
      display:flex;
    }

    .chat-container .chat-ui.maximized{
      width:90vw;
      height:85vh;
      top:5vh;
      left:5vw;
      right:unset;
      bottom:unset;
      border-radius:12px;
      position:fixed;
    }

    .chat-container .chat-header{
      background:linear-gradient(
        196deg,
        #bc2329 12.53%,
        #fbc51d 90.33%
      );
      color:#fff;
      padding:8px 12px;
      display:flex;
      align-items:center;
      justify-content:space-between;
      cursor:grab;
    }

    .chat-container .chat-header:active{
      cursor:grabbing;
    }

    .chat-header-left{
      display:flex;
      align-items:center;
      gap:10px;
    }

    .chat-header-icon{
      width:45px;
      height:45px;
      object-fit:cover;
      border-radius:50%;
    }

    .chat-header h4{
      margin:0;
      font-size:18px;
      color:#000;
    }

    .chat-header p{
      margin:0;
      font-size:13px;
      color:#000;
      font-weight:600;
    }

    .chat-header-right{
      display:flex;
      align-items:center;
      gap:8px;
    }

    .chat-header-right button{
      width:28px;
      height:28px;
      border:none;
      background:rgba(255,255,255,.15);
      color:#fff;
      border-radius:6px;
      cursor:pointer;
      transition:.2s;
    }

    .chat-header-right button:hover{
      background:rgba(255,255,255,.3);
    }

    .status-wrapper{
      display:flex;
      align-items:center;
      gap:5px;
      font-size:11px;
    }

    .status-dot{
      width:10px;
      height:10px;
      border-radius:50%;
    }

    .status-dot.online{
      background:#4caf50;
      box-shadow:0 0 6px #4caf50;
    }

    .status-dot.connecting{
      background:#ffc107;
      animation: blink 1s infinite;
    }

    .status-dot.offline{
      background:#bbb;
    }

    @keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
    }
    70% {
        box-shadow: 0 0 0 6px rgba(76, 175, 80, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
    }
    }

    @keyframes blink {
    0%,
    100% {
        opacity: 1;
    }
    50% {
        opacity: 0.3;
    }
    }

    .chat-messages{
      flex:1;
      padding:15px;
      background:linear-gradient(
        180deg,
        #f5f5f5 0%,
        #ececec 100%
      );
      overflow-y:auto;
      display:flex;
      flex-direction:column;
      gap:6px;
    }

    .chat-messages::-webkit-scrollbar{
      width:4px;
    }

    .chat-messages::-webkit-scrollbar-thumb{
      background:#821131;
    }

    .message{
      max-width:80%;
      padding:10px 12px 18px;
      border-radius:12px;
      margin-bottom:10px;
      line-height:1.5;
      font-size:14px;
      word-wrap:break-word;
      box-shadow:0 2px 8px rgba(0,0,0,.15);
    }

    .message.bot{
      background:rgba(255,255,255,.9);
      color:#222;
      align-self:flex-start;
      border-bottom-left-radius:4px;
    }

    .message.user{
      background:#bc2329;
      color:#fff;
      align-self:flex-end;
      border-bottom-right-radius:4px;
      min-width:90px;
    }

    .message-content{
      position:relative;
      display:inline-block;
      padding-right:40px;
    }
    
    .message-content a{
        color: #ffd966;
        text-decoration: none;
        pointer-events: none;
        cursor: default;
    }

    .message-content span{
      font-style:italic;
      font-size:12px;
      display:inline-block;
      margin-top:5px;
    }

    .message-time{
      position:absolute;
      bottom:-12px;
      right:2px;
      font-size:10px;
      color:rgba(0,0,0,.45);
    }

    .message.user .message-time{
      color:rgba(254, 240, 240, 0.45);
    }

    .chat-input{
      display:flex;
      align-items:center;
      border-top:1px solid #ddd;
      padding:10px;
      background:#fff;
    }

    .chat-input input{
      flex:1;
      border:1px solid #8d1131;
      border-radius:20px;
      padding:10px;
      font-size:14px;
      outline:none;
    }

    .chat-input img{
      width:30px;
      height:30px;
      margin-left:10px;
      cursor:pointer;
    }

    .chatbot{
      position:fixed;
      bottom:20px;
      right:30px;
      cursor:pointer;
      z-index:999999;
    }

    .bot-icon{
      width:75px;
      height:75px;
      transition:transform .2s ease;
    }

    .bot-icon:hover{
      transform:scale(1.05);
    }

    .bubble{
      position:absolute;
      top:-40px;
      left:55px;
      background:#fff;
      padding:14px 12px;
      border-radius:50rem;
      font-size:14px;
      box-shadow:0 4px 10px rgba(0,0,0,.2);
      animation:bubbleLoop 3s infinite;
      color:#000;
      width:50px;
      height:50px;
      text-align:center;
      line-height:16px;
      font-weight:600;
    }

    .bubble::after{
      content:"";
      position:absolute;
      bottom:-8px;
      left:18px;
      width:14px;
      height:14px;
      background:#fff;
      border-radius:50%;
    }

    .bubble::before{
      content:"";
      position:absolute;
      bottom:-16px;
      left:10px;
      width:8px;
      height:8px;
      background:#fff;
      border-radius:50%;
    }

    .typingIndicator{
      display:flex;
      align-items:center;
      height:22px;
    }

    .dot{
      width:6px;
      height:6px;
      margin:0 3px;
      border-radius:50%;
      background:#ecb011;
      animation:typing 1.4s infinite ease-in-out;
    }
    
    .dot:nth-child(1) {
    animation-delay: 0s;
    background-color: #ecb011;
    }

    .dot:nth-child(2) {
    animation-delay: 0.2s;
    background-color: #bf2420;
    }

    .dot:nth-child(3) {
    animation-delay: 0.4s;
    background-color: #bf2420;
    }

    @keyframes typing {
    0%,
    60%,
    100% {
        transform: translateY(0);
        opacity: 0.6;
    }
    30% {
        transform: translateY(-5px);
        opacity: 1;
    }
    }

    .chat-buttons{
      display:flex;
      gap:8px;
      margin-top:8px;
      flex-wrap:wrap;
    }

    .chat-btn{
      padding:6px 12px;
      border:none;
      background:linear-gradient(
        196deg,
        #c62828 10%,
        #f57c00 100%
      );
      color:#fff;
      border-radius:16px;
      cursor:pointer;
      font-size:13px;
      transition:.3s;
    }

    .chat-btn:hover{
      transform:translateY(-2px);
    }

    .chat-btn:disabled {
        background: #ccc;              // neutral color
        color: #666;                  // dim text
        cursor: not-allowed;          // shows disabled cursor
        transform: none;              // stop hover lift
        box-shadow: none;             // remove elevation
        opacity: 0.7;                 // slightly faded
    }

    .chat-btn:disabled:hover {
        background: #ccc;             // keep same as disabled
        transform: none;
        box-shadow: none;
    }

    .chat-disclaimer{
      font-size:11px;
      color:#333;
      margin:0 auto 10px;
      padding:4px;
      text-align:center;
      font-style:italic;
    }

    @keyframes typing{
      0%,60%,100%{
        transform:translateY(0);
        opacity:.6;
      }
      30%{
        transform:translateY(-5px);
        opacity:1;
      }
    }

    @keyframes fadeInUp{
      from{
        transform:translateY(20px);
        opacity:0;
      }
      to{
        transform:translateY(0);
        opacity:1;
      }
    }

    @keyframes bubbleLoop{
      0%{
        opacity:0;
        transform:translateY(10px) scale(.8);
      }
      20%{
        opacity:1;
        transform:translateY(0) scale(1);
      }
      60%{
        opacity:1;
        transform:translateY(0) scale(1);
      }
      80%{
        opacity:0;
        transform:translateY(10px) scale(.8);
      }
      100%{
        opacity:0;
      }
    }

    @media(max-width:768px){

      .chat-container .chat-ui{
        width:96vw;
        height:80vh;
        right:2vw;
        bottom:90px;
      }

      .chat-container .chat-ui.maximized{
        width:100vw;
        height:100vh;
        top:0;
        left:0;
        border-radius:0;
      }

    }

    `;
    document.head.appendChild(style);
  }

  // ========================================
  // FORMAT TIME
  // ========================================

  function formatTime(date) {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // ========================================
  // RENDER
  // ========================================

  function renderMessages() {
    const chatMessages =
      document.getElementById("chatMessages");

    if (!chatMessages) return;

    chatMessages.innerHTML = "";

    messages.forEach((msg, index) => {
      const wrapper =
        document.createElement("div");

      wrapper.className = `message ${msg.type}`;

      let html = marked.parse(msg.text || "");

      html = DOMPurify.sanitize(html);

      wrapper.innerHTML = `
      
        <div class="message-content">

          ${html}

          ${
            msg.buttons?.length
              ? `
            <div class="chat-buttons">

              ${msg.buttons
                .map(
                  (btn) => `
                  <button class="chat-btn" data-msg-index="${index}" ${msg.buttonsDisabled ? "disabled" : ""}>
                    ${btn}
                  </button>
                `
                )
                .join("")}

            </div>
          `
              : ""
          }

          <span class="message-time">
            ${formatTime(msg.time)}
          </span>

        </div>
      `;

    //   const buttons =
    //     wrapper.querySelectorAll(".chat-btn");

    //   buttons.forEach((button, btnIndex) => {
    //     button.addEventListener("click", () => {
    //       handleButtonClick(
    //         msg.buttons[btnIndex],
    //         index
    //       );
    //     });
    //   });
    const buttons =
  wrapper.querySelectorAll(".chat-btn");

buttons.forEach((button, btnIndex) => {

  button.addEventListener("click", () => {

    // PREVENT DOUBLE CLICK
    if (msg.buttonsDisabled) return;

    // DISABLE THIS BUTTON GROUP
    messages[index].buttonsDisabled = true;

    renderMessages();

    handleButtonClick(
      msg.buttons[btnIndex]
    );

  });

});

      chatMessages.appendChild(wrapper);
    });

    if (isTyping) {
      const typing =
        document.createElement("div");

      typing.className = "message bot";

      typing.innerHTML = `
      
        <div class="typingIndicator">

          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>

        </div>
      `;

      chatMessages.appendChild(typing);
    }

    scrollToBottom();
  }

  // ========================================
  // SCROLL
  // ========================================

  function scrollToBottom() {
    const chatMessages =
      document.getElementById("chatMessages");

    if (!chatMessages) return;

    chatMessages.scrollTop =
      chatMessages.scrollHeight;
  }

  // ========================================
  // STATUS
  // ========================================

  function setConnectionStatus(status) {
    const statusDot =
      document.getElementById("statusDot");

    const statusText =
      document.getElementById("statusText");

    if (!statusDot || !statusText) return;

    statusDot.className =
      `status-dot ${status}`;

    if (status === "online") {
      statusText.innerText = "Online";
    }

    if (status === "connecting") {
      statusText.innerText =
        "Reconnecting...";
    }

    if (status === "offline") {
      statusText.innerText = "Offline";
    }
  }

  // ========================================
  // PAYLOAD
  // ========================================

  function buildPayload(message) {
    return {
      action: "sendmessage",
      message,
      attributes: {
        p_source: widgetConfig.p_source,

        s_source:
          widgetConfig.s_source +
          "-chatbot",

        page_path:
          window.location.pathname.replace(
            "/",
            "_"
          ) || "homepage",

        sap_codes:
          widgetConfig.sap_codes,
      },
    };
  }

  // ========================================
  // WEBSOCKET
  // ========================================

  function connectWebSocket() {
    console.log("🔌 Connecting WebSocket...");
    ws = new WebSocket(WS_URL);

    setConnectionStatus("connecting");

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setConnectionStatus("online");

      heartbeatInterval = setInterval(() => {
        if (
          ws.readyState ===
          WebSocket.OPEN
        ) {
          ws.send(
            JSON.stringify({
              action: "ping",
            })
          );
          console.log("Heartbeat sent");
        }
      }, 5 * 60 * 1000);
    };

    ws.onmessage = (event) => {
      let parsed;

      try {
        parsed = JSON.parse(event.data);
      } catch (e) {
        return;
      }
      // STOP TYPING HERE
    //   isTyping = false;

      if (
        parsed?.text ===
        "##CONVERSATION_ENDED##"
      ) {
        const last =
            messages[messages.length - 1];

            if (last && last.type === "bot") {
            last.isStreaming = false;
            }
        // isTyping = false;
        botMessageBuffer = "";
        renderMessages();
        return;
      }

      if (
        parsed.text === undefined &&
        parsed.buttons === undefined
      ) {
        return;
      }

    //   if (botMessageBuffer === "") {
    //     isTyping = false;
    //   }
    if (
        typeof parsed.text === "string" &&
        parsed.text.trim() !== ""
    ) {

        // STOP TYPING WHEN BOT STARTS RESPONDING
        isTyping = false;

    }

      if (
        typeof parsed.text === "string"
      ) {
        botMessageBuffer += parsed.text;
      }

      const last =
        messages[messages.length - 1];

      // STREAM INTO CURRENT BOT MESSAGE
      if (last && last.type === "bot" && last.isStreaming) {
        last.text = botMessageBuffer;

        last.buttons =
          parsed.buttons ||
          last.buttons ||
          [];
        // CREATE NEW BOT MESSAGE
      } else {
        messages.push({
          type: "bot",
        //   text: parsed.text || "",
          text: botMessageBuffer,
          buttons:
            parsed.buttons || [],
          buttonsDisabled: false,
          isStreaming: true,
          time: new Date(),
        });
      }

      renderMessages();
    };

    ws.onclose = () => {
      console.log("❌ WebSocket disconnected");
      setConnectionStatus("connecting");

      clearInterval(heartbeatInterval);

      reconnectTimeout = setTimeout(() => {
        connectWebSocket();
      }, 3000);
    };

    ws.onerror = () => {
      console.log("⚠️ WebSocket error");
      setConnectionStatus("offline");

      ws.close();
    };
  }

  // ========================================
  // SEND MESSAGE
  // ========================================

  function handleSend() {
    const chatInput =
      document.getElementById(
        "chatInput"
      );

    const value =
      chatInput.value.trim();

    if (!value) return;

    messages = messages.map((msg) => {
      if (msg.type === "bot") {
        msg.buttons = [];
      }

      return msg;
    });

    // ADD USER MESSAGE IMMEDIATELY
    messages.push({
      type: "user",
      text: value,
      time: new Date(),
    });

    // SHOW TYPING IMMEDIATELY
    isTyping = true;

    // RENDER IMMEDIATELY
    renderMessages();

    // CLEAR INPUT IMMEDIATELY
    chatInput.value = "";

    // RESET BUFFER
    botMessageBuffer = "";

    // if (
    //   ws.readyState !==
    //   WebSocket.OPEN
    // ) {
    //   console.log("⚠ Socket not open. Reconnecting...");
    //   connectWebSocket();
    //   return;
    // }

    // SOCKET CLOSED
    // if (ws.readyState !== WebSocket.OPEN) {

    //     console.log("⚠ Socket not open. Reconnecting...");

    //     isTyping = false;

    //     renderMessages();

    //     connectWebSocket();

    //     return;
    // }

    // SOCKET CLOSED
    if (
        !ws ||
        ws.readyState !== WebSocket.OPEN
    ) {

        console.log(
        "⚠ Socket not open. Reconnecting..."
        );

        connectWebSocket();

        return;
    }


    const payload = buildPayload(value);

    console.log("📤 Sending:", payload);

    ws.send(JSON.stringify(payload));

    // ws.send(
    //   JSON.stringify(
    //     buildPayload(value)
    //   )
    // );

    // botMessageBuffer = "";

    // chatInput.value = "";
  }

  // ========================================
  // BUTTON CLICK
  // ========================================

  function handleButtonClick(text) {
    // DISABLE BUTTONS FOR THIS MESSAGE
    // if (messages[index]) {
    //     messages[index].buttonsDisabled = true;
    // }

    messages.push({
      type: "user",
      text,
      time: new Date(),
    });

    isTyping = true;

    renderMessages();

    const payload = buildPayload(text);

    console.log("📤 Sending:", payload);
    // IMPORTANT
    // RESET OLD BOT STREAM
    botMessageBuffer = "";

    ws.send(JSON.stringify(payload));
    // ws.send(
    //   JSON.stringify(
    //     buildPayload(text)
    //   )
    // );
  }

  // ========================================
  // EVENTS
  // ========================================

  function bindEvents() {
    document
      .getElementById("sendBtn")
      .addEventListener(
        "click",
        handleSend
      );

    document
      .getElementById("chatInput")
      .addEventListener(
        "keydown",
        (e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }
      );

    document
      .getElementById("chatToggle")
      .addEventListener(
        "click",
        () => {
          console.log("TOGGLE");
          document
            .getElementById("chatUI")
            .classList.toggle("open");
        }
      );

    document
      .getElementById("minimizeBtn")
      .addEventListener(
        "click",
        () => {
          document
            .getElementById("chatUI")
            .classList.remove("open");
        }
      );

    document
      .getElementById("maximizeBtn")
      .addEventListener(
        "click",
        () => {
          isMaximized = !isMaximized;

          document
            .getElementById("chatUI")
            .classList.toggle(
              "maximized",
              isMaximized
            );
        }
      );

    document
      .getElementById("closeBtn")
      .addEventListener(
        "click",
        () => {
          document
            .getElementById("chatUI")
            .classList.remove("open");

          messages = [
            {
              type: "bot",
              text: `How may I assist you?<br />
                <span>
                    By sharing your details, you agree that our team may contact you via call, SMS, or email.
                </span>`,
              buttons: [],
              time: new Date(),
            },
          ];

          renderMessages();
        }
      );

    makeDraggable(
      document.getElementById("chatUI")
    );
  }

  // ========================================
  // DRAGGABLE
  // ========================================

  function makeDraggable(element) {
    const header =
      document.getElementById(
        "chatHeader"
      );

    let offsetX = 0;
    let offsetY = 0;
    let isDown = false;

    header.addEventListener(
      "mousedown",
      (e) => {
        isDown = true;

        offsetX =
          element.offsetLeft -
          e.clientX;

        offsetY =
          element.offsetTop -
          e.clientY;
      }
    );

    document.addEventListener(
      "mouseup",
      () => {
        isDown = false;
      }
    );

    document.addEventListener(
      "mousemove",
      (e) => {
        if (!isDown) return;

        element.style.left =
          e.clientX +
          offsetX +
          "px";

        element.style.top =
          e.clientY +
          offsetY +
          "px";
      }
    );
  }

  // ========================================
  // GLOBAL EXPORT
  // ========================================

  window.MAACChatWidget = {
    init,
  };
})(window, document);