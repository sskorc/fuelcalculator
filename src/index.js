function calculateRaceLaps(raceTime, lapTime) {
    return Math.ceil(raceTime / lapTime);
}

function calculateFuelConsumptionPerLap(fuel, laps) {
    return fuel / laps;
}

function calculateFuelNeed(fuelConsumptionPerLap, laps) {
    return Math.ceil(fuelConsumptionPerLap * laps);
}

function manageRaceTime(raceTimeHours, raceTimeMinutes, lapTimeMinutes, lapTimeSeconds) {
    if (isNumber(raceTimeHours) && isNumber(raceTimeMinutes) && isNumber(lapTimeMinutes) && isNumber(lapTimeSeconds)) {
        raceTime = (Math.abs(Number(raceTimeHours)) * 60 + Math.abs(Number(raceTimeMinutes))) * 60;
        lapTime = Math.abs(Number(lapTimeMinutes)) * 60 + Math.abs(Number(lapTimeSeconds));

        raceLaps = calculateRaceLaps(raceTime, lapTime);
        printResult('raceTime', raceLaps);
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

        printResult('fuelConsumption', fuelConsumptionPerLap);
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

function isNumber(number) {
    return number !== '' && !isNaN(number);
}

function printResult(section, result) {
    let str = '';

    switch(section) {
        case 'raceTime':
            str = `Race will last ${result} laps`;
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

    if (values.isAdditionalLapsSelected) {
        manageAdditionalFuel('additionalLaps', true, values.additionalLaps);
    }

    if (values.isAdditionalLitersSelected) {
        manageAdditionalFuel('additionalLiters', true, values.additionalLiters);
    }

    if (values.isAdditionalPercentageSelected) {     
        manageAdditionalFuel('additionalPercentage', true, values.additionalPercentage/100);
    }

    if (raceLaps > 0 && fuelConsumptionPerLap > 0) {
        fuelNeed = calculateFuelNeed(fuelConsumptionPerLap, raceLaps) + additionalFuelNeed;
        printResult('final', fuelNeed)
    } else {
        clearResult('final');
    }
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



function calculate2(input, inputs) {
    if (input.id === "raceTimeHours" || input.id === "raceTimeMinutes" || input.id === "lapTimeMinutes" || input.id === "lapTimeSeconds") {
        const raceTimeHours = inputs.namedItem('raceTimeHours').value;
        const raceTimeMinutes = inputs.namedItem('raceTimeMinutes').value;
        const lapTimeMinutes = inputs.namedItem('lapTimeMinutes').value;
        const lapTimeSeconds = inputs.namedItem('lapTimeSeconds').value;

        manageRaceTime(raceTimeHours, raceTimeMinutes, lapTimeMinutes, lapTimeSeconds);
    } else if (input.id === "fuelConsumptionLiters" || input.id === "fuelConsumptionLaps") {
        const fuelConsumptionLiters = inputs.namedItem("fuelConsumptionLiters").value;
        const fuelConsumptionLaps = inputs.namedItem("fuelConsumptionLaps").value;

        manageFuelConsumption(fuelConsumptionLiters, fuelConsumptionLaps);
    } else if (["additionalLaps", "additionalLiters", "additionalPercentage"].includes(input.id)) {
        const isAdditionalFieldSelected = inputs.namedItem(input.id + "Selected").checked;
        manageAdditionalFuel(input.id, isAdditionalFieldSelected, input.value);
    } else if (["additionalLapsSelected", "additionalLitersSelected", "additionalPercentageSelected"].includes(input.id)) {
        const foo = input.id.replace("Selected", "");
        const additionalValue = inputs.namedItem(foo).value;
        manageAdditionalFuel(foo, input.checked, additionalValue);
    } else if (input.id === "nothingAdditionalSelected") {
        if (input.checked) {
            additionalFuelNeed = 0;
        }
    }

    if(additionalFuelNeed == 0 && input.id !== "nothingAdditionalSelected") {
        ["additionalLaps", "additionalLiters", "additionalPercentage"].forEach((item) => {
            if (inputs.namedItem(item + "Selected").checked) {
                manageAdditionalFuel(item, true, inputs.namedItem(item).value);
            }            
        });
    }

    if (raceLaps > 0 && fuelConsumptionPerLap > 0) {
        fuelNeed = calculateFuelNeed(fuelConsumptionPerLap, raceLaps) + additionalFuelNeed;
        printResult('final', fuelNeed)
    } else {
        clearResult('final');
    }
}

var raceTime = 0;
var lapTime = 0;
var raceLaps = 0;
var fuelConsumptionPerLap = 0;
var additionalFuelNeed = 0;
var fuelNeed = 0;

const url = new URL(document.URL);
const sh = url.searchParams.get("sh");
if(sh) {
    setInputValues(getInputValuesFromCSV(atob(sh)));
    calculate();
}

const inputs = document.getElementsByTagName("input");

console.log(inputs.namedItem('raceTimeHours'));

for (let input of inputs) {
    input.addEventListener("input", () => {
        calculate2(input, inputs);
    });

}

document.getElementById("shareButton").addEventListener("click", () => {
    const encodedString = btoa(getInputValues().toCSV());
    console.log(location.protocol + '//' + location.host + location.pathname + '?sh=' + encodedString);
});
