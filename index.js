import { GoogleGenerativeAI } from "@google/generative-ai";

// Your Gemini API key
const GEMINI_API_KEY = "AIzaSyB7EizqDnvJ03ozFo7c23f9X5kswPBzq9s";

// Elements
const generateStoryBtn = document.getElementById("generate-story-btn");
const storyInput = document.getElementById("story-input");
const surpriseBtn = document.getElementById("surprise-btn");
const emotionSelect = document.getElementById("emotion-select");
const saveBtn = document.getElementById("save-btn");
const downloadBtn = document.getElementById("download-btn");
const theatreModeBtn = document.getElementById("theatre-mode-btn");

// Event listeners
generateStoryBtn.addEventListener("click", generateStory);
storyInput.addEventListener("focus", handleTextAreaFocus);
storyInput.addEventListener("blur", handleTextAreaBlur);
surpriseBtn.addEventListener("click", surpriseMe);
saveBtn.addEventListener("click", saveMonoact);
downloadBtn.addEventListener("click", downloadMonoact);
theatreModeBtn.addEventListener("click", toggleTheatreMode);

// Surprise me themes
const surpriseThemes = [
  "A forgotten letter",
  "The last train",
  "Mirror reflections",
  "Whispers in the wind",
  "The unopened door",
  "A stranger's smile",
  "Lost in time",
  "The abandoned lighthouse",
  "Memories of yesterday",
  "The mysterious phone call"
];

function expandPrompt(input, emotion) {
  input = input.trim();

  if (input.length === 0) {
    displayError("Please enter a theme, phrase, or word to generate a monoact.");
    return null;
  }

  // Create prompts based on emotion
  const emotionPrompts = {
    dramatic: `Write a dramatic theatrical monologue about "${input}". Make it emotional and powerful. The monologue should be suitable for a solo performance on stage.`,
    comedic: `Write a comedic theatrical monologue about "${input}". Make it funny and engaging. The monologue should be suitable for a solo performance on stage.`,
    romantic: `Write a romantic theatrical monologue about "${input}". Make it heartfelt and touching. The monologue should be suitable for a solo performance on stage.`,
    tragic: `Write a tragic theatrical monologue about "${input}". Make it sorrowful and moving. The monologue should be suitable for a solo performance on stage.`,
    suspenseful: `Write a suspenseful theatrical monologue about "${input}". Make it tense and gripping. The monologue should be suitable for a solo performance on stage.`
  };

  return emotionPrompts[emotion] || emotionPrompts.dramatic;
}

async function generateStory() {
  let userInput = storyInput.value.trim();
  let emotion = emotionSelect.value;
  let storyPrompt = expandPrompt(userInput, emotion);
  
  if (!storyPrompt) return;

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const spinner = document.getElementById("spinner");
  spinner.style.display = "flex";

  try {
    const result = await model.generateContent(storyPrompt);
    const response = await result.response;
    let story = await response.text();

    story = story.replace(/(?:\r\n|\r|\n)/g, "<br />");

    displayStory(story);
  } catch (error) {
    console.error("Error generating monoact:", error);
    displayError("Sorry, I am having trouble generating the monoact.");
  } finally {
    spinner.style.display = "none";
  }
}

function displayStory(story) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = `<p>${story}</p>`;
}

function displayError(message) {
  const generatedContent = document.getElementById("generated-content");
  generatedContent.innerHTML = `<p class="error">${message}</p>`;
}

function handleTextAreaFocus() {
  storyInput.style.borderColor = "#f1c40f";
  storyInput.style.boxShadow = "0 0 8px rgba(255, 215, 0, 0.3)";
}

function handleTextAreaBlur() {
  if (storyInput.value.trim() === "") {
    storyInput.style.borderColor = "";
    storyInput.style.boxShadow = "";
  }
}

function surpriseMe() {
  const randomTheme = surpriseThemes[Math.floor(Math.random() * surpriseThemes.length)];
  const randomEmotionIndex = Math.floor(Math.random() * emotionSelect.options.length);
  
  storyInput.value = randomTheme;
  emotionSelect.selectedIndex = randomEmotionIndex;
  
  generateStory();
}

function saveMonoact() {
  const generatedContent = document.getElementById("generated-content");
  const content = generatedContent.innerText;
  
  if (!content || content.includes("Sorry, I am having trouble")) {
    alert("Please generate a monoact first before saving.");
    return;
  }
  
  localStorage.setItem("savedMonoact", content);
  alert("Monoact saved successfully!");
}

function downloadMonoact() {
  const generatedContent = document.getElementById("generated-content");
  const content = generatedContent.innerText;
  
  if (!content || content.includes("Sorry, I am having trouble")) {
    alert("Please generate a monoact first before downloading.");
    return;
  }
  
  const theme = storyInput.value.trim() || "Monoact";
  const emotion = emotionSelect.value;
  const filename = `${theme.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${emotion}_monoact.txt`;
  
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

let theatreModeActive = false;

function toggleTheatreMode() {
  const body = document.body;
  const container = document.querySelector(".container");
  const storyGenerator = document.querySelector(".story-generator");
  const generatedContent = document.getElementById("generated-content");
  
  theatreModeActive = !theatreModeActive;
  
  if (theatreModeActive) {
    // Save current content
    const content = generatedContent.innerHTML;
    
    // Hide everything except the content
    document.querySelectorAll("body > *").forEach(el => {
      if (el !== generatedContent) {
        el.style.display = "none";
      }
    });
    
    // Style the theatre mode
    body.style.backgroundColor = "black";
    generatedContent.style.position = "fixed";
    generatedContent.style.top = "0";
    generatedContent.style.left = "0";
    generatedContent.style.width = "100%";
    generatedContent.style.height = "100%";
    generatedContent.style.maxHeight = "100%";
    generatedContent.style.margin = "0";
    generatedContent.style.padding = "40px";
    generatedContent.style.fontSize = "24px";
    generatedContent.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    generatedContent.style.color = "#fff";
    generatedContent.style.display = "flex";
    generatedContent.style.alignItems = "center";
    generatedContent.style.justifyContent = "center";
    generatedContent.style.zIndex = "1000";
    
    // Add exit button
    const exitBtn = document.createElement("button");
    exitBtn.textContent = "Exit Theatre Mode";
    exitBtn.className = "exit-theatre-btn";
    exitBtn.style.position = "fixed";
    exitBtn.style.bottom = "20px";
    exitBtn.style.right = "20px";
    exitBtn.style.backgroundColor = "#f1c40f";
    exitBtn.style.color = "black";
    exitBtn.style.padding = "10px 20px";
    exitBtn.style.borderRadius = "30px";
    exitBtn.style.cursor = "pointer";
    exitBtn.style.border = "none";
    exitBtn.onclick = toggleTheatreMode;
    
    document.body.appendChild(exitBtn);
    
    // Restore content
    generatedContent.innerHTML = content;
  } else {
    // Remove exit button
    const exitBtn = document.querySelector(".exit-theatre-btn");
    if (exitBtn) {
      document.body.removeChild(exitBtn);
    }
    
    // Restore original styles
    body.style.backgroundColor = "";
    generatedContent.style.position = "";
    generatedContent.style.top = "";
    generatedContent.style.left = "";
    generatedContent.style.width = "";
    generatedContent.style.height = "";
    generatedContent.style.maxHeight = "300px";
    generatedContent.style.margin = "25px 0";
    generatedContent.style.padding = "20px";
    generatedContent.style.fontSize = "16px";
    generatedContent.style.backgroundColor = "rgba(18, 18, 18, 0.95)";
    generatedContent.style.color = "#ffe97f";
    generatedContent.style.display = "";
    generatedContent.style.alignItems = "";
    generatedContent.style.justifyContent = "";
    generatedContent.style.zIndex = "";
    
    // Show all elements again
    document.querySelectorAll("body > *").forEach(el => {
      el.style.display = "";
    });
    
    container.style.display = "block";
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", function() {
  // Check for saved monoact and display if available
  const savedMonoact = localStorage.getItem("savedMonoact");
  if (savedMonoact) {
    displayStory(savedMonoact.replace(/\n/g, "<br>"));
  }
});
