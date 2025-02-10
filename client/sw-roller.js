export class SwRollerElement extends HTMLElement {
	static html = `
		<form method="post" action="roll">
			<input id="forid" type="hidden" name="forid" />
			<label for="ability">Ability</label>
			<input id="ability" name="ability" type="number" min="0" max="20" step="1" />
			<label for="proficiency">Proficiency</label>
			<input id="proficiency" name="proficiency" type="number" min="0" max="20" step="1" />
			<label for="boost">Boost</label>
			<input id="boost" name="boost" type="number" min="0" max="20" step="1" />
			<label for="difficulty">Difficulty</label>
			<input id="difficulty" name="difficulty" type="number" min="0" max="20" step="1" />
			<label for="challenge">Challenge</label>
			<input id="challenge" name="challenge" type="number" min="0" max="20" step="1" />
			<label for="setback">Setback</label>
			<input id="setback" name="setback" type="number" min="0" max="20" step="1" />
			<label for="force">Force</label>
			<input id="force" name="force" type="number" min="0" max="20" step="1" />
			<button type="submit">Roll!</button>
			<label for="result">Result</label>
			<output id="result"></output>
			<label for="summary">Summary</label>
			<output id="summary"></output>
		</form>
	`

	static css = `
		
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
