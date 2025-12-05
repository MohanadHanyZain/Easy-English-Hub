// dashboard.js — Fetches data.json and populates home.html

document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.endsWith('home.html')) return;

  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      // Render content
      renderLevels(data.levels);
      renderStories(data.stories);
      renderFlashcards(data.flashcards);

      // Update overview stats
      document.getElementById('total-levels').textContent = data.levels.length;
      
      const totalStories = data.stories.length;
      document.getElementById('total-stories').textContent = totalStories;

      let totalFlashcards = 0;
      for (const level in data.flashcards) {
        totalFlashcards += data.flashcards[level].length;
      }
      document.getElementById('total-flashcards').textContent = totalFlashcards;
    })
    .catch(err => console.error('Error loading data:', err));

  function renderLevels(levels) {
    const container = document.getElementById('levels-container');
    if (!container) return;
    container.innerHTML = levels.map(level => `
      <div class="card">
        <img src="${level.image}" alt="${level.title}" class="card-img">
        <div class="card-body">
          <h3>${level.title}</h3>
          <p>${level.description}</p>
          <a href="level.html?level=${level.id}" class="btn">View Courses</a>
        </div>
      </div>
    `).join('');
  }

  function renderStories(stories) {
    const container = document.getElementById('stories-container');
    if (!container) return;
    container.innerHTML = stories.map(story => `
      <div class="card">
        <img src="${story.image}" alt="${story.title}" class="card-img">
        <div class="card-body">
          <h3>${story.title}</h3>
          <p>${story.content.substring(0, 100)}...</p>
          <a href="story.html?id=${story.id}" class="btn">Read Story</a>
        </div>
      </div>
    `).join('');
  }

  function renderFlashcards(flashcards) {
    const container = document.getElementById('flashcards-container');
    if (!container) return;
    let html = '';
    for (const level in flashcards) {
      html += `<h4>Level ${level}</h4>`;
      html += flashcards[level].map(card => `
        <div class="flashcard card">
          <img src="${card.image}" alt="${card.word}" style="height:100px; object-fit:contain;">
          <div class="flashcard-word">${card.word}</div>
          <div class="flashcard-trans">${card.translation}</div>
          <button class="audio-btn" onclick="playAudio('${card.audioUrl}')">🔊 Pronounce</button>
        </div>
      `).join('');
    }
    container.innerHTML = html;
  }
});

let currentAudio = null;
function playAudio(url) {
  if (currentAudio) currentAudio.pause();
  currentAudio = new Audio(url);
  currentAudio.play();
}