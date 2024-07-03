// 1. Despot some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin the slot machine
// 5. check if the user won
// 6. give the user their winnings
// 7. play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const SYMBOL_VALUES = {
  A: 5,
  B: 4,
  C: 3,
  D: 2,
};

/**
 * deposit - This function prompts the user to enter a deposit amount, and then
 * checks if the input is a valid number. If the input is valid, it is returned.
 * If the input is not valid, the function prompts the user again.
 *
 * @return {number} The valid deposit amount entered by the user.
 */
const deposit = () => {
  // Loop until a valid deposit amount is entered
  while (true) {
    // Prompt the user to enter a deposit amount
    const depositAmount = prompt("Enter a deposit amount: ");
    // Parse the input as a float
    const numberDepositAmount = parseFloat(depositAmount);

    // Check if the input is a valid number
    if (isNaN(numberDepositAmount)) {
      // If the input is not a number, print an error message and prompt the user again
      console.log("Invalid deposit amount, try again.");
    } else if (numberDepositAmount <= 0) {
      // If the input is a negative or zero number, print an error message and prompt the user again
      console.log("Deposit amount must be a positive number, try again.");
    } else {
      // If the input is a valid number, return it
      return numberDepositAmount;
    }
  }
};

const getNumberOfLines = () => {
  while (true) {
    const lines = prompt("Enter the number of lines to bet on (1-3): ");
    const numberOfLines = parseFloat(lines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3) {
      console.log("Invalid number of lines, try again.");
    } else {
      return numberOfLines;
    }
  }
};

const getBet = (balance, lines) => {
  while (true) {
    const bet = prompt("Enter the bet per line: ");
    const numberBet = parseFloat(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines) {
      console.log("Invalid bet, try again.");
    } else {
      return numberBet;
    }
  }
};

// Function to simulate spinning the slot machine reels
// It returns an array of reels, each reel is an array of symbols
const spin = () => {
  // Create an empty array to store all the symbols
  const symbols = [];

  // Loop through each symbol and its count
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    // Loop count times to add the symbol to the symbols array
    for (let i = 0; i < count; i++) {
      symbols.push(symbol);
    }
  }

  // Create an empty array to store the reels
  const reels = [];

  // Loop through each column of the reels
  for (let i = 0; i < COLS; i++) {
    // Add an empty array to the reels array
    reels.push([]);

    // Create a copy of the symbols array to use for the reel
    const reelSymbols = [...symbols];

    // Loop through each row of the reel
    for (let j = 0; j < ROWS; j++) {
      // Get a random index within the range of the reel symbols array length
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);

      // Get the selected symbol at the random index
      const selectedSymbol = reelSymbols[randomIndex];

      // Add the selected symbol to the current reel
      reels[i].push(selectedSymbol);

      // Remove the selected symbol from the reelSymbols array
      reelSymbols.splice(randomIndex, 1);
    }
  }

  // Return the array of reels
  return reels;
};

const transpose = (reels) => {
  const rows = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

const printRows = (rows) => {
  for (const row of rows) {
    let rowString = "";
    for (const [i, symbol] of row.entries()) {
      rowString += symbol;
      if (i != row.length - 1) {
        rowString += " | ";
      }
    }
    console.log(rowString);
  }
};

const getWinnings = (rows, bet, lines) => {
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol != symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      winnings += bet * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

const game = () => {
  let balance = deposit();

  while (true) {
    console.log("You have a balance of $" + balance);
    const numberOfLines = getNumberOfLines();
    const bet = getBet(balance, numberOfLines);
    balance -= bet * numberOfLines;
    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);
    const winnings = getWinnings(rows, bet, numberOfLines);
    balance += winnings;
    console.log("You won, $" + winnings.toString());

    if (balance <= 0) {
      console.log("You ran out of money!");
      break;
    }

    const playAgain = prompt("Do you want to play again (y/n)? ");

    if (playAgain != "y") break;
  }
};

game();