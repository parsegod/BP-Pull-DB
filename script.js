const tableBody = document.querySelector('#pullsTable tbody');
const searchInput = document.getElementById('search');
const categoryFilterContainer = document.getElementById('categoryCheckboxes');
const toggleCategoryDropdown = document.getElementById('toggleCategoryDropdown');
const categoryArrow = document.getElementById('categoryArrow');
const searchView = document.getElementById('searchView');
const poolFilterContainer = document.getElementById('poolCheckboxes');
const togglePoolDropdown = document.getElementById('togglePoolDropdown');
const poolArrow = document.getElementById('poolArrow');
const nothingCheckbox = document.getElementById('nothingCheckbox');
const imageCheckbox = document.getElementById('imageCheckbox');

const categoryMap = {
  "0": "ASSAULT RIFLES",
  "1": "SUBMACHINE GUNS",
  "2": "SHOTGUNS",
  "3": "LIGHT MACHINE GUNS",
  "4": "MARKSMAN RIFLES",
  "5": "SNIPER RIFLES",
  "6": "PISTOLS",
  "7": "LAUNCHERS",
  "8": "SPECIAL",
  "9": "MELEE"
};

const categoryMapReverse = Object.fromEntries(
  Object.entries(categoryMap).map(([key, val]) => [val, key])
);

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
  .catch(err => console.error("Error on load:", err));

function renderTable(data) {
  tableBody.innerHTML = '';

  data.forEach((weapon, i) => {
    weapon.Blueprints.forEach(blueprint => {
      if (blueprint.Name === "") return;
      const isInvalidImage = blueprint.Name === "NOTHING" || blueprint.Name === "UNRELEASED";
      const row = document.createElement('tr');
      row.className = i % 2 === 0 ? 'even' : 'odd';

      const nameCell = document.createElement('td');
      nameCell.textContent = weapon.Name;
      row.appendChild(nameCell);

      const categoryCell = document.createElement('td');
      categoryCell.textContent = categoryMap[weapon.Category];
      row.appendChild(categoryCell);

      const blueprintCell = document.createElement('td');
      const arrow = document.createElement('span');
      arrow.textContent = '▶';
      arrow.style.cursor = 'pointer';
      arrow.style.marginRight = '8px';
      if (!isInvalidImage) {
      blueprintCell.appendChild(arrow);
      }
      blueprintCell.appendChild(document.createTextNode(blueprint.Name));
      row.appendChild(blueprintCell);

      const poolCell = document.createElement('td');
      poolCell.textContent = blueprint.Pool;
      row.appendChild(poolCell);

      tableBody.appendChild(row);
      
      const accordionRow = document.createElement('tr');
      const accordionCell = document.createElement('td');
      accordionCell.colSpan = 4;
      accordionCell.style.padding = '0';
      accordionCell.style.border = 'none';

      const accordionContent = document.createElement('div');
      accordionContent.style.display = 'none';

      const img = document.createElement('img');

      const hideImage = blueprint.Name === "NOTHING" || blueprint.Name === "UNRELEASED";

      if (!hideImage) {
        img.dataset.src = `assets/blueprints/images/${weapon.Name}/${blueprint.Name}.jpg`;
        img.alt = blueprint.Name;
        img.style.maxWidth = '100%';

        img.onerror = () => {
          accordionContent.innerHTML = '<em>No image.</em>';
        };

        img.onload = () => {
          accordionContent.appendChild(img);
        };
      }

      accordionCell.appendChild(accordionContent);
      accordionRow.appendChild(accordionCell);
      if (!isInvalidImage) {
      tableBody.appendChild(accordionRow);
      }

      let imageLoaded = false;

arrow.addEventListener('click', (e) => {
  e.stopPropagation();
  const isVisible = accordionContent.style.display === 'block';
  
  if (!imageCheckbox.checked){
  document.querySelectorAll('#pullsTable tbody tr div').forEach(div => div.style.display = 'none');
  document.querySelectorAll('#pullsTable tbody tr span').forEach(sp => sp.textContent = '▶');
  }
  
  if (!isVisible) {
    accordionContent.style.display = 'block';
    arrow.textContent = '▼';

    if (!imageLoaded && img) {
      img.src = img.dataset.src;
      accordionContent.appendChild(img);
      imageLoaded = true;
    }
  } else {
    accordionContent.style.display = 'none';
    arrow.textContent = '▶';
  }
});

if (imageCheckbox.checked) {
  accordionContent.style.display = 'block';
  arrow.textContent = '▼';
  if (!imageLoaded && img) {
    accordionContent.appendChild(img);
    imageLoaded = true;
  }
}

    });
  });
  applyImageToggle();
}

function populateCategoryFilter() {
  categoryFilterContainer.innerHTML = '';

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'filter-buttons';
  buttonContainer.style.marginBottom = '8px';

  const selectAllBtn = document.createElement('button');
  selectAllBtn.textContent = 'Select All';
  selectAllBtn.style.marginRight = '6px';
  selectAllBtn.addEventListener('click', () => {
    categoryFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    applyFilters();
  });

  const deselectAllBtn = document.createElement('button');
  deselectAllBtn.textContent = 'Deselect All';
  deselectAllBtn.addEventListener('click', () => {
    categoryFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    applyFilters();
  });

  buttonContainer.appendChild(selectAllBtn);
  buttonContainer.appendChild(deselectAllBtn);
  categoryFilterContainer.appendChild(buttonContainer);

  const uniqueCategories = [...new Set(Weapons.map(w => categoryMap[w.Category]))];

  uniqueCategories.forEach(cat => {
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

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'filter-buttons';
  buttonContainer.style.marginBottom = '8px';

  const selectAllBtn = document.createElement('button');
  selectAllBtn.textContent = 'Select All';
  selectAllBtn.style.marginRight = '6px';
  selectAllBtn.addEventListener('click', () => {
    poolFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    applyFilters();
  });

  const deselectAllBtn = document.createElement('button');
  deselectAllBtn.textContent = 'Deselect All';
  deselectAllBtn.addEventListener('click', () => {
    poolFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    applyFilters();
  });

  buttonContainer.appendChild(selectAllBtn);
  buttonContainer.appendChild(deselectAllBtn);
  poolFilterContainer.appendChild(buttonContainer);

  const checkboxesContainer = document.createElement('div');
  checkboxesContainer.className = 'checkboxes-container';
  
  const uniquePools = [...new Set(Weapons.flatMap(w => w.Blueprints.map(bp => bp.Pool)))];

  const half = Math.ceil(uniquePools.length / 2);
  const left = uniquePools.slice(0, half);
  const right = uniquePools.slice(half);

  const interleaved = [];
  for (let i = 0; i < half; i++) {
    if (left[i]) interleaved.push(left[i]);
    if (right[i]) interleaved.push(right[i]);
  }
  
  interleaved.forEach(pool => {
    const label = document.createElement('label');
    label.style.display = 'block';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = pool;
    checkbox.checked = true;
    checkbox.addEventListener('change', applyFilters);

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(pool));
    checkboxesContainer.appendChild(label);
  });
  poolFilterContainer.appendChild(checkboxesContainer);
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
        if (!nothingCheckbox.checked && bp.Name === "NOTHING") return false;
        const inText = bp.Name.toLowerCase().includes(textFilter) || weapon.Name.toLowerCase().includes(textFilter);
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

nothingCheckbox.addEventListener('change', applyFilters);

imageCheckbox.addEventListener('change', () => {
  applyFilters();
  applyImageToggle();
})

function applyImageToggle() {
  const rows = Array.from(document.querySelectorAll('#pullsTable tbody tr'))
  .filter(row => row.querySelector('td[colspan="4"]'));

  if (imageCheckbox.checked) {
    for (let i = 0; i < rows.length; i++) {
      const accordionRow = rows[i];
      const accordionContent = accordionRow.querySelector('div');
      const dataRow = accordionRow.previousElementSibling;
      const arrow = dataRow?.querySelector('span');
      if (accordionContent && arrow) {
        accordionContent.style.display = 'block';
        arrow.textContent = '▼';

        const img = accordionContent.querySelector('img');

        if (img && !img.src) {
          img.src = img.dataset.src;

          img.onerror = () => {
            accordionContent.innerHTML = '<em>No image.</em>';
          };
        }
      }
    }
  } else {
    rows.forEach(row => {
      const accordionContent = row.querySelector('div');
      const arrow = row.querySelector('span');

      if (accordionContent && arrow) {
        accordionContent.style.display = 'none';
        arrow.textContent = '▶';
      }
    });
  }
}

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

