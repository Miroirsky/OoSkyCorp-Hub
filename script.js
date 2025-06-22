let selectedUrl = null;
let selectedType = null;

// Toutes les cartes sont ici, à éditer ou ajouter facilement
const cardsData = [
  {
    category: "Web Games",
    type: "webgame",
    title: "Magical Fight",
    description: "One of my web games",
    url: "https://miroirsky.github.io/Magical-Fight",
    image: "images/links-images/Magical-Fight.png"
  },
  {
    category: "Roblox",
    type: "roblox",
    title: "OoSkyCorp",
    description: "Join my Roblox group",
    url: "https://www.roblox.com/communities/33716114/Oo-Sky-Corp#!/about",
    image: "images/links-images/OoSkyCorp.webp"
  },
  {
    category: "Roblox",
    type: "roblox",
    title: "My Roblox Account",
    description: "Follow me on Roblox",
    url: "https://www.roblox.com/users/2004141820/profile",
    image: "images/links-images/Roblox-Account.webp"
  },
  {
    category: "Discord",
    type: "discord",
    title: "OoSkyCorp Server",
    description: "Join the group's Discord",
    url: "https://discord.gg/H5NMQvCy",
    image: "images/links-images/OoSkyCorp.webp"
  },
  {
    category: "Discord",
    type: "discord",
    title: "My Discord Server",
    description: "Join my personal Discord",
    url: "https://discord.gg/jQvbQ2KS",
    image: "images/links-images/Miroirsky.jpg"
  },
  {
    category: "Scratch",
    type: "scratch",
    title: "My Scratch Account",
    description: "Check out my Scratch profile",
    url: "https://scratch.mit.edu/users/Morgan16400/",
    image: "images/links-images/Scratch-Account.png"
  },
  {
    category: "Scratch",
    type: "scratch",
    title: "My Scratch Group",
    description: "Discover my Scratch studio",
    url: "https://scratch.mit.edu/studios/32520921/",
    image: "images/links-images/Scratch-Group.png"
  }
];

// Map type → couleur pour le glow du fond
const typeGlowColors = {
  webgame: "#00ffae",
  roblox: "#007bff",
  discord: "#5865F2",
  scratch: "#FFA600"
};

function createCard(card) {
  const div = document.createElement('div');
  div.className = `link-card ${card.type}`;
  div.onclick = () => selectCard(div, card.url);
  
  let cardContent = `<h3>${card.title}</h3><p>${card.description}</p>`;
  
  if (card.image) {
    cardContent = `
      <div class="card-image">
        <img src="${card.image}" alt="${card.title}">
      </div>
      ${cardContent}
    `;
  }
  
  cardContent += `<span class="card-url" title="${card.url}" onclick="copyURLToClipboard(event, '${card.url}')">${card.url}</span>`;
  div.innerHTML = cardContent;
  
  if (selectedUrl === card.url) div.classList.add('selected');
  return div;
}

// Génère la vue par catégories
function renderCategories() {
  const categoriesView = document.getElementById('categoriesView');
  categoriesView.innerHTML = "";
  // Liste des catégories dans l'ordre voulu
  const categoryOrder = ["Web Games", "Roblox", "Discord", "Scratch"];
  categoryOrder.forEach(cat => {
    const cards = cardsData.filter(card => card.category === cat);
    if (!cards.length) return;
    // Ajout du titre avec la bonne classe de couleur
    const h2 = document.createElement('h2');
    h2.className = `category-title ${cards[0].type}-title`;
    h2.textContent = cat;
    categoriesView.appendChild(h2);
    // Ajout des cartes
    const container = document.createElement('div');
    container.className = "card-container";
    cards.forEach(card => container.appendChild(createCard(card)));
    categoriesView.appendChild(container);
  });
}

// Génère la vue mixed triée alphabétiquement
function renderMixed() {
  const mixedView = document.getElementById('mixedView');
  mixedView.innerHTML = "";
  const sorted = [...cardsData].sort((a, b) => a.title.localeCompare(b.title, 'en'));
  const container = document.createElement('div');
  container.className = "card-container";
  sorted.forEach(card => container.appendChild(createCard(card)));
  mixedView.appendChild(container);
}


function updateTitleColor(type) {
  // Couleur principale selon le type, fallback vert
  const color = (typeGlowColors[type] || "#00ffae");
  const mainTitle = document.querySelector(".title");
  if (mainTitle) {
    mainTitle.style.color = color;
    mainTitle.style.textShadow = `0 0 8px ${color}`;
  }
}
function updateContainerGlow(type) {

  const container = document.querySelector('.container');
  const color = typeGlowColors[type] || "#00ffae";
  container.style.boxShadow = `0 0 40px 0 ${color}33, 0 0 120px 4px ${color}33`;
}

function updateSelectionHighlight() {
  document.querySelectorAll('.link-card').forEach(card => card.classList.remove('selected'));
  if (selectedUrl) {
    document.querySelectorAll('.link-card').forEach(card => {
      const h3 = card.querySelector('h3');
      const cardUrl = cardsData.find(c => c.title === h3.textContent)?.url;
      if (cardUrl === selectedUrl) {
        card.classList.add('selected');
      }
    });
    const travelBtn = document.getElementById('travelBtn');
    travelBtn.classList.remove('dynamic-webgame', 'dynamic-roblox', 'dynamic-discord', 'dynamic-scratch');
    if (selectedType) travelBtn.classList.add('dynamic-' + selectedType);
    updateContainerGlow(selectedType);
  updateTitleColor(selectedType);
  updateTitleColor(selectedType);
  } else {
    updateContainerGlow(); // Valeur par défaut (webgame)
  updateTitleColor('webgame');
  }
}

function selectCard(element, url) {
  document.querySelectorAll('.link-card').forEach(card => card.classList.remove('selected'));
  element.classList.add('selected');
  selectedUrl = url;
  const found = cardsData.find(card => card.url === url);
  selectedType = found ? found.type : null;

  const travelBtn = document.getElementById('travelBtn');
  travelBtn.classList.remove('dynamic-webgame', 'dynamic-roblox', 'dynamic-discord', 'dynamic-scratch');
  if (selectedType) travelBtn.classList.add('dynamic-' + selectedType);

  updateContainerGlow(selectedType);
  updateTitleColor(selectedType);
  updateTitleColor(selectedType);
}

function travel() {
  if (!selectedUrl) {
    alert("Please select a destination first!");
    return;
  }
  window.open(selectedUrl, '_blank');
}

function toggleDropdown() {
  document.getElementById("dropdownMenu").classList.toggle("show");
}

function setView(mode) {
  const btn = document.getElementById("displayModeBtn");
  if (mode === 'categories') {
    renderCategories();
    document.getElementById("categoriesView").style.display = '';
    document.getElementById("mixedView").style.display = 'none';
    btn.textContent = "Grouped by categories";
  } else {
    renderMixed();
    document.getElementById("categoriesView").style.display = 'none';
    document.getElementById("mixedView").style.display = '';
    btn.textContent = "Mixed view";
  }
  document.getElementById("dropdownMenu").classList.remove("show");
  setTimeout(updateSelectionHighlight, 5);
}

window.onclick = function(event) {
  if (!event.target.matches('.dropdown-toggle')) {
    document.getElementById("dropdownMenu").classList.remove("show");
  }
};

window.onload = function () {
  document.getElementById("displayModeBtn").textContent = "Grouped by categories";
  renderCategories();
  renderMixed();
  const travelBtn = document.getElementById('travelBtn');
  travelBtn.classList.add('dynamic-webgame');
  updateSelectionHighlight();
  updateContainerGlow('webgame');
  updateTitleColor('webgame');
};

function filterCards(searchText) {
  const cards = document.querySelectorAll('.link-card');
  const normalizedSearch = searchText.toLowerCase().trim();
  
  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    const matches = title.includes(normalizedSearch) || description.includes(normalizedSearch);
    
    if (normalizedSearch === '') {
      card.classList.remove('filtered', 'hidden');
    } else {
      if (matches) {
        card.classList.remove('hidden');
        card.classList.remove('filtered');
      } else {
        // Si on est en vue mixte, on filtre avec opacity
        if (document.getElementById('mixedView').style.display !== 'none') {
          card.classList.add('filtered');
          card.classList.remove('hidden');
        } else {
          // En vue catégories, on cache complètement
          card.classList.add('hidden');
          card.classList.remove('filtered');
        }
      }
    }
  });

  // Gérer l'affichage des titres de catégories
  if (document.getElementById('categoriesView').style.display !== 'none') {
    document.querySelectorAll('.category-title').forEach(title => {
      const categoryContainer = title.nextElementSibling;
      const visibleCards = categoryContainer.querySelectorAll('.link-card:not(.hidden)');
      title.style.display = visibleCards.length > 0 ? '' : 'none';
    });
  }
}


function copyURLToClipboard(event, url) {
  event.stopPropagation(); // éviter la sélection de la carte
  navigator.clipboard.writeText(url).then(() => {
    const originalText = event.target.textContent;
    event.target.textContent = "✅ Copied!";
    setTimeout(() => {
      event.target.textContent = originalText;
    }, 1500);
  }).catch(err => {
    alert("Failed to copy URL: " + err);
  });
}
