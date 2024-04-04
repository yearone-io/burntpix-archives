import Decimal from "decimal.js-light";

export const divideBigIntTokenBalance = (
  balance: bigint,
  decimals: number,
): string => {
  const divisor = BigInt(10) ** BigInt(decimals);
  const quotient = balance / divisor;
  const remainder = balance % divisor;
  let result = quotient.toString();
  if (remainder > 0) {
    let remainderStr = remainder.toString();
    while (remainderStr.length < decimals) {
      remainderStr = "0" + remainderStr;
    }
    result += "." + remainderStr;
  }
  return conciseLongNumber(Number(result));
};

const getFeesRoundingDecimals = (value: number) => {
  if (value < 0.01 && value >= 0.0001) {
    return 4;
  } else if (value < 0.0001 && value >= 0.000001) {
    return 6;
  } else if (value < 0.000001 && value >= 0.00000001) {
    return 8;
  } else if (value < 0.000001 && value >= 0.00000001) {
    return 10;
  } else if (value < 0.00000001 && value >= 0.0000000001) {
    return 12;
  } else if (value < 0.0000000001 && value >= 0.000000000001) {
    return 14;
  } else if (value < 0.000000000001 && value >= 0.00000000000001) {
    return 16;
  } else if (value < 0.00000000000001 && value >= 0.0000000000000001) {
    return 18;
  }
  return 2;
};

const conciseLongNumber = (num: number) => {
  if (isNaN(num) || !Number.isFinite(num)) {
    return "";
  }
  Decimal.config({ toExpNeg: -5 });
  const decimalNum = new Decimal(num);
  const stringNum = decimalNum.toString();
  const needsSubscripting = stringNum.includes("e-") && num < 1;
  // return with old display logic if number is not in need of new format
  if (!needsSubscripting) return num.toFixed(getFeesRoundingDecimals(num) + 2);
  // else impose concise subscript format
  let stringNumSplit = stringNum.split("e-");
  let subScriptValue = stringNumSplit[1];
  // strip e- and just collect number without excess 0's
  let newNumbers = Number.parseFloat(stringNumSplit[0]) / 10;
  // add one 0 back, followed by subscript representation for other 0's
  let subscriptResult = newNumbers
    .toFixed(4) // round 4 significant numbers
    .replace(
      ".",
      ".0" + String.fromCharCode(8320 + Number.parseInt(subScriptValue) - 1), // -1 because subscriptValue overestimates by 1
    );
  return subscriptResult;
};
