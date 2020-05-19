function calculateRaceLaps(raceTime, lapTime) {
    return Math.ceil(raceTime / lapTime);
}

function calculateFuelConsumptionPerLap(fuel, laps) {
    return fuel / laps;
}

function calculateFuelNeed(fuelConsumptionPerLap, laps) {
    return Math.ceil(fuelConsumptionPerLap * laps);
}

function addFuelAsLiters(fuel, additionalFuel) {
    return fuel + additionalFuel;
}

function addFuelAsPercentage(fuel, percentage) {
    return Math.ceil(fuel * (1 + percentage));
}

function isNumber(number) {
    return number !== '' && !isNaN(number);
}

function printResult2(section, result) {
    let str = '';

    switch(section) {
        case 'raceTime':
            str = `Race will last ${result} laps LOL`;
            break;
        case 'fuelConsumption':
            str = `Your fuel consumption is ${result.toFixed(2)} liters per lap.`;
            break;
        case 'final':
            str = `<span class="final-result">It's recommended that you tank:<br/><b>${result} liters</b></span>`;
            break;
        default:

    }

    document.getElementById(`${section}Results`).innerHTML = str;
}

function clearResult(section) {
    document.getElementById(`${section}Results`).innerHTML = '&nbsp;';
}


function calculate() {
    const values = getInputValues();

    manageRaceTime(values.raceTimeHours, values.raceTimeMinutes, values.lapTimeMinutes, values.lapTimeSeconds);

    manageFuelConsumption(values.fuelConsumptionLiters, values.fuelConsumptionLaps);

    const regularFuelNeed = calculateFuelNeed(fuelConsumptionPerLap, raceLaps);

    let fuelNeed = regularFuelNeed;

    if (values.isAdditionalLapsSelected) {
        fuelNeed = calculateFuelNeed(fuelConsumptionPerLap, raceLaps + values.additionalLaps);
    }

    if (values.isAdditionalLitersSelected) {
        fuelNeed = addFuelAsLiters(regularFuelNeed, values.additionalLiters);
    }

    if (values.isAdditionalPercentageSelected) {     
        fuelNeed = addFuelAsPercentage(regularFuelNeed, values.additionalPercentage/100);
    }

    printResults(raceLaps, fuelConsumptionPerLap, regularFuelNeed, fuelNeed);
}

function getInputValues() {
    return {
        raceTimeHours: Number(document.getElementById("raceTimeHours").value),
        raceTimeMinutes: Number(document.getElementById("raceTimeMinutes").value),
        lapTimeMinutes: Number(document.getElementById("lapTimeMinutes").value),
        lapTimeSeconds: Number(document.getElementById("lapTimeSeconds").value),
        fuelConsumptionLiters: Number(document.getElementById("fuelConsumptionLiters").value),
        fuelConsumptionLaps: Number(document.getElementById("fuelConsumptionLaps").value),
        additionalLaps: Number(document.getElementById("additionalLaps").value),
        additionalLiters: Number(document.getElementById("additionalLiters").value),
        additionalPercentage: Number(document.getElementById("additionalPercentage").value),
        isAdditionalLapsSelected: document.getElementById("additionalLapsSelected").checked,
        isAdditionalLitersSelected: document.getElementById("additionalLitersSelected").checked,
        isAdditionalPercentageSelected: document.getElementById("additionalPercentageSelected").checked,
        toCSV: function () {
            return `${this.raceTimeHours},${this.raceTimeMinutes},${this.lapTimeMinutes},${this.lapTimeSeconds},${this.fuelConsumptionLiters},${this.fuelConsumptionLaps},${this.additionalLaps},${this.additionalLiters},${this.additionalPercentage},${this.isAdditionalLapsSelected},${this.isAdditionalLitersSelected},${this.isAdditionalPercentageSelected}`;
        }
    };
}

function getInputValuesFromCSV(csv) {
    const values = csv.split(',');

    return {
        raceTimeHours: Number(values[0]),
        raceTimeMinutes: Number(values[1]),
        lapTimeMinutes: Number(values[2]),
        lapTimeSeconds: Number(values[3]),
        fuelConsumptionLiters: Number(values[4]),
        fuelConsumptionLaps: Number(values[5]),
        additionalLaps: Number(values[6]),
        additionalLiters: Number(values[7]),
        additionalPercentage: Number(values[8]),
        isAdditionalLapsSelected: (values[9] === 'true'),
        isAdditionalLitersSelected: (values[10] === 'true'),
        isAdditionalPercentageSelected: (values[11] === 'true'),
    }
}

function setInputValues(values) {
    document.getElementById("raceTimeHours").value = values.raceTimeHours;
    document.getElementById("raceTimeMinutes").value = values.raceTimeMinutes;
    document.getElementById("lapTimeMinutes").value = values.lapTimeMinutes;
    document.getElementById("lapTimeSeconds").value = values.lapTimeSeconds;
    document.getElementById("fuelConsumptionLiters").value = values.fuelConsumptionLiters;
    document.getElementById("fuelConsumptionLaps").value = values.fuelConsumptionLaps;
    document.getElementById("additionalLaps").value = values.additionalLaps;
    document.getElementById("additionalLiters").value = values.additionalLiters;
    document.getElementById("additionalPercentage").value = values.additionalPercentage;
    document.getElementById("additionalLapsSelected").checked = values.isAdditionalLapsSelected;
    document.getElementById("additionalLitersSelected").checked = values.isAdditionalLitersSelected;
    document.getElementById("additionalPercentageSelected").checked = values.isAdditionalPercentageSelected;
}

function printResults(
    raceLaps,
    fuelConsumptionPerLap,
    regularFuelNeed,
    fuelNeed
) {
    document.getElementById("finalResults").innerHTML = `
    Race will take ${raceLaps} laps.<br/>
    Your fuel consumption is ${fuelConsumptionPerLap.toFixed(2)} liters per lap.<br/>
    You need to tank at least ${regularFuelNeed} liters.<br/>
    <span class="final-result">It's recommended that you tank:<br/><b>${fuelNeed} liters</b></span>
  `;
}

function manageRaceTime(raceTimeHours, raceTimeMinutes, lapTimeMinutes, lapTimeSeconds) {
    if (isNumber(raceTimeHours) && isNumber(raceTimeMinutes) && isNumber(lapTimeMinutes) && isNumber(lapTimeSeconds)) {
        raceTime = (Math.abs(Number(raceTimeHours)) * 60 + Math.abs(Number(raceTimeMinutes))) * 60;
        lapTime = Math.abs(Number(lapTimeMinutes)) * 60 + Math.abs(Number(lapTimeSeconds));

        raceLaps = calculateRaceLaps(raceTime, lapTime);

        printResult2('raceTime', raceLaps);
    } else {
        raceTime = 0;
        lapTime = 0
        raceLaps = 0;

        clearResult('raceTime');
    }
}

function manageFuelConsumption(fuelConsumptionLiters, fuelConsumptionLaps) {
    if (isNumber(fuelConsumptionLiters) && Number(fuelConsumptionLiters) !== 0 && isNumber(fuelConsumptionLaps) && Number(fuelConsumptionLaps) !== 0) {
        fuelConsumptionPerLap = calculateFuelConsumptionPerLap(Math.abs(Number(fuelConsumptionLiters)), Math.abs(Number(fuelConsumptionLaps)));

        printResult2('fuelConsumption', fuelConsumptionPerLap);
    } else {
        fuelConsumptionPerLap = 0;

        clearResult('fuelConsumption');
    }
}

function manageAdditionalFuel(additionType, isSelected, additionalValue) {
    if(isSelected && raceLaps > 0 && fuelConsumptionPerLap > 0) {                
        if (isNumber(additionalValue)) {
            switch(additionType) {
                case 'additionalLaps':
                    additionalFuelNeed = calculateFuelNeed(fuelConsumptionPerLap, Math.abs(Number(additionalValue)));
                    break;
                case 'additionalLiters':
                    additionalFuelNeed = Math.abs(Number(additionalValue));
                    break;
                case 'additionalPercentage':
                    additionalFuelNeed = Math.ceil(Math.abs(Number(additionalValue))/100 * fuelNeed);
                    break;
                default:
                    additionalFuelNeed = 0;    
            }            
        } else {
            additionalFuelNeed = 0;
        }               
    } else {
        fuelNeed = 0;
    }
}

const url = new URL(document.URL);
const sh = url.searchParams.get("sh");
if(sh) {
    setInputValues(getInputValuesFromCSV(atob(sh)));
    calculate();
}

//document.getElementById("calculateButton").addEventListener("click", calculate);

// document.getElementById("raceTimeMinutes").addEventListener("input", () => {
//     console.log('s');
// });

const inputs = document.getElementsByTagName("input");

console.log(inputs.namedItem('raceTimeHours'));

var raceTime = 0;
var lapTime = 0;
var raceLaps = 0;
var fuelConsumptionPerLap = 0;
var additionalFuelNeed = 0;
var fuelNeed = 0;

for (let input of inputs) {
    // console.log(input.id);
    if (input.id === "raceTimeHours" || input.id === "raceTimeMinutes" || input.id === "lapTimeMinutes" || input.id === "lapTimeSeconds") {
        input.addEventListener("input", () => {
            // input.value = input.value.replace(/[^0-9.]/g, ''); 
            // input.value = input.value.replace(/(\..*)\./g, '$1');

            const raceTimeHours = inputs.namedItem('raceTimeHours').value;
            const raceTimeMinutes = inputs.namedItem('raceTimeMinutes').value;
            const lapTimeMinutes = inputs.namedItem('lapTimeMinutes').value;
            const lapTimeSeconds = inputs.namedItem('lapTimeSeconds').value;

            manageRaceTime(raceTimeHours, raceTimeMinutes, lapTimeMinutes, lapTimeSeconds);
        });
    } else if (input.id === "fuelConsumptionLiters" || input.id === "fuelConsumptionLaps") {
        input.addEventListener("input", () => {
            const fuelConsumptionLiters = document.getElementById("fuelConsumptionLiters").value;
            const fuelConsumptionLaps = document.getElementById("fuelConsumptionLaps").value;

            manageFuelConsumption(fuelConsumptionLiters, fuelConsumptionLaps);
        });
    } else if (input.id === "additionalLapsSelected") {
        input.addEventListener("input", () => {
            const additionalLaps = document.getElementById("additionalLaps").value;
            manageAdditionalFuel('additionalLaps', input.checked, additionalLaps);
        });
    } else if (input.id === "additionalLaps") {
        input.addEventListener("input", () => {
            const isAdditionalLapsSelected = document.getElementById("additionalLapsSelected").checked;
            manageAdditionalFuel('additionalLaps', isAdditionalLapsSelected, input.value);
        });
    } else if (input.id === "additionalLitersSelected") {
        input.addEventListener("input", () => {
            const additionalLiters = document.getElementById("additionalLiters").value;
            manageAdditionalFuel('additionalLiters', input.checked, additionalLiters);
        });
    } else if (input.id === "additionalLiters") {
        input.addEventListener("input", () => {
            const isAdditionalLitersSelected = document.getElementById("additionalLitersSelected").checked;
            manageAdditionalFuel('additionalLiters', isAdditionalLitersSelected, input.value);
        });
    } else if (input.id === "additionalPercentageSelected") {
        input.addEventListener("input", () => {
            const additionalPercentage = document.getElementById("additionalPercentage").value;
            manageAdditionalFuel('additionalPercentage', input.checked, additionalPercentage);
        });
    } else if (input.id === "additionalPercentage") {
        input.addEventListener("input", () => {
            const isAdditionalPercentageSelected = document.getElementById("additionalPercentageSelected").checked;
            manageAdditionalFuel('additionalPercentage', isAdditionalPercentageSelected, input.value);
        });
    } else if (input.id === "nothingAdditionalSelected") {
        input.addEventListener("input", () => {
            if (input.checked) {
                additionalFuelNeed = 0;
            }
        });
    }
    
    input.addEventListener("input", () => {
        if (raceLaps > 0 && fuelConsumptionPerLap > 0) {
            fuelNeed = calculateFuelNeed(fuelConsumptionPerLap, raceLaps) + additionalFuelNeed;
            printResult2('final', fuelNeed)
        } else {
            clearResult('final');
        }
    });

}

// console.log(inputs);
// inputs.forEach(function(input) {
//     input.addEventListener("input", calculate);
// });

document.getElementById("shareButton").addEventListener("click", () => {
    const encodedString = btoa(getInputValues().toCSV());
    console.log(location.protocol + '//' + location.host + location.pathname + '?sh=' + encodedString);
});
