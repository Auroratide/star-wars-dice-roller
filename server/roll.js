/**
 * @template T
 * @typedef {{ ability: T, proficiency: T, boost: T, difficulty: T, challenge: T, setback: T, force: T }} Dice
 * @property {T} data - The response data.
 */

/**
 * @typedef {{{ success: number, sideEffect: number, triumphs: number, despair: number, force: { light: number, dark: number } }}} Summary
 */

const Dice = {
	ability: ["✷", "☋", "✷☋", "✷✷", "☋", "✷", "☋☋", ""],
	proficiency: ["☋☋", "☋", "☋☋", "⦽", "✷", "✷☋", "✷", "✷☋", "✷✷", "✷☋", "✷✷", ""],
	boost: ["✷☋", "☋", "☋☋", "", "✷", ""],
	difficulty: ["⬣", "▼", "⬣▼", "⬣", "", "⬣⬣", "▼▼", "⬣"],
	challenge: ["⬣⬣", "⬣", "⬣⬣", "⬣", "⬣▼", "▼", "⬣▼", "▼", "▼▼", "⎊", "▼▼", ""],
	setback: ["▼", "▼", "⬣", "⬣", "", ""],
	force: ["⬤", "◯◯", "⬤", "◯◯", "⬤", "◯◯", "⬤", "◯", "⬤", "◯", "⬤", "⬤⬤"],
}

/**
 * @param {string[]} die 
 * @returns {string}
 */
function rollOne(die) {
	return die[Math.floor(Math.random() * die.length)]
}

/**
 * @param {Dice<string[]>} result 
 * @returns {Summary}
 */
function summarize(result) {
	const allSymbols = Object.values(result).flatMap((it) => it).join("").split("")
	const talliedSymbols = allSymbols.reduce((tally, sym) => ({
		...tally,
		[sym]: 1 + (tally[sym] ?? 0),
	}), 0)
	
	const get = (key) => talliedSymbols[key] ?? 0

	const netSuccessOrFailure = get("✷") + get("⦽") - get("▼") - get("⎊")
	const netPositiveOrNegative = get("☋") - get("⬣")

	return {
		success: netSuccessOrFailure,
		sideEffect: netPositiveOrNegative,
		triumphs: get("⦽"),
		despair: get("⎊"),
		force: {
			light: get("◯"),
			dark: get("⬤"),
		},
	}
}

/**
 * @param {Dice<number>} numberOfDice
 * @returns {{ dice: Dice<string[]>, summary: Summary }}
 */
export function roll(numberOfDice) {
	const result = {}

	Object.entries(Dice).map(([dieName, die]) => {
		const rolls = []

		for (let i = 0; i < numberOfDice[dieName]; ++i) {
			rolls.push(rollOne(die))
		}

		result[dieName] = rolls
	})

	const summary = summarize(result)

	return { dice: result, summary }
}
