const user = localStorage.getItem("animeUser");
if (!user) window.location.href = "login.html";
document.getElementById("welcome").innerText = `Welcome, ${user} ✨`;
if (user === "admin") {
  document.getElementById("welcome").innerHTML += ' <a href="admin.html">👑 Admin</a>';
}

playBattleSound();

function playSound() {
  document.getElementById("pokeSound").play();
}

function playBattleSound() {
  document.getElementById("battleSound").play();
}

async function getPokemon() {
  const name = document.getElementById("pokemonName").value.toLowerCase();
  if (name === "pikachu") playSound();
  const card = document.getElementById("pokemonCard");

  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await res.json();

    const type = data.types[0].type.name;

    card.innerHTML = `
      <div class="card ${type}">
        <h2>${data.name.toUpperCase()}</h2>
        <img src="${data.sprites.front_default}">
        <p>Type: ${type}</p>
        <button onclick="saveFavorite('${data.name}')">💖 Favorite</button>
        <div id="evolution"></div>
      </div>
    `;

    getEvolution(data.species.url);
  } catch {
    card.innerHTML = "<p>Pokémon not found 😢</p>";
  }
}

function saveFavorite(name) {
  let favs = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favs.includes(name)) {
    favs.push(name);
    localStorage.setItem("favorites", JSON.stringify(favs));
    showFavorites();
  }
}

function showFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites")) || [];
  document.getElementById("favorites").innerHTML =
    favs.map(p => `<span>⭐ ${p}</span>`).join("<br>");
}
showFavorites();

function logout() {
  localStorage.removeItem("animeUser");
  window.location.href = "login.html";
}

async function getEvolution(url) {
  const res = await fetch(url);
  const species = await res.json();
  const evoRes = await fetch(species.evolution_chain.url);
  const evoData = await evoRes.json();

  function getEvolutionChain(chain) {
    let chainText = chain.species.name;
    if (chain.evolves_to.length > 0) {
      chainText += ' -> ' + chain.evolves_to.map(e => getEvolutionChain(e)).join(' -> ');
    }
    return chainText;
  }

  document.getElementById("evolution").innerHTML =
    `<p>Evolution chain: ${getEvolutionChain(evoData.chain)}</p>`;
}
let offset = 0;
let limit = 20;

async function loadPokemonList() {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  displayPokemonList(data.results.map(p => p.name));
}

function nextPage() {
  offset += limit;
  loadPokemonList();
}

function prevPage() {
  if (offset >= limit) offset -= limit;
  loadPokemonList();
}

function displayPokemonList(names) {
  const list = document.getElementById("pokemonList");
  list.innerHTML = "";

  names.forEach(name => {
    const li = document.createElement("li");
    li.textContent = name.toUpperCase();
    li.onclick = () => {
      document.getElementById("pokemonName").value = name;
      getPokemon();
    };
    list.appendChild(li);
  });
}

loadPokemonList();

async function loadByGeneration() {
  const gen = document.getElementById("generation").value;
  if (!gen) return loadPokemonList();

  const res = await fetch(`https://pokeapi.co/api/v2/generation/${gen}`);
  const data = await res.json();

  displayPokemonList(data.pokemon_species.map(p => p.name));
}
async function filterType(type) {
  const res = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
  const data = await res.json();

  const names = data.pokemon.slice(0, 50).map(p => p.pokemon.name);
  displayPokemonList(names);
}

// Check for URL param
const urlParams = new URLSearchParams(window.location.search);
const pokemonName = urlParams.get('name');
if (pokemonName) {
  document.getElementById("pokemonName").value = pokemonName;
  getPokemon();
}

