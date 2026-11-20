/* Get references to DOM elements */
const categoryFilter = document.getElementById("categoryFilter");
const productSearch = document.getElementById("productSearch");
const productsContainer = document.getElementById("productsContainer");
const chatForm = document.getElementById("chatForm");
const chatWindow = document.getElementById("chatWindow");
const userInput = document.getElementById("userInput");
const sendButton = document.getElementById("sendBtn");
const selectedProductsList = document.getElementById("selectedProductsList");
const clearSelectedProductsButton = document.getElementById("clearSelectedProducts");
const selectionStorageStatus = document.getElementById("selectionStorageStatus");
const generateRoutineButton = document.getElementById("generateRoutine");

/* Send chat requests through the class-hosted Worker. No API key is needed here. */
const workerUrl = "https://hidden-smoke-cd3e.farha-2-sajid5.workers.dev/";

/* Keep the conversation so the advisor can answer follow-up questions. */
const messages = [
  {
    role: "system",
    content:
      "You are a helpful L'Oréal beauty advisor. Use the full conversation history, including any generated routine, to answer follow-up questions clearly and consistently. Only answer questions about that routine or related beauty topics such as skincare, haircare, makeup, fragrance, and personal care. If a question is unrelated, politely explain that you can only help with beauty and routine topics.",
  },
];

/* Store chosen products so they can be included in the routine request. */
const selectedProducts = new Map();
const selectedProductsStorageKey = "lorealRoutineBuilder.selectedProducts";

/* Restore previously selected product data from this browser. */
try {
  const savedProducts = localStorage.getItem(selectedProductsStorageKey);

  if (savedProducts) {
    const products = JSON.parse(savedProducts);
    const validProducts =
      Array.isArray(products) &&
      products.every(
        (product) =>
          Number.isInteger(product.id) &&
          typeof product.name === "string" &&
          typeof product.brand === "string" &&
          typeof product.category === "string" &&
          typeof product.description === "string"
      );

    if (!validProducts) {
      throw new Error("Saved product selections have an invalid format.");
    }

    products.forEach((product) => selectedProducts.set(product.id, product));
  }
} catch (error) {
  console.error("Could not restore saved product selections:", error);
  selectionStorageStatus.textContent =
    "Saved products could not be loaded from this browser.";
}

/* Show initial placeholder until user selects a category */
productsContainer.innerHTML = `
  <div class="placeholder-message">
    Choose a category or search for products
  </div>
`;

/* Load the product data once and reuse it for searches and categories. */
let productsPromise;
async function loadProducts() {
  if (!productsPromise) {
    productsPromise = fetch("products.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Could not load products (${response.status}).`);
        }
        return response.json();
      })
      .then((data) => data.products)
      .catch((error) => {
        productsPromise = undefined;
        throw error;
      });
  }

  return productsPromise;
}

/* Create HTML for displaying product cards */
function displayProducts(products) {
  productsContainer.innerHTML = products
    .map(
      (product) => `
    <article
      class="product-card${selectedProducts.has(product.id) ? " is-selected" : ""}"
      data-product-id="${product.id}"
    >
      <button
        type="button"
        class="product-card-select"
        aria-pressed="${selectedProducts.has(product.id)}"
      >
        <img src="${product.image}" alt="">
        <span class="product-info">
          <span class="product-name">${product.name}</span>
          <span class="product-brand">${product.brand}</span>
        </span>
      </button>
      <button
        type="button"
        class="product-description-toggle"
        aria-expanded="false"
        aria-controls="product-description-${product.id}"
      >Learn more</button>
      <div class="product-description-panel" id="product-description-${product.id}" hidden>
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
    const descriptionButton = productsContainer.querySelector(
      `[data-product-id="${product.id}"] .product-description-toggle`
    );
    const descriptionPanel = productsContainer.querySelector(
      `[data-product-id="${product.id}"] .product-description-panel`
    );

    selectButton.addEventListener("click", () => toggleProduct(product));
    descriptionButton.addEventListener("click", () => {
      const isExpanded =
        descriptionButton.getAttribute("aria-expanded") === "true";
      descriptionButton.setAttribute("aria-expanded", String(!isExpanded));
      descriptionButton.textContent = isExpanded
        ? "Learn more"
        : "Hide description";
      descriptionPanel.hidden = isExpanded;
    });
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
function updateSelectedProducts(save = true) {
  selectedProductsList.replaceChildren();
  clearSelectedProductsButton.disabled = selectedProducts.size === 0;

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

  if (save) {
    try {
      localStorage.setItem(
        selectedProductsStorageKey,
        JSON.stringify(Array.from(selectedProducts.values()))
      );
      selectionStorageStatus.textContent = "";
    } catch (error) {
      console.error("Could not save product selections:", error);
      selectionStorageStatus.textContent =
        "Your selection is active but could not be saved in this browser.";
    }
  }

  productsContainer.querySelectorAll(".product-card").forEach((card) => {
    const isSelected = selectedProducts.has(Number(card.dataset.productId));
    const selectButton = card.querySelector(".product-card-select");
    selectButton.setAttribute("aria-pressed", String(isSelected));
    card.classList.toggle("is-selected", isSelected);
  });
}

/* Render restored selections without rewriting storage during page startup. */
updateSelectedProducts(false);

/* Clear every selected product and update the saved list. */
clearSelectedProductsButton.addEventListener("click", () => {
  selectedProducts.clear();
  updateSelectedProducts();
});

/* Show a status message in the product grid. */
function displayProductMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.className = "placeholder-message";
  messageElement.textContent = message;
  productsContainer.replaceChildren(messageElement);
}

/* Filter products by both the selected category and the search text. */
let filterRequest = 0;
async function filterProducts() {
  const currentRequest = ++filterRequest;
  const searchTerm = productSearch.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  if (!selectedCategory && !searchTerm) {
    displayProductMessage("Choose a category or search for products");
    return;
  }

  try {
    const products = await loadProducts();
    if (currentRequest !== filterRequest) {
      return;
    }

    const filteredProducts = products.filter((product) => {
      const matchesCategory =
        !selectedCategory || product.category === selectedCategory;
      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.description,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(searchTerm);
    });

    if (filteredProducts.length === 0) {
      displayProductMessage("No products match your search.");
      return;
    }

    displayProducts(filteredProducts);
  } catch (error) {
    if (currentRequest === filterRequest) {
      console.error("Could not load products:", error);
      displayProductMessage("Products could not be loaded. Please try again.");
    }
  }
}

categoryFilter.addEventListener("change", filterProducts);
productSearch.addEventListener("input", filterProducts);

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

  const productData = Array.from(selectedProducts.values()).map((product) => ({
    name: product.name,
    brand: product.brand,
    category: product.category,
    description: product.description,
  }));
  const routineRequest = `Create a personalized beauty routine using the selected products below. Explain the order and when to use each product. Only recommend products from this list.\n\nSelected products:\n${JSON.stringify(
    productData,
    null,
    2
  )}`;

  await sendMessage(
    routineRequest,
    "Please build my routine using the products I selected."
  );
  userInput.focus();
});
