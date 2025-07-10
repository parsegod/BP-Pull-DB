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

const changelogModal = document.getElementById('changelogModal');
const closeChangelogModalBtn = document.getElementById('closeChangelogModal');
const changelogButton = document.getElementById('changelogButton');
const changelogContentDiv = document.getElementById('changelogContent');

const howToUseModal = document.getElementById('howToUseModal');
const closeHowToUseModalBtn = document = document.getElementById('closeHowToUseModal');
const howToUseButton = document.getElementById('howToUseButton');
const howToUseContentDiv = document.getElementById('howToUseContent');


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

const changelogEntries = [
    {
    date: "2025-06-11 10:23PM 𝗠𝗦𝗧",
    changes: [
      "↷ 𝗨𝗽𝗮𝘁𝗲𝗱 𝘄 𝗧𝗼 𝗚𝘂𝗶𝗱𝗲 ↶",
      " 𝗮𝗱𝗱𝗲𝗱 𝗮 𝗠𝘂𝗹𝘁𝗶𝗽𝗹𝗮𝘆𝗲𝗿 𝗘𝘅𝗽𝗹𝗼𝗶𝘁 �𝗲𝗰𝘁𝗶𝗼𝗻. 𝗮𝘀𝘄𝗲𝗹𝗹 𝗮𝘀 𝘀𝗼𝗺𝗲 𝗮𝗱𝗷𝘂𝘀𝘁𝗺𝗲𝗻𝘁𝘀 𝘁𝗼 𝘁𝗵𝗲 𝗺𝗮𝗶𝗻 𝗛𝗼𝘄 𝗧𝗼 𝗨𝗶."
    ]
  },
    {
    date: "2025-06-11 6:13AM 𝗠𝗦𝗧",
    changes: [
            "↷ 𝗔𝗱𝗱𝗲𝗱 𝗡𝗲𝘄 𝗣𝗿𝗶𝗻𝘁𝘀 ↶",
            "ASG-89: PERSONAL DETECTIVE (Pool 22)"
    ]
  },
    {
    date: "2025-06-10 10:38AM 𝗠𝗦𝗧",
    changes: [
            "↷ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗣𝗿𝗶𝗻𝘁 ↶",
            "HDR: NAUTILOID (Pool 2)"
    ]
  },
    {
    date: "2025-06-09 4:06PM 𝗠𝗦𝗧",
    changes: [
            "↷ 𝗔𝗱𝗱𝗲𝗱 𝗡𝗲𝘄 𝗣𝗿𝗶𝗻𝘁𝘀 ↶",
            "LW31A1 FROSTLINE: THUNDERHEAD (Pool 7)",
            "KOMPAKT 92: PRINTED END (Pool 13)"
    ]
  },
    {
    date: "2025-06-08 7:48AM 𝗠𝗦𝗧",
    changes: [
            "↷ 𝗔𝗱𝗱𝗲𝗱 𝗡𝗲𝘄 𝗣𝗿𝗶𝗻𝘁𝘀 ↶",
            "MAELSTROM: DARK ENDING (Pool 15)",
            "KRIG C: DE-ANIMATOR (Pool 12)"
    ]
  },
    {
    date: "2025-06-07 9:48AM 𝗠𝗦𝗧",
    changes: [
            "↷ 𝗔𝗱𝗱𝗲𝗱 𝗡𝗲𝘄 𝗣𝗿𝗶𝗻𝘁𝘀 ↶",
            "LC10: STORM RAGE (Pool 1)",
            "LC10: BLACKCELL HULL BUSTER  (Pool 2)"
    ]
  },
    {
    date: "2025-06-06 8:51PM 𝗠𝗦𝗧",
    changes: [
      "↷ 𝗔𝗱𝗱𝗲𝗱 𝗛𝗼𝘄 𝗧𝗼 𝗚𝘂𝗶𝗱𝗲 ↶",
      " 𝗮𝗱𝗱𝗲𝗱 𝗮 𝗦𝗲𝗰𝘁𝗶𝗼𝗻 𝘁𝗵𝗮𝘁 𝗵𝗲𝗹𝗽𝘀 𝗻𝗲𝘄 𝘂𝘀𝗲𝗿𝘀 𝘂𝗻𝗱𝗲𝗿𝘀𝘁𝗮𝗻𝗱 𝗵𝗼𝘄 𝘁𝗵𝗲 𝘀𝗶𝘁𝗲/𝗺𝗲𝘁𝗵𝗼𝗱 𝘄𝗼𝗿𝗸𝘀."
    ]
  },
    {
        date: "2025-06-06 7:34 PM 𝗠𝗦𝗧",
        changes: [
            "↷ 𝗔𝗱𝗱𝗲𝗱 𝗡𝗲𝘄 𝗣𝗿𝗶𝗻𝘁𝘀 ↶",
            "CR-56 AMAX: DATA BREACHER (Pool 2)",
            "LADRA: HELLBLOCK (Pool 2)",
            "FENG 82: LOCK UP (Pool 7)",
            "LW31A1 FROSTLINE: SNITCH UP (Pool 15)",
            "KRIG C: IED (Pool 17)",
            "KRIG C: IED BLACKCELL (Pool 20)",
            "STRYDER .22: HOT FRANK (Pool 6)",
            "MARINE SP: GEN POP PROP (Pool 12)",
            "KOMPAKT 92: PRE OWNED (Pool 10)",
            "AMR MOD 4: MAKESHIFT (Pool 7)",
            "GS45: HOMESPUN (Pool 8)",
            "AS VAL: SECURITY DETAIL (Pool 10)",
            "ASG-89: ESCAPE PLAN (Pool 18)",
            "ASG-89: ESCAPE PLAN BLACKCELL (Pool 21)",
            "GPMG-7: CROWD CONTROL (Pool 17)",
            "FFAR 1: COMBO BASH (Pool 9)",
            "FFAR 1: PUNISHING BLOWS (Pool 1)",
            "LC10: HULL BUSTER (Pool 5)",
            "LC10: BYTE BLASTER (Pool 9)",
            "AMES 85: LETHAL INSPECTION (Pool 26)",
            "AMES 85: SCALES (Pool 27)",
            "AMES 86: PRO REISSUE (Pool 28)",
            "HDR: HYDRATOR (Pool 6)",
            "DM-10: MUCKER (Pool 12)",
            "MODEL L: DRAIN HAZARD (Pool 22)",
            "MODEL L: DRAIN HAZARD BLACKCELL (Pool 12)",
            "SAUG: OVERFLOW (Pool 20)"
    ]
  },
    {
    date: "2025-06-02 8:07AM 𝗠𝗦𝗧",
    changes: [
      "↷ 𝗙𝗶𝘅𝗲𝗱 𝗗𝘂𝗽𝗲 ↶",
      " 𝗙𝗶𝘅𝗲𝗱 𝘁𝗵𝗲 𝗲𝗿𝗿𝗼𝗿 𝗰𝗮𝘂𝘀𝗶𝗻𝗴 𝘁𝗵𝗲 𝗺𝗼𝗱𝗮𝗹 𝘁𝗼 𝗱𝘂𝗽𝗲 𝘁𝘄𝗶𝗰𝗲. "
    ]
  },
    {
    date: "2025-06-02 6:50AM 𝗠𝗦𝗧",
    changes: [
      "↷ 𝗥𝗲𝗺𝗼𝘃𝗲𝗱 𝗦𝗰𝗿𝗼𝗹𝗹 𝗕𝗮𝗿 𝗩𝗶𝘀𝗶𝗯𝗹𝗶𝘁𝘆 ↶",
      " 𝗜 𝗱𝗶𝗱𝗻'𝘁 𝗹𝗶𝗸𝗲 𝗵𝗼𝘄 𝘁𝗵𝗲 𝘀𝗰𝗿𝗼𝗹𝗹 𝗯𝗮𝗿 𝘄𝗮𝘀 𝗹𝗼𝗼𝗸𝗶𝗻𝗴 𝘀𝗼 𝗜 𝗿𝗲𝗺𝗼𝘃𝗲𝗱 𝗶𝘁𝘀 𝘃𝗶𝘀𝗮𝗯𝗶𝗹𝗶𝘁𝘆 "
    ]
  },
  {
    date: "2025-06-01 11:32PM 𝗠𝗦𝗧",
    changes: [
      "↷ 𝗔𝗱𝗱𝗲𝗱 𝗡𝗲𝘄 𝗣𝗿𝗶𝗻𝘁𝘀 ↶",
      " MODEL L: NO PAROLE (Pool 17)",
      " XM4: THERMOPLASTIC (Pool 20)",
      " 9MM PM: ARABESQUE (Pool 8)",
      " SAUG: PILE (Pool 13)",
      " JACKAL PDW: SWORN RIVALS (Blackcell 26)",
      " AMES 85: LETHAL INSPECTION (Pool 26)",
      " C9: THE PAINTSTORM (Pool 15)",
      " CYPHER 091: THE PAINTBURST (Pool 7)",
      " CR-56 AMAX: VERDUROUS MENACE (Pool 2)",
      " CR-56 AMAX: SEA CHOMPER (Pool 4)",
      " PPSH-41: SHRILL BLEAATER (Pool 8)",
      " TR2: BEAT `EM UP (Pool 2)",
      " GPMG-7: HEAD FIRST (Pool 13)",
      " MAELSTROM: BARRAINA (Pool 13)"
    ]
  }
];

function loadAppData() {
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
      showChangelogModal();
    })
    .catch(err => console.error("Error on load:", err));
}

document.addEventListener('DOMContentLoaded', loadAppData);

function renderTable(data) {
  let totalCount = 0;
  let normalCount = 0;
  let unreleasedCount = 0;
  let nothingCount = 0;

  data.forEach(weapon => {
    weapon.Blueprints.forEach(blueprint => {
      totalCount++;
      const status = blueprint.status || 'Normal';
      if (status === "UNRELEASED") {
        unreleasedCount++;
      } else if (status === "NOTHING") {
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

      const blueprintStatus = blueprint.status || 'Normal';
      const canDisplayImage = blueprintStatus !== "NOTHING" && blueprintStatus !== "NOTEXTURE";

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
      arrow.style.visibility = canDisplayImage ? 'visible' : 'hidden';

      const blueprintNameSpan = document.createElement('span');
      blueprintNameSpan.textContent = blueprint.Name;

      if (blueprintStatus === "RELEASED") {
        blueprintNameSpan.classList.add('status-released');
      } else if (blueprintStatus === "UNRELEASED") {
        blueprintNameSpan.classList.add('status-unreleased');
      } else if (blueprintStatus === "NOTHING") {
        blueprintNameSpan.classList.add('status-nothing');
      } else if (blueprintStatus === "NOTEXTURE") {
        blueprintNameSpan.classList.add('status-no-texture');
      }

      blueprintCell.appendChild(arrow);
      blueprintCell.appendChild(blueprintNameSpan);
      row.appendChild(blueprintCell);

      const poolCell = document.createElement('td');
      poolCell.textContent = blueprint.Pool;
      row.appendChild(poolCell);

      tableBody.appendChild(row);

      if (canDisplayImage) {
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

    const statusOptions = ['RELEASED', 'UNRELEASED', 'NOTHING', 'NOTEXTURE'];

    statusOptions.forEach(status => {
        const label = document.createElement('label');
        label.style.display = 'block';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = status;
        checkbox.checked = (status === 'RELEASED' || status === 'UNRELEASED');
        checkbox.addEventListener('change', applyFilters);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(status === 'RELEASED' ? 'Show RELEASED' :
                                               status === 'UNRELEASED' ? 'Show UNRELEASED' :
                                               `Show ${status}`));
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
        const blueprintStatus = bp.status || 'Normal';

        if (activeStatuses.includes('RELEASED') && blueprintStatus === "RELEASED") {
            inStatus = true;
        }
        if (activeStatuses.includes('UNRELEASED') && blueprintStatus === "UNRELEASED") {
            inStatus = true;
        }
        if (activeStatuses.includes('NOTHING') && blueprintStatus === "NOTHING") {
            inStatus = true;
        }
        if (activeStatuses.includes('NOTEXTURE') && blueprintStatus === "NOTEXTURE") {
            inStatus = true;
        }
        if (activeStatuses.includes('Normal') &&
            blueprintStatus !== "NOTHING" &&
            blueprintStatus !== "NOTEXTURE" &&
            blueprintStatus !== "RELEASED" &&
            blueprintStatus !== "UNRELEASED") {
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
    const blueprintNameSpan = blueprintNameCell?.querySelector('span:last-child');
    const blueprintName = blueprintNameSpan ? blueprintNameSpan.textContent.trim() : '';

    const hasImageClass = blueprintNameSpan && (
        blueprintNameSpan.classList.contains('status-released') ||
        blueprintNameSpan.classList.contains('status-unreleased')
    );

    return hasImageClass;
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

function closeAllDropdowns() {
  const dropdowns = [categoryFilterContainer, poolFilterContainer, statusFilterContainer];
  const arrows = [categoryArrow, poolArrow, statusArrow];

  dropdowns.forEach((dropdown, index) => {
    if (!dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
      arrows[index].textContent = '▼';
    }
  });
}

toggleCategoryDropdown.addEventListener('click', (e) => {
  e.stopPropagation();
  const isHidden = categoryFilterContainer.classList.contains('hidden');
  if (isHidden) {
    closeAllDropdowns();
    categoryFilterContainer.classList.remove('hidden');
    categoryArrow.textContent = '▲';
  } else {
    categoryFilterContainer.classList.add('hidden');
    categoryArrow.textContent = '▼';
  }
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
  const isHidden = poolFilterContainer.classList.contains('hidden');
  if (isHidden) {
    closeAllDropdowns();
    poolFilterContainer.classList.remove('hidden');
    poolArrow.textContent = '▲';
  } else {
    poolFilterContainer.classList.add('hidden');
    poolArrow.textContent = '▼';
  }
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
    const isHidden = statusFilterContainer.classList.contains('hidden');
    if (isHidden) {
      closeAllDropdowns();
      statusFilterContainer.classList.remove('hidden');
      statusArrow.textContent = '▲';
    } else {
      statusFilterContainer.classList.add('hidden');
      statusArrow.textContent = '▼';
    }
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

function populateChangelog() {
  changelogContentDiv.innerHTML = '';

  changelogEntries.forEach(entry => {
    const listItem = document.createElement('li');
    const dateStrong = document.createElement('strong');
    dateStrong.textContent = `Date: ${entry.date}`;
    listItem.appendChild(dateStrong);

    const ul = document.createElement('ul');
    entry.changes.forEach(change => {
      const li = document.createElement('li');
      li.textContent = change;
      ul.appendChild(li);
    });
    listItem.appendChild(ul);
    changelogContentDiv.appendChild(listItem);
  });
}

function showChangelogModal() {
  populateChangelog();
  changelogModal.classList.add('visible');
}

function hideChangelogModal() {
  changelogModal.classList.remove('visible');
}

changelogButton.addEventListener('click', showChangelogModal);

closeChangelogModalBtn.addEventListener('click', hideChangelogModal);

changelogModal.addEventListener('click', (e) => {
  if (e.target === changelogModal) {
    hideChangelogModal();
  }
});

function showHowToUseModal() {
  howToUseModal.classList.add('visible');
  showHowToTab('explanation');
}

function hideHowToUseModal() {
  howToUseModal.classList.remove('visible');
}

howToUseButton.addEventListener('click', showHowToUseModal);

closeHowToUseModalBtn.addEventListener('click', hideHowToUseModal);

howToUseModal.addEventListener('click', (e) => {
  if (e.target === howToUseModal) {
    hideHowToUseModal();
  }
});

function showHowToTab(tabId) {
  const tabButtons = document.querySelectorAll('.how-to-tabs .tab-button');
  const tabContents = document.querySelectorAll('.how-to-sections .tab-content');

  tabButtons.forEach(button => button.classList.remove('active'));
  tabContents.forEach(content => content.classList.add('hidden'));

  const selectedButton = document.querySelector(`.how-to-tabs button[data-tab="${tabId}"]`);
  const selectedContent = document.getElementById(`${tabId}-content`);

  if (selectedButton) {
    selectedButton.classList.add('active');
  }
  if (selectedContent) {
    selectedContent.classList.remove('hidden');
  }
}

document.addEventListener('DOMContentLoaded', () => {
    const howToUseTabs = document.querySelector('.how-to-tabs');
    if (howToUseTabs) {
        howToUseTabs.addEventListener('click', (event) => {
            if (event.target.classList.contains('tab-button')) {
                const tabId = event.target.dataset.tab;
                showHowToTab(tabId);
            }
        });
    }
});

function showChangelogOnPageLoad() {
  showChangelogModal();
}

document.addEventListener('DOMContentLoaded', showChangelogOnPageLoad);