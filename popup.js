const daysOneMonth = 30
const fixedDay = 10
const decimalPlaces = 3
var total = 66666

document.addEventListener('DOMContentLoaded', function () {
  var start = moneyGot(total, fixedDay)
  var step = salaryPerSecond(total)
  var counter = step

  var daysLeft = document.getElementById('days-left-number');
  daysLeft.innerHTML = daysOneMonth - daysPassed(fixedDay)

  var intervalId = setInterval(() => {
    counter += step
    updateMoneyGot(start + counter)
  }, 1000)

  const settingsSalary = document.getElementById('settings-salary')
  console.log('adding value change listener')
  settingsSalary.addEventListener('input', function (event) {
    console.log('Input value changed:', event.target.value)
    clearInterval(intervalId)

    total = Number(event.target.value)
    start = moneyGot(total, fixedDay)
    step = salaryPerSecond(total)
    counter = step

    intervalId = setInterval(() => {
      counter += step
      updateMoneyGot(start + counter)
    }, 1000)
  })

  document.getElementById('settings-date').addEventListener('input', function (event) {
    const fixedDay = Number(event.target.value)
    console.log(`settings-date changed to ${daysOneMonth - daysPassed(fixedDay)}`)
    document.getElementById('days-left-number').innerHTML = `${daysOneMonth - daysPassed(fixedDay)}`
  })

});

function updateMoneyGot(latestMoneyGot) {
  var amount = document.getElementById('salary-got');
  amount.innerHTML = latestMoneyGot.toFixed(decimalPlaces)
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