function calculateCycles() {
  const type = document.getElementById('calcType').value;
  const baseTime = document.getElementById('baseTime').value;
  if (!baseTime) {
    alert("Please enter a valid time.");
    return;
  }

  let [hours, minutes] = baseTime.split(':').map(Number);
  let baseDate = new Date();
  baseDate.setHours(hours, minutes, 0, 0);

  let results = [];
  const sleepCycles = [5.5,5.1,4.76,4.4,3.8]; //results time

  for (let cycles of sleepCycles) {
    let adjustedTime = new Date(
      baseDate.getTime() + (type === 'wakeup' ? -1 : 1) * (90 * cycles + 60) * 60000 //time
    );

    let formattedTime = adjustedTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    results.push(`<div class="cycle-item">${formattedTime}</div>`);
  }

  document.getElementById('resultBox').classList.remove('hidden');
  document.getElementById('cycleResults').innerHTML = results.join('');
}


//SleepDebtTracker
let sleepDebt = 0;

function updateDebt() {
  const sleepInput = document.getElementById('sleepInput').value;
  const missedSleep = parseFloat(sleepInput);

  if (isNaN(missedSleep) || missedSleep < 0) {
    alert("Please enter a valid number for lost sleep.");
    return;
  }

  sleepDebt += missedSleep;
  sleepDebt = Math.min(sleepDebt, 60); //cap debt at 60 h（8*7=56h

  document.querySelector('.debt-bar').style.width = `${(sleepDebt / 60) * 100}%`;
  document.getElementById('debtText').innerText = `Weekly Sleep Debt: ${sleepDebt.toFixed(1)}h`;
}

//SDT reset
function resetDebt() {
  sleepDebt = 0;
  document.querySelector('.debt-bar').style.width = "0%";
  document.getElementById('debtText').innerText = `Weekly Sleep Debt: 0h`;
}


// Productivity Planner
function planSleep() {
  const workStart = document.getElementById('workStart').value;
  const workEnd = document.getElementById('workEnd').value;

  if (!workStart || !workEnd) {
    alert("Please enter valid work hours.");
    return;
  }

  const [startHours, startMinutes] = workStart.split(':').map(Number);
  const [endHours, endMinutes] = workEnd.split(':').map(Number);

  const workStartTime = new Date();
  workStartTime.setHours(startHours, startMinutes, 0);

  const workEndTime = new Date();
  workEndTime.setHours(endHours, endMinutes, 0);

  // (9 hours before work start
  const bestBedtime = new Date(workStartTime.getTime() - 9 * 60 * 60 * 1000);
  const formattedBedtime = bestBedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  document.getElementById('workResult').innerHTML = `<strong>Best Bedtime:</strong> ${formattedBedtime}`;
}


function updateChronotype() {
  const hour = new Date().getHours();
  let chronotype = "Balanced Sleeper";

  if (hour >= 5 && hour < 9) {
    chronotype = "🌞 Early Bird - You wake up naturally with the sunrise!";
  } else if (hour >= 9 && hour < 16) {
    chronotype = "☀️ Daytime Sleeper - You might have an unusual schedule.";
  } else if (hour >= 16 && hour < 21) {
    chronotype = "🌆 Evening Person - You feel more active in the evening.";
  } else if (hour >= 21 || hour < 5) {
    chronotype = "🦉 Night Owl - You stay up late and feel energetic at night!";
  }

  document.getElementById('chronotypeText').innerHTML = `<strong>${chronotype}</strong>`;
}
setInterval(updateChronotype, 10000); // Updates 10s

// Relax Timer
let timerInterval;
let timeLeft;

function startTimer(seconds) {
  clearInterval(timerInterval); // Stop any existing timer
  timeLeft = seconds;

  function updateDisplay() {
    document.getElementById('timerDisplay').innerText =
      `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
  }

  function tick() {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      document.getElementById('timerDisplay').innerText = "Done!";
      document.getElementById('relaxBox').classList.add('hidden'); // Hide relax box after completion
    }
  }

  updateDisplay();
  timerInterval = setInterval(tick, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById('timerDisplay').innerText = "Stopped";
}

// Start of Unsplash API integration code from Unsplash Documentation
fetch(`https://api.unsplash.com/photos/random?query=night-sky&client_id=8B94n-nHcsYyQwfdYQbFTgoAZC5xdzcPhc8cWRqsVFw`)
.then(response => response.json())
.then(data => {
  const bgImage = document.getElementById('bg-image');
  bgImage.style.backgroundImage = `url(${data.urls.regular})`;
 // End of Unsplash API integration code from Unsplash Documentation
  bgImage.style.backgroundSize = 'cover';
  bgImage.style.backgroundPosition = 'center';
  
});

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const bgImage = document.getElementById('bg-image');
  
  if (document.body.classList.contains('light-mode')) {
    bgImage.style.filter = 'brightness(0.8) contrast(110%)';
  } else {
    bgImage.style.filter = 'brightness(0.5) contrast(130%)';
  }
}