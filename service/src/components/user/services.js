const getNewUserInitPoints = (user) => {
    const mainPointsAmount = maxConsecutiveSymbolsPrize(user.telegramId.toString())
    const extraPointsAmount = combinationPrize(user.telegramId.toString())

    return mainPointsAmount + extraPointsAmount;
}


function maxConsecutiveSymbolsPrize(telegramIdString) {
    let maxCount = 0;
    let currentCount = 1;

    for (let i = 1; i < telegramIdString.length; i++) {
        if (telegramIdString[i] === telegramIdString[i - 1]) {
            currentCount++;
        } else {
            if (currentCount > maxCount) {
                maxCount = currentCount;
            }
            currentCount = 1;
        }
    }

    // Check the last sequence
    if (currentCount > maxCount) {
        maxCount = currentCount;
    }

    switch (maxCount) {
        case 0 || 1:
            return 700
        case 2:
            return 1000
        case 3:
            return 5000
        case 4:
            return 10000
        case 5:
            return 20000
        case 6:
            return 40000
        case 7:
            return 70000
        case 8:
            return 100000
    }

}
function combinationPrize(telegramIdString) {
   let result = 0
    const orderRegexp = /(?:0123|1234|2345|3456|4567|5678|6789)/g;
    const mirrorRegexp = /(\d)(\d)\2\1/g;
    const alternatingRegexp = /(\d)\d\1\d/;
    const pairMatchRegexp = /(\d)\1(\d)\2/;


    if (orderRegexp.test(telegramIdString)) result += 5000
    if (mirrorRegexp.test(telegramIdString)) result += 4000
    if (alternatingRegexp.test(telegramIdString)) result += 6000
    if (pairMatchRegexp.test(telegramIdString)) result += 7000

    return result
}

module.exports = {
    getNewUserInitPoints
}
