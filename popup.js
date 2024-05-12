const daysOneMonth = 30
const fixedDay = 10
const decimalPlaces = 3
var total = 6666

document.addEventListener('DOMContentLoaded', function () {
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
    const fixedDay = document.getElementById("settings-date-select").value
    updateMoneyGotFunc(total, fixedDay)
  })

  document.getElementById("settings-date-select").addEventListener("change", function () {
    const total = Number(document.getElementById('settings-salary').value)
    const fixedDay = Number(this.value)
    updateMoneyGotFunc(total, fixedDay)
    document.getElementById('days-left-number').innerHTML = `${daysOneMonth - daysPassed(fixedDay)}`
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