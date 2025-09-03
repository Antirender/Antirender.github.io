document.addEventListener('DOMContentLoaded', function() {
  const calculateBtn = document.getElementById('calculateBtn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      const powerInput = document.getElementById('power');
      const hoursInput = document.getElementById('hours');
      const rateInput = document.getElementById('rate');
      const power = parseFloat(powerInput.value);
      const hours = parseFloat(hoursInput.value);
      const rate = parseFloat(rateInput.value);
      if (isNaN(power) || isNaN(hours) || isNaN(rate)) {
        alert('Are you noob? Numbers!');
        return;
      }
      const consumption = (power * hours) / 1000;
      const cost = consumption * rate;
      const resultDiv = document.getElementById('result');
      const energyP = document.getElementById('energy');
      const costP = document.getElementById('cost');
      energyP.textContent = 'Daily Consumption: ' + consumption.toFixed(2) + ' kWh';
      costP.textContent = 'Daily Cost: ~ $' + cost.toFixed(2);
      resultDiv.style.display = 'block';
    });
  }
});
