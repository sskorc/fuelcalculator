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

    raceLaps.manage(values.raceTimeHours, values.raceTimeMinutes, values.lapTimeMinutes, values.lapTimeSeconds);
    fuelConsumption.manage(values.fuelConsumptionLiters, values.fuelConsumptionLaps);
    additionalFuel.getNumericFields().forEach((field) => {
        if (values[field + 'Selected']) { additionalFuel.manage(field, true, values[field]); }
    })

    fuelNeed.manage(raceLaps.result, fuelConsumption.result, additionalFuel.result);
}

function observeField(input, inputs) {
    if (raceLaps.getFields().includes(input.id)) {
        values = raceLaps.getFields().map((fieldName) => {
            return inputs.namedItem(fieldName).value;
        });
        raceLaps.manage(...values);
    } else if (fuelConsumption.getFields().includes(input.id)) {
        values = fuelConsumption.getFields().map((fieldName) => {
            return inputs.namedItem(fieldName).value;
        });
        fuelConsumption.manage(...values);
    } else if (additionalFuel.getNumericFields().includes(input.id)) {
        additionalFuel.manage(input.id, inputs.namedItem(input.id + "Selected").checked, input.value);
    } else if (additionalFuel.getBooleanFields().includes(input.id)) {
        const additionalFuelField = input.id.replace("Selected", "");
        const additionalValue = inputs.namedItem(additionalFuelField).value;
        additionalFuel.manage(additionalFuelField, input.checked, additionalValue);
    } else if (input.id === "nothingAdditionalSelected") {
        if (input.checked) {
            additionalFuel.clear();
        }
    }

    if(additionalFuel.result == 0 && input.id !== "nothingAdditionalSelected") {
        additionalFuel.getNumericFields().forEach((item) => {
            if (inputs.namedItem(item + "Selected").checked) {
                additionalFuel.manage(item, true, inputs.namedItem(item).value);
            }            
        });
    }

    fuelNeed.manage(raceLaps.result, fuelConsumption.result, additionalFuel.result);
}

function getInputValues() {
    const numberValues = numericFields.reduce((acc, cur) => {
        acc[cur] = Number(document.getElementById(cur).value);
        return acc;
    }, {});

    const booleanValues = booleanFields.reduce((acc, cur) => {
        acc[cur] = document.getElementById(cur).checked;
        return acc;
    }, {});

    return Object.assign(numberValues, booleanValues);
}

function exportValuesToCSV(values) {
    return Object.values(values).reduce(function(acc, cur, i) {
        return acc + (i !== 0 ? ',' : '') + cur;
      }, '');
}

function importValuesFromCSV(csv) {
    const values = csv.split(',');

    numericFields.forEach((fieldName, i) => {
        document.getElementById(fieldName).value = Number(values[i]);
    });

    booleanFields.forEach((fieldName, i) => {
        document.getElementById(fieldName).checked = (values[i + 9] === 'true');
    });
}

const raceLaps = {
    result: 0,
    getFields() { return ["raceTimeHours", "raceTimeMinutes", "lapTimeMinutes", "lapTimeSeconds"] },
    manage(raceTimeHours, raceTimeMinutes, lapTimeMinutes, lapTimeSeconds) {
        if (isNumber(raceTimeHours) && isNumber(raceTimeMinutes) && isNumber(lapTimeMinutes) && isNumber(lapTimeSeconds)) {
            raceTime = (Math.abs(Number(raceTimeHours)) * 60 + Math.abs(Number(raceTimeMinutes))) * 60;
            lapTime = Math.abs(Number(lapTimeMinutes)) * 60 + Math.abs(Number(lapTimeSeconds));
    
            this.result = this.calculate(raceTime, lapTime);
            printResult('raceTime', this.result);
        } else {
            this.result = 0;    
            clearResult('raceTime');
        }
    },
    calculate(raceTime, lapTime) {
        return Math.ceil(raceTime / lapTime)
    }
};

const fuelConsumption = {
    result: 0,
    getFields() { return ["fuelConsumptionLiters", "fuelConsumptionLaps"] },
    manage(fuelConsumptionLiters, fuelConsumptionLaps) {
        if (isNumber(fuelConsumptionLiters) && Number(fuelConsumptionLiters) !== 0 && isNumber(fuelConsumptionLaps) && Number(fuelConsumptionLaps) !== 0) {
            this.result = this.calculate(Math.abs(Number(fuelConsumptionLiters)), Math.abs(Number(fuelConsumptionLaps)));
    
            printResult('fuelConsumption', this.result);
        } else {
            this.result = 0;
    
            clearResult('fuelConsumption');
        }
    },
    calculate(fuel, laps) {
        return fuel / laps;
    }
}

const additionalFuel = {
    result: 0,
    getNumericFields() { return ["additionalLaps", "additionalLiters", "additionalPercentage"] },
    getBooleanFields() { return ["additionalLapsSelected", "additionalLitersSelected", "additionalPercentageSelected"] },
    manage(additionType, isSelected, additionalValue) {
        if(isSelected && raceLaps.result > 0 && fuelConsumption.result > 0) {                
            if (isNumber(additionalValue)) {
                switch(additionType) {
                    case 'additionalLaps':
                        this.result = fuelNeed.calculate(fuelConsumption.result, Math.abs(Number(additionalValue)));
                        break;
                    case 'additionalLiters':
                        this.result = Math.abs(Number(additionalValue));
                        break;
                    case 'additionalPercentage':
                        this.result = Math.ceil(Math.abs(Number(additionalValue))/100 * fuelNeed.result);
                        break;
                    default:
                        this.result = 0;    
                }            
            } else {
                this.result = 0;
            }               
        } else {
            fuelNeed.clear();
        }
    },
    clear() { this.result = 0 }
}

const fuelNeed = {
    result: 0,
    manage(raceLapsResult, fuelConsumptionResult, additionalFuelResult) {
        if (raceLapsResult > 0 && fuelConsumptionResult > 0) {
            this.result = this.calculate(fuelConsumptionResult, raceLapsResult);
            printResult('final', this.result + additionalFuelResult)
        } else {
            clearResult('final');
        }
    },
    calculate(fuelConsumptionPerLap, laps) {
        return Math.ceil(fuelConsumptionPerLap * laps);
    },
    clear() { this.result = 0; }
}

const numericFields = [].concat(raceLaps.getFields(), fuelConsumption.getFields(), additionalFuel.getNumericFields());
const booleanFields = additionalFuel.getBooleanFields();

const url = new URL(document.URL);
const importString = url.searchParams.get("sh");
if(importString) {
    importValuesFromCSV(atob(importString));
    calculate();
}

const inputs = document.getElementsByTagName("input");
for (let input of inputs) {
    input.addEventListener("input", () => {
        observeField(input, inputs);
    });
}

document.getElementById("shareButton").addEventListener("click", () => {
    const encodedString = btoa(exportValuesToCSV(getInputValues()));
    console.log(location.protocol + '//' + location.host + location.pathname + '?sh=' + encodedString);
});
