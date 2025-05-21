// Load stored seasons from localStorage or initialize an empty object
let seasons = JSON.parse(localStorage.getItem('seasons')) || {};

// Initialize a sample season (for testing, remove this later if not needed)
function initializeSeason(seasonName) {
    return {
        name: seasonName,
        teams: [
            { name: 'Team A', draws: 5, points: 15 },
            { name: 'Team B', draws: 3, points: 12 },
            { name: 'Team C', draws: 7, points: 21 },
        ]
    };
}

// Add new season to the list
function addNewSeason() {
    const seasonName = document.getElementById("season-name").value.trim();
    if (!seasonName) return alert("Please enter a season name");

    if (seasons[seasonName]) {
        alert("Season already exists");
        return;
    }

    const newSeason = initializeSeason(seasonName);
    seasons[seasonName] = newSeason;
    
    // Save the updated seasons to localStorage
    localStorage.setItem('seasons', JSON.stringify(seasons));

    // Add the season to the dropdown
    const seasonSelect = document.getElementById("seasons-dropdown");
    const option = document.createElement("option");
    option.value = seasonName;
    option.textContent = seasonName;
    seasonSelect.appendChild(option);

    // Select the new season
    seasonSelect.value = seasonName;
    switchSeason();
}

// Switch seasons and display the leaderboard
function switchSeason() {
    const seasonName = document.getElementById("seasons-dropdown").value;
    if (!seasonName || !seasons[seasonName]) return;

    const season = seasons[seasonName];
    renderLeaderboard(season);
}

// Render the leaderboard for a given season
function renderLeaderboard(season) {
    const tbody = document.querySelector("#leaderboard-table tbody");
    tbody.innerHTML = ""; // Clear existing rows

    // Sort teams by points and then by draws (in case of a tie)
    const sortedTeams = season.teams.sort((a, b) => b.points - a.points || b.draws - a.draws);

    sortedTeams.forEach((team, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${team.name}</td>
            <td>${team.draws}</td>
            <td>${team.points}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Enable drag-and-drop functionality
const tableBody = document.querySelector("#leaderboard-table tbody");

new Sortable(tableBody, {
    onEnd: function (evt) {
        const teams = Array.from(tableBody.children);
        teams.forEach((row, index) => {
            const teamName = row.children[1].textContent;
            const seasonName = document.getElementById("seasons-dropdown").value;
            const season = seasons[seasonName];

            // Reorder teams based on new index
            const teamIndex = season.teams.findIndex(team => team.name === teamName);
            const [movedTeam] = season.teams.splice(teamIndex, 1);
            season.teams.splice(index, 0, movedTeam);
        });

        // Save the updated seasons to localStorage
        localStorage.setItem('seasons', JSON.stringify(seasons));
    }
});

// Initial render
window.onload = () => {
    // Populate the seasons dropdown
    const seasonSelect = document.getElementById("seasons-dropdown");
    for (const seasonName in seasons) {
        const option = document.createElement("option");
        option.value = seasonName;
        option.textContent = seasonName;
        seasonSelect.appendChild(option);
    }

    // If a season is already selected, display its leaderboard
    if (seasonSelect.value) {
        switchSeason();
    } else {
        addNewSeason(); // Adds a default season for testing purposes
    }
};
