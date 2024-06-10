const serverUrl = 'http://localhost:3000';

let votes = {};
let voted = false;

async function addOption() {
    const optionName = document.getElementById('new-option').value.trim();
    if (optionName && !votes[optionName]) {
        votes[optionName] = 0;

        // Add button for new option
        const optionsDiv = document.getElementById('options');
        const newButton = document.createElement('button');
        newButton.innerText = optionName;
        newButton.className = 'option';
        newButton.onclick = () => vote(optionName);
        optionsDiv.appendChild(newButton);

        // Add result display for new option
        const resultsDiv = document.getElementById('results');
        const newResult = document.createElement('p');
        newResult.id = `${optionName}-count`;
        newResult.innerText = `${optionName}: 0 votes`;
        resultsDiv.appendChild(newResult);

        document.getElementById('new-option').value = '';
    } else {
        alert('Option name is either empty or already exists.');
    }
}

async function vote(option) {
    if (!voted) {
        try {
            const response = await fetch(`${serverUrl}/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ option })
            });
            const result = await response.json();
            votes = result.votes;
            updateResults();
            voted = true;

            // Disable all buttons
            const buttons = document.getElementsByClassName('option');
            for (let button of buttons) {
                button.disabled = true;
            }
        } catch (error) {
            console.error('Error voting:', error);
        }
    } else {
        alert('You have already voted.');
    }
}

async function loadVotes() {
    try {
        const response = await fetch(`${serverUrl}/votes`);
        votes = await response.json();
        updateResults();
    } catch (error) {
        console.error('Error loading votes:', error);
    }
}

function updateResults() {
    for (let option in votes) {
        let resultElement = document.getElementById(`${option}-count`);
        if (resultElement) {
            resultElement.innerText = `${option}: ${votes[option]} votes`;
        } else {
            const resultsDiv = document.getElementById('results');
            const newResult = document.createElement('p');
            newResult.id = `${option}-count`;
            newResult.innerText = `${option}: ${votes[option]} votes`;
            resultsDiv.appendChild(newResult);
        }
    }
}

document.addEventListener('DOMContentLoaded', loadVotes);
