// --- SHARKFEAST CORE SCRIPT ---
const OWNER_USERNAME = "sharkie";
const LETTER_CHOICES = ["ARK", "SH", "FEA", "ST", "MEG", "SUR", "FIN", "OCE"];
const STAFF_RANKS = ["Website Owner", "Website Admin", "Website Mod"];

if (!localStorage.getItem("shark_users_db")) {
    const defaultRegistry = {};
    defaultRegistry[OWNER_USERNAME] = { password: "Megalodon#789X!_Apex", rank: "Website Owner", pfp: "🦈" };
    localStorage.setItem("shark_users_db", JSON.stringify(defaultRegistry));
}

const AppState = {
    currentUser: JSON.parse(localStorage.getItem("shark_current_user") || "null"),
    activeLobby: JSON.parse(localStorage.getItem("shark_active_lobby") || "null"),
    lobbies: JSON.parse(localStorage.getItem("shark_feasts_lobbies") || "[]"),
    gameActive: false,
    currentLetters: "SHARK",
    roundTimer: null,
    timeLeft: 10
};

document.addEventListener("DOMContentLoaded", () => {
    initAuthUI();
    resolveUserRank();
    initUserProfileUI();
    initChatToggle();
    initSidebarTabs();
    renderPublicLobbies();
    updateManagementConsolePosition();
    initEventListeners();

    if (AppState.currentUser) {
        document.getElementById("auth-modal-overlay")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");
    } else {
        document.getElementById("auth-modal-overlay")?.classList.remove("hidden");
        document.getElementById("lobby-browser-container")?.classList.add("hidden");
    }

    if (AppState.activeLobby) {
        enterLobby(AppState.activeLobby, false);
    }
});

// ===================== AUTH =====================

function initAuthUI() {
    const signUpTab = document.getElementById("auth-tab-signup");
    const signInTab = document.getElementById("auth-tab-signin");
    const submitBtn = document.getElementById("auth-submit-btn");
    const usernameInput = document.getElementById("auth-username-input");
    const passwordInput = document.getElementById("auth-password-input");
    const errorBanner = document.getElementById("auth-error-banner");

    let isSignUpMode = false;

    signUpTab?.addEventListener("click", () => {
        isSignUpMode = true;
        signUpTab.style.background = "#fff";
        signUpTab.style.color = "#000";
        signInTab.style.background = "transparent";
        signInTab.style.color = "#fff";
        if (submitBtn) submitBtn.textContent = "Create Account";
    });

    signInTab?.addEventListener("click", () => {
        isSignUpMode = false;
        signInTab.style.background = "#fff";
        signInTab.style.color = "#000";
        signUpTab.style.background = "transparent";
        signUpTab.style.color = "#fff";
        if (submitBtn) submitBtn.textContent = "Sign In";
    });

    submitBtn?.addEventListener("click", (e) => {
        e.preventDefault();
        const username = usernameInput?.value.trim() || "";
        const password = passwordInput?.value.trim() || "";
        errorBanner?.classList.add("hidden");

        if (!username || !password) {
            showAuthError("Please enter both username and password.");
            return;
        }

        const globalBans = JSON.parse(localStorage.getItem("shark_global_bans") || "[]");
        if (globalBans.includes(username.toLowerCase())) {
            showAuthError("This account has been banned from SharkFeast.");
            return;
        }

        const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");

        if (isSignUpMode) {
            if (usersDb[username]) {
                showAuthError("Username already exists! Please choose another one or sign in.");
                return;
            }
            usersDb[username] = {
                password: password,
                rank: username.toLowerCase() === OWNER_USERNAME ? "Website Owner" : "Player",
                pfp: "🦈"
            };
            localStorage.setItem("shark_users_db", JSON.stringify(usersDb));
        } else {
            if (!usersDb[username] || usersDb[username].password !== password) {
                showAuthError("Invalid username or password.");
                return;
            }
        }

        AppState.currentUser = { username, rank: usersDb[username].rank, pfp: usersDb[username].pfp };
        localStorage.setItem("shark_current_user", JSON.stringify(AppState.currentUser));

        document.getElementById("auth-modal-overlay")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");

        resolveUserRank();
        initUserProfileUI();
        updateManagementConsolePosition();
        renderPublicLobbies();
    });

    function showAuthError(msg) {
        if (errorBanner) {
            errorBanner.textContent = msg;
            errorBanner.classList.remove("hidden");
        } else {
            alert(msg);
        }
    }
}

function resolveUserRank() {
    if (!AppState.currentUser) return;
    if (AppState.currentUser.username.toLowerCase() === OWNER_USERNAME) {
        AppState.currentUser.rank = "Website Owner";
    } else {
        const staffRanks = JSON.parse(localStorage.getItem("shark_feasts_staff") || "{}");
        const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
        const userRecord = usersDb[AppState.currentUser.username];
        AppState.currentUser.rank = staffRanks[AppState.currentUser.username] || userRecord?.rank || AppState.currentUser.rank || "Player";
    }
}

function isWebsiteStaff(rank) {
    return STAFF_RANKS.includes(rank);
}

// ===================== PROFILE =====================

function initUserProfileUI() {
    if (!AppState.currentUser) return;

    const avatarEl = document.getElementById("user-avatar-placeholder");
    const profileContainer = document.getElementById("user-profile-badge");
    const usernameLabel = document.getElementById("user-display-name");
    const currentUserDisplay = document.getElementById("current-user-display");

    if (usernameLabel) usernameLabel.textContent = AppState.currentUser.username;
    if (currentUserDisplay) currentUserDisplay.textContent = AppState.currentUser.username;

    if (avatarEl && AppState.currentUser.pfp) {
        avatarEl.innerHTML = AppState.currentUser.pfp.startsWith("data:image")
            ? `<img src="${AppState.currentUser.pfp}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
            : AppState.currentUser.pfp;
    }

    if (profileContainer && !document.getElementById("profile-dropdown-menu")) {
        profileContainer.style.position = "relative";
        const dropdown = document.createElement("div");
        dropdown.id = "profile-dropdown-menu";
        dropdown.className = "hidden";
        dropdown.style.cssText = "position:absolute; top:45px; left:0; background:#0f172a; border:1px solid #334155; border-radius:8px; padding:10px; width:150px; z-index:9999; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.5);";
        dropdown.innerHTML = `
            <div style="font-size:12px; font-weight:bold; color:#38bdf8; margin-bottom:8px; border-bottom:1px solid #1e293b; padding-bottom:4px;">${AppState.currentUser.username}</div>
            <button id="change-pfp-btn" style="width:100%; text-align:left; background:none; border:none; color:white; padding:6px; cursor:pointer; border-radius:4px; font-size:12px;">Change PFP</button>
            <button id="logout-btn" style="width:100%; text-align:left; background:none; border:none; color:#ef4444; padding:6px; cursor:pointer; font-weight:bold; border-radius:4px; font-size:12px;">Logout</button>
        `;
        profileContainer.appendChild(dropdown);

        profileContainer.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("hidden");
        });

        document.addEventListener("click", () => dropdown.classList.add("hidden"));

        dropdown.querySelector("#change-pfp-btn").addEventListener("click", () => {
            let hiddenInput = document.getElementById("direct-global-pfp-input");
            if (!hiddenInput) {
                hiddenInput = document.createElement("input");
                hiddenInput.type = "file";
                hiddenInput.id = "direct-global-pfp-input";
                hiddenInput.accept = "image/*";
                hiddenInput.style.display = "none";
                document.body.appendChild(hiddenInput);

                hiddenInput.addEventListener("change", (ev) => {
                    const file = ev.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const newPfp = event.target.result;
                        AppState.currentUser.pfp = newPfp;
                        localStorage.setItem("shark_current_user", JSON.stringify(AppState.currentUser));

                        const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
                        if (usersDb[AppState.currentUser.username]) {
                            usersDb[AppState.currentUser.username].pfp = newPfp;
                            localStorage.setItem("shark_users_db", JSON.stringify(usersDb));
                        }
                        initUserProfileUI();
                        if (AppState.activeLobby) renderLobbySeating();
                    };
                    reader.readAsDataURL(file);
                });
            }
            hiddenInput.click();
        });

        dropdown.querySelector("#logout-btn").addEventListener("click", () => {
            AppState.currentUser = null;
            localStorage.removeItem("shark_current_user");
            window.location.reload();
        });
    }
}

// ===================== MANAGEMENT CONSOLE POSITION =====================
// Bottom-middle while browsing lobbies, top-right corner once inside a lobby.
// Visible only to Website Owner / Admin / Mod.

function updateManagementConsolePosition() {
    const managementBtn = document.getElementById("secret-lobby-viewer-btn");
    const isStaff = isWebsiteStaff(AppState.currentUser?.rank);
    const inLobby = AppState.activeLobby !== null;
    if (!managementBtn) return;

    if (!isStaff) {
        managementBtn.classList.add("hidden");
        return;
    }

    managementBtn.classList.remove("hidden");
    managementBtn.textContent = "🛡️ Management Console";
    managementBtn.style.cssText += "border:none; padding:10px 18px; border-radius:8px; cursor:pointer; font-weight:bold; background:#dc2626; color:white; box-shadow:0 0 12px rgba(220,38,38,0.5); z-index:999;";

    if (!inLobby) {
        managementBtn.style.position = "fixed";
        managementBtn.style.bottom = "20px";
        managementBtn.style.left = "50%";
        managementBtn.style.transform = "translateX(-50%)";
        managementBtn.style.top = "auto";
        managementBtn.style.right = "auto";
    } else {
        managementBtn.style.position = "fixed";
        managementBtn.style.top = "15px";
        managementBtn.style.right = "20px";
        managementBtn.style.bottom = "auto";
        managementBtn.style.left = "auto";
        managementBtn.style.transform = "none";
    }
}

// ===================== SIDEBAR / CHAT UI =====================

function initSidebarTabs() {
    document.querySelectorAll(".sidebar-tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".sidebar-tab-btn").forEach(b => {
                b.classList.remove("active");
                b.style.background = "transparent";
                b.style.color = "#94a3b8";
            });
            document.querySelectorAll(".sidebar-pane").forEach(p => p.classList.add("hidden"));

            e.currentTarget.classList.add("active");
            e.currentTarget.style.background = "#1e293b";
            e.currentTarget.style.color = "white";

            const paneId = e.currentTarget.getAttribute("data-pane");
            document.getElementById(paneId)?.classList.remove("hidden");

            if (paneId === "lobby-players-tab-pane") renderPlayersTabList();
            if (paneId === "lobby-settings-pane") loadLobbySettingsUI();
        });
    });
}

function initChatToggle() {
    const chatToggleBtn = document.getElementById("chat-toggle-btn");
    const chatSidebar = document.getElementById("chat-sidebar");
    if (chatToggleBtn && chatSidebar) {
        chatToggleBtn.addEventListener("click", () => {
            chatSidebar.classList.toggle("collapsed");
            chatToggleBtn.textContent = chatSidebar.classList.contains("collapsed") ? "---->" : "<----";
        });
    }
}

// ===================== GLOBAL EVENT LISTENERS =====================

function initEventListeners() {
    document.getElementById("open-create-modal-btn")?.addEventListener("click", () => {
        document.getElementById("new-lobby-name-input").value = "";
        document.getElementById("private-lobby-checkbox").checked = false;
        document.getElementById("create-modal")?.classList.remove("hidden");
    });

    document.getElementById("cancel-create-modal-btn")?.addEventListener("click", () => {
        document.getElementById("create-modal")?.classList.add("hidden");
    });

    document.getElementById("confirm-create-lobby-btn")?.addEventListener("click", () => {
        const rawName = document.getElementById("new-lobby-name-input")?.value.trim() || "";
        if (rawName.length < 2) {
            alert("Lobby name must be at least 2 characters.");
            return;
        }

        const newLobby = {
            id: Date.now(),
            name: rawName,
            isPrivate: document.getElementById("private-lobby-checkbox")?.checked || false,
            host: AppState.currentUser.username,
            lobbyMods: [],
            rulesText: "Follow chat rules and respect all players.",
            gameMode: "Standard",
            lives: 3,
            players: [],
            gameParticipants: [],
            playerStates: {},
            mutedPlayers: [],
            bannedPlayers: []
        };

        AppState.lobbies.push(newLobby);
        saveAndCleanLobbies();
        document.getElementById("create-modal")?.classList.add("hidden");
        enterLobby(newLobby, true);
    });

    document.getElementById("secret-lobby-viewer-btn")?.addEventListener("click", () => {
        openManagementConsole();
    });

    document.getElementById("save-lobby-settings-btn")?.addEventListener("click", saveLobbySettings);

    document.getElementById("lobby-lives-range")?.addEventListener("input", (e) => {
        const label = document.getElementById("lobby-lives-val");
        if (label) label.textContent = e.target.value;
    });

    const chatInput = document.getElementById("chat-input-field");
    const chatForm = document.getElementById("chat-input-form") || chatInput?.closest("form");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInput?.value.trim();
            if (text) {
                handleChatMessage(text);
                chatInput.value = "";
            }
        });
    }

    document.getElementById("leave-lobby-btn")?.addEventListener("click", () => {
        if (AppState.activeLobby) {
            AppState.lobbies = JSON.parse(localStorage.getItem("shark_feasts_lobbies") || "[]");
            const cur = AppState.lobbies.find(l => l.id === AppState.activeLobby.id);
            if (cur) {
                cur.players = (cur.players || []).filter(p => p !== AppState.currentUser.username);
                cur.gameParticipants = (cur.gameParticipants || []).filter(p => p !== AppState.currentUser.username);
                if (cur.playerStates) delete cur.playerStates[AppState.currentUser.username];
                if (cur.lobbyMods) cur.lobbyMods = cur.lobbyMods.filter(p => p !== AppState.currentUser.username);
            }
            saveAndCleanLobbies();
        }
        stopRoundTimer();
        AppState.activeLobby = null;
        AppState.gameActive = false;
        localStorage.removeItem("shark_active_lobby");

        document.getElementById("lobby-screen")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");
        updateManagementConsolePosition();
        renderPublicLobbies();
    });
}

// ===================== CHAT =====================

function handleChatMessage(text) {
    if (!AppState.activeLobby) return;
    if (AppState.activeLobby.mutedPlayers?.includes(AppState.currentUser.username)) {
        appendChatMessage("System", "You are muted in this lobby and cannot send messages.");
        return;
    }
    appendChatMessage(AppState.currentUser.username, text);
}

// ===================== LOBBY ROLE PERMISSIONS =====================

// Host + lobby mods + website staff can kick/ban/mute inside a lobby.
function canModerateLobby() {
    if (!AppState.activeLobby || !AppState.currentUser) return false;
    const isHost = AppState.activeLobby.host === AppState.currentUser.username;
    const isLobbyMod = (AppState.activeLobby.lobbyMods || []).includes(AppState.currentUser.username);
    return isHost || isLobbyMod || isWebsiteStaff(AppState.currentUser.rank);
}

// Only the lobby host (or website staff, as an override) can promote/demote lobby mods.
function canManageLobbyMods() {
    if (!AppState.activeLobby || !AppState.currentUser) return false;
    const isHost = AppState.activeLobby.host === AppState.currentUser.username;
    return isHost || isWebsiteStaff(AppState.currentUser.rank);
}

function isCurrentUserLobbyHost() {
    return AppState.activeLobby && AppState.currentUser && AppState.activeLobby.host === AppState.currentUser.username;
}

// ===================== ENTER LOBBY =====================

function enterLobby(lobbyObj, saveStorage = true) {
    AppState.lobbies = JSON.parse(localStorage.getItem("shark_feasts_lobbies") || "[]");
    const currentLobby = AppState.lobbies.find(l => l.id === lobbyObj.id) || lobbyObj;

    if ((currentLobby.bannedPlayers || []).includes(AppState.currentUser.username)) {
        alert("You are banned from this lobby.");
        return;
    }

    AppState.activeLobby = currentLobby;

    let isNewJoin = false;
    if (!AppState.activeLobby.players) AppState.activeLobby.players = [];
    if (AppState.currentUser && !AppState.activeLobby.players.includes(AppState.currentUser.username)) {
        AppState.activeLobby.players.push(AppState.currentUser.username);
        isNewJoin = true;
    }
    if (!AppState.activeLobby.lives) AppState.activeLobby.lives = 3;

    if (saveStorage) saveAndCleanLobbies();

    document.getElementById("lobby-browser-container")?.classList.add("hidden");
    document.getElementById("auth-modal-overlay")?.classList.add("hidden");
    document.getElementById("lobby-screen")?.classList.remove("hidden");

    updateManagementConsolePosition();
    renderLobbyUI();

    if (isNewJoin) announceUserJoin();
}

function announceUserJoin() {
    const user = AppState.currentUser;
    if (!user) return;
    let alertMsg;
    if (user.rank === "Website Owner") {
        alertMsg = `Beware! Website Owner Has Joined: ${user.username} has joined`;
    } else if (user.rank === "Website Admin") {
        alertMsg = `Website Admin Has Joined: ${user.username} has joined`;
    } else if (user.rank === "Website Mod") {
        alertMsg = `Website Mod Has Joined: ${user.username} has joined`;
    } else {
        alertMsg = `${user.username} has joined the lobby`;
    }
    appendChatMessage("System", alertMsg);
}

function renderLobbyUI() {
    const nameHeader = document.getElementById("current-lobby-name-header");
    if (nameHeader) nameHeader.textContent = AppState.activeLobby.name;

    const badge = document.getElementById("server-type-badge-header");
    if (badge) {
        badge.textContent = AppState.activeLobby.isPrivate ? "Private" : "Public";
        badge.style.background = AppState.activeLobby.isPrivate ? "#7f1d1d" : "#0284c7";
    }

    loadLobbySettingsUI();
    renderLobbySeating();
    renderPlayersTabList();
}

// ===================== LOBBY SETTINGS =====================

function loadLobbySettingsUI() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;

    const rulesInput = document.getElementById("lobby-rules-input");
    const modeSelect = document.getElementById("lobby-gamemode-select");
    const livesRange = document.getElementById("lobby-lives-range");
    const livesVal = document.getElementById("lobby-lives-val");
    const saveBtn = document.getElementById("save-lobby-settings-btn");
    const readonlyNote = document.getElementById("settings-readonly-note");

    if (rulesInput) rulesInput.value = lobby.rulesText || "";
    if (modeSelect) modeSelect.value = lobby.gameMode || "Standard";
    if (livesRange) livesRange.value = lobby.lives || 3;
    if (livesVal) livesVal.textContent = lobby.lives || 3;

    const editable = isCurrentUserLobbyHost();
    [rulesInput, modeSelect, livesRange].forEach(el => { if (el) el.disabled = !editable; });
    if (saveBtn) saveBtn.classList.toggle("hidden", !editable);
    if (readonlyNote) readonlyNote.classList.toggle("hidden", editable);
}

function saveLobbySettings() {
    if (!AppState.activeLobby) return;

    if (!isCurrentUserLobbyHost()) {
        alert("Only the lobby host can change these settings.");
        return;
    }

    const rulesEl = document.getElementById("lobby-rules-input");
    const modeEl = document.getElementById("lobby-gamemode-select");
    const livesEl = document.getElementById("lobby-lives-range");

    if (rulesEl) AppState.activeLobby.rulesText = rulesEl.value;
    if (modeEl) AppState.activeLobby.gameMode = modeEl.value;
    if (livesEl) {
        const newLives = parseInt(livesEl.value, 10) || 3;
        AppState.activeLobby.lives = newLives;
        Object.keys(AppState.activeLobby.playerStates || {}).forEach(username => {
            if (!(AppState.activeLobby.gameParticipants || []).includes(username)) {
                AppState.activeLobby.playerStates[username].lives = newLives;
            }
        });
    }

    saveAndCleanLobbies();
    renderLobbyUI();
    appendChatMessage("System", `⚙️ ${AppState.currentUser.username} updated the lobby settings.`);
}

// ===================== PLAYERS TAB / MODERATION =====================

function renderPlayersTabList() {
    const listPane = document.getElementById("lobby-players-tab-pane");
    if (!listPane || !AppState.activeLobby) return;

    let html = `<div style="font-weight:bold; color:#38bdf8; margin-bottom:8px;">Players in Lobby (${AppState.activeLobby.players.length})</div>`;
    const canModerate = canModerateLobby();
    const canManageMods = canManageLobbyMods();

    AppState.activeLobby.players.forEach(player => {
        const isPlayerHost = player === AppState.activeLobby.host;
        const isPlayerMod = (AppState.activeLobby.lobbyMods || []).includes(player);
        const isMuted = (AppState.activeLobby.mutedPlayers || []).includes(player);

        html += `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#030712; padding:6px 10px; border-radius:6px; margin-bottom:6px; flex-wrap:wrap; gap:6px;">
                <span style="cursor:pointer; color:#38bdf8;" onclick="openPlayerProfileModal('${player}')">👤 ${player} ${isPlayerHost ? '(Host)' : ''} ${isPlayerMod ? '(Lobby Mod)' : ''} ${isMuted ? '🔇' : ''}</span>
        `;

        let actionButtons = `<div style="display:flex; gap:4px; align-items:center;">`;
        if (canManageMods && player !== AppState.currentUser.username && !isPlayerHost) {
            actionButtons += `<button class="mod-action-btn mod" onclick="toggleLobbyMod('${player}')">${isPlayerMod ? 'Unmod' : 'Mod'}</button>`;
        }
        if (canModerate && player !== AppState.currentUser.username) {
            actionButtons += `<button class="mod-action-btn mute" onclick="toggleMutePlayer('${player}')">${isMuted ? 'Unmute' : 'Mute'}</button>`;
            actionButtons += `<button class="mod-action-btn kick" onclick="kickPlayer('${player}')">Kick</button>`;
            actionButtons += `<button class="mod-action-btn ban" onclick="banPlayer('${player}')">Ban</button>`;
        }
        if (player !== AppState.currentUser.username) {
            actionButtons += `<button class="mod-action-btn" style="background:#374151; color:white;" onclick="reportPlayer('${player}')">Report</button>`;
        }
        actionButtons += `</div>`;
        html += actionButtons + `</div>`;
    });

    listPane.innerHTML = html;
}

window.openPlayerProfileModal = function(username) {
    const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
    const userInfo = usersDb[username] || { rank: "Player", pfp: "🦈" };

    const modal = document.createElement("div");
    modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:99999;";
    modal.innerHTML = `
        <div style="background:#0f172a; border:1px solid #334155; padding:20px; border-radius:12px; text-align:center; width:280px; color:white;">
            <div style="font-size:40px; margin-bottom:10px;">${userInfo.pfp.startsWith("data:image") ? `<img src="${userInfo.pfp}" style="width:50px;height:50px;border-radius:50%;object-fit:cover;">` : userInfo.pfp}</div>
            <h3 style="color:#38bdf8; margin:0 0 5px 0;">${username}</h3>
            <p style="color:#8b949e; font-size:12px; margin-bottom:15px;">Rank: ${userInfo.rank}</p>
            <button style="padding:6px 12px; font-size:12px; border:none; border-radius:6px; cursor:pointer; background:#334155; color:white;" onclick="this.closest('div').parentElement.remove();">Close</button>
        </div>
    `;
    document.body.appendChild(modal);
};

window.toggleLobbyMod = function(username) {
    if (!canManageLobbyMods()) return;
    if (!AppState.activeLobby.lobbyMods) AppState.activeLobby.lobbyMods = [];

    if (AppState.activeLobby.lobbyMods.includes(username)) {
        AppState.activeLobby.lobbyMods = AppState.activeLobby.lobbyMods.filter(m => m !== username);
        appendChatMessage("System", `${username} is no longer a lobby mod.`);
    } else {
        AppState.activeLobby.lobbyMods.push(username);
        appendChatMessage("System", `${username} has been promoted to lobby mod by ${AppState.currentUser.username}.`);
    }
    saveAndCleanLobbies();
    renderLobbyUI();
};

window.toggleMutePlayer = function(username) {
    if (!canModerateLobby()) return;
    if (!AppState.activeLobby.mutedPlayers) AppState.activeLobby.mutedPlayers = [];

    if (AppState.activeLobby.mutedPlayers.includes(username)) {
        AppState.activeLobby.mutedPlayers = AppState.activeLobby.mutedPlayers.filter(p => p !== username);
        appendChatMessage("System", `🔊 ${username} was unmuted by ${AppState.currentUser.username}.`);
    } else {
        AppState.activeLobby.mutedPlayers.push(username);
        appendChatMessage("System", `🔇 ${username} was muted by ${AppState.currentUser.username}.`);
    }
    saveAndCleanLobbies();
    renderPlayersTabList();
};

window.kickPlayer = function(username) {
    if (!canModerateLobby()) return;
    AppState.activeLobby.players = AppState.activeLobby.players.filter(p => p !== username);
    AppState.activeLobby.gameParticipants = (AppState.activeLobby.gameParticipants || []).filter(p => p !== username);
    if (AppState.activeLobby.playerStates) delete AppState.activeLobby.playerStates[username];
    if (AppState.activeLobby.lobbyMods) AppState.activeLobby.lobbyMods = AppState.activeLobby.lobbyMods.filter(p => p !== username);
    saveAndCleanLobbies();
    renderLobbyUI();
    appendChatMessage("System", `🔨 Player ${username} was kicked from the lobby by ${AppState.currentUser.username}.`);
};

window.banPlayer = function(username) {
    if (!canModerateLobby()) return;
    if (!confirm(`Ban ${username} from this lobby? They won't be able to rejoin.`)) return;
    if (!AppState.activeLobby.bannedPlayers) AppState.activeLobby.bannedPlayers = [];
    if (!AppState.activeLobby.bannedPlayers.includes(username)) AppState.activeLobby.bannedPlayers.push(username);
    window.kickPlayer(username);
    appendChatMessage("System", `⛔ ${username} has been banned from this lobby by ${AppState.currentUser.username}.`);
};

window.reportPlayer = function(username) {
    const reason = prompt(`Reason for reporting ${username}:`);
    if (!reason) return;

    let reports = JSON.parse(localStorage.getItem("shark_lobby_reports") || "[]");
    reports.push({
        reporter: AppState.currentUser.username,
        target: username,
        lobbyName: AppState.activeLobby.name,
        lobbyId: AppState.activeLobby.id,
        reason,
        time: new Date().toLocaleTimeString()
    });
    localStorage.setItem("shark_lobby_reports", JSON.stringify(reports));
    alert("Report submitted to the staff notification mailbox!");
};

// ===================== ARENA SEATING (4 sides around the shark pool) =====================

function renderLobbySeating() {
    const seatingGrid = document.getElementById("player-seating-grid");
    if (!seatingGrid || !AppState.activeLobby) return;

    const lobby = AppState.activeLobby;
    const players = lobby.players || [];
    const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
    const inGameRound = (lobby.gameParticipants || []).includes(AppState.currentUser.username);

    const sides = { top: [], right: [], bottom: [], left: [] };
    const sideOrder = ["top", "right", "bottom", "left"];
    players.forEach((player, idx) => sides[sideOrder[idx % 4]].push(player));

    const buildRaft = (player) => {
        const isPlayerHost = player === lobby.host;
        const isPlayerMod = (lobby.lobbyMods || []).includes(player);
        const pfp = usersDb[player]?.pfp || "🦈";
        const inRound = (lobby.gameParticipants || []).includes(player);
        const state = (lobby.playerStates || {})[player];
        const eliminated = inRound && state && state.lives <= 0;

        return `
            <div class="raft-seat ${eliminated ? "eliminated" : ""}">
                <div class="raft-avatar">${pfp.startsWith("data:image") ? `<img src="${pfp}">` : pfp}</div>
                <div class="raft-meta">
                    <div class="raft-name">${player}${isPlayerHost ? " ⚓" : isPlayerMod ? " 🛡️" : ""}</div>
                    <div class="raft-lives">${eliminated ? "OUT" : inRound ? "❤️".repeat(Math.max(state?.lives ?? lobby.lives, 0)) : "Not in round"}</div>
                </div>
            </div>
        `;
    };

    const emptySlot = `<div class="raft-seat empty">🪵 Empty Seat</div>`;

    seatingGrid.innerHTML = `
        <div style="color:#e0f2fe; font-weight:bold; margin-bottom:15px; text-align:center;">🌊 SharkFeast Arena Pool 🌊</div>
        <div class="arena-grid">
            <div class="seat-row top">${sides.top.map(buildRaft).join("") || emptySlot}</div>
            <div class="seat-col left">${sides.left.map(buildRaft).join("")}</div>

            <div class="arena-center">
                <div class="prompt-pool" id="prompt-pool">
                    <div class="shark-swimmer" id="arena-shark">🦈</div>
                    <div class="prompt-text-box" id="prompt-text-box">
                        <span class="prompt-label">Typing Prompt</span><br>
                        <span class="prompt-syllable" id="active-letters-display">${AppState.currentLetters}</span>
                    </div>
                    <div class="splash-fx" id="splash-fx">💦</div>
                </div>
            </div>

            <div class="seat-col right">${sides.right.map(buildRaft).join("")}</div>
            <div class="seat-row bottom">${sides.bottom.map(buildRaft).join("") || emptySlot}</div>
        </div>

        <div id="round-timer-display" style="text-align:center; font-size: 13px; font-weight: bold; color: #34d399; margin-top: 14px;">
            ${lobby.gameParticipants?.length ? `⏳ Time Left: ${AppState.timeLeft}s` : ""}
        </div>

        <div style="text-align:center; margin-top:10px;">
            <input type="text" id="active-game-word-input" placeholder="Type word containing the prompt and press Enter..." style="width:80%; max-width:340px; padding:10px 14px; border-radius:8px; border:1px solid #38bdf8; background:#030712; color:white; font-size:14px; outline:none;" ${!inGameRound || !AppState.gameActive ? 'disabled' : ''}>
        </div>

        <div class="round-status-line" id="round-status-line"></div>

        <div style="margin-top:14px; display:flex; justify-content:center;">
            ${!inGameRound ? `
                <button id="join-game-round-btn" style="background:#22c55e; padding:8px 16px; border:none; border-radius:6px; cursor:pointer; color:white; font-weight:bold;">Join Game Round</button>
            ` : `
                <span style="color:#34d399; font-weight:bold; padding:8px;">You're seated in the arena!</span>
            `}
        </div>
    `;

    document.getElementById("join-game-round-btn")?.addEventListener("click", handleJoinGameRound);

    const activeWordInput = document.getElementById("active-game-word-input");
    if (activeWordInput) {
        activeWordInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter" && AppState.gameActive) {
                const word = e.target.value.trim().toLowerCase();
                e.target.value = "";
                processTypingWord(word);
            }
        });
    }

    refreshRoundStatusLine();
}

function refreshRoundStatusLine() {
    const statusLine = document.getElementById("round-status-line");
    if (!statusLine || !AppState.activeLobby) return;
    const joined = AppState.activeLobby.gameParticipants?.length || 0;

    if (!AppState.gameActive) {
        if (joined === 0) {
            statusLine.textContent = "Click Join Game Round to take a seat — at least 2 players are needed to start.";
        } else if (joined === 1) {
            statusLine.textContent = "Waiting for at least 1 more player to join the round...";
        }
    } else {
        statusLine.textContent = "Round in progress — type fast!";
    }
}

function handleJoinGameRound() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;
    if (!lobby.gameParticipants) lobby.gameParticipants = [];
    if (!lobby.playerStates) lobby.playerStates = {};

    if (lobby.gameParticipants.includes(AppState.currentUser.username)) return;

    lobby.gameParticipants.push(AppState.currentUser.username);
    lobby.playerStates[AppState.currentUser.username] = { lives: lobby.lives || 3 };
    saveAndCleanLobbies();
    renderLobbySeating();
    appendChatMessage("System", `${AppState.currentUser.username} joined the game round.`);

    if (lobby.gameParticipants.length >= 2 && !AppState.gameActive) {
        startTypingRound();
    } else {
        appendChatMessage("System", "Waiting for at least 2 players before the round can start...");
    }
}

function startTypingRound() {
    stopRoundTimer();
    AppState.gameActive = true;
    AppState.currentLetters = LETTER_CHOICES[Math.floor(Math.random() * LETTER_CHOICES.length)];
    AppState.timeLeft = 10;

    const display = document.getElementById("active-letters-display");
    if (display) display.textContent = AppState.currentLetters;

    const input = document.getElementById("active-game-word-input");
    if (input) {
        input.disabled = false;
        input.focus();
    }

    appendChatMessage("System", `🎮 Round started! Type a word containing "${AppState.currentLetters}" within 10 seconds.`);
    refreshRoundStatusLine();

    AppState.roundTimer = setInterval(() => {
        AppState.timeLeft--;
        const timerDisplay = document.getElementById("round-timer-display");
        if (timerDisplay) {
            timerDisplay.textContent = `⏳ Time Left: ${AppState.timeLeft}s`;
            timerDisplay.style.color = AppState.timeLeft <= 3 ? '#ef4444' : '#34d399';
        }

        if (AppState.timeLeft <= 0) {
            stopRoundTimer();
            appendChatMessage("System", `⏰ Time's up! ${AppState.currentUser.username} ran out of time.`);
            applyLifeLoss(AppState.currentUser.username);
        }
    }, 1000);
}

function stopRoundTimer() {
    if (AppState.roundTimer) {
        clearInterval(AppState.roundTimer);
        AppState.roundTimer = null;
    }
}

function processTypingWord(word) {
    if (!AppState.gameActive) return;

    if (!word.toUpperCase().includes(AppState.currentLetters)) {
        stopRoundTimer();
        appendChatMessage("System", `❌ Incorrect word from ${AppState.currentUser.username}!`);
        applyLifeLoss(AppState.currentUser.username);
        return;
    }

    stopRoundTimer();
    appendChatMessage("System", `✅ Correct! ${AppState.currentUser.username} submitted "${word}".`);
    startTypingRound();
    saveAndCleanLobbies();
    renderLobbySeating();
}

// ===================== LIFE LOSS / ELIMINATION ANIMATIONS =====================

function applyLifeLoss(username) {
    const lobby = AppState.activeLobby;
    if (!lobby?.playerStates?.[username]) return;

    lobby.playerStates[username].lives -= 1;
    appendChatMessage("System", `${username} lost a life! (-1 Life)`);

    playSinkAndSplashAnimation();

    if (lobby.playerStates[username].lives <= 0) {
        appendChatMessage("System", `🦈 The shark swallowed ${username}! They are out of the game.`);
        playEliminationAnimation(() => {
            lobby.gameParticipants = lobby.gameParticipants.filter(p => p !== username);
            AppState.gameActive = false;
            saveAndCleanLobbies();
            renderLobbySeating();
            checkForRoundWinner();
        });
    } else {
        saveAndCleanLobbies();
        setTimeout(() => {
            renderLobbySeating();
            startTypingRound();
        }, 650);
    }
}

function playSinkAndSplashAnimation() {
    const promptBox = document.getElementById("prompt-text-box");
    const splash = document.getElementById("splash-fx");

    if (promptBox) {
        promptBox.classList.add("sinking");
        setTimeout(() => promptBox.classList.remove("sinking"), 550);
    }
    if (splash) {
        splash.classList.remove("active");
        void splash.offsetWidth; // restart animation
        splash.classList.add("active");
    }
}

function playEliminationAnimation(onComplete) {
    const shark = document.getElementById("arena-shark");
    if (!shark) {
        onComplete && onComplete();
        return;
    }
    shark.style.animationPlayState = "paused";
    shark.classList.add("jump-swallow");
    setTimeout(() => {
        shark.classList.remove("jump-swallow");
        shark.style.animationPlayState = "running";
        onComplete && onComplete();
    }, 1100);
}

function checkForRoundWinner() {
    const lobby = AppState.activeLobby;
    if (!lobby) return;
    const remaining = lobby.gameParticipants || [];

    if (remaining.length <= 1) {
        if (remaining.length === 1) {
            appendChatMessage("System", `🏆 ${remaining[0]} wins the round!`);
        } else {
            appendChatMessage("System", "The round ended with no survivors.");
        }
        lobby.gameParticipants = [];
        lobby.playerStates = {};
        AppState.gameActive = false;
        saveAndCleanLobbies();
        renderLobbySeating();
    }
}

// ===================== MANAGEMENT CONSOLE (website staff) =====================

function openManagementConsole() {
    const modal = document.getElementById("admin-modal");
    if (!modal) return;

    const rank = AppState.currentUser.rank;
    const isOwner = rank === "Website Owner";
    const isAdmin = rank === "Website Admin";
    const isMod = rank === "Website Mod";

    modal.classList.remove("hidden");
    modal.innerHTML = `
        <div class="admin-modal-card">
            <h3 style="margin-top:0; color:#38bdf8;">SharkFeast Management Console</h3>
            <div class="admin-tabs">
                <button class="tab-btn active" data-target="admin-servers-pane">Server Manager</button>
                <button class="tab-btn" data-target="admin-commands-pane">Command Center</button>
                <button class="tab-btn" data-target="admin-players-pane">All Players</button>
                <button class="tab-btn" data-target="admin-mailbox-pane">Mailbox 📬</button>
                ${isOwner ? '<button class="tab-btn" data-target="admin-ranks-pane">Manage Ranks</button>' : ''}
            </div>

            <div id="admin-servers-pane" class="admin-tab-pane">
                <p style="font-size:12px; color:#8b949e;">Active lobbies and server health control.</p>
                <div id="admin-servers-list" style="margin-top:10px;"></div>
            </div>

            <div id="admin-commands-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Website staff commands (${isOwner ? '15 commands' : isAdmin ? '10 commands' : '8 commands'} available). These are separate from lobby-host / lobby-mod controls, which only apply inside a single lobby.</p>
                <textarea id="admin-cmd-textarea" rows="3" placeholder="Type command (e.g. /ban, /mute, /warn)..." style="width:100%; background:#030712; color:white; border:1px solid #374151; padding:8px; border-radius:4px; margin:10px 0;"></textarea>
                <button id="execute-admin-cmd-btn" style="width:100%; margin-bottom:15px; padding:8px; background:#38bdf8; color:black; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">Execute Command</button>
                <div style="background:#030712; padding:10px; border-radius:6px; border:1px solid #1f2937; max-height:150px; overflow-y:auto;">
                    <strong style="color:#38bdf8; font-size:12px;">Authorized Commands (${rank}):</strong>
                    <ul style="margin:5px 0 0 20px; font-size:11px; color:#9ca3af; padding:0;">
                        ${isMod ? `
                            <li>/warn [user] - Issue warning</li>
                            <li>/mute [user] - Global mute</li>
                            <li>/kick [user] - Kick from lobby</li>
                            <li>/reportcheck - Review reports</li>
                            <li>/serverinfo - Check uptime</li>
                            <li>/staffmsg [msg] - Broadcast staff notice</li>
                            <li>/clearchat - Clear global announcements</li>
                            <li>/help - View help guide</li>
                        ` : ''}
                        ${isAdmin ? `
                            <li>/warn [user], /mute [user], /kick [user], /reportcheck, /serverinfo, /staffmsg [msg], /clearchat, /help</li>
                            <li>/ban [user] - Global website ban</li>
                            <li>/unban [user] - Remove global ban</li>
                        ` : ''}
                        ${isOwner ? `
                            <li>All 15 commands unlocked: Full Website Owner Control (Ban, Unban, SetRank, Server Shutdown, Global Broadcasts, Database Purge, Mod Promos, etc.)</li>
                        ` : ''}
                    </ul>
                </div>
            </div>

            <div id="admin-players-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Registered users database and online/lobby status:</p>
                <div id="admin-all-players-list" style="margin-top:10px;"></div>
            </div>

            <div id="admin-mailbox-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Lobby Reports Mailbox (Exclusive to Website Owner, Admins & Mods — regular players never see this):</p>
                <div id="admin-mailbox-list" style="margin-top:10px;"></div>
            </div>

            ${isOwner ? `
            <div id="admin-ranks-pane" class="admin-tab-pane hidden">
                <p style="font-size:12px; color:#8b949e;">Assign or update player website ranks.</p>
                <input type="text" id="rank-username-input" placeholder="Enter exact username..." style="width:100%; background:#030712; color:white; border:1px solid #374151; padding:8px; border-radius:4px; margin:8px 0;">
                <select id="rank-select-dropdown" style="width:100%; background:#030712; color:white; border:1px solid #374151; padding:8px; border-radius:4px; margin-bottom:12px;">
                    <option value="Player">Player</option>
                    <option value="Website Mod">Website Mod</option>
                    <option value="Website Admin">Website Admin</option>
                </select>
                <button id="apply-rank-btn" style="width:100%; padding:8px; background:#22c55e; color:white; font-weight:bold; border:none; border-radius:4px; cursor:pointer;">Apply Rank</button>
            </div>` : ''}

            <div style="display:flex; justify-content: flex-end; margin-top: 20px;">
                <button id="close-admin-btn" style="background:#374151; color:white; border:none; padding:6px 14px; border-radius:4px; cursor:pointer;">Close Panel</button>
            </div>
        </div>
    `;

    modal.querySelectorAll(".tab-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            modal.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
            modal.querySelectorAll(".admin-tab-pane").forEach(p => p.classList.add("hidden"));
            e.currentTarget.classList.add("active");
            modal.querySelector("#" + e.currentTarget.getAttribute("data-target"))?.classList.remove("hidden");
        });
    });

    document.getElementById("close-admin-btn")?.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    document.getElementById("execute-admin-cmd-btn")?.addEventListener("click", () => {
        const val = document.getElementById("admin-cmd-textarea")?.value.trim();
        if (!val) return;
        alert(`Executed command: ${val}`);
        document.getElementById("admin-cmd-textarea").value = "";
    });

    if (isOwner) {
        document.getElementById("apply-rank-btn")?.addEventListener("click", () => {
            const username = document.getElementById("rank-username-input")?.value.trim();
            const selectedRole = document.getElementById("rank-select-dropdown")?.value;
            if (!username) return;

            let staffRanks = JSON.parse(localStorage.getItem("shark_feasts_staff") || "{}");
            if (selectedRole === "Player") delete staffRanks[username];
            else staffRanks[username] = selectedRole;

            localStorage.setItem("shark_feasts_staff", JSON.stringify(staffRanks));
            alert(`Updated ${username} to ${selectedRole}!`);
        });
    }

    renderAdminServersList();
    renderAdminPlayersList();
    renderAdminMailboxList();
}

function renderAdminServersList() {
    const container = document.getElementById("admin-servers-list");
    if (!container) return;
    saveAndCleanLobbies();

    if (AppState.lobbies.length === 0) {
        container.innerHTML = `<p style="color:#8b949e; padding:10px;">No active lobbies right now.</p>`;
        return;
    }

    let html = "";
    AppState.lobbies.forEach(s => {
        html += `
            <div class="admin-list-row">
                <div><strong>${s.name}</strong> <span style="color:${s.isPrivate ? '#a855f7' : '#22c55e'};">(${s.isPrivate ? 'Private' : 'Public'})</span> — Host: ${s.host}</div>
                <button style="background:#dc2626; color:white; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="shutdownLobby(${s.id})">Shutdown</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

window.shutdownLobby = function(id) {
    AppState.lobbies = AppState.lobbies.filter(l => l.id !== id);
    localStorage.setItem("shark_feasts_lobbies", JSON.stringify(AppState.lobbies));
    if (AppState.activeLobby && AppState.activeLobby.id === id) {
        AppState.activeLobby = null;
        localStorage.removeItem("shark_active_lobby");
        document.getElementById("lobby-screen")?.classList.add("hidden");
        document.getElementById("lobby-browser-container")?.classList.remove("hidden");
    }
    renderAdminServersList();
    renderPublicLobbies();
    alert("Lobby has been shut down.");
};

function renderAdminPlayersList() {
    const container = document.getElementById("admin-all-players-list");
    if (!container) return;

    const usersDb = JSON.parse(localStorage.getItem("shark_users_db") || "{}");
    saveAndCleanLobbies();

    let html = "";
    Object.keys(usersDb).forEach(username => {
        const inLobby = AppState.lobbies.find(l => (l.players || []).includes(username));
        const statusText = inLobby ? `In Lobby: ${inLobby.name}` : "Offline / Browsing";
        const statusColor = inLobby ? "#22c55e" : "#8b949e";

        html += `
            <div class="admin-list-row">
                <div><strong>${username}</strong> <span style="color:#38bdf8; font-size:11px;">(${usersDb[username].rank || "Player"})</span></div>
                <div style="color:${statusColor};">${statusText}</div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function renderAdminMailboxList() {
    const container = document.getElementById("admin-mailbox-list");
    if (!container) return;

    const reports = JSON.parse(localStorage.getItem("shark_lobby_reports") || "[]");
    if (reports.length === 0) {
        container.innerHTML = `<p style="color:#8b949e; padding:10px;">No lobby reports received in mailbox.</p>`;
        return;
    }

    let html = "";
    reports.forEach(r => {
        html += `
            <div style="background:#030712; padding:10px; border-radius:6px; margin-bottom:8px; border-left:3px solid #ef4444; font-size:12px;">
                <div><strong>Reporter:</strong> ${r.reporter} | <strong>Reported:</strong> <span style="color:#ef4444;">${r.target}</span></div>
                <div style="color:#9ca3af; margin:4px 0;">Reason: ${r.reason}</div>
                <div style="color:#9ca3af; margin:4px 0;">Lobby: ${r.lobbyName} (${r.time})</div>
                <button style="background:#38bdf8; color:black; font-weight:bold; border:none; padding:4px 8px; border-radius:4px; cursor:pointer;" onclick="joinLobbyById(${r.lobbyId}); document.getElementById('admin-modal').classList.add('hidden');">Join Lobby to Investigate</button>
            </div>
        `;
    });
    container.innerHTML = html;
}

// ===================== LOBBY LIST / PERSISTENCE =====================

function saveAndCleanLobbies() {
    AppState.lobbies = AppState.lobbies.filter(l => l.players && l.players.length > 0);
    localStorage.setItem("shark_feasts_lobbies", JSON.stringify(AppState.lobbies));
    if (AppState.activeLobby) {
        localStorage.setItem("shark_active_lobby", JSON.stringify(AppState.activeLobby));
    }
}

function renderPublicLobbies() {
    const list = document.getElementById("public-lobbies-list");
    if (!list) return;

    saveAndCleanLobbies();
    const publicLobbies = AppState.lobbies.filter(l => !l.isPrivate);

    if (publicLobbies.length === 0) {
        list.innerHTML = `<p style="color:#8b949e; text-align:center; padding:10px;">No public lobbies active. Create one above!</p>`;
        return;
    }

    let html = "";
    publicLobbies.forEach(l => {
        html += `<div style="display:flex; justify-content:space-between; align-items:center; padding:10px; background:#030712; border-radius:6px; margin-bottom:8px;">
            <div><strong>${l.name}</strong> <span style="color:#8b949e; font-size:12px;">(Host: ${l.host} — Players: ${l.players.length})</span></div>
            <button style="background:#38bdf8; color:black; font-weight:bold; padding:4px 10px; border:none; border-radius:4px; cursor:pointer;" onclick="joinLobbyById(${l.id})">Join</button>
        </div>`;
    });
    list.innerHTML = html;
}

window.joinLobbyById = function(id) {
    const lobby = AppState.lobbies.find(l => l.id === id);
    if (lobby) enterLobby(lobby, true);
};

function appendChatMessage(sender, text) {
    const box = document.getElementById("chat-messages");
    if (box) {
        box.innerHTML += `<div><strong>${sender}:</strong> ${text}</div>`;
        box.scrollTop = box.scrollHeight;
    }
}
