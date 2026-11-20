/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");
const selectedProductsList = document.getElementById("selectedProductsList");
const generateRoutineButton = document.getElementById("generateRoutine");

/* Send chat requests through the class-hosted Worker. No API key is needed here. */
const workerUrl = "https://hidden-smoke-cd3e.farha-2-sajid5.workers.dev/";

/* Keep the conversation so the advisor can answer follow-up questions. */
const messages = [
  {
    role: "system",
    content:
      "You are a helpful L'Oréal beauty and product advisor. Give clear, friendly, personalized routine guidance.",
  },
];

/* Store chosen products so they can be included in the routine request. */
const selectedProducts = new Map();

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Select a category to view products
  </div>
`;

/* Load product data from JSON file */
async function loadProducts() {
  const response = await fetch("products.json");
  const data = await response.json();
  return data.products;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <article class="product-card" data-product-id="${product.id}">
      <button
        type="button"
        class="product-card-select"
        aria-pressed="${selectedProducts.has(product.id)}"
        aria-describedby="product-description-${product.id}"
      >
        <img src="${product.image}" alt="">
        <span class="product-info">
          <span class="product-name">${product.name}</span>
          <span class="product-brand">${product.brand}</span>
        </span>
      </button>
      <div
        class="product-description-overlay"
        id="product-description-${product.id}"
        role="tooltip"
      >
        <p class="product-description">${product.description}</p>
      </div>
    </article>
  `
    )
    .join("");

  products.forEach((product) => {
    const selectButton = productsContainer.querySelector(
      `[data-product-id="${product.id}"] .product-card-select`
    );

    selectButton.addEventListener("click", () => toggleProduct(product));
  });
}

/* Add or remove a product when its card is selected. */
function toggleProduct(product) {
  const isSelected = selectedProducts.has(product.id);

  if (isSelected) {
    selectedProducts.delete(product.id);
  } else {
    selectedProducts.set(product.id, product);
  }

  updateSelectedProducts();
}

/* Show chosen products and keep visible cards in sync with the selection. */
function updateSelectedProducts() {
  selectedProductsList.replaceChildren();

  selectedProducts.forEach((product) => {
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "selected-product";
    removeButton.textContent = `${product.brand} ${product.name}`;
    removeButton.setAttribute(
      "aria-label",
      `Remove ${product.brand} ${product.name} from selected products`
    );
    removeButton.addEventListener("click", () => {
      selectedProducts.delete(product.id);
      updateSelectedProducts();
    });
    selectedProductsList.appendChild(removeButton);
  });

  productsContainer.querySelectorAll(".product-card").forEach((card) => {
    const isSelected = selectedProducts.has(Number(card.dataset.productId));
    const selectButton = card.querySelector(".product-card-select");
    selectButton.setAttribute("aria-pressed", String(isSelected));
    card.classList.toggle("is-selected", isSelected);
  });
}

/* Filter and display products when category changes */
categoryFilter.addEventListener("change", async (e) => {
  const products = await loadProducts();
  const selectedCategory = e.target.value;

  /* filter() creates a new array containing only products 
     where the category matches what the user selected */
  const filteredProducts = products.filter(
    (product) => product.category === selectedCategory
  );

  displayProducts(filteredProducts);
});

/* Add a message as text so chat replies are displayed safely. */
function addChatMessage(content, className) {
  const messageElement = document.createElement("div");
  messageElement.className = className;
  messageElement.textContent = content;
  chatWindow.appendChild(messageElement);
  chatWindow.setAttribute("aria-live", "polite");
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Show a small animated indicator while the Worker is responding. */
function addTypingIndicator() {
  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.setAttribute("role", "status");
  indicator.setAttribute("aria-label", "The advisor is typing");

  for (let dot = 0; dot < 3; dot += 1) {
    indicator.appendChild(document.createElement("span"));
  }

  chatWindow.appendChild(indicator);
  chatWindow.scrollTop = chatWindow.scrollHeight;
  return indicator;
}

/* Send each message with the full conversation history. */
async function sendMessage(message, displayText = message) {
  messages.push({ role: "user", content: message });
  addChatMessage(displayText, "user-message");
  userInput.disabled = true;
  sendButton.disabled = true;
  generateRoutineButton.disabled = true;

  const typingIndicator = addTypingIndicator();

  try {
    const response = await fetch(workerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`The advisor request failed (${response.status}).`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content;

    if (typeof reply !== "string" || !reply.trim()) {
      throw new Error("The advisor returned an empty response.");
    }

    messages.push({ role: "assistant", content: reply });
    addChatMessage(reply, "bot-message");
  } catch (error) {
    console.error("Could not get a response from the advisor:", error);
    messages.pop();
    addChatMessage(
      "I couldn't reach the advisor just now. Please try again.",
      "error-message"
    );
  } finally {
    typingIndicator.remove();
    userInput.disabled = false;
    sendButton.disabled = false;
    generateRoutineButton.disabled = false;
  }
}

/* Send a typed question to the advisor. */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = userInput.value.trim();
  if (!question) {
    return;
  }

  userInput.value = "";
  await sendMessage(question);
  userInput.focus();
});

/* Ask the advisor for a routine based on the selected products. */
generateRoutineButton.addEventListener("click", async () => {
  if (selectedProducts.size === 0) {
    addChatMessage(
      "Choose at least one product before generating a routine.",
      "error-message"
    );
    return;
  }

  const productDetails = Array.from(selectedProducts.values())
    .map(
      (product) =>
        `- ${product.brand} ${product.name}: ${product.description}`
    )
    .join("\n");

  const routineRequest = `Create a personalized routine using these selected products. Explain the order and when to use each product:\n${productDetails}`;

  await sendMessage(
    routineRequest,
    "Please build my routine using the products I selected."
  );
  userInput.focus();
});
