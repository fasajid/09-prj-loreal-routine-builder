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
const languageSelect = document.getElementById("languageSelect");
const siteTitle = document.querySelector(".site-title");
const categoryFilterPlaceholder = categoryFilter.querySelector("option[value='']");
const selectedProductsTitle = document.querySelector(".selected-products h2");
const chatTitle = document.querySelector(".chatbox h2");
const clearSelectedProductsText = clearSelectedProductsButton;
const siteSubtitle = document.querySelector(".site-subtitle");
const languageLabel = document.querySelector(".language-control label");
const privacyLink = document.querySelector('.site-footer a[href="#"]');
const footerLinks = document.querySelectorAll(".site-footer nav a");
const searchLabel = document.querySelector('label[for="productSearch"]');
const messageLabel = document.querySelector('label[for="userInput"]');
const sendButtonText = sendButton.querySelector(".visually-hidden");

/* Text shown when the user changes the app language. */
const translations = {
  en: {
    language: "Language",
    title: "Smart Routine & Product Advisor",
    subtitle: "Personalized beauty, thoughtfully curated",
    category: "Choose a Category",
    placeholder: "Search products by name or keyword",
    selected: "Selected Products",
    clear: "Clear all",
    generate: "Generate Routine",
    chatTitle: "Let's Build Your Routine",
    chatPlaceholder: "Ask me about products or routines...",
    initialMessage: "Choose a category or search for products",
    learnMore: "Learn more",
    hideDescription: "Hide description",
    noMatches: "No products match your search.",
    loadError: "Products could not be loaded. Please try again.",
    searchLabel: "Search products",
    messageLabel: "Message",
    send: "Send",
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    contact: "Contact",
    categories: ["Cleansers", "Moisturizers & Treatments", "Haircare", "Makeup", "Hair Color", "Hair Styling", "Men's Grooming", "Suncare", "Fragrance"],
  },
  fr: {
    language: "Langue",
    title: "Conseiller intelligent de routine et de produits",
    subtitle: "Beauté personnalisée, sélectionnée avec soin",
    category: "Choisir une catégorie",
    placeholder: "Rechercher par nom ou mot-clé",
    selected: "Produits sélectionnés",
    clear: "Tout effacer",
    generate: "Créer ma routine",
    chatTitle: "Créons votre routine",
    chatPlaceholder: "Posez-moi une question sur les produits ou les routines...",
    initialMessage: "Choisissez une catégorie ou recherchez des produits",
    learnMore: "En savoir plus",
    hideDescription: "Masquer la description",
    noMatches: "Aucun produit ne correspond à votre recherche.",
    loadError: "Les produits n'ont pas pu être chargés. Réessayez.",
    searchLabel: "Rechercher des produits",
    messageLabel: "Message",
    send: "Envoyer",
    privacy: "Politique de confidentialité",
    terms: "Conditions d'utilisation",
    contact: "Contact",
    categories: ["Nettoyants", "Hydratants et soins", "Soins capillaires", "Maquillage", "Coloration", "Coiffage", "Soins homme", "Protection solaire", "Parfum"],
  },
  es: {
    language: "Idioma",
    title: "Asesor inteligente de rutinas y productos",
    subtitle: "Belleza personalizada, seleccionada con cuidado",
    category: "Elegir una categoría",
    placeholder: "Buscar por nombre o palabra clave",
    selected: "Productos seleccionados",
    clear: "Borrar todo",
    generate: "Crear rutina",
    chatTitle: "Creemos tu rutina",
    chatPlaceholder: "Pregúntame sobre productos o rutinas...",
    initialMessage: "Elige una categoría o busca productos",
    learnMore: "Más información",
    hideDescription: "Ocultar descripción",
    noMatches: "No hay productos que coincidan con tu búsqueda.",
    loadError: "No se pudieron cargar los productos. Inténtalo de nuevo.",
    searchLabel: "Buscar productos",
    messageLabel: "Mensaje",
    send: "Enviar",
    privacy: "Política de privacidad",
    terms: "Condiciones de uso",
    contact: "Contacto",
    categories: ["Limpiadores", "Hidratantes y tratamientos", "Cuidado del cabello", "Maquillaje", "Coloración", "Peinado", "Cuidado masculino", "Protección solar", "Fragancia"],
  },
  ar: {
    language: "اللغة",
    title: "مستشار ذكي للعناية والمنتجات",
    subtitle: "جمال شخصي ومختار بعناية",
    category: "اختر فئة",
    placeholder: "ابحث باسم المنتج أو كلمة مفتاحية",
    selected: "المنتجات المحددة",
    clear: "مسح الكل",
    generate: "إنشاء الروتين",
    chatTitle: "لننشئ روتينك",
    chatPlaceholder: "اسألني عن المنتجات أو الروتين...",
    initialMessage: "اختر فئة أو ابحث عن المنتجات",
    learnMore: "معرفة المزيد",
    hideDescription: "إخفاء الوصف",
    noMatches: "لا توجد منتجات تطابق بحثك.",
    loadError: "تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى.",
    searchLabel: "البحث عن المنتجات",
    messageLabel: "الرسالة",
    send: "إرسال",
    privacy: "سياسة الخصوصية",
    terms: "شروط الاستخدام",
    contact: "اتصل بنا",
    categories: ["منظفات", "مرطبات وعلاجات", "العناية بالشعر", "مكياج", "صبغة الشعر", "تصفيف الشعر", "العناية بالرجال", "واقٍ شمسي", "عطور"],
  },
  he: {
    language: "שפה",
    title: "יועץ שגרה ומוצרים חכם",
    subtitle: "יופי מותאם אישית, נבחר בקפידה",
    category: "בחרו קטגוריה",
    placeholder: "חפשו לפי שם מוצר או מילת מפתח",
    selected: "מוצרים נבחרים",
    clear: "נקה הכל",
    generate: "צור שגרת טיפוח",
    chatTitle: "בואו נבנה את השגרה שלך",
    chatPlaceholder: "שאלו אותי על מוצרים או שגרות...",
    initialMessage: "בחרו קטגוריה או חפשו מוצרים",
    learnMore: "למידע נוסף",
    hideDescription: "הסתר תיאור",
    noMatches: "אין מוצרים התואמים לחיפוש.",
    loadError: "לא ניתן היה לטעון מוצרים. נסו שוב.",
    searchLabel: "חיפוש מוצרים",
    messageLabel: "הודעה",
    send: "שלח",
    privacy: "מדיניות פרטיות",
    terms: "תנאי שימוש",
    contact: "צור קשר",
    categories: ["ניקוי", "לחות וטיפולים", "טיפוח שיער", "איפור", "צבע שיער", "עיצוב שיער", "טיפוח גברים", "הגנה מהשמש", "בשמים"],
  },
  fa: {
    language: "زبان",
    title: "مشاور هوشمند روتین و محصولات",
    subtitle: "زیبایی شخصی‌سازی‌شده، با دقت انتخاب‌شده",
    category: "یک دسته انتخاب کنید",
    placeholder: "جستجو بر اساس نام یا کلیدواژه",
    selected: "محصولات انتخاب‌شده",
    clear: "پاک کردن همه",
    generate: "ساختن روتین",
    chatTitle: "بیایید روتین شما را بسازیم",
    chatPlaceholder: "درباره محصولات یا روتین بپرسید...",
    initialMessage: "یک دسته انتخاب کنید یا محصولات را جستجو کنید",
    learnMore: "اطلاعات بیشتر",
    hideDescription: "پنهان کردن توضیح",
    noMatches: "محصولی مطابق جستجوی شما پیدا نشد.",
    loadError: "بارگذاری محصولات ممکن نبود. دوباره تلاش کنید.",
    searchLabel: "جستجوی محصولات",
    messageLabel: "پیام",
    send: "ارسال",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
    contact: "تماس",
    categories: ["پاک‌کننده‌ها", "مرطوب‌کننده‌ها و درمان‌ها", "مراقبت مو", "آرایش", "رنگ مو", "استایل مو", "مراقبت مردانه", "محافظت از آفتاب", "عطر"],
  },
  ur: {
    language: "زبان",
    title: "ذہین روٹین اور مصنوعات کا مشیر",
    subtitle: "ذاتی خوبصورتی، سوچ سمجھ کر منتخب",
    category: "ایک زمرہ منتخب کریں",
    placeholder: "نام یا لفظ کے لحاظ سے تلاش کریں",
    selected: "منتخب شدہ مصنوعات",
    clear: "سب صاف کریں",
    generate: "روٹین بنائیں",
    chatTitle: "آئیے آپ کی روٹین بنائیں",
    chatPlaceholder: "مصنوعات یا روٹین کے بارے میں پوچھیں...",
    initialMessage: "زمرہ منتخب کریں یا مصنوعات تلاش کریں",
    learnMore: "مزید معلومات",
    hideDescription: "تفصیل چھپائیں",
    noMatches: "آپ کی تلاش سے کوئی مصنوعات مطابقت نہیں رکھتی۔",
    loadError: "مصنوعات لوڈ نہیں ہو سکیں۔ دوبارہ کوشش کریں۔",
    searchLabel: "مصنوعات تلاش کریں",
    messageLabel: "پیغام",
    send: "بھیجیں",
    privacy: "رازداری کی پالیسی",
    terms: "استعمال کی شرائط",
    contact: "رابطہ",
    categories: ["کلیزر", "موئسچرائزر اور علاج", "بالوں کی دیکھ بھال", "میک اپ", "بالوں کا رنگ", "بالوں کی اسٹائلنگ", "مردوں کی دیکھ بھال", "سن کیئر", "خوشبو"],
  },
};

let currentLanguage = "en";
const languageNames = {
  en: "English",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
  he: "Hebrew",
  fa: "Persian",
  ur: "Urdu",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  "zh-TW": "Traditional Chinese",
  ja: "Japanese",
  ko: "Korean",
  hi: "Hindi",
  bn: "Bengali",
  tr: "Turkish",
  pl: "Polish",
  nl: "Dutch",
  sv: "Swedish",
  no: "Norwegian",
  da: "Danish",
  fi: "Finnish",
  el: "Greek",
  cs: "Czech",
  ro: "Romanian",
  hu: "Hungarian",
  uk: "Ukrainian",
  vi: "Vietnamese",
  th: "Thai",
  id: "Indonesian",
  ms: "Malay",
  tl: "Filipino",
  sw: "Swahili",
};

const rtlLanguages = ["ar", "he", "fa", "ur"];

/* Update visible text and the language used for future advisor replies. */
function changeLanguage(language) {
  const text = translations[language] || translations.en;
  if (!text) {
    return;
  }

  currentLanguage = language;
  document.documentElement.lang = language;
  document.documentElement.dir = rtlLanguages.includes(language) ? "rtl" : "ltr";
  document.body.dir = rtlLanguages.includes(language) ? "rtl" : "ltr";
  languageLabel.textContent = text.language;
  siteTitle.childNodes[0].textContent = text.title;
  siteSubtitle.textContent = text.subtitle;
  categoryFilterPlaceholder.textContent = text.category;
  productSearch.placeholder = text.placeholder;
  productSearch.setAttribute("aria-label", text.searchLabel);
  searchLabel.textContent = text.searchLabel;
  messageLabel.textContent = text.messageLabel;
  sendButtonText.textContent = text.send;
  selectedProductsTitle.textContent = text.selected;
  clearSelectedProductsText.textContent = text.clear;
  generateRoutineButton.innerHTML =
    '<i class="fa-solid fa-wand-magic-sparkles"></i> ' + text.generate;
  chatTitle.textContent = text.chatTitle;
  userInput.placeholder = text.chatPlaceholder;

  if (text.categories) {
    const categoryValues = [
      "cleanser",
      "moisturizer",
      "haircare",
      "makeup",
      "hair color",
      "hair styling",
      "men's grooming",
      "suncare",
      "fragrance",
    ];

    categoryValues.forEach((value, index) => {
      const option = categoryFilter.querySelector(`option[value="${value}"]`);
      if (option) {
        option.textContent = text.categories[index];
      }
    });
  }

  footerLinks[0].textContent = text.privacy;
  footerLinks[1].textContent = text.terms;
  footerLinks[2].textContent = text.contact;

  if (!categoryFilter.value && !productSearch.value) {
    displayProductMessage(text.initialMessage);
  }

  messages[0].content =
    `You are a helpful L'Oréal beauty advisor. Answer every response in ${languageNames[language]}. ` +
    "Use the full conversation history, including any generated routine, to answer follow-up questions clearly and consistently. " +
    "Keep responses concise but complete: finish every sentence and thought. " +
    "Format responses with simple Markdown headings, short paragraphs, and concise numbered steps. Avoid complex formatting. " +
    "Only answer questions about that routine or related beauty topics such as skincare, haircare, makeup, fragrance, and personal care. " +
    "If a question is unrelated, politely explain that you can only help with beauty and routine topics.";

  localStorage.setItem("lorealRoutineBuilder.language", language);
}

languageSelect.addEventListener("change", () => {
  changeLanguage(languageSelect.value);
});

/* Return the active language text, with English as a safe fallback. */
function getCurrentText() {
  return translations[currentLanguage] || translations.en;
}

/* Send chat requests through the class-hosted Worker. No API key is needed here. */
const workerUrl = "https://hidden-smoke-cd3e.farha-2-sajid5.workers.dev/";

/* Keep the conversation so the advisor can answer follow-up questions. */
const messages = [
  {
    role: "system",
    content:
      "You are a helpful L'Oréal beauty advisor. Use the full conversation history, including any generated routine, to answer follow-up questions clearly and consistently. Keep responses concise but complete: finish every sentence and thought. Format responses with simple Markdown headings, short paragraphs, and concise numbered steps. Avoid complex formatting. Only answer questions about that routine or related beauty topics such as skincare, haircare, makeup, fragrance, and personal care. If a question is unrelated, politely explain that you can only help with beauty and routine topics.",
  },
];

/* Restore the user's last language choice when the page opens. */
const savedLanguage = localStorage.getItem("lorealRoutineBuilder.language");
if (languageNames[savedLanguage]) {
  languageSelect.value = savedLanguage;
  changeLanguage(savedLanguage);
}

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
      >${getCurrentText().learnMore}</button>
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
        ? getCurrentText().learnMore
        : getCurrentText().hideDescription;
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
      displayProductMessage(getCurrentText().noMatches);
      return;
    }

    displayProducts(filteredProducts);
  } catch (error) {
    if (currentRequest === filterRequest) {
      console.error("Could not load products:", error);
      displayProductMessage(getCurrentText().loadError);
    }
  }
}

categoryFilter.addEventListener("change", filterProducts);
productSearch.addEventListener("input", filterProducts);

/* Add a message as text so chat replies are displayed safely. */
function addChatMessage(content, className) {
  const messageElement = document.createElement("div");
  messageElement.className = className;
  if (className === "bot-message") {
    formatAssistantReply(messageElement, content);
  } else {
    messageElement.textContent = content;
  }
  chatWindow.appendChild(messageElement);
  chatWindow.setAttribute("aria-live", "polite");
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

/* Convert Markdown replies to sanitized HTML before displaying them. */
function formatAssistantReply(container, content) {
  if (!window.marked || !window.DOMPurify) {
    console.error("Markdown display libraries could not be loaded.");
    container.textContent = content;
    return;
  }

  container.innerHTML = window.DOMPurify.sanitize(window.marked.parse(content));
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
