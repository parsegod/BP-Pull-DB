const tableBody = document.querySelector('#pullsTable tbody');
const searchInput = document.getElementById('search');
const categoryFilterContainer = document.getElementById('categoryCheckboxes');
const toggleCategoryDropdown = document.getElementById('toggleCategoryDropdown');
const categoryArrow = document.getElementById('categoryArrow');
const searchView = document.getElementById('searchView');
const poolFilterContainer = document.getElementById('poolCheckboxes');
const togglePoolDropdown = document.getElementById('togglePoolDropdown');
const poolArrow = document.getElementById('poolArrow');
const imageCheckbox = document.getElementById('imageCheckbox');

const statusFilterContainer = document.getElementById('statusCheckboxes');
const toggleStatusDropdown = document.getElementById('toggleStatusDropdown');
const statusArrow = document.getElementById('statusArrow');

const totalBlueprintsSpan = document.getElementById('totalBlueprints');
const normalBlueprintsSpan = document.getElementById('normalBlueprints');
const unreleasedBlueprintsSpan = document.getElementById('unreleasedBlueprints');
const nothingBlueprintsSpan = document.getElementById('nothingBlueprints');

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
    populateStatusFilter(); 
    applyFilters();
    searchView.classList.remove('hidden');
  })
  .catch(err => console.error("Error on load:", err));

function renderTable(data) {
  let totalCount = 0; 
  let normalCount = 0; 
  let unreleasedCount = 0; 
  let nothingCount = 0; 

  data.forEach(weapon => { 
    weapon.Blueprints.forEach(blueprint => { 
      totalCount++; 
      if (blueprint.Name === "UNRELEASED") { 
        unreleasedCount++; 
      } else if (blueprint.Name === "NOTHING") { 
        nothingCount++; 
      } else {
        normalCount++; 
      }
    });
  });

  totalBlueprintsSpan.textContent = totalCount; 
  normalBlueprintsSpan.textContent = normalCount; 
  unreleasedBlueprintsSpan.textContent = unreleasedCount; 
  nothingBlueprintsSpan.textContent = nothingCount; 

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
      arrow.style.cursor = 'pointer';
      arrow.textContent = '▶';
      arrow.style.display = 'inline-block';
      arrow.style.width = '1.2em'; 
      arrow.style.textAlign = 'center';
      arrow.style.visibility = isInvalidImage ? 'hidden' : 'visible'; 

      blueprintCell.appendChild(arrow);
      blueprintCell.appendChild(document.createTextNode(blueprint.Name));
      row.appendChild(blueprintCell);

      const poolCell = document.createElement('td');
      poolCell.textContent = blueprint.Pool;
      row.appendChild(poolCell);

      tableBody.appendChild(row);

      if (!isInvalidImage) {
        const accordionRow = document.createElement('tr');
        const accordionCell = document.createElement('td');
        accordionCell.colSpan = 4;
        accordionCell.style.padding = '0';
        accordionCell.style.border = 'none';

        const accordionContent = document.createElement('div');
        accordionContent.className = 'accordion-content';

        const img = document.createElement('img');
        img.dataset.src = `assets/blueprints/images/${weapon.Name}/${blueprint.Name}.jpg`;
        img.alt = blueprint.Name;
        img.style.maxWidth = '100%';
        img.style.height = 'auto'; 

        img.onerror = () => {
          accordionContent.innerHTML = '<em>No image.</em>';

          if (img.parentNode) {
            img.parentNode.removeChild(img);
          }
        };   

        accordionCell.appendChild(accordionContent);
        accordionRow.appendChild(accordionCell);
        tableBody.appendChild(accordionRow);

        let imageLoaded = false;

        arrow.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = accordionContent.classList.contains('expanded');

          if (!imageCheckbox.checked){
            document.querySelectorAll('#pullsTable tbody tr div.expanded').forEach(div => {
              div.classList.remove('expanded');

              const parentAccordionRow = div.closest('tr');
              const dataRow = parentAccordionRow?.previousElementSibling;
              const associatedArrow = dataRow?.querySelector('span');
              if (associatedArrow) {
                associatedArrow.textContent = '▶';
              }
            });
          }

          if (!isVisible) {
            accordionContent.classList.add('expanded');
            arrow.textContent = '▼';

            if (!imageLoaded && img.dataset.src) {
              img.src = img.dataset.src;

              if (!accordionContent.contains(img)) {
                accordionContent.appendChild(img);
              }
              imageLoaded = true;
            }
          } else {
            accordionContent.classList.remove('expanded');
            arrow.textContent = '▶';
          }
        });

        if (imageCheckbox.checked) {
          accordionContent.classList.add('expanded');
          arrow.textContent = '▼';
          if (!imageLoaded && img.dataset.src) {
            img.src = img.dataset.src;
            if (!accordionContent.contains(img)) {
              accordionContent.appendChild(img);
            }
            imageLoaded = true;
          }
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

function populateStatusFilter() {
    statusFilterContainer.innerHTML = '';

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'filter-buttons';
    buttonContainer.style.marginBottom = '8px';

    const selectAllBtn = document.createElement('button');
    selectAllBtn.textContent = 'Select All';
    selectAllBtn.style.marginRight = '6px';
    selectAllBtn.addEventListener('click', () => {
        statusFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = true);
        applyFilters();
    });

    const deselectAllBtn = document.createElement('button');
    deselectAllBtn.textContent = 'Deselect All';
    deselectAllBtn.addEventListener('click', () => {
        statusFilterContainer.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
        applyFilters();
    });

    buttonContainer.appendChild(selectAllBtn);
    buttonContainer.appendChild(deselectAllBtn);
    statusFilterContainer.appendChild(buttonContainer);

    const statusOptions = ['Normal', 'NOTHING', 'UNRELEASED']; 

    statusOptions.forEach(status => {
        const label = document.createElement('label');
        label.style.display = 'block';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = status;
        checkbox.checked = (status === 'Normal'); 
        checkbox.addEventListener('change', applyFilters);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(status === 'Normal' ? 'Normal Blueprints' : `Show ${status}`)); 
        statusFilterContainer.appendChild(label);
    });
}

function applyFilters() {
  const textFilter = searchInput.value.toLowerCase();
  const activeCategories = [...categoryFilterContainer.querySelectorAll('input:checked')]
    .map(cb => cb.value);
  const activePools = [...poolFilterContainer.querySelectorAll('input:checked')]
    .map(cb => cb.value);
  const activeStatuses = [...statusFilterContainer.querySelectorAll('input:checked')] 
    .map(cb => cb.value);

  const filtered = Weapons
    .filter(w => activeCategories.includes(categoryMap[w.Category]))
    .map(weapon => {
      const filteredBlueprints = weapon.Blueprints.filter(bp => {
        const inText = bp.Name.toLowerCase().includes(textFilter) || weapon.Name.toLowerCase().includes(textFilter);
        const inPool = activePools.includes(bp.Pool);

        let inStatus = false;
        if (activeStatuses.includes('Normal') && bp.Name !== "NOTHING" && bp.Name !== "UNRELEASED") {
            inStatus = true;
        }
        if (activeStatuses.includes('NOTHING') && bp.Name === "NOTHING") {
            inStatus = true;
        }
        if (activeStatuses.includes('UNRELEASED') && bp.Name === "UNRELEASED") {
            inStatus = true;
        }

        if (activeStatuses.length === 0) {
            inStatus = false;
        }

        return inText && inPool && inStatus; 
      });

      return {
        ...weapon,
        Blueprints: filteredBlueprints
      };
    })
    .filter(w => w.Blueprints.length > 0);

  renderTable(filtered);
}

searchInput.addEventListener('input', applyFilters);

imageCheckbox.addEventListener('change', () => {
  applyFilters(); 
})

function applyImageToggle() {

  const accordionRows = Array.from(document.querySelectorAll('#pullsTable tbody tr')).filter(row => {
    const isAccordionRow = row.querySelector('td[colspan="4"]');
    if (!isAccordionRow) return false; 

    const dataRow = row.previousElementSibling;
    const blueprintNameCell = dataRow?.querySelector('td:nth-child(3)');

    const blueprintName = blueprintNameCell ? blueprintNameCell.textContent.replace(/[▶▼]/g, '').trim() : '';

    return blueprintName !== 'NOTHING' && blueprintName !== 'UNRELEASED';
  });

  accordionRows.forEach(accordionRow => {
    const accordionContent = accordionRow.querySelector('div.accordion-content');
    const dataRow = accordionRow.previousElementSibling;
    const arrow = dataRow?.querySelector('span');
    const img = accordionContent?.querySelector('img'); 

    if (accordionContent && arrow) {
      if (imageCheckbox.checked) {
        accordionContent.classList.add('expanded');
        arrow.textContent = '▼';

        if (img && img.dataset.src && !img.src) {
          img.src = img.dataset.src;
        }

        if (img && !accordionContent.contains(img)) {
          accordionContent.appendChild(img);
        } else if (!img && !accordionContent.querySelector('em')) {

          const tempImg = document.createElement('img');
          const blueprintName = dataRow?.querySelector('td:nth-child(3)')?.textContent.replace(/[▶▼]/g, '').trim();
          if (blueprintName) {
            tempImg.dataset.src = `assets/blueprints/images/${dataRow.querySelector('td:nth-child(1)').textContent}/${blueprintName}.jpg`;
            tempImg.alt = blueprintName;
            tempImg.style.maxWidth = '100%';
            tempImg.style.height = 'auto';
            tempImg.onerror = () => {
              accordionContent.innerHTML = '<em>No image.</em>';
            };
            tempImg.src = tempImg.dataset.src; 
            accordionContent.appendChild(tempImg);
          } else {
            accordionContent.innerHTML = '<em>No image.</em>';
          }
        }
      } else {

        accordionContent.classList.remove('expanded');
        arrow.textContent = '▶';
      }
    }
  });
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

toggleStatusDropdown.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = statusFilterContainer.classList.toggle('hidden');
    statusArrow.textContent = isHidden ? '▼' : '▲';
});

document.addEventListener('click', (e) => {
    if (!statusFilterContainer.contains(e.target) &&
        !toggleStatusDropdown.contains(e.target)) {
      if (!statusFilterContainer.classList.contains('hidden')) {
        statusFilterContainer.classList.add('hidden');
        statusArrow.textContent = '▼';
      }
    }
});
