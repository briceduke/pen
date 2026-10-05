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
    radial-gradient(80rem 28rem at 12% -20%, rgb(255 255 255 / 0.08), transparent),
    #111111;
  color: #f4f4f5;
}

.card {
  max-width: 28rem;
  padding: 1.75rem 1.85rem 1.6rem;
  border-radius: 1.5rem;
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.1);
}

.eyebrow {
  margin: 0 0 0.45rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-size: 0.68rem;
  color: #a1a1aa;
}

h1 {
  margin: 0 0 0.7rem;
  font-size: 1.7rem;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

p {
  margin: 0 0 1.2rem;
  line-height: 1.55;
  color: #d4d4d8;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 0.6rem 1.05rem;
  background: #fafafa;
  color: #18181b;
  font-weight: 600;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid #fafafa;
  outline-offset: 3px;
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
  background: #0a0a0a;
}

.stage {
  position: relative;
  width: 11rem;
  height: 11rem;
}

.planet {
  position: absolute;
  inset: 3.4rem;
  border-radius: 999px;
  background: radial-gradient(circle at 32% 30%, #f4f4f5, #52525b);
}

.orbit {
  position: absolute;
  inset: 0;
  border: 1px dashed rgb(255 255 255 / 0.18);
  border-radius: 999px;
  animation: spin 5s linear infinite;
}

.moon {
  position: absolute;
  top: -0.35rem;
  left: 50%;
  width: 0.7rem;
  height: 0.7rem;
  margin-left: -0.35rem;
  border-radius: 999px;
  background: #fafafa;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit {
    animation: none;
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
  <p class="eyebrow">State</p>
  <h1>Counter</h1>
  <p id="value">0</p>
  <div class="row">
    <button id="dec" type="button" aria-label="Decrement">−</button>
    <button id="inc" type="button" aria-label="Increment">+</button>
  </div>
</section>
`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #111111;
  color: #fafafa;
}

section {
  text-align: center;
}

.eyebrow {
  margin: 0;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.68rem;
  color: #a1a1aa;
}

h1 {
  margin: 0.35rem 0 0;
  font-size: 0.95rem;
  font-weight: 500;
  color: #d4d4d8;
}

#value {
  font-size: 4.25rem;
  margin: 0.15rem 0 1rem;
  letter-spacing: -0.06em;
  font-variant-numeric: tabular-nums;
}

.row {
  display: flex;
  gap: 0.65rem;
  justify-content: center;
}

button {
  width: 2.75rem;
  height: 2.75rem;
  border: 0;
  border-radius: 999px;
  background: #fafafa;
  color: #18181b;
  font-size: 1.25rem;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid #fafafa;
  outline-offset: 3px;
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
  <p class="eyebrow">Console</p>
  <h1>Errors and warnings</h1>
  <p>This example logs, warns, then throws so you can filter the console panel.</p>
  <button id="boom" type="button">Throw</button>
</main>
`,
  css: `body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  font-family: ui-sans-serif, system-ui, sans-serif;
  background: #111111;
  color: #fafafa;
}

main {
  max-width: 24rem;
}

.eyebrow {
  margin: 0 0 0.4rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  font-size: 0.68rem;
  color: #a1a1aa;
}

h1 {
  margin: 0 0 0.6rem;
  letter-spacing: -0.03em;
}

p {
  margin: 0 0 1.1rem;
  line-height: 1.5;
  color: #d4d4d8;
}

button {
  border: 0;
  border-radius: 999px;
  padding: 0.6rem 1.05rem;
  background: #fafafa;
  color: #18181b;
  font-weight: 600;
  cursor: pointer;
}

button:focus-visible {
  outline: 2px solid #fafafa;
  outline-offset: 3px;
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

const blankDocument: PlaygroundDocument = {
  v: 1,
  exampleId: "blank",
  html: "",
  css: "",
  js: "",
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
    description: "Pure CSS motion, respects reduced motion",
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
  {
    id: "blank",
    name: "Blank",
    description: "Empty editors for a fresh pen",
    document: blankDocument,
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
