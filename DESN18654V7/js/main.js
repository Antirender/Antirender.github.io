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
  SCBedTime.hours = hours;
  SCBedTime.minutes = minutes;
  // 12-hour conversion:
  if (hours === 0) {
      SCBedTime.hours = 12;
      SCBedTime.meridiem = "AM";
  } else if (hours >= 12) {
      SCBedTime.meridiem = "PM";
      if (hours > 12) {
          SCBedTime.hours = hours - 12;
      }
  } else {
      SCBedTime.meridiem = "AM";
  }
  //Start of code from weekly Tutorials
  baseDate.setHours(hours, minutes, 0, 0);
  //End of code from weekly Tutorials

  // Update the display based on the selected mode
  fill(document.getElementById('calcType').value);
  
  // Show the time view (Best Times) area
  document.getElementById('timeView').classList.remove('hidden');
}
//learn this from usability for ixd Tutorials
function fill(type) {
  var titleElem = document.querySelector("#titleElem"),
      timeSpan = document.querySelector("#timeSpan"),
      bedText = document.querySelector("#bedTextElem"),
      wakeText = document.querySelector("#wakeTextElem"),
      textHiddenCls = "time-view__text_hidden";
  if (type == "wakeup") {
      // wake-up
      titleElem.innerHTML = titleElem.dataset.titleBed;
      timeSpan.innerHTML = formatTime(SCBedTime);  // use user input time
      bedText.classList.remove(textHiddenCls);
      wakeText.classList.add(textHiddenCls);
  } else {
      // bedtime mode
      titleElem.innerHTML = titleElem.dataset.titleWakeup;
      timeSpan.innerHTML = formatTime(SCBedTime);  // use user input time
      bedText.classList.add(textHiddenCls);
      wakeText.classList.remove(textHiddenCls);
  }
  fillList(type);
}
//learn this from code from weekly Tutorials
// fillList() generates 4 time options
function fillList(type) {
  var timeList = document.querySelector("#timeList"),
      template = '<li class="time-list__item{{cls}}"><span class="time-list__text">{{time}}</span></li>',
      suggestedClass = " time-list__item_suggested",
      curItem = "";
  timeList.innerHTML = "";
  // generate 4 time options
  for (var i = 0; i < 4; i++) {
      curItem = template;
      var bestPrefix = (i === 0) ? "BEST: " : "";
      curItem = curItem.replace("{{cls}}", i < 2 ? suggestedClass : "");
      if (type == "bedtime") {
          //bedtime subtract hours from SCBedTime
          curItem = curItem.replace("{{time}}", bestPrefix + formatTime(SCBedTime, (4 + i) * 1.5 - 0.25));
      } else {
          // For wake-up mode: add hours to SCBedTime
          curItem = curItem.replace("{{time}}", bestPrefix + formatTime(SCBedTime, (4 + i) * -1.5 + 0.25));
      }
      timeList.innerHTML += curItem;
  }
}

// formatTime() formats a time object into a string
function formatTime(time, addHours) {
  var allMinutes = time.hours * 60 + time.minutes,
      str = "",
      hours = 0,
      minutes = 0,
      meridiem = time.meridiem;
  allMinutes += addHours ? addHours * 60 : 0;
  if (allMinutes < 0) {
      allMinutes = 720 + allMinutes;
      meridiem = (meridiem == "AM") ? "PM" : "AM";
  } else if (allMinutes > 720) {
      allMinutes -= 720;
      meridiem = (meridiem == "AM") ? "PM" : "AM";
  }
  hours = parseInt(allMinutes / 60);
  hours = (hours === 0) ? 12 : hours;
  minutes = allMinutes % 60;
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  str = hours + ":" + minutes + "&nbsp;" + meridiem;
  return str;
}
//learn this from code from weekly Tutorials
// getTime() 
function getTime() {
  var time = new Date(),
      hours = time.getHours(),
      minutes = time.getMinutes(),
      meridiem = "AM";
  if (hours > 11) {
      hours -= 12;
      meridiem = "PM";
  }
  return {
      hours: hours,
      minutes: minutes,
      meridiem: meridiem
  };
}


//learn this from code from weekly Tutorials
// back button
document.getElementById("backButton").addEventListener("click", function () {
  document.getElementById('timeView').classList.add('hidden');
});


// into string
function formatTime(time, addHours) {
  var allMinutes = time.hours * 60 + time.minutes,
      str = "",
      hours = 0,
      minutes = 0,
      meridiem = time.meridiem;
  allMinutes += addHours ? addHours * 60 : 0;
  if (allMinutes < 0) {
      allMinutes = 720 + allMinutes;
      meridiem = (meridiem == "AM") ? "PM" : "AM";
  } else if (allMinutes > 720) {
      allMinutes -= 720;
      meridiem = (meridiem == "AM") ? "PM" : "AM";
  }
  hours = parseInt(allMinutes / 60);
  hours = (hours === 0) ? 12 : hours;
  minutes = allMinutes % 60;
  minutes = minutes >= 10 ? minutes : "0" + minutes;
  str = hours + ":" + minutes + "&nbsp;" + meridiem;
  return str;
}

// Global object for Sleep Calculator baseline (SCBedTime)
var SCBedTime = {
  hours: 0,
  minutes: 0,
  meridiem: "AM"
};


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
  sleepDebt = Math.min(sleepDebt, 60); // cap debt at 60 h (8*7=56h)
  //End of code from weekly Tutorials

  document.querySelector('.debt-bar').style.width = `${(sleepDebt / 60) * 100}%`;
  //Start of code from MDN
  document.getElementById('debtText').innerText = `Weekly Sleep Debt: ${sleepDebt.toFixed(1)}h`;
  //End of code from MDN
}
  //Start of code from VDES31927 weekly Tutorials
function resetDebt() {
  sleepDebt = 0;
  document.querySelector('.debt-bar').style.width = "0%";
  document.getElementById('debtText').innerText = `Weekly Sleep Debt: 0h`;
}
  //End of code from VDES31927 weekly Tutorials

function planSleep() {
  const workStart = document.getElementById('workStart').value;
  const workEnd = document.getElementById('workEnd').value;

  if (!workStart || !workEnd) {
    alert("Please enter valid work hours.");
    return;
  }

  const [startHours, startMinutes] = workStart.split(':').map(Number);
  const workStartTime = new Date();
  workStartTime.setHours(startHours, startMinutes, 0);

  // (9 hours before work start)
  //Start of code from weekly Tutorials(Information Architecture)
  const bestBedtime = new Date(workStartTime.getTime() - 9 * 60 * 60 * 1000);
  //End of code from weekly Tutorials(Information Architecture)

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
  } else {
    chronotype = "🦉 Night Owl - You stay up late and feel energetic at night!";
  }
  //End of code from weekly Tutorials
  document.getElementById('chronotypeText').innerHTML = `<strong>${chronotype}</strong>`;
}

// Prevent multiple intervals stacking
setInterval(updateChronotype, 10000);
  //End of code from Usability for Interaction Design weekly Tutorials

let timerInterval;
let timeLeft;

function startTimer(seconds) {
  clearInterval(timerInterval); // Stop any existing timer
  timeLeft = seconds;

  function updateDisplay() {
    //Start of code from weekly Tutorials
    document.getElementById('timerDisplay').innerText =
      `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`;
    //End of code from weekly Tutorials
  }

  function tick() {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      document.getElementById('timerDisplay').innerText = "Done!";
      document.getElementById('relaxBox').classList.add('hidden'); // Hide relax box 
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

//api
// Start of Unsplash API integration code from Unsplash Documentation
fetch(`https://api.unsplash.com/photos/random?query=night-sky&client_id=8B94n-nHcsYyQwfdYQbFTgoAZC5xdzcPhc8cWRqsVFw`)
  .then(response => response.json())
  .then(data => {
    const bgImage = document.getElementById('bg-image');
    bgImage.style.backgroundImage = `url(${data.urls.regular})`;
    // End of Unsplash API integration code from Unsplash Documentation
    bgImage.style.backgroundSize = 'cover';
    bgImage.style.backgroundPosition = 'center';
  })
  .catch(() => {
    console.error("Error fetching background image.");
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
