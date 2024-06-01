const daysOneMonth = 30
const decimalPlaces = 2

document.addEventListener('DOMContentLoaded', async function () {

  const originalTotal = await fetchLocalStorage('salary')
  const originalFixedDay = await fetchLocalStorage('day')

  const total = originalTotal || 6666
  const fixedDay = originalFixedDay || 10

  document.getElementById('settings-salary').value = total
  document.getElementById('settings-date-select').value = `${fixedDay}`

  const start = moneyGot(total, fixedDay)
  document.getElementById('salary-got').innerHTML = start.toFixed(decimalPlaces)
  document.getElementById('days-left-number').innerHTML = daysOneMonth - daysPassed(fixedDay)

  var intervalId = setInterval(() => {
    updateMoneyGotFunc(total, fixedDay)
  }, 1000)

  const updateMoneyGotFunc = function (total, fixedDay) {
    clearInterval(intervalId)
    const start = moneyGot(total, fixedDay)
    const step = salaryPerSecond(total)
    var accumulator = step
    accumulator += step
    updateMoneyGot(start + accumulator)

    intervalId = setInterval(() => {
      accumulator += step
      updateMoneyGot(start + accumulator)
    }, 1000)
  }

  document.getElementById('settings-salary').addEventListener('input', function (event) {
    const total = Number(event.target.value)
    const fixedDay = Number(document.getElementById("settings-date-select").value)
    updateMoneyGotFunc(total, fixedDay)

    const options = {
      salary: total,
      day: fixedDay
    }
    chrome.storage.local.set(options).then(() => {
      console.log(`${JSON.stringify(options)}` + "Value is set");
    });
  })

  document.getElementById("settings-date-select").addEventListener("change", function () {
    const total = Number(document.getElementById('settings-salary').value)
    const fixedDay = Number(this.value)
    updateMoneyGotFunc(total, fixedDay)
    document.getElementById('days-left-number').innerHTML = `${daysOneMonth - daysPassed(fixedDay)}`

    const options = {
      salary: total,
      day: fixedDay
    }
    chrome.storage.local.set(options).then(() => {
      console.log(`${JSON.stringify(options)}` + "Value is set");
    });
  });

  drawCurve()

  const button = document.getElementById('settings-button-img');
  const content = document.getElementById('settings-content');
  if (!originalTotal && !originalFixedDay) {
    button.src = 'up.png'
    content.style.display = 'block';
  } else {
    button.src = 'down.png'
    content.style.display = 'none';
  }

  document.getElementById("settings-button").addEventListener("click", function () {
    toggleContent()
    console.log('toggled....')
  })

  const flipContainer = document.querySelector('.flip-container');
  const flipButton = document.getElementById('flipButton');

  flipButton.addEventListener('click', () => {
    flipContainer.classList.toggle('flipped');
  });

});

function drawCurve() {
  const canvas = document.getElementById('curveCanvas');
  const ctx = canvas.getContext('2d');

  // Set up the shadow properties
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 1.5;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1;

  // Draw the curved line
  ctx.beginPath();
  ctx.moveTo(0, 100); // Starting point
  ctx.quadraticCurveTo(150, 150, 300, 100); // Control point and end point
  ctx.strokeStyle = '#D14E3F'; // Line color
  ctx.lineWidth = 1; // Line width
  ctx.stroke(); // Draw the line
}

function updateMoneyGot(latestMoneyGot) {
  document.getElementById('salary-got').innerHTML = latestMoneyGot.toFixed(decimalPlaces)
}

function salaryPerSecond(salaryTotal) {
  return salaryTotal / (daysOneMonth * 24 * 60 * 60)
}

function moneyGot(salaryTotal, salaryDate) {
  const days = daysPassed(salaryDate)
  const money = (1.0 * days / daysOneMonth) * salaryTotal
  return money
}

function daysPassed(fixedDay) {
  const today = (new Date()).getDate();
  if (fixedDay <= today) {
    return today - fixedDay
  }

  return daysOneMonth - fixedDay + today
}

async function fetchLocalStorage(key) {
  return new Promise(resolve => {
    chrome.storage.local.get([key]).then((result) => {
      console.log("Value is " + JSON.stringify(result[key]));
      resolve((result[key]))
    });
  })
}

function toggleContent() {
  const content = document.getElementById('settings-content');
  const button = document.getElementById('settings-button-img');
  if (button.src.includes('down.png')) {
    content.style.display = 'block';
    button.src = 'up.png'
  } else {
    content.style.display = 'none';
    button.src = 'down.png'
  }
}