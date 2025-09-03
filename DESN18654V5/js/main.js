//learn this from usability for ixd Tutorials
function calculateCycles() {
  const type = document.getElementById('calcType').value;
  const baseTime = document.getElementById('baseTime').value;
 //Start of code from MDN
  if (!baseTime) {
    alert("Please enter a valid time.");
    return;
  }
 //End of code from MDN
  
//learn this from DESN18654
  let [hours, minutes] = baseTime.split(':').map(Number);
  let baseDate = new Date();
 //Start of code from weekly Tutorials
  baseDate.setHours(hours, minutes, 0, 0);
  //End of code from weekly Tutorials
  let results = [];
  const sleepCycles = [5.5,5.1,4.76,4.4,3.8]; //results time(90*x)

  for (let cycles of sleepCycles) {
    let adjustedTime = new Date(
//Start of code from weekly Tutorials
      baseDate.getTime() + (type === 'wakeup' ? -1 : 1) * (90 * cycles + 60) * 60000 //time
    );
//End of code from weekly Tutorials
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


//SleepDebt
let sleepDebt = 0;

function updateDebt() {
  const sleepInput = document.getElementById('sleepInput').value;
  const missedSleep = parseFloat(sleepInput);

  if (isNaN(missedSleep) || missedSleep < 0) {
    alert("Please enter a valid number for lost sleep.");
    return;
  }

  sleepDebt += missedSleep;
//Start of code from weekly Tutorials
  sleepDebt = Math.min(sleepDebt, 60); //cap debt at 60 h（8*7=56h)
//End of code from weekly Tutorials
  document.querySelector('.debt-bar').style.width = `${(sleepDebt / 60) * 100}%`;
   //Start of code from MDN
  document.getElementById('debtText').innerText = `Weekly Sleep Debt: ${sleepDebt.toFixed(1)}h`;
   //End of code from MDN
}

//SD reset
function resetDebt() {
  sleepDebt = 0;
  document.querySelector('.debt-bar').style.width = "0%";
  document.getElementById('debtText').innerText = `Weekly Sleep Debt: 0h`;
}


// Work hour
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
  //Start of code from weekly Tutorials
  const bestBedtime = new Date(workStartTime.getTime() - 9 * 60 * 60 * 1000);
  //End of code from weekly Tutorials
  const formattedBedtime = bestBedtime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  document.getElementById('workResult').innerHTML = `<strong>Best Bedtime:</strong> ${formattedBedtime}`;
}


function updateChronotype() {
 //Start of code from weekly Tutorials
  const hour = new Date().getHours();
  //End of code from weekly Tutorials
  let chronotype = "Balanced Sleeper";
  //Start of code from weekly Tutorials
  if (hour >= 5 && hour < 9) {
    chronotype = "🌞 Early Bird - You wake up naturally with the sunrise!";
  } else if (hour >= 9 && hour < 16) {
    chronotype = "☀️ Daytime Sleeper - You might have an unusual schedule.";
  } else if (hour >= 16 && hour < 21) {
    chronotype = "🌆 Evening Person - You feel more active in the evening.";
  } else if (hour >= 21 || hour < 5) {
    chronotype = "🦉 Night Owl - You stay up late and feel energetic at night!";
  }
//End of code from weekly Tutorials
  document.getElementById('chronotypeText').innerHTML = `<strong>${chronotype}</strong>`;
}
setInterval(updateChronotype, 10000); // Updates 10s

// relax
let timerInterval;
let timeLeft;

function startTimer(seconds) {
  clearInterval(timerInterval); // Stop any existing timer
  timeLeft = seconds;

  function updateDisplay() {
  //Start of code from weekly Tutorials
    document.getElementById('timerDisplay').innerText =
  //End of code from weekly Tutorials
      `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
  }
//learn this from design thesis
  function tick() {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
  //Start of code from weekly Tutorials
      document.getElementById('timerDisplay').innerText = "Done!";
      document.getElementById('relaxBox').classList.add('hidden'); // Hide relax box after completion
  //End of code from weekly Tutorials
    }
  }

  updateDisplay();
  timerInterval = setInterval(tick, 1000);
}
//learn this from system design Tutorials
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
//learn this from info-Architecture Tutorials
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const bgImage = document.getElementById('bg-image');
  
  
  if (document.body.classList.contains('light-mode')) {
    bgImage.style.filter = 'brightness(0.8) contrast(110%)';
  } else {
    bgImage.style.filter = 'brightness(0.5) contrast(130%)';
  }
}

function toggleAccess() {
  document.body.classList.toggle('padding');
  const bgImage = document.getElementById('bg-image');
  
  
  if (document.body.classList.contains('light-mode')) {
    bgImage.style.filter = 'brightness(0.8) contrast(110%)';
  } else {
    bgImage.style.filter = 'brightness(0.5) contrast(130%)';
  }
}