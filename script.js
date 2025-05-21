document.getElementById('team-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  const teamName = document.getElementById('team-name').value;
  const gamesPlayed = document.getElementById('games-played').value;
  const wins = document.getElementById('wins').value;
  const losses = document.getElementById('losses').value;
  
  const points = wins * 3;  // 3 points per win
  
  const tableBody = document.getElementById('leaderboard-body');
  
  // Create a new row for the table
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${teamName}</td>
    <td>${gamesPlayed}</td>
    <td>${wins}</td>
    <td>${losses}</td>
    <td>${points}</td>
    <td><button class="edit-btn">Edit</button></td>
  `;
  
  // Add the row to the table
  tableBody.appendChild(row);
  
  // Clear the form
  document.getElementById('team-form').reset();
});

// Edit button functionality
document.getElementById('leaderboard-body').addEventListener('click', function(event) {
  if (event.target && event.target.classList.contains('edit-btn')) {
    const row = event.target.closest('tr');
    const cells = row.getElementsByTagName('td');
    
    // Get existing values
    document.getElementById('team-name').value = cells[0].textContent;
    document.getElementById('games-played').value = cells[1].textContent;
    document.getElementById('wins').value = cells[2].textContent;
    document.getElementById('losses').value = cells[3].textContent;
    
    // Remove the row for editing
    row.remove();
  }
});
