export class SwRollerElement extends HTMLElement {
	static html = `
		<form method="post" action="roll">
			<input id="forid" type="hidden" name="forid" />
			<div class="dice-grid">
				<div class="die-type d8 green">
					<label for="ability">Ability</label>
					<input id="ability" name="ability" type="number" min="0" max="20" value="0" step="1" />
					<ul>
						<li><sw-icon name="success"></sw-icon></li>
						<li></li>
						<li class="double"><sw-icon name="success"></sw-icon><sw-icon name="advantage"></sw-icon></li>
						<li class="double"><sw-icon name="success"></sw-icon><sw-icon name="advantage"></sw-icon></li>
						<li class="double"><sw-icon name="success"></sw-icon><sw-icon name="advantage"></sw-icon></li>
						<li class="double"><sw-icon name="success"></sw-icon><sw-icon name="advantage"></sw-icon></li>
						<li class="double"><sw-icon name="success"></sw-icon><sw-icon name="advantage"></sw-icon></li>
					</ul>
				</div>
				<div class="die-type d12 yellow">
					<label for="proficiency">Proficiency</label>
					<input id="proficiency" name="proficiency" type="number" min="0" max="20" value="0" step="1" />
					<ul>
						<li><sw-icon name="triumph"></sw-icon></li>
						<li class="double"><sw-icon name="advantage"></sw-icon><sw-icon name="advantage"></sw-icon></li>
					</ul>
				</div>
				<div class="die-type d6 blue">
					<label for="boost">Boost</label>
					<input id="boost" name="boost" type="number" min="0" max="20" value="0" step="1" />
					<ul>
						<li><sw-icon name="success"></sw-icon><sw-icon name="advantage"></sw-icon></li>
					</ul>
				</div>
				<div class="die-type d8 purple">
					<label for="difficulty">Difficulty</label>
					<input id="difficulty" name="difficulty" type="number" min="0" max="20" value="0" step="1" />
					<ul>
						<li><sw-icon name="threat"></sw-icon><sw-icon name="failure"></sw-icon></li>
						<li><sw-icon name="threat"></sw-icon><sw-icon name="failure"></sw-icon></li>
						<li></li>
					</ul>
				</div>
				<div class="die-type d12 red">
					<label for="challenge">Challenge</label>
					<input id="challenge" name="challenge" type="number" min="0" max="20" value="0" step="1" />
					<ul>
						<li><sw-icon name="despair"></sw-icon></li>
						<li><sw-icon name="threat"></sw-icon><sw-icon name="threat"></sw-icon></li>
						<li><sw-icon name="failure"></sw-icon></li>
					</ul>
				</div>
				<div class="die-type d6 black">
					<label for="setback">Setback</label>
					<input id="setback" name="setback" type="number" min="0" max="20" value="0" step="1" />
					<ul>
						<li><sw-icon name="failure"></sw-icon></li>
						<li><sw-icon name="threat"></sw-icon></li>
					</ul>
				</div>
				<div class="die-type d0 white">
					<label for="force">Force</label>
					<input id="force" name="force" type="number" min="0" max="20" value="0" step="1" />
					<ul>
						<li><sw-icon name="dark"></sw-icon></li>
						<li class="double"><sw-icon name="light"></sw-icon><sw-icon name="light"></sw-icon></li>
					</ul>
				</div>
			</div>

			<div class="actions">
				<button class="danger" type="button">Reset</button>
				<button type="submit">Roll!</button>
			</div>

			<div class="summary">
				<label for="outcome">Outcome:</label>
				<output id="outcome">Failure (-1)</output>
				<label for="side-effects">Side Effects:</label>
				<output id="side-effects">Negative (-1)</output>
				<label for="critical">Critical:</label>
				<output id="critical">1<sw-icon name="triumph"></sw-icon> 1<sw-icon name="despair"></sw-icon></output>
				<label for="force-result">Force:</label>
				<output id="force-result">2<sw-icon name="light"></sw-icon> 1<sw-icon name="dark"></sw-icon></output>
			</div>
		</form>
	`

	static css = `
		form {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 1.5em;
		}

		.dice-grid {
			display: grid;
			grid-template-columns: auto auto 1fr;
			row-gap: 0.75em;
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
			font-size: 0.65em;
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
		this.shadowRoot.querySelector("#summary").textContent = JSON.stringify(result)
	}

	connectedCallback() {
		const foridField = this.shadowRoot?.querySelector("#forid")
		const form = this.shadowRoot?.querySelector("form")

		if (foridField != null) {
			foridField.value = this.id
		}

		form?.addEventListener("submit", (e) => {
			e.preventDefault()

			this.roll()
		})
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
