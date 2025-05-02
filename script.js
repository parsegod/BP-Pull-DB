  const tableBody = document.querySelector('#pullsTable tbody');
  const categoryFilterContainer = document.getElementById('categoryCheckboxes');
  const searchInput = document.getElementById('search');

  const categoryList = [
    "AR", "Sub", "Shotgun", "LMG", "Marksman",
    "Snipe", "Pistol", "Special", "Launcher", "Melee"
  ];

  let Weapons = [];
  let currentData = [];
  let currentSortKey = null;
  let currentSortDirection = 'asc';

  // 🔹 Lade JSON-Datei
  fetch('assets/weapon.json')
    .then(res => res.json())
    .then(data => {
      Weapons = data.Weapons;
      currentData = [...Weapons];
      populateCategoryFilter();
      renderTable(currentData);
    })
    .catch(err => console.error('Fehler beim Laden:', err));

  // 🔹 Tabelle rendern
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

  // 🔹 Filter erstellen
  function populateCategoryFilter() {
    categoryFilterContainer.innerHTML = '';

    categoryList.forEach((cat, idx) => {
      const label = document.createElement('label');
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

  // 🔹 Filtern & sortieren
  function applyFilters() {
    const textFilter = searchInput.value.toLowerCase();
    const checkedCats = [...categoryFilterContainer.querySelectorAll('input:checked')]
      .map(cb => cb.value);

    const filtered = Weapons
      .filter(w => w.name.toLowerCase().includes(textFilter))
      .filter(w => checkedCats.includes(w.Category));

    renderTable(filtered);
  }

  // 🔹 Suche live verarbeiten
  searchInput.addEventListener('input', applyFilters);
