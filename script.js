// API used = https://fxratesapi.com

const apiKey = 'YOUR_ACTUAL_API_KEY'; // Replace with your actual API key
const baseCurrencySelect = document.getElementById('baseCurrency');
const targetCurrencySelect = document.getElementById('targetCurrency');
const amountInput = document.getElementById('amount');
const resultDiv = document.getElementById('result');
const currencyContainer = document.getElementById('currencyContainer');

// Fetch and populate currency options
fetch(`https://api.fxratesapi.com/latest?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        // Populate select options
        Object.keys(data.rates).forEach(currency => {
            const option1 = document.createElement('option');
            const option2 = document.createElement('option');

            option1.text = currency;
            option1.value = currency;

            option2.text = currency;
            option2.value = currency;

            baseCurrencySelect.add(option1);
            targetCurrencySelect.add(option2);
        });

        // Display all currencies with their rates in the container
        displayCurrencies(data.rates);
    })
    .catch(error => console.error('Error fetching currencies:', error));

// Display all currencies with their rates in the container
function displayCurrencies(rates) {
    // Clear previous content
    currencyContainer.innerHTML = '';

    Object.entries(rates).forEach(([currency, rate]) => {
        const currencyElement = document.createElement('div');
        currencyElement.innerText = `${currency}: ${rate.toFixed(8)}`; // Assuming rate is a number
        currencyContainer.appendChild(currencyElement);
    });
}

// Function to convert currency
function convertCurrency() {
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;
  const amount = amountInput.value;

  if (baseCurrency === targetCurrency) {
      resultDiv.innerHTML = 'Please pick a different target currency for conversion.';
      return;
  }

  // Use the selected base currency for the fetch request
  fetch(`https://api.fxratesapi.com/latest?api_key=${apiKey}&base=${baseCurrency}`)
      .then(response => response.json())
      .then(data => {
          const conversionRate = data.rates[targetCurrency];
          if (conversionRate === undefined) {
              resultDiv.innerHTML = 'Error fetching exchange rates for the selected target currency.';
              return;
          }

          // Calculate the converted amount based on the retrieved conversion rate
          const convertedAmount = amount * conversionRate;
          resultDiv.innerHTML = `${amount} ${baseCurrency} = ${convertedAmount.toFixed(2)} ${targetCurrency}`;
      })
      .catch(error => {
          console.error('Error fetching exchange rates:', error);
          resultDiv.innerHTML = 'Error fetching exchange rates';
      });
}

function reverseCurrencies() {
  const baseCurrency = baseCurrencySelect.value;
  const targetCurrency = targetCurrencySelect.value;

  baseCurrencySelect.value = targetCurrency;
  targetCurrencySelect.value = baseCurrency;

  convertCurrency();
}
