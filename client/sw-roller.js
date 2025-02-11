import { SwIconElement } from "./sw-icon.js"

const EMPTY_RESULT = {
	dice: {
		ability: [],
		proficiency: [],
		boost: [],
		difficulty: [],
		challenge: [],
		setback: [],
		force: [],
	},
	summary: {
		success: 0,
		sideEffect: 0,
		triumphs: 0,
		despair: 0,
		force: {
			light: 0,
			dark: 0,
		},
	},
}

export class SwRollerElement extends HTMLElement {
	static html = `
		<form method="post" action="roll">
			<input id="forid" type="hidden" name="forid" />
			<div class="dice-grid">
				<div class="die-type d8 green">
					<label for="ability">Ability</label>
					<input id="ability" name="ability" type="number" min="0" max="20" value="0" step="1" />
					<ul id="ability-rolls"></ul>
				</div>
				<div class="die-type d12 yellow">
					<label for="proficiency">Proficiency</label>
					<input id="proficiency" name="proficiency" type="number" min="0" max="20" value="0" step="1" />
					<ul id="proficiency-rolls"></ul>
				</div>
				<div class="die-type d6 blue">
					<label for="boost">Boost</label>
					<input id="boost" name="boost" type="number" min="0" max="20" value="0" step="1" />
					<ul id="boost-rolls"></ul>
				</div>
				<div class="die-type d8 purple">
					<label for="difficulty">Difficulty</label>
					<input id="difficulty" name="difficulty" type="number" min="0" max="20" value="0" step="1" />
					<ul id="difficulty-rolls"></ul>
				</div>
				<div class="die-type d12 red">
					<label for="challenge">Challenge</label>
					<input id="challenge" name="challenge" type="number" min="0" max="20" value="0" step="1" />
					<ul id="challenge-rolls"></ul>
				</div>
				<div class="die-type d6 black">
					<label for="setback">Setback</label>
					<input id="setback" name="setback" type="number" min="0" max="20" value="0" step="1" />
					<ul id="setback-rolls"></ul>
				</div>
				<div class="die-type d0 white">
					<label for="force">Force</label>
					<input id="force" name="force" type="number" min="0" max="20" value="0" step="1" />
					<ul id="force-rolls"></ul>
				</div>
			</div>

			<div class="actions">
				<button class="danger" type="reset">Reset</button>
				<button type="submit">Roll!</button>
			</div>

			<div class="summary">
				<label for="outcome">Outcome:</label>
				<output id="outcome">Failure (0)</output>
				<label for="side-effects">Side Effects:</label>
				<output id="side-effects">None (0)</output>
				<label for="critical">Critical:</label>
				<output id="critical"></output>
				<label for="force-result">Force:</label>
				<output id="force-result">0<sw-icon name="light"></sw-icon> 0<sw-icon name="dark"></sw-icon></output>
			</div>
		</form>
	`

	static css = `
		:host {
			display: block;
			inline-size: 100%;
		}

		form {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 1.5em;
			inline-size: 100%;
		}

		.dice-grid {
			display: grid;
			grid-template-columns: auto auto 1fr;
			row-gap: 0.75em;
			inline-size: 100%;
		}

		.die-type {
			font-size: 1.25em;
			display: grid;
			grid-column: span 3;
			grid-template-columns: subgrid;
			gap: 0.5em;
		} .die-type > :nth-child(1) {
			place-self: center end;
		} .die-type > :nth-child(2) {
			place-self: center center;
		} .die-type > :nth-child(3) {
			place-self: center start;
		}

		.die-type ul {
			font-size: 0.875em;
			list-style: none;
			padding: 0;
			margin: 0;
			display: flex;
			flex-direction: row;
			flex-wrap: wrap;
			gap: 0.125em;
		}

		.die-type.green {
			--color: var(--green);
		} .die-type.yellow {
			--color: var(--yellow);
		} .die-type.blue {
			--color: var(--blue);
		} .die-type.purple {
			--color: var(--purple);
		} .die-type.red {
			--color: var(--red);
		} .die-type.black {
			--color: var(--black);
		} .die-type.white {
			--color: var(--white);
		}

		.die-type li {
			position: relative;
			inline-size: 1.5em;
			block-size: 1.5em;
			display: flex;
			align-items: center;
			justify-content: center;
			line-height: 1;
		} .die-type li::before {
			content: "";
			position: absolute;
			inline-size: 1.45em;
			block-size: 1.45em;
			background: oklch(var(--color));
			inset: 50%;
			transform: translate(-50%, -50%);
			z-index: -1;
		} .die-type li sw-icon {
			color: var(--dark);
			font-size: 0.875em;
		} .die-type li.double sw-icon {
			font-size: 0.6em;
		}

		.d8 li::before {
			clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
		} .d6 li::before {
			clip-path: inset(12.5%);
		} .d12 li::before {
			clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
		} .d0 li::before {
			clip-path: circle(45% at 50% 50%);
		}

		.actions {
			display: flex;
			gap: 1em;
		}

		.summary {
			display: grid;
			grid-template-columns: auto 1fr;
			gap: 0.25em 0.5em;
		} .summary label {
			font-weight: bold;
			place-self: center end;
		} .summary output {
			place-self: center start;
			display: flex;
			align-items: center;
		}

		input, button {
			font-family: inherit;
			font-size: 1em;
			text-align: center;
			border: none;
		}

		input {
			border-block-end: 0.125em solid var(--light);
			color: var(--light);
			background: oklch(var(--color) / 0.25);
			padding-inline: 0.25em;
		}

		input[type=number]::-webkit-inner-spin-button, 
		input[type=number]::-webkit-outer-spin-button {  
			-webkit-appearance: none;
			margin: 0;
		}

		button {
			--color: var(--highlight);
			background: none;
			color: var(--color);
			border: 0.125em solid var(--color);
			cursor: pointer;
			padding: 0.25em 1em;
			letter-spacing: 0.1ch;
		} button:hover, button:focus {
			background: var(--color);
			color: var(--dark);
		} button:active {
			border-color: var(--dark);
		}

		button.danger {
			--color: oklch(var(--red));
		}
	`

	constructor() {
		super()

		this.#createRoot()
	}

	roll() {
		const form = this.shadowRoot?.querySelector("form")
		const formdata = new FormData(form)

		fetch("/roll", {
			method: "POST",
			body: formdata,
		})
	}

	showResult(result) {
		console.log(result)
		this.#showRolls(result.dice)
		this.#showSummary(result.summary)
	}

	changeField(field, value) {
		this.shadowRoot.querySelector(`input[name="${field}"]`).value = value
	}

	#showRolls(rolls) {
		Object.entries(rolls).forEach(([dieType, results]) => {
			const ul = this.shadowRoot.querySelector(`#${dieType}-rolls`)
			ul.innerHTML = ""

			results.forEach((result) => {
				const li = document.createElement("li")
				if (result.length > 1) {
					li.classList.add("double")
				}

				[...result].forEach((symbol) => {
					li.appendChild(SwIconElement.fromSymbol(symbol))
				})

				ul.appendChild(li)
			})
		})
	}

	#showSummary(summary) {
		const outcome = this.shadowRoot.querySelector("#outcome")
		const sideEffects = this.shadowRoot.querySelector("#side-effects")
		const critical = this.shadowRoot.querySelector("#critical")
		const forceResult = this.shadowRoot.querySelector("#force-result")

		outcome.innerHTML = (summary.success > 0 ? "Success" : "Failure") + " " + `(${summary.success})`
		sideEffects.innerHTML = (summary.sideEffect === 0 ? "None" : summary.sideEffect > 0 ? "Positive" : "Negative") + " " + `(${summary.sideEffect})`
		critical.innerHTML = (summary.triumphs > 0 ? `${summary.triumphs}<sw-icon name="triumph"></sw-icon>` : "") + " " + (summary.despair > 0 ? `${summary.despair}<sw-icon name="despair"></sw-icon>` : "")
		forceResult.innerHTML = `${summary.force.light}<sw-icon name="light"></sw-icon> ${summary.force.dark}<sw-icon name="dark"></sw-icon>`
	}

	connectedCallback() {
		const foridField = this.shadowRoot?.querySelector("#forid")
		const form = this.shadowRoot?.querySelector("form")
		const inputs = this.shadowRoot?.querySelectorAll("input")

		if (foridField != null) {
			foridField.value = this.id
		}

		form?.addEventListener("submit", (e) => {
			e.preventDefault()

			this.roll()
		})

		form?.addEventListener("reset", () => {
			this.showResult(EMPTY_RESULT)
		})

		inputs?.forEach((input) => {
			input.addEventListener("focus", (e) => {
				if (e.target.value === "0") {
					e.target.value = ""
				}
			})

			input.addEventListener("blur", (e) => {
				if (e.target.value === "") {
					e.target.value = "0"
				}
			})

			input.addEventListener("input", (e) => {
				this.#dispatchChange(e.target.name, e.target.value)
			})
		})
	}

	#dispatchChange = (field, value) => {
		this.dispatchEvent(new CustomEvent("change", {
			detail: {
				field,
				value,
			},
		}))
	}

	#createRoot = () => {
		const root = this.shadowRoot ?? this.attachShadow({ mode: "open" })

		const style = document.createElement("style")
		style.innerHTML = SwRollerElement.css

		const template = document.createElement("template")
		template.innerHTML = SwRollerElement.html

		root.appendChild(style)
		root.appendChild(template.content)

		return root
	}
}

customElements.define("sw-roller", SwRollerElement)
