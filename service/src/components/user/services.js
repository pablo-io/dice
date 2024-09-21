const getNewUserInitPoints = (telegramId) => {
    const mainBonus = maxConsecutiveSymbolsPrize(telegramId.toString())
    const extraBonus = combinationPrize(telegramId.toString())
    const extraBonusAmount = extraBonus.reduce((acc, item) => acc += item.points, 0)

    return {
        totalPoints: mainBonus.points + extraBonusAmount,
        mainBonus,
        extraBonus
    }
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
            return {points: 700, title: "Base Reward", description: "No Match", example: "(e.g., 12345678)"}
        case 2:
            return {points: 1000, title: "Double Match", description: "2 matching digits", example: "(e.g., 11234567)"}
        case 3:
            return {points: 5000, title: "Triple Match", description: "3 matching digits", example: "(e.g., 11123456)"}
        case 4:
            return {points: 10000, title: "Quad Match", description: "4 matching digits", example: "(e.g., 11112345)"}
        case 5:
            return {points: 20000, title: "Penta Match", description: "5 matching digits", example: "(e.g., 11111234)"}
        case 6:
            return {points: 40000, title: "Hexa Match", description: "6 matching digits", example: "(e.g., 11111123)"}
        case 7:
            return {points: 70000, title: "Hepta Match", description: "7 matching digits", example: "(e.g., 11111112)"}
        case 8:
            return {points: 100000, title: "Octa Match", description: "8 matching digits", example: "(e.g., 11111111)"}
    }

}

function combinationPrize(telegramIdString) {
    const result = [
        {
            points: 0,
            title: "Sequence Bonus",
            example: "(e.g., 1234)"
        },
        {
            points: 0,
            title: "Palindrome Bonus",
            example: "(e.g., 1221)"
        },
        {
            points: 0,
            title: "Alternating Pattern Bonus",
            example: "(e.g., 1212)"
        },
        {
            points: 0,
            title: "Pair Match Bonus",
            example: "(e.g., 1122)"
        }
    ]
    const orderRegexp = /(?:0123|1234|2345|3456|4567|5678|6789)/g;
    const mirrorRegexp = /(\d)(\d)(?!\1)\2\1/g;
    const alternatingRegexp = /(\d)(\d)\1(?!\1)\2/g;
    const pairMatchRegexp = /(\d)\1(\d)(?!\1)\2/g;


    if (orderRegexp.test(telegramIdString)) {
        result[0].points += 9000
    }
    if (mirrorRegexp.test(telegramIdString)) {
        result[1].points += 4000
    }
    if (alternatingRegexp.test(telegramIdString)) {
        result[2].points += 6000
    }
    if (pairMatchRegexp.test(telegramIdString)) {
        result[3].points += 7000
    }

    return result
}

module.exports = {
    getNewUserInitPoints
}
