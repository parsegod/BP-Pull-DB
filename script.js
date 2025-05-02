const tableBody = document.querySelector('#pullsTable tbody');
const searchView = document.getElementById('searchView');
const searchInput = document.getElementById('search');
const categoryFilterContainer = document.getElementById('categoryCheckboxes');
const toggleCategoryDropdown = document.getElementById('toggleCategoryDropdown');
const categoryArrow = document.getElementById('categoryArrow');

let currentSortKey = null;
let currentSortDirection = 'asc';
let currentData = [];
let Weapons = [];

const category = [
  "AR",
  "Sub",
  "Shotgun",
  "LMG",
  "Marksman",
  "Snipe",
  "Pistol",
  "Special",
  "Launcher",
  "Melee"
  
];

fetch('assets/weapon.json')
  .then(response => response.json())
  .then(data => {
        Weapons = data.weapon;
        currentData = [...Weapons];
        renderTable(currentData);
      })

function populateCategoryFilter() {
  categoryFilterContainer.innerHTML = '';

  const controls = document.createElement('div');
  controls.className = 'category-controls';

  const selectAll = document.createElement('button');
  selectAll.textContent = 'Select All';
  selectAll.type = 'button';
  selectAll.addEventListener('click', () => {
    categoryFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
    applySortAndFilter();
  });

  const deselectAll = document.createElement('button');
  deselectAll.textContent = 'Deselect All';
  deselectAll.type = 'button';
  deselectAll.addEventListener('click', () => {
    categoryFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    applySortAndFilter();
  });

  controls.appendChild(selectAll);
  controls.appendChild(deselectAll);
  categoryFilterContainer.appendChild(controls);

  category.forEach((categoryName, idx) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = idx;
    checkbox.checked = true;
    checkbox.addEventListener('change', applySortAndFilter);
    label.append(checkbox, document.createTextNode(categoryName));
    categoryFilterContainer.appendChild(label);
  });

  categoryFilterContainer.classList.add('hidden');
  categoryArrow.textContent = '▼';
}


function renderTable(data) {
  tableBody.innerHTML = '';
  data.forEach((weapon,i) => {
    const categoryName = category[weapon.category] || 'Unknown';
    const row = document.createElement('tr');
    row.className = i % 2 === 0 ? 'even' : 'odd';
    row.innerHTML = `
      <td>${weapon.name}</td>
      <td>${categoryName}</td>
      <td>${weapon.blueprint}</td>
      <td>${weapon.pool}</td>`;  
    tableBody.appendChild(row);
  });
}

function applySortAndFilter() {
  const textFilter = searchInput.value.toLowerCase();
  const checkedTypes = [...categoryFilterContainer.querySelectorAll('input:checked')].map(cb => +cb.value);
    let filtered = currentData.filter(weapon => {
    return weapon.name.toLowerCase().includes(textFilter)
  });

  if (currentSortKey) {
    filtered.sort((a, b) => {
      let aVal = a[currentSortKey], bVal = b[currentSortKey];
      return currentSortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    });
  }

  renderTable(filtered);
}

[searchInput].forEach(el =>
  el.addEventListener('input', applySortAndFilter)
);

document.querySelectorAll('#pullsTable th').forEach(header => {
  header.addEventListener('click', () => {
    const key = header.dataset.key;
    if (currentSortKey === key) {
      currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      currentSortKey = key;
      currentSortDirection = 'asc';
    }
    document.querySelectorAll('#pullsTable th').forEach(h =>
      h.classList.remove('sorted-asc', 'sorted-desc')
    );
    header.classList.add(`sorted-${currentSortDirection}`);
    applySortAndFilter();
  });
});

toggleCategoryDropdown.addEventListener('click', e => {
  e.stopPropagation();
  const isHidden = categoryFilterContainer.classList.toggle('hidden');
  categoryArrow.textContent = isHidden ? '▼' : '▲';
});

document.addEventListener('click', e => {
  if (!categoryFilterContainer.contains(e.target) && !toggleCategoryDropdown.contains(e.target)) {
    if (!categoryFilterContainer.classList.contains('hidden')) {
      categoryFilterContainer.classList.add('hidden');
      categoryArrow.textContent = '▼';
    }
  }
});
