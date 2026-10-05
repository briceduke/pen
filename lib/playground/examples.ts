import type { PlaygroundDocument, StarterExample } from "@/lib/playground/types"

const helloDocument: PlaygroundDocument = {
  v: 1,
  exampleId: "hello",
  html: `<main class="card">
  <p class="eyebrow">Pen</p>
  <h1>Live in the browser</h1>
  <p>Edit HTML, CSS, and JS. The preview and console update on the client — no compile server.</p>
  <button id="ping" type="button">Ping console</button>
</main>
`,
  css: `:root {
  color-scheme: dark;
}

body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background:
    radial-gradient(1200px 500px at 20% -10%, #3b3358, transparent),
    #111015;
  color: #f6f3ff;
}

.card {
  max-width: 28rem;
  padding: 2rem;
  border-radius: 1.75rem;
  background: rgb(255 255 255 / 0.06);
  border: 1px solid rgb(255 255 255 / 0.12);
}

.eyebrow {
  margin: 0 0 0.5rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.72rem;
  color: #c9c2e0;
}

h1 {
  margin: 0 0 0.75rem;
  font-size: 1.8rem;
}

p {
  margin: 0 0 1.25rem;
  line-height: 1.55;
  color: #d8d3ea;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 0.65rem 1.15rem;
  background: #ece7fb;
  color: #17141f;
  font-weight: 600;
  cursor: pointer;
}
`,
  js: `const button = document.querySelector("#ping")

button?.addEventListener("click", () => {
  console.log("Hello from the sandbox", { t: Date.now() })
})

console.info("Preview ready")
`,
}

const animationDocument: PlaygroundDocument = {
  v: 1,
  exampleId: "orbit",
  html: `<div class="stage">
  <div class="planet"></div>
  <div class="orbit"><span class="moon"></span></div>
</div>
`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #0b0b10;
}

.stage {
  position: relative;
  width: 10rem;
  height: 10rem;
}

.planet {
  position: absolute;
  inset: 3rem;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, #f4e8ff, #7c5cbf);
}

.orbit {
  position: absolute;
  inset: 0;
  border: 1px dashed rgb(255 255 255 / 0.2);
  border-radius: 999px;
  animation: spin 4s linear infinite;
}

.moon {
  position: absolute;
  top: -0.4rem;
  left: 50%;
  width: 0.8rem;
  height: 0.8rem;
  margin-left: -0.4rem;
  border-radius: 999px;
  background: #efeafc;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`,
  js: `console.log("Orbiting…")
`,
}

const counterDocument: PlaygroundDocument = {
  v: 1,
  exampleId: "counter",
  html: `<section>
  <h1>Counter</h1>
  <p id="value">0</p>
  <div class="row">
    <button id="dec" type="button">−</button>
    <button id="inc" type="button">+</button>
  </div>
</section>
`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #121118;
  color: #f4f1fb;
}

section {
  text-align: center;
}

#value {
  font-size: 4rem;
  margin: 0.25rem 0 1rem;
  font-variant-numeric: tabular-nums;
}

.row {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

button {
  width: 3rem;
  height: 3rem;
  border: 0;
  border-radius: 999px;
  background: #ece7fb;
  color: #16131c;
  font-size: 1.4rem;
  cursor: pointer;
}
`,
  js: `let count = 0
const value = document.querySelector("#value")

function render() {
  if (value) value.textContent = String(count)
  console.log("count", count)
}

document.querySelector("#inc")?.addEventListener("click", () => {
  count += 1
  render()
})

document.querySelector("#dec")?.addEventListener("click", () => {
  count -= 1
  render()
})

render()
`,
}

const errorDocument: PlaygroundDocument = {
  v: 1,
  exampleId: "errors",
  html: `<main>
  <h1>Console errors</h1>
  <p>This example logs, warns, then throws so you can see the console panel.</p>
  <button id="boom" type="button">Throw</button>
</main>
`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #140f14;
  color: #f7f1f1;
}

main {
  max-width: 24rem;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 0.65rem 1.15rem;
  background: #f3d6d6;
  color: #3a1414;
  font-weight: 600;
  cursor: pointer;
}
`,
  js: `console.info("All good so far")
console.warn("This is a warning")
console.error("This is an error log")

document.querySelector("#boom")?.addEventListener("click", () => {
  throw new Error("Boom from the sandbox")
})
`,
}

export const STARTER_EXAMPLES: readonly StarterExample[] = [
  {
    id: "hello",
    name: "Hello Pen",
    description: "Starter card with a console ping",
    document: helloDocument,
  },
  {
    id: "orbit",
    name: "CSS orbit",
    description: "Pure CSS animation",
    document: animationDocument,
  },
  {
    id: "counter",
    name: "JS counter",
    description: "Clicks update the DOM and console",
    document: counterDocument,
  },
  {
    id: "errors",
    name: "Console errors",
    description: "Logs, warnings, and a thrown error",
    document: errorDocument,
  },
] as const

export const DEFAULT_EXAMPLE_ID = "hello" as const

/**
 * @param exampleId - Example identifier
 * @returns Matching starter example, or the default Hello Pen example
 */
export function findStarterExample(exampleId: string): StarterExample {
  return (
    STARTER_EXAMPLES.find((example) => example.id === exampleId) ??
    STARTER_EXAMPLES[0]
  )
}

/**
 * @returns Default playground document
 */
export function getDefaultDocument(): PlaygroundDocument {
  return findStarterExample(DEFAULT_EXAMPLE_ID).document
}
