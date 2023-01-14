const refs = {
    form: document.querySelector('form'),
    // date: document.querySelector('input[name="date"]'),
    // time: document.querySelector('input[name="time"]'),
    highPressure: document.querySelector('input[name="highPressure"]'),
    bottomPressure: document.querySelector('input[name="bottomPressure"]'),
    pulse: document.querySelector('input[name="pulse"]'),
    weight: document.querySelector('input[name="weight"]'),
    comment: document.querySelector('input[name="comment"]'),
    submitBtn: document.querySelector('form > button[type="submit"]'),
}
const { form, date, time, highPressure,bottomPressure,pulse, weight, comment, submitBtn,} = refs;
const LOCAL_STORAGE_DATA_KEY = 'formData-key';

initPage();

function onFormSubmit(e) {
    e.preventDefault();
    
    // if (highPressureRef.value === '' && bottomPressureRef.value === '' && pulseRef.value === '' && weight.value === '' && comment.value === '') {
    //     alert('Поля не должны быть пустыми!')
    //     return;
    // }

    let formData = new FormData(e.currentTarget)
    const { name, value } = e.target;
    formData[name] = value;
    let formDataValues = Object.fromEntries(formData.entries())

    const currentDate = new Date();
    const date = currentDate.toLocaleString().slice(0, 10);
    const currentTime = currentDate.toLocaleString().slice(11, 17);
    formDataValues.time = currentTime;
    formDataValues.date = date;
    
    let stringifyFormData = JSON.stringify(formDataValues)
    try {

        const dataLocalStorage = getDataFromStorage();
        dataLocalStorage.push(JSON.parse(stringifyFormData));
        localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(dataLocalStorage))

    } catch (error) {
        console.log(error);
    }
    const saveData = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
    let parseData = JSON.parse(saveData)
    const table = document.querySelector('tbody');

    addMarkup(table, renderTable(formDataValues))

    const highPressureRef = document.querySelectorAll('.highPressure');
    const bottomPressureRef = document.querySelectorAll('.bottomPressure');
    const pulseRef = document.querySelectorAll('.pulse');

    validatePressure(highPressureRef)
    validatePressure(bottomPressureRef)
    validatePulse(pulseRef)
    form.reset()

}

function renderTable(data) {
    if (!data) return
    console.log(data);

    const { date, time, highPressure, bottomPressure, pulse, weight, comment, } = data;

    const markup = `<tr>
          <td>${date}</td>
          <td>${time}</td>
          <td class="highPressure">${highPressure}</td>
          <td class="bottomPressure">${bottomPressure}</td>
          <td class="pulse">${pulse}</td>
          <td>${weight}</td>
          <td class="comment">${comment}</td>
        </tr>`
    
    return markup;
}
function addMarkup (element, markup) {
    element.insertAdjacentHTML('afterend', markup)
}

function getDataFromStorage() {
  const data = localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
  return data ? JSON.parse(data) : [];
}
function saveData(data) {
    const dataLocalStorage = getDataFromStorage();
    // console.log(data);
    dataLocalStorage.push(data);
    localStorage.setItem(LOCAL_STORAGE_DATA_KEY, dataLocalStorage)
}

function initPage() {
    const data = getDataFromStorage();

    data.forEach((element,) => {

        const markup = renderTable(element)
        const table = document.querySelector('tbody');
        addMarkup(table, markup)
    })
    
    const highPressureRef = document.querySelectorAll('.highPressure');
    const bottomPressureRef = document.querySelectorAll('.bottomPressure');
    const pulseRef = document.querySelectorAll('.pulse');

    validatePressure(highPressureRef)
    validatePressure(bottomPressureRef)
    validatePulse(pulseRef)
}

function validatePressure(pressure) {
    
    pressure.forEach(item => {
        // console.log(item);
        if (Number(item.textContent) >= 130) {
            // console.log(item);
            item.classList.add('red')
        } else if (Number(item.textContent) < 130) {
            item.classList.add('green')
        }
    })
}
function validatePulse (pulse) {
    pulse.forEach(item => {
        if (Number(item.textContent) > 80) {
            item.classList.add('red')
        } else item.classList.add('green')
    })
}

form.addEventListener('submit', onFormSubmit);