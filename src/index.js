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

document.getElementById("shareButton").addEventListener("click", () => {
    const encodedString = btoa(getInputValues().toCSV());
    console.log(location.protocol + '//' + location.host + location.pathname + '?sh=' + encodedString);
});
