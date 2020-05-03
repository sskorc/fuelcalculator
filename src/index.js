function calculateRaceLaps(raceTime, lapTime) {
    return Math.ceil(raceTime / lapTime);
}

function calculateFuelConsumptionPerLap(fuel, laps) {
    return fuel / laps;
}

function calculateFuelNeed(fuelConsumptionPerLap, laps) {
    return Math.ceil(fuelConsumptionPerLap * laps);
}

function addFuelPerLaps(fuel, laps, fuelConsumptionPerLap) {
    return fuel + calculateFuelNeed(fuelConsumptionPerLap, laps);
}

function addFuelAsLiters(fuel, additionalFuel) {
    return fuel + additionalFuel;
}

function addFuelAsPercentage(fuel, percentage) {
    return Math.ceil(fuel * (1 + percentage));
}

// const raceTime = 30 * 60;
// const lapTime = 1 * 60 + 50; //1m50s
// const raceLaps = calculateRaceLaps(raceTime, lapTime);
// const fuelConsumptionPerLap = calculateFuelConsumptionPerLap(30, 7.2);
// const regularFuelNeed = calculateFuelNeed(fuelConsumptionPerLap, raceLaps);
// const fuelNeed = addFuelPerLaps(regularFuelNeed, 1, fuelConsumptionPerLap);
// const fuelNeed = addFuelAsPercentage(regularFuelNeed, 0.1);
// const fuelNeed = addFuelAsLiters(regularFuelNeed, 5);

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
    <span class="final-result">It's recommended that you tank <b>${fuelNeed} liters</b>.</span>
  `;
}

document.getElementById("calculateButton").addEventListener("click", () => {
    const raceTimeMinutes = Number(
        document.getElementById("raceTimeMinutes").value
    );
    const raceTimeSeconds = Number(
        document.getElementById("raceTimeSeconds").value
    );
    const lapTimeMinutes = Number(
        document.getElementById("lapTimeMinutes").value
    );
    const lapTimeSeconds = Number(
        document.getElementById("lapTimeSeconds").value
    );
    const fuelConsumptionLiters = Number(
        document.getElementById("fuelConsumptionLiters").value
    );
    const fuelConsumptionLaps = Number(
        document.getElementById("fuelConsumptionLaps").value
    );

    const raceTime = raceTimeMinutes * 60 + raceTimeSeconds;
    const lapTime = lapTimeMinutes * 60 + lapTimeSeconds;

    console.log(raceTime);
    console.log(lapTime);

    const raceLaps = calculateRaceLaps(raceTime, lapTime);
    const fuelConsumptionPerLap = calculateFuelConsumptionPerLap(
        fuelConsumptionLiters,
        fuelConsumptionLaps
    );

    const regularFuelNeed = calculateFuelNeed(fuelConsumptionPerLap, raceLaps);

    let fuelNeed = regularFuelNeed;

    if (document.getElementById("additonalLapsSelected").checked) {
        const additionalLaps = Number(
            document.getElementById("additonalLaps").value
        );
        fuelNeed = addFuelPerLaps(regularFuelNeed, additionalLaps, fuelConsumptionPerLap);
    }

    if (document.getElementById("additonalLitersSelected").checked) {
        const additionalLiters = Number(
            document.getElementById("additonalLiters").value
        );
        fuelNeed = addFuelAsLiters(regularFuelNeed, additionalLiters);
    }

    if (document.getElementById("additonalPercentageSelected").checked) {
        const additionalPercentage = Number(
            document.getElementById("additionalPercentage").value
        )/100;        
        fuelNeed = addFuelAsPercentage(regularFuelNeed, additionalPercentage);
    }

    printResults(raceLaps, fuelConsumptionPerLap, regularFuelNeed, fuelNeed);
});
