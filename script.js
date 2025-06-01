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

// NEW STATUS FILTER ELEMENTS
const statusFilterContainer = document.getElementById('statusCheckboxes');
const toggleStatusDropdown = document.getElementById('toggleStatusDropdown');
const statusArrow = document.getElementById('statusArrow');

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
    populateStatusFilter(); // NEW: Call to populate the new status filter
    applyFilters();
    searchView.classList.remove('hidden');
  })
  .catch(err => console.error("Error on load:", err));

function renderTable(data) {
  tableBody.innerHTML = '';

  data.forEach((weapon, i) => {
    weapon.Blueprints.forEach(blueprint => {
      // Skip blueprints with empty names
      if (blueprint.Name === "") return;

      const isInvalidImage = blueprint.Name === "Nothing Pulls" || blueprint.Name === "Unreleased";
      
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
      arrow.style.width = '1.2em'; // consistent width for both ▶ and ▼
      arrow.style.textAlign = 'center';
      arrow.style.visibility = isInvalidImage ? 'hidden' : 'visible'; // always in DOM, but hidden for invalid images

      blueprintCell.appendChild(arrow);
      blueprintCell.appendChild(document.createTextNode(blueprint.Name));
      row.appendChild(blueprintCell);

      const poolCell = document.createElement('td');
      poolCell.textContent = blueprint.Pool;
      row.appendChild(poolCell);

      tableBody.appendChild(row);
      
      // Only create and append accordion row if it's a valid image blueprint
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
        img.style.height = 'auto'; // Ensure aspect ratio is maintained

        // Add an error handler for the image
        img.onerror = () => {
          accordionContent.innerHTML = '<em>No image.</em>';
          // Remove the image element from the DOM if it exists
          if (img.parentNode) {
            img.parentNode.removeChild(img);
          }
        };   
        
        accordionCell.appendChild(accordionContent);
        accordionRow.appendChild(accordionCell);
        tableBody.appendChild(accordionRow);

        let imageLoaded = false;
        
        // Event listener for the arrow to toggle accordion content
        arrow.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = accordionContent.classList.contains('expanded');
        
          // If "Show All Previews" is not checked, collapse all other open accordions
          if (!imageCheckbox.checked){
            document.querySelectorAll('#pullsTable tbody tr div.expanded').forEach(div => {
              div.classList.remove('expanded');
              // Find the corresponding arrow and change its text
              const parentAccordionRow = div.closest('tr');
              const dataRow = parentAccordionRow?.previousElementSibling;
              const associatedArrow = dataRow?.querySelector('span');
              if (associatedArrow) {
                associatedArrow.textContent = '▶';
              }
            });
          }
        
          // Toggle the current accordion
          if (!isVisible) {
            accordionContent.classList.add('expanded');
            arrow.textContent = '▼';

            // Load image only if it hasn't been loaded and a src is available
            if (!imageLoaded && img.dataset.src) {
              img.src = img.dataset.src;
              // Append image only if it's not already a child
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

        // If "Show All Previews" is checked, expand this accordion and load image
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
  // After rendering, apply the image toggle state based on checkbox
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

// NEW FUNCTION: Populate Status Filter
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

    const statusOptions = ['Normal', 'Nothing Pulls', 'Unreleased']; // Define blueprint status options

    statusOptions.forEach(status => {
        const label = document.createElement('label');
        label.style.display = 'block';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = status;
        checkbox.checked = (status === 'Normal'); // Default: only 'Normal Blueprints' are checked
        checkbox.addEventListener('change', applyFilters);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(status === 'Normal' ? 'Normal Blueprints' : `Show ${status}`)); // Display "Show Nothing Pulls", "Show Unreleased"
        statusFilterContainer.appendChild(label);
    });
}

function applyFilters() {
  const textFilter = searchInput.value.toLowerCase();
  const activeCategories = [...categoryFilterContainer.querySelectorAll('input:checked')]
    .map(cb => cb.value);
  const activePools = [...poolFilterContainer.querySelectorAll('input:checked')]
    .map(cb => cb.value);
  const activeStatuses = [...statusFilterContainer.querySelectorAll('input:checked')] // NEW: Get active statuses
    .map(cb => cb.value);

  const filtered = Weapons
    .filter(w => activeCategories.includes(categoryMap[w.Category]))
    .map(weapon => {
      const filteredBlueprints = weapon.Blueprints.filter(bp => {
        const inText = bp.Name.toLowerCase().includes(textFilter) || weapon.Name.toLowerCase().includes(textFilter);
        const inPool = activePools.includes(bp.Pool);

        // NEW: Status Filtering Logic
        let inStatus = false;
        if (activeStatuses.includes('Normal') && bp.Name !== "Nothing Pullss" && bp.Name !== "Unreleased") {
            inStatus = true;
        }
        if (activeStatuses.includes('Nothing Pulls') && bp.Name === "Nothing Pulls") {
            inStatus = true;
        }
        if (activeStatuses.includes('Unreleased') && bp.Name === "Unreleased") {
            inStatus = true;
        }
        // If no status is selected, no blueprints will be shown
        if (activeStatuses.length === 0) {
            inStatus = false;
        }

        return inText && inPool && inStatus; // Combine all filters
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

// Old checkbox listeners removed
// Nothing PullsCheckbox.addEventListener('change', applyFilters);
// UnreleasedCheckbox.addEventListener('change', applyFilters); 

imageCheckbox.addEventListener('change', () => {
  applyFilters(); // Re-render table to ensure correct initial state of accordions
})

function applyImageToggle() {
  // Select only accordion rows that are not for "Nothing Pulls" or "Unreleased" blueprints
  const accordionRows = Array.from(document.querySelectorAll('#pullsTable tbody tr')).filter(row => {
    const isAccordionRow = row.querySelector('td[colspan="4"]');
    if (!isAccordionRow) return false; // Not an accordion row

    // Check the blueprint name from the *previous* data row
    const dataRow = row.previousElementSibling;
    const blueprintNameCell = dataRow?.querySelector('td:nth-child(3)');
    // Extract text content, remove arrow characters, and trim whitespace
    const blueprintName = blueprintNameCell ? blueprintNameCell.textContent.replace(/[▶▼]/g, '').trim() : '';
    
    return blueprintName !== 'Nothing Pulls' && blueprintName !== 'Unreleased';
  });

  accordionRows.forEach(accordionRow => {
    const accordionContent = accordionRow.querySelector('div.accordion-content');
    const dataRow = accordionRow.previousElementSibling;
    const arrow = dataRow?.querySelector('span');
    const img = accordionContent?.querySelector('img'); // Get the img element if it exists

    if (accordionContent && arrow) {
      if (imageCheckbox.checked) {
        accordionContent.classList.add('expanded');
        arrow.textContent = '▼';
        // Load image if it exists, has a dataset.src, and hasn't been loaded yet
        if (img && img.dataset.src && !img.src) {
          img.src = img.dataset.src;
        }
        // Ensure image is appended if it's not already there (e.g., after a filter change)
        if (img && !accordionContent.contains(img)) {
          accordionContent.appendChild(img);
        } else if (!img && !accordionContent.querySelector('em')) {
          // This case should ideally not be hit if renderTable creates the img correctly
          // but as a fallback, if no img and no 'No image.' message, create and append
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
            tempImg.src = tempImg.dataset.src; // Set src immediately
            accordionContent.appendChild(tempImg);
          } else {
            accordionContent.innerHTML = '<em>No image.</em>';
          }
        }
      } else {
        // If imageCheckbox is not checked, collapse the accordion
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

// NEW: Event listeners for Status dropdown
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
