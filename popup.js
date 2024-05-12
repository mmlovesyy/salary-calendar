const daysOneMonth = 30
const decimalPlaces = 3

document.addEventListener('DOMContentLoaded', async function () {
  const total = await fetchLocalStorage('salary') || 6666
  const fixedDay = await fetchLocalStorage('day') || 10

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

});

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