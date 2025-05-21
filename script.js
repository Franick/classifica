// Initialize data
let seasons = JSON.parse(localStorage.getItem('seasons')) || [];
let currentSeason = null;
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || {};

// Load seasons and leaderboard data
window.onload = function() {
    loadSeasons();
    if (seasons.length > 0) {
        currentSeason = seasons[0].name; // Set the default season
        loadLeaderboard();
    }
};

// Add a new season
function addSeason() {
    const seasonName = document.getElementById('season-name').value.trim();
    if (seasonName && !seasons.some(season => season.name === seasonName)) {
        const newSeason = { name: seasonName, teams: [] };
        seasons.push(newSeason);
        currentSeason = seasonName; // Set the current season
        localStorage.setItem('seasons', JSON.stringify(seasons));
        loadSeasons();
        loadLeaderboard();
    }
}

// Load and display all seasons
function loadSeasons() {
    const seasonsList = document.getElementById('seasons-list');
    seasonsList.innerHTML = '';
    seasons.forEach(season => {
        const li = document.createElement('li');
        li.textContent = season.name;
        li.onclick = () => setSeason(season.name);
        seasonsList.appendChild(li);
    });
}

// Set the current season
function setSeason(seasonName) {
    currentSeason = seasonName;
    loadLeaderboard();
}

// Add a new team to the leaderboard
function addTeam() {
    const teamName = document.getElementById('team-name').value.trim();
    const teamPoints = parseInt(document.getElementById('team-points').value.trim());
    if (teamName && !isNaN(teamPoints) && teamPoints >= 0) {
        if (!leaderboard[currentSeason]) {
            leaderboard[currentSeason] = [];
        }

        leaderboard[currentSeason].push({ name: teamName, points: teamPoints });
        leaderboard[currentSeason].sort((a, b) => b.points - a.points); // Sort by points
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        loadLeaderboard();
    }
}

// Load and display the leaderboard for the current season
function loadLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = '';
    if (leaderboard[currentSeason]) {
        leaderboard[currentSeason].forEach((team, index) => {
            const li = document.createElement('li');
            li.textContent = `${team.name} - ${team.points} points`;
            li.draggable = true;
            li.dataset.index = index;
            li.ondragstart = dragStart;
            li.ondragover = dragOver;
            li.ondrop = drop;
            li.ondragenter = dragEnter;
            li.ondragleave = dragLeave;
            leaderboardList.appendChild(li);
        });
    }
}

// Drag and Drop Handling
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.index);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragEnter(e) {
    e.preventDefault();
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    const draggedIndex = e.dataTransfer.getData('text/plain');
    const droppedIndex = e.target.dataset.index;

    if (draggedIndex !== droppedIndex) {
        const draggedTeam = leaderboard[currentSeason][draggedIndex];
        leaderboard[currentSeason].splice(draggedIndex, 1);
        leaderboard[currentSeason].splice(droppedIndex, 0, draggedTeam);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        loadLeaderboard();
    }
}
