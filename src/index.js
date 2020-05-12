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

function calculate() {
    const values = getInputValues();

    const raceTime = (values.raceTimeHours * 60 + values.raceTimeMinutes) * 60;
    const lapTime = values.lapTimeMinutes * 60 + values.lapTimeSeconds;

    const raceLaps = calculateRaceLaps(raceTime, lapTime);
    const fuelConsumptionPerLap = calculateFuelConsumptionPerLap(
        values.fuelConsumptionLiters,
        values.fuelConsumptionLaps
    );

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
    document.getElementById("results").innerHTML = `
    Race will take ${raceLaps} laps.<br/>
    Your fuel consumption is ${fuelConsumptionPerLap.toFixed(2)} liters per lap.<br/>
    You need to tank at least ${regularFuelNeed} liters.<br/>
    <span class="final-result">It's recommended that you tank:<br/><b>${fuelNeed} liters</b></span>
  `;
}

const url = new URL(document.URL);
const sh = url.searchParams.get("sh");
if(sh) {
    setInputValues(getInputValuesFromCSV(atob(sh)));
    calculate();
}

document.getElementById("calculateButton").addEventListener("click", calculate);

// document.getElementById("raceTimeMinutes").addEventListener("input", () => {
//     console.log('s');
// });

const inputs = document.getElementsByTagName("input");

console.log(inputs.namedItem('raceTimeHours'));

let raceTime = 0;
let lapTime = 0;
let raceLaps = 0;
let fuelConsumptionPerLap = 0;
let additionalFuelNeed = 0;
let fuelNeed = 0;

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

            if (isNumber(raceTimeHours) && isNumber(raceTimeMinutes) && isNumber(lapTimeMinutes) && isNumber(lapTimeSeconds)) {
                raceTime = (Math.abs(Number(raceTimeHours)) * 60 + Math.abs(Number(raceTimeMinutes))) * 60;
                lapTime = Math.abs(Number(lapTimeMinutes)) * 60 + Math.abs(Number(lapTimeSeconds));

                raceLaps = calculateRaceLaps(raceTime, lapTime);

                document.getElementById("raceTimeResults").innerHTML = `Race will last ${raceLaps} laps`;
            } else {
                raceTime = 0;
                lapTime = 0
                raceLaps = 0;

                document.getElementById("raceTimeResults").innerHTML = `&nbsp;`;
            }
        });
    } else if (input.id === "fuelConsumptionLiters" || input.id === "fuelConsumptionLaps") {
        input.addEventListener("input", () => {
            const fuelConsumptionLiters = document.getElementById("fuelConsumptionLiters").value;
            const fuelConsumptionLaps = document.getElementById("fuelConsumptionLaps").value;

            if (isNumber(fuelConsumptionLiters) && Number(fuelConsumptionLiters) !== 0 && isNumber(fuelConsumptionLaps) && Number(fuelConsumptionLaps) !== 0) {
                fuelConsumptionPerLap = calculateFuelConsumptionPerLap(Math.abs(Number(fuelConsumptionLiters)), Math.abs(Number(fuelConsumptionLaps)));

                document.getElementById("fuelConsumptionResults").innerHTML = `Your fuel consumption is ${fuelConsumptionPerLap.toFixed(2)} liters per lap.`;
            } else {
                fuelConsumptionPerLap = 0;

                document.getElementById("fuelConsumptionResults").innerHTML = `&nbsp;`;
            }
        });
    } else if (input.id === "additionalLapsSelected") {
        input.addEventListener("input", () => {
            if(input.checked && raceLaps > 0 && fuelConsumptionPerLap > 0) {
                const additionalLaps = document.getElementById("additionalLaps").value;
                if (isNumber(additionalLaps)) {
                    additionalFuelNeed = calculateFuelNeed(fuelConsumptionPerLap, Math.abs(Number(additionalLaps)));
                } else {
                    additionalFuelNeed = 0;
                }               
            } else {
                fuelNeed = 0;
            }
        });
    } else if (input.id === "additionalLaps") {
        input.addEventListener("input", () => {
            const isAdditionalLapsSelected = document.getElementById("additionalLapsSelected").checked;
            if (isAdditionalLapsSelected && raceLaps > 0 && fuelConsumptionPerLap > 0) {
                const additionalLaps = input.value;
                if (isNumber(additionalLaps)) {
                    additionalFuelNeed = calculateFuelNeed(fuelConsumptionPerLap, Math.abs(Number(additionalLaps)));
                } else {
                    additionalFuelNeed = 0;
                }
            } else {
                fuelNeed = 0;
            }
        });
    } else if (input.id === "additionalLitersSelected") {
        input.addEventListener("input", () => {
            if(input.checked && raceLaps > 0 && fuelConsumptionPerLap > 0) {
                const additionalLiters = document.getElementById("additionalLiters").value;
                if (isNumber(additionalLiters)) {
                    additionalFuelNeed = Math.abs(Number(additionalLiters));
                } else {
                    additionalFuelNeed = 0;
                }               
            } else {
                fuelNeed = 0;
            }
        });
    } else if (input.id === "additionalLiters") {
        input.addEventListener("input", () => {
            const isAdditionalLitersSelected = document.getElementById("additionalLitersSelected").checked;
            if (isAdditionalLitersSelected && raceLaps > 0 && fuelConsumptionPerLap > 0) {
                const additionalLiters = input.value;
                if (isNumber(additionalLiters)) {
                    additionalFuelNeed = Math.abs(Number(additionalLiters));
                } else {
                    additionalFuelNeed = 0;
                }
            } else {
                fuelNeed = 0;
            }
        });
    } else if (input.id === "additionalPercentageSelected") {
        input.addEventListener("input", () => {
            if(input.checked && raceLaps > 0 && fuelConsumptionPerLap > 0) {
                const additionalPercentage = document.getElementById("additionalPercentage").value;
                if (isNumber(additionalPercentage)) {
                    additionalFuelNeed = Math.ceil(Math.abs(Number(additionalPercentage))/100 * fuelNeed);
                } else {
                    additionalFuelNeed = 0;
                }               
            } else {
                fuelNeed = 0;
            }
        });
    } else if (input.id === "additionalPercentage") {
        input.addEventListener("input", () => {
            const isAdditionalPercentageSelected = document.getElementById("additionalPercentageSelected").checked;
            if (isAdditionalPercentageSelected && raceLaps > 0 && fuelConsumptionPerLap > 0) {
                const additionalPercentage = input.value;
                if (isNumber(additionalPercentage)) {
                    additionalFuelNeed = Math.ceil(Math.abs(Number(additionalPercentage))/100 * fuelNeed);
                    console.log(Math.abs(Number(additionalPercentage)));
                } else {
                    additionalFuelNeed = 0;
                }
            } else {
                fuelNeed = 0;
            }
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
            document.getElementById("results").innerHTML = `<span class="final-result">It's recommended that you tank:<br/><b>${fuelNeed} liters</b></span>`;
        } else {
            document.getElementById("results").innerHTML = `Results will appear here.`;
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
