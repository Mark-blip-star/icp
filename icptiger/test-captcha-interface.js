// Test script for the new captcha interface
// This simulates the frontend captcha handling

console.log("🧪 Testing new captcha interface...");

// Simulate captcha data from backend
const captchaData = {
  type: "linkedin",
  captchaSiteKey: "3117BF26-4762-4F5A-8ED9-A85E69209A46",
  challengeId:
    "AQF9ns4PIblJnQAAAZiDuXR9qHWVNuPlWRYQxRvfJnYoPwl9AS24qxyPpt4i-hNp7Bn60FAlF03ok8kLIQHLWZ_RvZZeeuNMKA",
  csrfToken: "ajax:9101987644365017010",
  captchaUrl:
    "https://www.linkedin.com/checkpoint/challenge/AgGAJ6Q2UG167AAAAZiDuXOB0q0BwYuTBwggkcmr1j1ezvIAKXIHXRjil...",
  pageTitle: "Перевірка безпеки | LinkedIn",
  pageContent: "Давайте проведемо швидку перевірку безпеки",
};

console.log("📋 Captcha data:", captchaData);

// Simulate the captcha solved callback
const onCaptchaSolved = (token) => {
  console.log("✅ Captcha solved with token:", token.substring(0, 20) + "...");

  // Simulate sending token to backend
  console.log("📤 Sending token to backend...");

  // In real scenario, this would be a fetch to /api/linkedin/continue-after-captcha
  setTimeout(() => {
    console.log("🎉 Backend processed token successfully!");
    console.log("🔐 Login completed with cookies");
  }, 2000);
};

// Simulate the captcha interface creation
console.log("🎯 Creating captcha interface...");

// Create container
const container = document.createElement("div");
container.id = "arkose-iframe-container";
container.style.cssText = `
  background: white;
  border-radius: 8px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
`;

// Add LinkedIn logo
const logo = document.createElement("div");
logo.innerHTML = `
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#0077B5">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
`;
container.appendChild(logo);

// Add title
const title = document.createElement("h3");
title.textContent = "Захист вашого облікового запису";
title.style.cssText = `
  font-size: 18px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  color: #191919;
`;
container.appendChild(title);

// Add description
const description = document.createElement("p");
description.textContent = "Будь ласка, розв'яжіть цей пазл, щоб ми знали, що Ви є реальною людиною";
description.style.cssText = `
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
  line-height: 1.4;
`;
container.appendChild(description);

// Add puzzle area
const puzzleArea = document.createElement("div");
puzzleArea.style.cssText = `
  background: #f3f2ef;
  border-radius: 8px;
  padding: 20px;
  margin: 16px 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// Add puzzle icon
const puzzleIcon = document.createElement("div");
puzzleIcon.innerHTML = "🧩";
puzzleIcon.style.cssText = `
  font-size: 48px;
  margin-bottom: 16px;
`;
puzzleArea.appendChild(puzzleIcon);

// Add puzzle text
const puzzleText = document.createElement("p");
puzzleText.textContent = "Пазл завантажується...";
puzzleText.style.cssText = `
  font-size: 14px;
  color: #666;
  margin: 0;
`;
puzzleArea.appendChild(puzzleText);

container.appendChild(puzzleArea);

// Add start button
const startButton = document.createElement("button");
startButton.textContent = "Розпочати пазл";
startButton.style.cssText = `
  background: #0077B5;
  color: white;
  border: none;
  border-radius: 24px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  margin: 16px 0;
  transition: background-color 0.2s;
`;

// Add hover effect
startButton.onmouseenter = () => {
  startButton.style.background = "#005885";
};
startButton.onmouseleave = () => {
  startButton.style.background = "#0077B5";
};

// Add click handler
startButton.onclick = () => {
  console.log('🎯 User clicked "Start Puzzle" button');

  // Simulate puzzle solving process
  puzzleText.textContent = "Розв'язування пазлу...";
  startButton.disabled = true;
  startButton.textContent = "Розв'язування...";
  startButton.style.background = "#ccc";

  // Simulate solving time
  setTimeout(() => {
    puzzleText.textContent = "Пазл розв'язано!";
    puzzleIcon.innerHTML = "✅";
    puzzleIcon.style.fontSize = "32px";

    // Generate a simulated token
    const simulatedToken = `linkedin-captcha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    console.log("✅ Simulated captcha solved, token:", simulatedToken.substring(0, 20) + "...");

    // Call the callback with the token
    onCaptchaSolved(simulatedToken);
  }, 3000);
};

container.appendChild(startButton);

// Add challenge ID if available
if (captchaData.challengeId) {
  const challengeId = document.createElement("div");
  challengeId.textContent = captchaData.challengeId;
  challengeId.style.cssText = `
    font-size: 12px;
    color: #999;
    font-family: monospace;
    margin-top: 16px;
  `;
  container.appendChild(challengeId);
}

// Add alternative option to open in new window
const alternativeOption = document.createElement("div");
alternativeOption.style.cssText = `
  margin-top: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
`;

const alternativeText = document.createElement("p");
alternativeText.textContent = "Або відкрийте капчу в новому вікні:";
alternativeText.style.cssText = `
  font-size: 14px;
  color: #666;
  margin: 0 0 12px 0;
`;
alternativeOption.appendChild(alternativeText);

const openWindowButton = document.createElement("button");
openWindowButton.textContent = "Відкрити капчу в новому вікні";
openWindowButton.style.cssText = `
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  margin-right: 8px;
`;

openWindowButton.onclick = () => {
  console.log("🌐 Opening captcha in new window...");
  const captchaUrl = captchaData.captchaUrl || "https://www.linkedin.com/checkpoint/challenge";
  window.open(captchaUrl, "_blank", "width=800,height=600");
};

alternativeOption.appendChild(openWindowButton);

const manualButton = document.createElement("button");
manualButton.textContent = "Я вирішив капчу вручну";
manualButton.style.cssText = `
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
`;

manualButton.onclick = () => {
  console.log("👤 User manually solved captcha");
  const manualToken = `manual-captcha-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  onCaptchaSolved(manualToken);
};

alternativeOption.appendChild(manualButton);
container.appendChild(alternativeOption);

// Add to page for testing
document.body.appendChild(container);

console.log("✅ Captcha interface created and added to page");
console.log("🎯 You can now test the interface by clicking the buttons");
