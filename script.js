const tableBody = document.querySelector('#pullsTable tbody');
const searchInput = document.getElementById('search');
const categoryFilterContainer = document.getElementById('categoryCheckboxes');
const toggleCategoryDropdown = document.getElementById('toggleCategoryDropdown');
const categoryArrow = document.getElementById('categoryArrow');
const searchView = document.getElementById('searchView');
const poolFilterContainer = document.getElementById('poolCheckboxes');
const togglePoolDropdown = document.getElementById('togglePoolDropdown');
const poolArrow = document.getElementById('poolArrow');

const categoryMap = {
  "0": "AR",
  "1": "Sub",
  "2": "Shotgun",
  "3": "LMG",
  "4": "Marksman",
  "5": "Snipe",
  "6": "Pistol",
  "7": "Special",
  "8": "Launcher",
  "9": "Melee"
};

const categoryMapReverse = Object.fromEntries(
  Object.entries(categoryMap).map(([key, val]) => [val, key])
);

const poolList = ["1", "2", "3", "4","5","6","7","8","9","10"];

let Weapons = [];
let currentData = [];

fetch('assets/weapon.json')
  .then(res => res.json())
  .then(data => {
    Weapons = data.Weapons;
    currentData = [...Weapons];
    populateCategoryFilter();
    populatePoolFilter();
    applyFilters();
    searchView.classList.remove('hidden');
  })
  .catch(err => console.error("Fehler beim Laden:", err));

function renderTable(data) {
  tableBody.innerHTML = '';

  data.forEach((weapon, i) => {
    weapon.Blueprints.forEach(blueprint => {
      const row = document.createElement('tr');
      row.className = i % 2 === 0 ? 'even' : 'odd';
      row.innerHTML = `
        <td>${weapon.name}</td>
        <td>${categoryMap[weapon.Category]}</td>
        <td>${blueprint.Name}</td>
        <td>${blueprint.Pool}</td>
      `;
      tableBody.appendChild(row);
    });
  });
}

function populateCategoryFilter() {
  categoryFilterContainer.innerHTML = '';

  Object.values(categoryMap).forEach(cat => {
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

function populatePoolFilter() {
  poolFilterContainer.innerHTML = '';

  poolList.forEach(pool => {
    const label = document.createElement('label');
    label.style.display = 'block';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = pool;
    checkbox.checked = true;
    checkbox.addEventListener('change', applyFilters);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(pool));
    poolFilterContainer.appendChild(label);
  });
}

function applyFilters() {
  const textFilter = searchInput.value.toLowerCase();
  const activeCategories = [...categoryFilterContainer.querySelectorAll('input:checked')]
    .map(cb => cb.value);
  const activePools = [...poolFilterContainer.querySelectorAll('input:checked')]
    .map(cb => cb.value);

  const filtered = Weapons
    .filter(w => activeCategories.includes(categoryMap[w.Category]))
    .map(weapon => {
      const filteredBlueprints = weapon.Blueprints.filter(bp => {
        const inText = bp.Name.toLowerCase().includes(textFilter) || weapon.name.toLowerCase().includes(textFilter);
        const inPool = activePools.includes(bp.Pool);
        return inText && inPool;
      });

      return {
        ...weapon,
        Blueprints: filteredBlueprints
      };
    })
    .filter(w => w.Blueprints.length > 0);

  renderTable(filtered);
}


// 🔹 Live-Search
searchInput.addEventListener('input', applyFilters);

toggleCategoryDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = categoryFilterContainer.classList.toggle('hidden');
  categoryArrow.textContent = isHidden ? '▼' : '▲';
});

document.addEventListener('click', (e) => {
  if (!categoryFilterContainer.contains(e.target) &&
      !toggleCategoryDropdown.contains(e.target)) {
    if (!categoryFilterContainer.classList.contains('hidden')) {
      categoryFilterContainer.classList.add('hidden');
      categoryArrow.textContent = '▼';
    }
  }
});

togglePoolDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = poolFilterContainer.classList.toggle('hidden');
  poolArrow.textContent = isHidden ? '▼' : '▲';
});

document.addEventListener('click', (e) => {
  if (!poolFilterContainer.contains(e.target) && !togglePoolDropdown.contains(e.target)) {
    if (!poolFilterContainer.classList.contains('hidden')) {
      poolFilterContainer.classList.add('hidden');
      poolArrow.textContent = '▼';
    }
  }
});
