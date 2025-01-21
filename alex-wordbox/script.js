// --------------------------------------------------------------------
// script.js
// --------------------------------------------------------------------
const gridElement = document.getElementById('grid');
const wordElement = document.getElementById('word');
const messageElement = document.getElementById('message');
const submitButton = document.getElementById('submit-button');

let grid = [];
let selectedCells = [];
let currentWord = '';
let dictionary = [];
const gridSize = 4;

function generateGrid(gridLetters = null) {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    gridElement.innerHTML = ''; // Clear existing grid
    grid = [];

    let letterIndex = 0;
    const totalCells = gridSize * gridSize;

    if (gridLetters) {
      // Validate the input
      if (gridLetters.length !== totalCells) {
        alert(`Please enter exactly ${totalCells} letters.`);
        return;
      }
      gridLetters = gridLetters.toUpperCase();
    }

    for (let row = 0; row < gridSize; row++) {
      const rowArray = [];
      for (let col = 0; col < gridSize; col++) {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');

        let letter;
        if (gridLetters) {
          letter = gridLetters[letterIndex++];
        } else {
          letter = letters[Math.floor(Math.random() * letters.length)];
        }

        cellElement.textContent = letter;
        cellElement.dataset.row = row;
        cellElement.dataset.col = col;
        gridElement.appendChild(cellElement);

        // Store cell data
        const cell = {
          element: cellElement,
          letter: letter,
          row: row,
          col: col,
          selected: false,
        };
        rowArray.push(cell);

        // Add click event listener
        cellElement.addEventListener('click', () => selectCell(cell));
      }
      grid.push(rowArray);
    }
  }



// Initialize the game
generateGrid();


let allValidWords = new Set();

function generateAllValidWords() {
    allValidWords.clear();
    const visited = [...Array(gridSize)].map(() => Array(gridSize).fill(false));

    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            findWordsFromCell(row, col, '', trie.root, visited);
        }
    }
    // Display the total number of words
    messageElement.textContent = `Total words: ${allValidWords.size}`;

    // Display the initial counts
    updateRemainingWordsMessage();
}

// Directions to move: 8 adjacent cells (including diagonals)
const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
];

function findWordsFromCell(row, col, prefix, node, visited) {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return;
    if (visited[row][col]) return;

    const letter = grid[row][col].letter.toLowerCase();
    if (!node.children[letter]) return; // No words with this prefix

    visited[row][col] = true;
    prefix += letter;
    node = node.children[letter];

    if (node.isEndOfWord && prefix.length >= 4) {
        allValidWords.add(prefix);
    }

    for (const [dr, dc] of directions) {
        findWordsFromCell(row + dr, col + dc, prefix, node, visited);
    }

    visited[row][col] = false; // Backtrack
}




function getRemainingWordsByLength() {
    const remainingWords = [...allValidWords].filter(word => !wordsFound.has(word));
    const lengthCounts = {};

    for (const word of remainingWords) {
        const length = word.length;
        if (lengthCounts[length]) {
            lengthCounts[length]++;
        } else {
            lengthCounts[length] = 1;
        }
    }

    return { totalRemaining: remainingWords.length, lengthCounts };
}


function getSortedLengthCounts() {
    const { lengthCounts } = getRemainingWordsByLength();

    // Convert the counts object to an array and sort by length descending
    const sortedCounts = Object.entries(lengthCounts)
        .map(([length, count]) => ({ length: parseInt(length), count }))
        .sort((a, b) => b.length - a.length);

    return sortedCounts;
}


const wordRemainingElement = document.getElementById('wordsRemainingMessage');
function updateRemainingWordsMessage() {
    const { totalRemaining } = getRemainingWordsByLength();
    const sortedCounts = getSortedLengthCounts();

    let message = `${totalRemaining} word${totalRemaining !== 1 ? 's' : ''} remaining\n`;
    for (const { length, count } of sortedCounts) {
        message += `<br/>${count} (${length}-letter) word${count !== 1 ? 's' : ''}\n`;
    }
    wordRemainingElement.innerHTML = message;
}




// Load and build the trie from the dictionary
fetch('filtered_dictionary.txt')
    .then(response => response.text())
    .then(text => {
        const words = text.split('\n').map(word => word.trim());
        dictionary = new Set(words); // For quick lookup
        for (const word of words) {
            trie.insert(word);
        }
        // After building the trie, generate words from the grid
        generateAllValidWords();
    });








// Check if two cells are adjacent
function isAdjacent(cell1, cell2) {
    return Math.max(
        Math.abs(cell1.row - cell2.row),
        Math.abs(cell1.col - cell2.col)
    ) <= 1;
}



class TrieNode {
    constructor() {
        this.children = {};
        this.isEndOfWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (const letter of word) {
            if (!node.children[letter]) {
                node.children[letter] = new TrieNode();
            }
            node = node.children[letter];
        }
        node.isEndOfWord = true;
    }
}

let trie = new Trie();

// Reset the current selection
function resetSelection() {
    selectedCells.forEach(cell => {
        cell.selected = false;
        cell.element.classList.remove('selected');
    });
    selectedCells = [];
    currentWord = '';
    wordElement.textContent = '';

    // Clear hint highlights
    grid.flat().forEach(cell => {
        cell.element.classList.remove('hint');
    });
}

function selectCell(cell) {
    // Clear hints when a cell is selected
    grid.flat().forEach(c => {
        c.element.classList.remove('hint');
    });

    if (cell.selected) return;

    if (selectedCells.length > 0) {
        const lastCell = selectedCells[selectedCells.length - 1];
        if (!isAdjacent(cell, lastCell)) return;
    }

    cell.selected = true;
    cell.element.classList.add('selected');
    selectedCells.push(cell);
    currentWord += cell.letter;
    wordElement.textContent = currentWord;
}


let wordsFound = new Set();

submitButton.addEventListener('click', () => {
    const lowerCaseWord = currentWord.toLowerCase();
    if (currentWord.length < 4) {
        messageElement.textContent = 'Word must be at least 4 letters long.';
    } else if (allValidWords.has(lowerCaseWord)) {
        if (wordsFound.has(lowerCaseWord)) {
            messageElement.textContent = `You've already found "${currentWord.toUpperCase()}".`;
        } else {
            wordsFound.add(lowerCaseWord);
            messageElement.textContent = `"${currentWord.toUpperCase()}" is correct!`;
            updateRemainingWordsMessage();
        }
    } else {
        messageElement.textContent = `"${currentWord.toUpperCase()}" is not valid.`;
    }
    resetSelection();
    updateRemainingWordsMessage();
});







// Function to find the path for a word
function findPathForWord(word) {
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const path = [];
            const visited = [...Array(gridSize)].map(() => Array(gridSize).fill(false));
            if (searchForWord(row, col, word, 0, path, visited)) {
                return path;
            }
        }
    }
    return null; // Word not found
}

function searchForWord(row, col, word, index, path, visited) {
    if (index >= word.length) return true;
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) return false;
    if (visited[row][col]) return false;
    if (grid[row][col].letter.toLowerCase() !== word[index]) return false;

    visited[row][col] = true;
    path.push({ row, col });

    if (index === word.length - 1) return true;

    for (const [dr, dc] of directions) {
        if (searchForWord(row + dr, col + dc, word, index + 1, path, visited)) {
            return true;
        }
    }

    visited[row][col] = false;
    path.pop();
    return false;
}

const hintButton = document.getElementById('hint-button');
hintButton.addEventListener('click', () => {
    const remainingWords = [...allValidWords].filter(word => !wordsFound.has(word));
    if (remainingWords.length === 0) {
        messageElement.textContent = 'No more words to find!';
        return;
    }
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];

    const path = findPathForWord(randomWord);
    if (!path) {
        messageElement.textContent = 'No hint available.';
        return;
    }

    // Highlight the path
    resetSelection();
    path.forEach(({ row, col }) => {
        const cell = grid[row][col];
        cell.element.classList.add('hint');
    });

    messageElement.textContent = `Hint: The word starts with "${randomWord[0].toUpperCase()}"`;
});

const resetButton = document.getElementById('reset-button');
resetButton.addEventListener('click', () => {
    resetSelection();
    updateRemainingWordsMessage();
});


const setGridButton = document.getElementById('set-grid-button');
const randomGridButton = document.getElementById('random-grid-button');
const gridInput = document.getElementById('grid-input');

setGridButton.addEventListener('click', () => {
  let userInput = gridInput.value.replace(/[^A-Za-z]/g, '').toUpperCase();
  if (userInput.length !== 16) {
    alert('Please enter exactly 16 letters (A-Z).');
    return;
  }
  startNewGame(userInput);
});

randomGridButton.addEventListener('click', () => {
  startNewGame();
});

function startNewGame(gridLetters = null) {
  wordsFound.clear();
  resetSelection();
  generateGrid(gridLetters);
  generateAllValidWords();
  updateRemainingWordsMessage();
  messageElement.textContent = '';
}
