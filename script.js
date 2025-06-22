let currentViewMode = 'categories';
const categoryIcons = {
  "Web Games": "images/category-icons/website.png",
  "Roblox": "images/category-icons/roblox.png",
  "Discord": "images/category-icons/discord.webp",
  "Scratch": "images/category-icons/scratch.png",
  "Twitch": "images/category-icons/twitch.webp"
};

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
    image: "images/cards-images/Magical-Fight.png"
  },
  {
    category: "Roblox",
    type: "roblox",
    title: "OoSkyCorp",
    description: "Join my Roblox group",
    url: "https://www.roblox.com/communities/33716114/Oo-Sky-Corp#!/about",
    image: "images/cards-images/OoSkyCorp.webp"
  },
  {
    category: "Roblox",
    type: "roblox",
    title: "My Roblox Account",
    description: "Follow me on Roblox",
    url: "https://www.roblox.com/users/2004141820/profile",
    image: "images/cards-images/Roblox-Account.webp"
  },
  {
    category: "Discord",
    type: "discord",
    title: "OoSkyCorp Server",
    description: "Join the group's Discord",
    url: "https://discord.gg/H5NMQvCy",
    image: "images/cards-images/OoSkyCorp.webp"
  },
  {
    category: "Discord",
    type: "discord",
    title: "My Discord Server",
    description: "Join my personal Discord",
    url: "https://discord.gg/jQvbQ2KS",
    image: "images/cards-images/Miroirsky.jpg"
  },
  {
    category: "Scratch",
    type: "scratch",
    title: "My Scratch Account",
    description: "Check out my Scratch profile",
    url: "https://scratch.mit.edu/users/Morgan16400/",
    image: "images/cards-images/Scratch-Group.png"
  },
  {
    category: "Scratch",
    type: "scratch",
    title: "My Scratch Group",
    description: "Discover my Scratch studio",
    url: "https://scratch.mit.edu/studios/32520921/",
    image: "images/cards-images/Scratch-Account.png"
  },
  {
    category: "Twitch",
    type: "twitch",
    title: "My Twitch Channel",
    description: "Follow me on Twitch",
    url: "https://www.twitch.tv/miroirsky",
    image: "images/cards-images/Miroirsky.jpg"
  }
];

// Map type → couleur pour le glow du fond
const typeGlowColors = {
  webgame: "#00ffae",
  roblox: "#007bff",
  discord: "#5865F2",
  scratch: "#FFA600",
  twitch: "#9146FF"
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

  // Ajout de l'icône catégorie en haut à gauche si Mixed View
  if (currentViewMode === 'mixed') {
    const iconPath = categoryIcons[card.category];
    if (iconPath) {
      const catIcon = document.createElement('img');
      catIcon.src = iconPath;
      catIcon.alt = card.category + " icon";
      catIcon.className = "card-category-icon";
      div.appendChild(catIcon);
    }
  }


  
  if (selectedUrl === card.url) div.classList.add('selected');
  return div;
}

function renderView(mode) {
  const mainContainer = document.getElementById('mainContainer');
  mainContainer.innerHTML = '';
  
  if (mode === 'categories') {
    // Vue par catégories
    const categoryOrder = ["Web Games", "Roblox", "Twitch", "Discord", "Scratch"];
    categoryOrder.forEach(cat => {
      const cards = cardsData.filter(card => card.category === cat);
      if (!cards.length) return;
      
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';
      
      const h2 = document.createElement('h2');
h2.className = `category-title ${cards[0].type}-title`;
const iconPath = categoryIcons[cat];
if (iconPath) {
  const img = document.createElement('img');
  img.src = iconPath;
  img.alt = cat + " icon";
  img.className = "category-icon";
  h2.appendChild(img);
}
const textNode = document.createTextNode(cat);
h2.appendChild(textNode);
categorySection.appendChild(h2);
      
      const container = document.createElement('div');
      container.className = "card-container";
      cards.forEach(card => container.appendChild(createCard(card)));
      categorySection.appendChild(container);
      
      mainContainer.appendChild(categorySection);
    });
  } else {
    // Vue mixte
    const container = document.createElement('div');
    container.className = "card-container";
    const sorted = [...cardsData].sort((a, b) => a.title.localeCompare(b.title, 'en'));
    sorted.forEach(card => container.appendChild(createCard(card)));
    mainContainer.appendChild(container);
  }
}

function setView(mode) {
  currentViewMode = mode;
  const btn = document.getElementById("displayModeBtn");
  renderView(mode);
  btn.textContent = mode === 'categories' ? "Grouped by categories" : "Mixed view";
  document.getElementById("dropdownMenu").classList.remove("show");
  
  // Réappliquer la recherche actuelle si elle existe
  const searchInput = document.getElementById("searchInput");
  if (searchInput && searchInput.value.trim() !== '') {
    filterCards(searchInput.value);
  }
  
  // Réappliquer la sélection si une carte était sélectionnée
  if (selectedUrl) {
    const cards = document.querySelectorAll('.link-card');
    cards.forEach(card => {
      const url = card.querySelector('.card-url').getAttribute('title');
      if (url === selectedUrl) {
        card.classList.add('selected');
      }
    });
  }
}

function filterCards(searchText) {
  const cards = document.querySelectorAll('.link-card');
  const normalizedSearch = searchText.toLowerCase().trim();
  const isInMixedView = !document.querySelector('.category-section');

  cards.forEach(card => {
    const title = card.querySelector('h3').textContent.toLowerCase();
    const description = card.querySelector('p').textContent.toLowerCase();
    // Recherche la catégorie dans le JS (on la retrouve via l'URL de la carte)
    const url = card.querySelector('.card-url').getAttribute('title');
    const cardObj = cardsData.find(c => c.url === url);
    const category = cardObj ? cardObj.category.toLowerCase() : '';

    const matches =
      title.includes(normalizedSearch) ||
      description.includes(normalizedSearch) ||
      category.includes(normalizedSearch);

    if (normalizedSearch === '') {
      card.classList.remove('filtered', 'hidden');
    } else {
      if (matches) {
        card.classList.remove('hidden', 'filtered');
      } else {
        if (isInMixedView) {
          card.classList.add('filtered');
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
          card.classList.remove('filtered');
        }
      }
    }
  });

  // Gérer l'affichage des titres de catégories en vue catégories
  if (!isInMixedView) {
    document.querySelectorAll('.category-section').forEach(section => {
      const hasVisibleCards = section.querySelector('.card-container').querySelectorAll('.link-card:not(.hidden)').length > 0;
      section.style.display = hasVisibleCards ? '' : 'none';
    });
  }
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
    travelBtn.classList.remove('dynamic-webgame', 'dynamic-roblox', 'dynamic-discord', 'dynamic-scratch', 'dynamic-twitch');
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
  travelBtn.classList.remove('dynamic-webgame', 'dynamic-roblox', 'dynamic-discord', 'dynamic-scratch', 'dynamic-twitch');
  if (selectedType) {
    travelBtn.classList.add('dynamic-' + selectedType);
  }

  updateContainerGlow(selectedType);
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

window.onclick = function(event) {
  if (!event.target.matches('.dropdown-toggle')) {
    document.getElementById("dropdownMenu").classList.remove("show");
  }
};

window.onload = function() {
  renderView('categories');
  const travelBtn = document.getElementById('travelBtn');
  travelBtn.classList.add('dynamic-webgame');
  updateContainerGlow('webgame');
  updateTitleColor('webgame');
};

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
