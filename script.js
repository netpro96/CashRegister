const purchaseBtn = document.getElementById("purchase-btn");
const changeDueContainer = document.getElementById("change-due");
const listOfAllUnits = document.querySelectorAll(".units");
const unitsList = document.getElementById("change-drawer");

let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100]
];

const formatResults = (status, change) => {
  changeDueContainer.innerHTML = `<p>Status: ${status}</p>`;
  change.map(
    money => (changeDueContainer.innerHTML += `<p>${money[0]}: $${money[1]}</p>`)
  );
  return;
};

// Function to calculate change and update the cid array
const getChange = (price, cash, cid) => {
  let change = cash - price; // Calculate the change
  let cidTotal = parseFloat(cid.reduce((acc, curr) => acc + curr[1], 0)); // Calculate the total cash in cid

  if (change > cidTotal) {
    return (changeDueContainer.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>');  // If change required is more than total cash, return insufficient funds
  }

  // Object mapping currency names to their respective unit values
  const currencyUnit = {
      "PENNY": 0.01,
      "NICKEL": 0.05,
      "DIME": 0.1,
      "QUARTER": 0.25,
      "ONE": 1,
      "FIVE": 5,
      "TEN": 10,
      "TWENTY": 20,
      "ONE HUNDRED": 100
  };

  let result = { status: 'OPEN', change: [] };
  // Loop through cid array starting from the highest denomination
  for (let i = cid.length - 1; i >= 0; i--) {
      const currencyName = cid[i][0];
      const currencyValue = cid[i][1];
      const unit = currencyUnit[currencyName];
      let numOfCurrency = Math.min(Math.floor(change / unit), currencyValue / unit);
      // Determine the number of current currency to be returned as change
      if (numOfCurrency > 0) {
          result.change.push([currencyName, numOfCurrency * unit]); // Add currency and amount to change array
          change = Number((change - numOfCurrency * unit).toFixed(2)); // Update remaining change
      }
  }

  if (change === 0) {
    if (cidTotal === cash - price) {
      result.status = 'CLOSED'; // Update status to 'CLOSED' if all cash in drawer is utilized
    }
  }

  if (change > 0) {
      return (changeDueContainer.innerHTML = '<p>Status: INSUFFICIENT_FUNDS</p>'); // If change cannot be made with available denominations, return insufficient funds
  }

  // Update cid array with the deducted amounts
  for (let i = 0; i < result.change.length; i++) {
      for (let j = 0; j < cid.length; j++) {
          if (cid[j][0] === result.change[i][0]) {
              cid[j][1] -= result.change[i][1]; // Deduct change amount from cid
              cid[j][1] = parseFloat(cid[j][1].toFixed(2)); // Round to two decimal places
          }
      }
  }

  updateScreen(cid); // Update the screen with new cid values
  formatResults(result.status, result.change);
  return result.change; // Return the breakdown of change
};


// Function to update the screen with new cid values
const updateScreen = (cid) => {
  listOfAllUnits.forEach((unit, index) => {
      unit.innerText = `$${cid[index][1].toFixed(2)}`; // Update the displayed values with two decimal places
  });
};

purchaseBtn.addEventListener('click' , () => {
  const cash = document.getElementById("cash").value;
 if (cash == price){
    return (changeDueContainer.innerText = "No change due - customer paid with exact cash");
   
 } else if (cash < price){
    alert("Customer does not have enough money to purchase the item");
 } else {
  console.log(getChange(price, cash, cid));
  console.log(cid);
  updateScreen(cid);
  
 }
});
