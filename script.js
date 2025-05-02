const tableBody = document.querySelector('#pullsTable tbody');
const searchInput = document.getElementById('search');
const categoryFilterContainer = document.getElementById('categoryCheckboxes');
const toggleCategoryDropdown = document.getElementById('toggleCategoryDropdown');
const categoryArrow = document.getElementById('categoryArrow');
const searchView = document.getElementById('searchView');

const categoryList = [
  "AR", "Sub", "Shotgun", "LMG", "Marksman",
  "Snipe", "Pistol", "Special", "Launcher", "Melee"
];

let Weapons = [];
let currentData = [];

// 🔹 JSON laden
fetch('assets/weapon.json')
  .then(res => res.json())
  .then(data => {
    Weapons = data.Weapons;
    currentData = [...Weapons];
    populateCategoryFilter();
    applyFilters();
    searchView.classList.remove('hidden');
  })
  .catch(err => console.error("Fehler beim Laden:", err));

// 🔹 Tabelle anzeigen
function renderTable(data) {
  tableBody.innerHTML = '';

  data.forEach((weapon, i) => {
    weapon.Blueprints.forEach(blueprint => {
      const row = document.createElement('tr');
      row.className = i % 2 === 0 ? 'even' : 'odd';
      row.innerHTML = `
        <td>${weapon.name}</td>
        <td>${weapon.Category}</td>
        <td>${blueprint.Name}</td>
        <td>${blueprint.Pool}</td>
      `;
      tableBody.appendChild(row);
    });
  });
}

// 🔹 Kategorie-Checkboxen erstellen
function populateCategoryFilter() {
  categoryFilterContainer.innerHTML = '';

  categoryList.forEach(cat => {
    const label = document.createElement('label');
    label.style.display = 'block';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = cat;
    checkbox.checked = true;
    checkbox.addEventListener('change', applyFilters);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(cat));
    categoryFilterContainer.appendChild(label);
  });
}

// 🔹 Filter anwenden
function applyFilters() {
  const textFilter = searchInput.value.toLowerCase();
  const activeCategories = [...categoryFilterContainer.querySelectorAll('input:checked')]
    .map(cb => cb.value);

  const filtered = Weapons
    .filter(w => w.name.toLowerCase().includes(textFilter))
    .filter(w => activeCategories.includes(w.Category));

  renderTable(filtered);
}

// 🔹 Live-Suche
searchInput.addEventListener('input', applyFilters);

// 🔹 Kategorie-Dropdown öffnen/schließen
toggleCategoryDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = categoryFilterContainer.classList.toggle('hidden');
  categoryArrow.textContent = isHidden ? '▼' : '▲';
});

// 🔹 Klick außerhalb des Dropdowns schließt es
document.addEventListener('click', (e) => {
  if (!categoryFilterContainer.contains(e.target) &&
      !toggleCategoryDropdown.contains(e.target)) {
    if (!categoryFilterContainer.classList.contains('hidden')) {
      categoryFilterContainer.classList.add('hidden');
      categoryArrow.textContent = '▼';
    }
  }
});
