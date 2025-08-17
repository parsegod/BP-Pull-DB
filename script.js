// FileName: /script.js

// ================== DOM Element Selections ================== //
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
const closeHowToUseModalBtn = document.getElementById('closeHowToUseModal');
const howToUseButton = document.getElementById('howToUseButton');
const howToUseContentDiv = document.getElementById('howToUseContent');

const bugLogModal = document.getElementById('bugLogModal');
const closeBugLogModalBtn = document.getElementById('closeBugLogModal');
const bugLogButton = document.getElementById('bugLogButton');
const bugLogContentDiv = document.getElementById('bugLogContent');

const clearStorageModal = document.getElementById('clearStorageModal');
const closeClearStorageModalBtn = document.getElementById('closeClearStorageModal');
const confirmClearStorageBtn = document.getElementById('confirmClearStorageBtn');
const cancelClearStorageBtn = document.getElementById('cancelClearStorageBtn');

// New Discord Announcement Modal elements
const discordAnnouncementLink = document.getElementById('discordAnnouncementLink');
const discordAnnouncementModal = document.getElementById('discordAnnouncementModal');
const closeDiscordAnnouncementModalBtn = document.getElementById('closeDiscordAnnouncementModal');
const goToDiscordBtn = document.getElementById('goToDiscordBtn');
const cancelDiscordModalBtn = document.getElementById('cancelDiscordModalBtn');

// Desktop-only buttons
const clearStorageButtonDesktop = document.getElementById('clearStorageButton');
const discordButtonDesktop = document.getElementById('discordButton');
const contributionsButtonDesktop = document.getElementById('contributionsButton');

// Mobile-only buttons (if they exist, otherwise these will be null)
const clearStorageButtonMobile = document.getElementById('clearStorageButtonMobile');
const discordButtonMobile = document.getElementById('discordButtonMobile');
const contributionsButtonMobile = document.getElementById('contributionsButtonMobile');

// ================== END ================== //


// ================== Global Data & Mappings ================== //
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
    "date": "2025-07-22 01:25AM MST",
    "changes": [
      "↷ Overall Site Adds ↶",
      "Revamped Homepage (Bug Finder, Custom Mobile Local, etc.)",
      "Added End Key (API Key Status)",
      "Simplified Loading Logic",
      "Revamped Blocked Page (Mobile UI, Information and Contact)",
      "Revamped Verify Page (Temporary API Key, '/' Redirect Logic, Info, etc.)",
      "Edited Vercel Rules ('/' Redirects, '*' Redirects, etc.)"
    ]
  },
  {
    "date": "2025-07-21 03:30AM MST",
    "changes": [
      "↷ Major Security Adds ↶",
      "Added Blocked Page (Blacklisted Home)",
      "Added Verify Page (IP Blacklist Check)",
      "Revamped The Loading Page for Mobile",
      "Added 2-Hour Local Storage (Keys)",
      "Added Button to Clear Local Storage Items",
      "Linked All Files Correctly"
    ]
  },
  {
    "date": "2025-07-21 03:30AM MST",
    "changes": [
      "↷ Major Security Adds ↶",
      "Added Blocked Page (Blacklisted Home)",
      "Added Verify Page (IP Blacklist Check)",
      "Revamped The Loading Page for Mobile",
      "Added 2-Hour Local Storage (Keys)",
      "Added Button to Clear Local Storage Items",
      "Linked All Files Correctly"
    ]
  },
  {
    "date": "2025-07-12 02:43PM MST",
    "changes": [
      "↷ Update To UI ↶",
      "Added Page Loader",
      "Added Contributions Page",
      "Revamped Search-Filter-Section",
      "Revamped Main Container",
      "Added Mobile Responsive Browsing",
      "Minor CSS Adjustments"
    ]
  },
  {
    "date": "2025-06-11 10:23PM MST",
    "changes": [
      "↷ Update to Guide ↶",
      "Added a Multiplayer Exploit Section. As well as some adjustments to the main How To UI."
    ]
  },
  {
    "date": "2025-06-11 06:13AM MST",
    "changes": [
      "↷ Added New Prints ↶",
      "ASG-89: PERSONAL DETECTIVE (Pool 22)"
    ]
  },
  {
    "date": "2025-06-10 10:38AM MST",
    "changes": [
      "↷ Removed Print ↶",
      "HDR: NAUTILOID (Pool 2)"
    ]
  },
  {
    "date": "2025-06-09 04:06PM MST",
    "changes": [
      "↷ Added New Prints ↶",
      "LW31A1 FROSTLINE: THUNDERHEAD (Pool 7)",
      "KOMPAKT 92: PRINTED END (Pool 13)"
    ]
  },
  {
    "date": "2025-06-08 07:48AM MST",
    "changes": [
      "↷ Added New Prints ↶",
      "MAELSTROM: DARK ENDING (Pool 15)",
      "KRIG C: DE-ANIMATOR (Pool 12)"
    ]
  },
  {
    "date": "2025-06-07 09:48AM MST",
    "changes": [
      "↷ Added New Prints ↶",
      "LC10: STORM RAGE (Pool 1)",
      "LC10: BLACKCELL HULL BUSTER (Pool 2)"
    ]
  },
  {
    "date": "2025-06-06 08:51PM MST",
    "changes": [
      "↷ Added How To Guide ↶",
      "Added a Section that helps new users understand how the site/method works."
    ]
  },
  {
    "date": "2025-06-06 07:34PM MST",
    "changes": [
      "↷ Added New Prints ↶",
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
    "date": "2025-06-02 08:07AM MST",
    "changes": [
      "↷ Fixed Dupe ↶",
      "Fixed the error causing the modal to dupe twice."
    ]
  },
  {
    "date": "2025-06-02 06:50AM MST",
    "changes": [
      "↷ Removed Scroll Bar Visibility ↶",
      "I didn't like how the scroll bar was looking so I removed its visibility."
    ]
  },
  {
    "date": "2025-06-01 11:32PM MST",
    "changes": [
      "↷ Added New Prints ↶",
      "MODEL L: NO PAROLE (Pool 17)",
      "XM4: THERMOPLASTIC (Pool 20)",
      "9MM PM: ARABESQUE (Pool 8)",
      "SAUG: PILE (Pool 13)",
      "JACKAL PDW: SWORN RIVALS (Blackcell 26)",
      "AMES 85: LETHAL INSPECTION (Pool 26)",
      "C9: THE PAINTSTORM (Pool 15)",
      "CYPHER 091: THE PAINTBURST (Pool 7)",
      "CR-56 AMAX: VERDUROUS MENACE (Pool 2)",
      "CR-56 AMAX: SEA CHOMPER (Pool 4)",
      "PPSH-41: SHRILL BLEAATER (Pool 8)",
      "TR2: BEAT 'EM UP (Pool 2)",
      "GPMG-7: HEAD FIRST (Pool 13)",
      "MAELSTROM: BARRAINA (Pool 13)"
    ]
  }
];

const bugLogEntries = [
    {
        date: "2025-07-21 11:30AM 𝗠𝗗𝗧",
        fixes: [
            "Fixed an issue where the search input would lose focus on blur.",
            "Improved responsiveness of filter dropdowns on smaller screens.",
            "Resolved a bug causing incorrect blueprint counts for 'NOTHING' status."
        ]
    },
    {
        date: "2025-07-20 09:00AM 𝗠𝗗𝗧",
        fixes: [
            "Addressed a display bug with images not loading correctly in accordion views.",
            "Optimized table rendering for faster performance with large datasets."
        ]
    }
];

// ================== END ================== //


// ================== API Key Management & Security ================== //

const blacklistedIPsEncoded = [
  ""
];

function decodeBase64(encodedString) {
    try {
        return atob(encodedString);
    } catch (e) {
        console.error("Base64 decoding error:", e);
        return "";
    }
}

async function getUserIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return null;
    }
}

function isIPBlacklisted(ip) {
    return blacklistedIPsEncoded.some(encodedIp => decodeBase64(encodedIp) === ip);
}

function checkAPIKeyAndRedirect(isInitialCheck) {
    const apiKey = localStorage.getItem('blubase_api_key');
    const apiKeyExpiry = localStorage.getItem('blubase_api_key_expiry');
    const originalApiKey = localStorage.getItem('blubase_api_key_original');
    const currentTime = new Date().getTime();

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const isCorrupted = !apiKey || !uuidRegex.test(apiKey) || (originalApiKey && apiKey !== originalApiKey);
    const isExpired = !apiKeyExpiry || isNaN(parseInt(apiKeyExpiry)) || currentTime >= parseInt(apiKeyExpiry);

    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');

    if (isCorrupted || isExpired) {
        console.log("API key corrupted or expired. Clearing local storage.");
        localStorage.removeItem('blubase_api_key');
        localStorage.removeItem('blubase_api_key_expiry');
        localStorage.removeItem('blubase_api_key_original');

        if (isInitialCheck) {
            console.log("Initial load, API key corrupted/expired. Redirecting to /verify.");
            window.location.replace('/verify');
        } else {
            console.log("API key corrupted/expired during runtime. Redirecting to /endkey.");
            window.location.replace('/endkey');
        }
    } else {
        console.log("Valid and untampered API key found. Displaying content.");

        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
        }

        if (mainContent) {
            mainContent.style.display = 'block';

            setTimeout(() => {
                mainContent.style.opacity = '1';
            }, 10);
        }
    }
}

// ================== END ================== //

// ================== Discord Functionality (Updated for Proxy) ================== //

const discordGuildId = '1406333070239465572';
const discordInviteCode = '7mfEwgUT8H';
const userId = '1285264427540545588';

let userActivities = [];
let currentActivityIndex = 0;
let elapsedTimeInterval;
let hasReceivedInitialData = false;
const pollingInterval = 5000; // Poll every 5 seconds

// Function to handle the initial loading state
function setLoadingState() {
    const presenceActivityName = document.getElementById('presence-activity-name');
    if (presenceActivityName) {
        presenceActivityName.textContent = 'Loading activity...';
    }
}

// Function to fetch Discord invite data for the mobile view
async function fetchDiscordData() {
    try {
        const response = await fetch(`https://discord.com/api/v9/invites/${discordInviteCode}?with_counts=true`);
        if (!response.ok) {
            throw new Error('Failed to fetch Discord data');
        }
        const data = await response.json();

        const guildNameElement = document.getElementById('discord-guild-name');
        const onlineCountElement = document.getElementById('discord-online-count');
        const totalMembersElement = document.getElementById('discord-total-members');
        const serverIconElement = document.getElementById('discord-server-icon');
        const serverBannerElement = document.getElementById('discord-server-banner');

        if (data.guild) {
            guildNameElement.textContent = data.guild.name;
            onlineCountElement.textContent = `${data.approximate_presence_count} Online`;
            totalMembersElement.textContent = `${data.approximate_member_count} Members`;
            if (data.guild.icon) {
                const iconUrl = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`;
                serverIconElement.src = iconUrl;
            }
            if (data.guild.banner && serverBannerElement) {
                const bannerUrl = `https://cdn.discordapp.com/banners/${data.guild.id}/${data.guild.banner}.png?size=1024`;
                serverBannerElement.style.backgroundImage = `url(${bannerUrl})`;
            }
        }
    } catch (error) {
        console.error('Error fetching Discord data:', error);
        const guildNameElement = document.getElementById('discord-guild-name');
        const onlineCountElement = document.getElementById('discord-online-count');
        const totalMembersElement = document.getElementById('discord-total-members');
        guildNameElement.textContent = 'Blu Base Community';
        onlineCountElement.textContent = '0 Online';
        totalMembersElement.textContent = '0 Members';
    }
}

// Function to fetch Discord invite data for the desktop view
async function fetchDiscordInviteForDesktop() {
    try {
        const response = await fetch(`https://discord.com/api/v9/invites/${discordInviteCode}?with_counts=true`);
        if (!response.ok) {
            throw new Error('Failed to fetch Discord data for desktop invite');
        }
        const data = await response.json();

        const inviteGuildName = document.getElementById('discord-invite-guild-name');
        const inviteOnlineCount = document.getElementById('discord-invite-online-count');
        const inviteTotalMembers = document.getElementById('discord-invite-total-members');
        const inviteServerIcon = document.getElementById('discord-invite-server-icon');

        if (data.guild) {
            inviteGuildName.textContent = data.guild.name;
            inviteOnlineCount.textContent = data.approximate_presence_count;
            inviteTotalMembers.textContent = data.approximate_member_count;
            if (data.guild.icon) {
                const iconUrl = `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png`;
                inviteServerIcon.src = iconUrl;
            }
        }
    } catch (error) {
        console.error('Error fetching Discord invite for desktop:', error);
        const inviteGuildName = document.getElementById('discord-invite-guild-name');
        const inviteOnlineCount = document.getElementById('discord-invite-online-count');
        const inviteTotalMembers = document.getElementById('discord-invite-total-members');
        inviteGuildName.textContent = 'Blu Base Community';
        inviteOnlineCount.textContent = 'N/A';
        inviteTotalMembers.textContent = 'N/A';
    }
}

function updateElapsedTime(startTime) {
    const presenceElapsedTime = document.getElementById('presence-elapsed-time');
    if (!presenceElapsedTime) return;

    if (elapsedTimeInterval) {
        clearInterval(elapsedTimeInterval);
    }

    if (startTime) {
        elapsedTimeInterval = setInterval(() => {
            const currentTime = Date.now();
            const elapsedMilliseconds = currentTime - startTime;
            const hours = Math.floor(elapsedMilliseconds / (1000 * 60 * 60));
            const minutes = Math.floor((elapsedMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((elapsedMilliseconds % (1000 * 60)) / 1000);
            presenceElapsedTime.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} elapsed`;
        }, 1000);
    } else {
        presenceElapsedTime.textContent = '';
    }
}

function displayActivity(activity) {
    const presenceActivityName = document.getElementById('presence-activity-name');
    const presenceDetailsText = document.getElementById('presence-details-text');
    const presenceStateText = document.getElementById('presence-state-text');
    const presenceLargeImage = document.getElementById('presence-large-image');

    if (activity) {
        if (presenceActivityName) presenceActivityName.textContent = activity.name;

        if (presenceDetailsText && activity.details) {
            presenceDetailsText.textContent = activity.details;
        } else if (presenceDetailsText) {
            presenceDetailsText.textContent = '';
        }
        if (presenceStateText && activity.state) {
            presenceStateText.textContent = activity.state;
        } else if (presenceStateText) {
            presenceStateText.textContent = '';
        }

        if (presenceLargeImage && activity.assets && activity.assets.large_image) {
            let largeImageUrl = '';
            if (activity.assets.large_image.startsWith('mp:')) {
                largeImageUrl = `https://media.discordapp.net/${activity.assets.large_image.substring(3)}`;
            } else if (activity.assets.large_image.startsWith('spotify:')) {
                const spotifyId = activity.assets.large_image.split(':')[1];
                largeImageUrl = `https://i.scdn.co/image/${spotifyId}`;
            } else if (activity.application_id) {
                largeImageUrl = `https://cdn.discordapp.com/app-assets/${activity.application_id}/${activity.assets.large_image}.png`;
            } else {
                largeImageUrl = activity.assets.large_image;
            }
            presenceLargeImage.src = largeImageUrl;
            presenceLargeImage.alt = activity.assets.large_text || activity.name;
            presenceLargeImage.style.display = 'block';
        } else if (presenceLargeImage) {
            presenceLargeImage.style.display = 'none';
            presenceLargeImage.src = '';
        }
        updateElapsedTime(activity.timestamps?.start);
    } else {
        if (hasReceivedInitialData) {
            if (presenceActivityName) presenceActivityName.textContent = 'No active game/stream/listening.';
            if (presenceDetailsText) presenceDetailsText.textContent = '';
            if (presenceStateText) presenceStateText.textContent = '';
            if (presenceLargeImage) {
                presenceLargeImage.style.display = 'none';
                presenceLargeImage.src = '';
            }
            updateElapsedTime(null);
        }
    }
}

function setupCarouselNavigation() {
    const presenceCarousel = document.getElementById('presence-carousel');
    if (!presenceCarousel) return;

    let prevButton = document.getElementById('presence-carousel-prev');
    let nextButton = document.getElementById('presence-carousel-next');
    if (prevButton) prevButton.remove();
    if (nextButton) nextButton.remove();

    if (userActivities.length > 1) {
        prevButton = document.createElement('button');
        prevButton.id = 'presence-carousel-prev';
        prevButton.className = 'carousel-nav-button prev';
        prevButton.innerHTML = '&#10094;';
        prevButton.addEventListener('click', showPreviousActivity);
        presenceCarousel.appendChild(prevButton);

        nextButton = document.createElement('button');
        nextButton.id = 'presence-carousel-next';
        nextButton.className = 'carousel-nav-button next';
        nextButton.innerHTML = '&#10095;';
        nextButton.addEventListener('click', showNextActivity);
        presenceCarousel.appendChild(nextButton);

        let touchStartX = 0;
        let touchEndX = 0;

        presenceCarousel.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        presenceCarousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                showNextActivity();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                showPreviousActivity();
            }
        });
    }
}

function removeCarouselNavigation() {
    const prevButton = document.getElementById('presence-carousel-prev');
    const nextButton = document.getElementById('presence-carousel-next');
    if (prevButton) prevButton.remove();
    if (nextButton) nextButton.remove();
}

function showNextActivity() {
    if (userActivities.length === 0) return;
    currentActivityIndex = (currentActivityIndex + 1) % userActivities.length;
    displayActivity(userActivities[currentActivityIndex]);
}

function showPreviousActivity() {
    if (userActivities.length === 0) return;
    currentActivityIndex = (currentActivityIndex - 1 + userActivities.length) % userActivities.length;
    displayActivity(userActivities[currentActivityIndex]);
}

// Function to fetch data from your Vercel proxy
async function fetchPresenceDataFromProxy() {
    const proxyEndpoint = '/api/lanyard-proxy'; // The new proxy endpoint

    try {
        const response = await fetch(proxyEndpoint);
        if (!response.ok) {
            throw new Error(`Proxy error! status: ${response.status}`);
        }
        const data = await response.json();
        
        hasReceivedInitialData = true; // Set this flag once data is received
        updatePresenceUI(data); // Use the existing UI update function
    } catch (error) {
        console.error('Error fetching presence data from proxy:', error);
        hasReceivedInitialData = true;
        displayActivity(null); // Display a default message on error
    }
}

function updatePresenceUI(user) {
    const presenceAvatar = document.getElementById('presence-avatar');
    const presenceStatusDot = document.getElementById('presence-status-dot');
    const presenceUsername = document.getElementById('presence-username');
    const presenceDiscordLink = document.getElementById('presence-discord-link');

    userActivities = user.activities.filter(act => act.type === 0 || act.type === 1 || act.type === 2 || act.type === 4);

    if (presenceAvatar && user.discord_user) {
        presenceAvatar.src = `https://cdn.discordapp.com/avatars/${user.discord_user.id}/${user.discord_user.avatar}.webp`;
    } else if (presenceAvatar) {
        presenceAvatar.src = 'assets/logo.png';
    }

    if (presenceUsername && user.discord_user) {
        presenceUsername.textContent = `@${user.discord_user.username}`;
    } else if (presenceUsername) {
        presenceUsername.textContent = '@UserNotFound';
    }

    if (presenceDiscordLink && user.discord_user) {
        presenceDiscordLink.href = `https://discord.com/users/${user.discord_user.id}`;
    } else if (presenceDiscordLink) {
        presenceDiscordLink.href = '#';
    }

    let statusColor = '';
    switch (user.discord_status) {
        case 'online':
            statusColor = '#43b581';
            break;
        case 'idle':
            statusColor = '#faa61a';
            break;
        case 'dnd':
            statusColor = '#f04747';
            break;
        default:
            statusColor = '#747f8d';
    }
    if (presenceStatusDot) {
        presenceStatusDot.style.backgroundColor = statusColor;
    }

    if (userActivities.length > 0) {
        currentActivityIndex = 0;
        displayActivity(userActivities[currentActivityIndex]);
        setupCarouselNavigation();
    } else {
        displayActivity(null);
        removeCarouselNavigation();
    }
}

// ================== New Initialization Logic ================== //
// We now run this function when the page loads to ensure the right order.

function init() {
    // 1. Immediately set a loading state while we fetch data.
    setLoadingState();

    // 2. Start fetching static Discord invite data. This can happen in the background.
    fetchDiscordData();
    fetchDiscordInviteForDesktop();

    // 3. Start polling the proxy endpoint for presence data.
    fetchPresenceDataFromProxy();
    setInterval(fetchPresenceDataFromProxy, pollingInterval);
}

// Call the new init function when the page is fully loaded.
window.onload = init;

// ================== END ================== //


// ================== Data Loading & Table Rendering ================== //

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
      adjustTableContainerHeight();
    })
    .catch(err => console.error("Error on load:", err));
}

function renderTable(data) {
  let totalCount = 0;
  let normalCount = 0;
  let unreleasedCount = 0;
  let nothingCount = 0;

  tableBody.innerHTML = ''; // Clear table before rendering

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

      if (blueprint.Name === "") return;

      const blueprintStatus = blueprint.status || 'Normal';
      const canDisplayImage = blueprintStatus !== "NOTHING" && blueprintStatus !== "NOTEXTURE";

      const row = document.createElement('tr');
      row.className = 'data-row'; // Add a class to easily identify data rows

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
      arrow.style.transition = 'transform 0.2s ease-out'; // Smooth arrow rotation

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
        accordionRow.className = 'accordion-row'; // Add a class to easily identify accordion rows
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

        const blueprintInfo = document.createElement('div');
        blueprintInfo.className = 'blueprint-info';
        blueprintInfo.innerHTML = `
            <p><strong>Blueprint Name:</strong> ${blueprint.Name}</p>
            <p><strong>Weapon:</strong> ${weapon.Name}</p>
            <p><strong>Category:</strong> ${categoryMap[weapon.Category]}</p>
            <p><strong>Pool Number:</strong> ${blueprint.Pool}</p>
            <p><strong>Bundle Name:</strong> ${blueprint.Bundle || 'N/A'}</p>
            <p><strong>Release Status:</strong> ${blueprintStatus}</p>
        `;

        img.onerror = () => {
          img.style.display = 'none'; // Hide broken image
          const noImageText = document.createElement('em');
          noImageText.textContent = 'No image available.';
          accordionContent.prepend(noImageText); // Add "No image" text
        };

        accordionContent.appendChild(img);
        accordionContent.appendChild(blueprintInfo);
        accordionCell.appendChild(accordionContent);
        accordionRow.appendChild(accordionCell);
        tableBody.appendChild(accordionRow);

        let imageLoaded = false;

        arrow.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = accordionContent.classList.contains('expanded');

          // Close all other expanded accordions if "Show All Previews" is not checked
          if (!imageCheckbox.checked) {
            document.querySelectorAll('#pullsTable tbody tr div.expanded').forEach(div => {
              if (div !== accordionContent) { // Don't collapse the current one
                div.classList.remove('expanded');
                const parentAccordionRow = div.closest('tr');
                const dataRow = parentAccordionRow?.previousElementSibling;
                const associatedArrow = dataRow?.querySelector('span');
                if (associatedArrow) {
                  associatedArrow.textContent = '▶';
                  associatedArrow.style.transform = 'rotate(0deg)';
                }
              }
            });
          }

          if (!isVisible) {
            accordionContent.classList.add('expanded');
            arrow.textContent = '▼';
            arrow.style.transform = 'rotate(180deg)'; // Changed from 90deg to 180deg for down arrow

            if (!imageLoaded && img.dataset.src) {
              img.src = img.dataset.src;
              imageLoaded = true;
            }
          } else {
            accordionContent.classList.remove('expanded');
            arrow.textContent = '▶';
            arrow.style.transform = 'rotate(0deg)'; // Reset arrow rotation
          }
        });

        // Initial state for "Show All Previews"
        if (imageCheckbox.checked) {
          accordionContent.classList.add('expanded');
          arrow.textContent = '▼';
          arrow.style.transform = 'rotate(180deg)'; // Changed from 90deg to 180deg for down arrow
          if (!imageLoaded && img.dataset.src) {
            img.src = img.dataset.src;
            imageLoaded = true;
          }
        }
      }
    });
  });

  totalBlueprintsSpan.textContent = totalCount;
  normalBlueprintsSpan.textContent = normalCount;
  unreleasedBlueprintsSpan.textContent = unreleasedCount;
  nothingBlueprintsSpan.textContent = nothingCount;

  applyImageToggle(); // Re-apply toggle state after rendering
}

// ================== END ================== //


// ================== Filter Functionality ================== //

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

  const uniqueCategories = [...new Set(Weapons.map(w => categoryMap[w.Category]))].sort(); // Sort categories alphabetically

  uniqueCategories.forEach(cat => {
    const label = document.createElement('label');
    label.className = 'category-checkbox-item'; // Add new class for styling

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

  const uniquePools = [...new Set(Weapons.flatMap(w => w.Blueprints.map(bp => bp.Pool)))].sort((a, b) => a - b); // Sort numerically

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

function applyImageToggle() {
  const accordionRows = document.querySelectorAll('#pullsTable tbody tr.accordion-row');

  accordionRows.forEach(accordionRow => {
    const accordionContent = accordionRow.querySelector('div.accordion-content');
    const dataRow = accordionRow.previousElementSibling;
    const arrow = dataRow?.querySelector('span');
    const img = accordionContent?.querySelector('img');
    const blueprintNameSpan = dataRow?.querySelector('td:nth-child(3) span:last-child');
    const blueprintStatus = blueprintNameSpan ? (blueprintNameSpan.classList.contains('status-released') ? 'RELEASED' : (blueprintNameSpan.classList.contains('status-unreleased') ? 'UNRELEASED' : 'Normal')) : 'Normal';
    const canDisplayImage = blueprintStatus !== "NOTHING" && blueprintStatus !== "NOTEXTURE";

    if (accordionContent && arrow && canDisplayImage) {
      if (imageCheckbox.checked) {
        accordionContent.classList.add('expanded');
        arrow.textContent = '▼';
        arrow.style.transform = 'rotate(180deg)';
        if (img && img.dataset.src && !img.src) {
          img.src = img.dataset.src;
        }
      } else {
        accordionContent.classList.remove('expanded');
        arrow.textContent = '▶';
        arrow.style.transform = 'rotate(0deg)';
      }
    } else if (arrow) {
        arrow.style.visibility = 'hidden';
        if (accordionContent) {
            accordionContent.classList.remove('expanded');
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

// ================== END ================== //


// ================== Modal & UI Interactions ================== //

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

function showHowToUseModal() {
  howToUseModal.classList.add('visible');
  showHowToTab('explanation');
}

function hideHowToUseModal() {
  howToUseModal.classList.remove('visible');
}

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

function showChangelogOnPageLoad() {
  showChangelogModal();
}

function adjustTableContainerHeight() {
  const fixedTopHeader = document.querySelector('.announcement-banner');
  const tableContainer = document.querySelector('.table-container');
  const mainContainer = document.querySelector('.container');

  if (fixedTopHeader && tableContainer && mainContainer) {
    const fixedHeaderHeight = fixedTopHeader.offsetHeight;
    const mainContainerPaddingTop = parseFloat(getComputedStyle(mainContainer).paddingTop);
    const mainContainerPaddingBottom = parseFloat(getComputedStyle(mainContainer).paddingBottom);
    const mainContainerMarginBottom = parseFloat(getComputedStyle(mainContainer).marginBottom);

    let elementsAboveTableHeight = 0;
    if (window.innerWidth > 768) {
        const searchViewElement = document.getElementById('searchView');
        const buttonGroupCentered = document.querySelector('.button-group-centered');
        const blueprintCounters = document.querySelector('.blueprint-counters');

        if (searchViewElement) elementsAboveTableHeight += searchViewElement.offsetHeight;
        if (buttonGroupCentered) elementsAboveTableHeight += buttonGroupCentered.offsetHeight;
        if (blueprintCounters) elementsAboveTableHeight += blueprintCounters.offsetHeight;

    } else {
        const searchViewElement = document.getElementById('searchView');
        const mobileCheckboxControls = document.querySelector('.checkbox-controls.mobile-only');
        const blueprintCounters = document.querySelector('.blueprint-counters');

        if (searchViewElement) elementsAboveTableHeight += searchViewElement.offsetHeight;
        if (mobileCheckboxControls) elementsAboveTableHeight += mobileCheckboxControls.offsetHeight;
        if (blueprintCounters) elementsAboveTableHeight += blueprintCounters.offsetHeight;
    }

    const buffer = mainContainerPaddingTop + mainContainerPaddingBottom + mainContainerMarginBottom;

    tableContainer.style.maxHeight = `calc(${mainContainer.clientHeight}px - ${elementsAboveTableHeight}px - 30px)`;
  }
}

function populateBugLog() {
  bugLogContentDiv.innerHTML = '';

  bugLogEntries.forEach(entry => {
    const listItem = document.createElement('li');
    const dateStrong = document.createElement('strong');
    dateStrong.textContent = `Date: ${entry.date}`;
    listItem.appendChild(dateStrong);

    const ul = document.createElement('ul');
    entry.fixes.forEach(fix => {
      const li = document.createElement('li');
      li.textContent = fix;
      ul.appendChild(li);
    });
    listItem.appendChild(ul);
    bugLogContentDiv.appendChild(listItem);
  });
}

function showBugLogModal() {
  populateBugLog();
  bugLogModal.classList.add('visible');
}

function hideBugLogModal() {
  bugLogModal.classList.remove('visible');
}

function showClearStorageModal() {
    clearStorageModal.classList.add('visible');
}

function hideClearStorageModal() {
    clearStorageModal.classList.remove('visible');
}

function showDiscordAnnouncementModal() {
    discordAnnouncementModal.classList.add('visible');
}

function hideDiscordAnnouncementModal() {
    discordAnnouncementModal.classList.remove('visible');
}

// ================== END ================== //


// ================== UI & Interface Management ================== //

function initializeSearchInput() {
    const searchInput = document.getElementById('search');
    let storedValue = '';

    if (searchInput) {
        searchInput.addEventListener('blur', function() {
            storedValue = this.value;
        });

        searchInput.addEventListener('focus', function() {
            this.value = storedValue;
        });
    }
}

function initializeAnnouncementBanner() {
  const announcementTextElement = document.getElementById('announcement-text');

  const messages = [
    { text: 'sorry for the inconvenience on downtime.', duration: 10000 },
    { text: 'if you encounter any problems', duration: 5000 },
    { text: 'please contact me on discord <a href="https://discord.com/users/1285264427540545588" style="font-weight: bold; color: #4A8CD4; text-decoration: none;">@Softlist</a>', duration: 10000 } // Set a duration for the last message
  ];

  let currentIndex = 0;

  function showNextMessage() {
    const currentMessage = messages[currentIndex];
    announcementTextElement.innerHTML = currentMessage.text;

    currentIndex = (currentIndex + 1) % messages.length;

    setTimeout(showNextMessage, currentMessage.duration);
  }

  showNextMessage();
}

function initializeModalEventListeners() {
    const confirmClearStorageBtn = document.getElementById('confirmClearStorageBtn');
    if (confirmClearStorageBtn) {
        confirmClearStorageBtn.addEventListener('click', () => {
            localStorage.removeItem('blubase_api_key');
            localStorage.removeItem('blubase_api_key_expiry');
            localStorage.removeItem('blubase_api_key_original');

            document.cookie = 'blubase_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

            const clearStorageModal = document.getElementById('clearStorageModal');
            if (clearStorageModal) {
                clearStorageModal.classList.add('hidden');
            }

            setTimeout(() => {
                window.location.replace('/endkey');
            }, 2000);
        });
    }

    const goToDiscordEmbedBtn = document.getElementById('goToDiscordEmbedBtn');
    if (goToDiscordEmbedBtn) {
        goToDiscordEmbedBtn.addEventListener('click', () => {
            window.open('https://discord.gg/7mfEwgUT8H', '_blank');
        });
    }
}

// ================== END ================== //


// ================== Event Listeners ================== //

document.addEventListener('DOMContentLoaded', function() {
    // Desktop contributions button
    if (contributionsButtonDesktop) {
        contributionsButtonDesktop.addEventListener('click', function() {
            window.location.href = 'https://blunet.wtf/HOH';
        });
    }
    // Mobile contributions button
    if (contributionsButtonMobile) {
        contributionsButtonMobile.addEventListener('click', function() {
            window.location.href = 'https://blunet.wtf/HOH';
        });
    }

    // Event listener for the Discord announcement link
    if (discordAnnouncementLink) {
        discordAnnouncementLink.addEventListener('click', (e) => {
            e.preventDefault();
            showDiscordAnnouncementModal();
        });
    }

    // Event listeners for the Discord announcement modal buttons
    if (closeDiscordAnnouncementModalBtn) {
        closeDiscordAnnouncementModalBtn.addEventListener('click', hideDiscordAnnouncementModal);
    }
    if (goToDiscordBtn) {
        goToDiscordBtn.addEventListener('click', () => {
            window.open('https://discord.com/oauth2/authorize?client_id=1397393308086440040&scope=bot&permissions=24', '_blank');
            hideDiscordAnnouncementModal();
        });
    }
    if (cancelDiscordModalBtn) {
        cancelDiscordModalBtn.addEventListener('click', hideDiscordAnnouncementModal);
    }
    if (discordAnnouncementModal) {
        discordAnnouncementModal.addEventListener('click', (e) => {
            if (e.target === discordAnnouncementModal) {
                hideDiscordAnnouncementModal();
            }
        });
    }

    // Filter dropdown toggles
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

    // Changelog Modal
    changelogButton.addEventListener('click', showChangelogModal);
    closeChangelogModalBtn.addEventListener('click', hideChangelogModal);
    changelogModal.addEventListener('click', (e) => {
        if (e.target === changelogModal) {
            hideChangelogModal();
        }
    });

    // How To Use Modal
    howToUseButton.addEventListener('click', showHowToUseModal);
    closeHowToUseModalBtn.addEventListener('click', hideHowToUseModal);
    howToUseModal.addEventListener('click', (e) => {
        if (e.target === howToUseModal) {
            hideHowToUseModal();
        }
    });
    const howToUseTabs = document.querySelector('.how-to-tabs');
    if (howToUseTabs) {
        howToUseTabs.addEventListener('click', (event) => {
            if (event.target.classList.contains('tab-button')) {
                const tabId = event.target.dataset.tab;
                showHowToTab(tabId);
            }
        });
    }

    // Bug Log Modal
    bugLogButton.addEventListener('click', showBugLogModal);
    closeBugLogModalBtn.addEventListener('click', hideBugLogModal);
    bugLogModal.addEventListener('click', (e) => {
        if (e.target === bugLogModal) {
            hideBugLogModal();
        }
    });

    // Clear Storage Modal
    if (clearStorageButtonDesktop) {
        clearStorageButtonDesktop.addEventListener('click', () => {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                showClearStorageModal();
            } else {
                const confirmationMessage = 'Thank you for using Parsed.top created by parse... The page will reload.';
                if (confirm(confirmationMessage)) {
                    // Clear all relevant local storage items for desktop
                    localStorage.removeItem('blubase_api_key');
                    localStorage.removeItem('blubase_api_key_expiry');
                    localStorage.removeItem('blubase_api_key_original');
                    document.cookie = 'blubase_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
                    window.location.replace('/verify');
                }
            }
        });
    }
    if (clearStorageButtonMobile) {
        clearStorageButtonMobile.addEventListener('click', () => {
            showClearStorageModal();
        });
    }
    // This confirmClearStorageBtn is used by the mobile modal
    confirmClearStorageBtn.addEventListener('click', () => {
        localStorage.removeItem('blubase_api_key');
        localStorage.removeItem('blubase_api_key_expiry');
        localStorage.removeItem('blubase_api_key_original');
        document.cookie = 'blubase_verified=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.location.replace('/verify');
    });
    cancelClearStorageBtn.addEventListener('click', () => {
        hideClearStorageModal();
    });
    closeClearStorageModalBtn.addEventListener('click', () => {
        hideClearStorageModal();
    });
    clearStorageModal.addEventListener('click', (e) => {
        if (e.target === clearStorageModal) {
            hideClearStorageModal();
        }
    });

    // Search input and image checkbox
    searchInput.addEventListener('input', applyFilters);
    imageCheckbox.addEventListener('change', () => {
        applyImageToggle();
    });

    // Adjust table height on resize
    window.addEventListener('resize', adjustTableContainerHeight);

    // Initial data load
    loadAppData();
});
// ================== END ================== //


// ================== Initialization & Main Logic ================== //

async function initializeApp() {
    const userIP = await getUserIP();
    console.log("User IP detected:", userIP);

    if (userIP && isIPBlacklisted(userIP)) {
        console.warn("Blacklisted IP detected. Redirecting to blocked.html.");
        localStorage.removeItem('blubase_api_key');
        localStorage.removeItem('blubase_api_key_expiry');
        localStorage.removeItem('blubase_api_key_original');
        window.location.replace('/blocked');
        return;
    } else if (userIP) {
        console.log("User IP not blacklisted.");
    } else {
        console.warn("Could not get user IP. Proceeding without blacklist check.");
    }

    document.addEventListener('DOMContentLoaded', () => {
        checkAPIKeyAndRedirect(true);
    });

    window.addEventListener('storage', (event) => {
        console.log("Storage event detected for key:", event.key);
        if (event.key === 'blubase_api_key' || event.key === 'blubase_api_key_expiry' || event.key === 'blubase_api_key_original') {
            checkAPIKeyAndRedirect(false);
        }
    });

    window.addEventListener('focus', () => {
        console.log("Window focus detected. Re-checking API key status.");
        checkAPIKeyAndRedirect(false);
    });
}

// ================== END ================== //


// ================== Window Load Event ================== //

window.addEventListener('load', () => {
    if (window.va && typeof window.va.track === 'function') {
        // Analytics tracking code would go here
    } else {
        // Fallback or alternative tracking
    }

    initializeSearchInput();
    initializeAnnouncementBanner();
    initializeModalEventListeners();

    fetchDiscordData();

    if (window.innerWidth > 768) {
        fetchDiscordInviteForDesktop();
        initializeLanyardWebSocket(); 
    }
});

// Initialize the app
initializeApp();

// ================== END ================== //
