document.addEventListener("DOMContentLoaded", () => {
    const quizData = [
        {
            question: "Com que frequência você sente coceira, ardência ou desconforto na região íntima?",
            options: [
                { text: "Quase nunca", points: 1 },
                { text: "De vez em quando, principalmente no calor ou após a menstruação", points: 3 },
                { text: "Com frequência, parece que nunca passa completamente", points: 5 },
                { text: "Já perdi as contas… volta sempre 😞", points: 7 }
            ]
        },
        {
            question: "Você já teve crises repetidas de candidíase (mesmo após tratamento)?",
            options: [
                { text: "Nunca tive", points: 1 },
                { text: "Uma ou duas vezes na vida", points: 3 },
                { text: "Algumas vezes nos últimos anos", points: 5 },
                { text: "Sim, várias vezes… parece que sempre volta 😣", points: 7 }
            ]
        },
        {
            question: "Como você se sente em relação à sua libido e desejo sexual atualmente?",
            options: [
                { text: "Me sinto bem, tudo normal", points: 1 },
                { text: "Está um pouco mais baixa do que antes", points: 3 },
                { text: "Tenho dificuldade em me sentir \"no clima\"", points: 5 },
                { text: "Me sinto completamente desconectada do meu corpo e do meu desejo 😔", points: 7 }
            ]
        },
        {
            question: "Você sente que isso tem afetado sua autoestima ou seu relacionamento?",
            options: [
                { text: "Não, está tudo bem por enquanto", points: 1 },
                { text: "Um pouco, em alguns momentos", points: 3 },
                { text: "Bastante… já evitei momentos íntimos por isso", points: 5 },
                { text: "Sim, tem me deixado insegura e frustrada 😞", points: 7 }
            ]
        },
        {
            question: "Se você encontrasse uma solução natural, segura e fácil de usar para recuperar sua saúde íntima e sua confiança, o que faria?",
            options: [
                { text: "Gostaria de saber mais", points: 1 },
                { text: "Testaria por curiosidade", points: 3 },
                { text: "Começaria o quanto antes!", points: 5 },
                { text: "Com certeza! Isso mudaria minha vida 💗", points: 7 }
            ]
        }
    ];

    let currentQuestionIndex = 0;
    let userScore = 0;
    let selectedOptionButton = null;
    let countdownInterval = null;
    let feedbackTimeout = null;
    let isAdvancing = false; // Flag to prevent multiple advances

    // Elementos da tela inicial
    const introScreen = document.getElementById("intro-screen");
    const startQuizButton = document.getElementById("start-quiz-button");

    // Elementos do quiz
    const quizContainer = document.getElementById("quiz-container");
    const resultContainer = document.getElementById("result-container");
    const quizArea = document.getElementById("quiz-area");
    const progressBar = document.getElementById("progress-bar");
    const questionCardTemplate = document.getElementById("question-card-template");

    // Elementos da tela de resultado
    const resultIconArea = document.getElementById("result-icon-area");
    const resultTitle = document.getElementById("result-title");
    const resultMessage = document.getElementById("result-message");
    const discountArea = document.getElementById("discount-area");
    const paymentOnDeliveryMessageArea = document.getElementById("payment-on-delivery-message-area");
    const timerArea = document.getElementById("timer-area");
    const countdownTimerElement = document.getElementById("countdown-timer");
    const ctaButtonArea = document.getElementById("cta-button-area");
    const ctaButton = document.getElementById("cta-button");
    const captureFormArea = document.getElementById("capture-form-area");
    const submitCaptureButton = document.getElementById("submit-capture-button");
    const captureNameInput = document.getElementById("capture-name");
    const captureEmailInput = document.getElementById("capture-email");

    const finalCheckoutUrl = "https://entrega.logzz.com.br/pay/memqzmgzd/2-mes-de-tratamento-candilib";

    // Iniciar o quiz quando o botão da tela inicial for clicado
    startQuizButton.addEventListener("click", () => {
        // Ocultar a tela inicial com animação
        introScreen.classList.add("hidden-screen");
        
        // Exibir o quiz após um breve intervalo para a animação
        setTimeout(() => {
            introScreen.classList.add("hidden");
            quizContainer.classList.remove("hidden");
            
            // Iniciar o quiz carregando a primeira pergunta
            loadQuestion(currentQuestionIndex);
        }, 500);
    });

    function loadQuestion(index) {
        isAdvancing = false; // Reset flag when new question loads
        const existingCard = quizArea.querySelector(".quiz-card:not(#question-card-template)");
        if (existingCard) {
            existingCard.classList.add("hidden-left");
            setTimeout(() => existingCard.remove(), 500);
        }

        const newCard = questionCardTemplate.cloneNode(true);
        newCard.id = `question-card-${index}`;
        newCard.classList.remove("absolute", "top-0", "left-0", "w-full", "opacity-0", "pointer-events-none");
        newCard.style.position = "relative"; 
        newCard.classList.add("hidden-right", "opacity-0"); 

        const questionData = quizData[index];
        newCard.querySelector("#question-text").textContent = questionData.question;
        const optionsContainer = newCard.querySelector("#options-container");
        optionsContainer.innerHTML = "";

        questionData.options.forEach((option, optionIndex) => {
            const optionWrapper = document.createElement("div");
            optionWrapper.classList.add("relative");

            const button = document.createElement("button");
            button.innerHTML = option.text;
            button.classList.add("option-button", "w-full", "text-left", "candilib-texto-principal");
            button.dataset.points = option.points;
            button.dataset.feedbackId = `feedback-${index}-${optionIndex}`;
            button.addEventListener("click", () => selectOption(button));

            const feedbackDiv = document.createElement("div");
            feedbackDiv.id = `feedback-${index}-${optionIndex}`;
            feedbackDiv.classList.add("points-feedback");

            optionWrapper.appendChild(button);
            optionWrapper.appendChild(feedbackDiv);
            optionsContainer.appendChild(optionWrapper);
        });

        quizArea.appendChild(newCard);
        requestAnimationFrame(() => {
            newCard.classList.remove("hidden-right", "opacity-0");
        });

        updateProgressBar();
        selectedOptionButton = null; // Reset selected option for new question
        if (feedbackTimeout) clearTimeout(feedbackTimeout);
    }

    function selectOption(button) {
        if (isAdvancing) return; // Prevent action if already advancing
        isAdvancing = true; // Set flag to true

        if (selectedOptionButton) {
            selectedOptionButton.classList.remove("selected");
            const prevFeedbackId = selectedOptionButton.dataset.feedbackId;
            const prevFeedbackEl = document.getElementById(prevFeedbackId);
            if (prevFeedbackEl) {
                prevFeedbackEl.classList.remove("show");
                prevFeedbackEl.textContent = "";
            }
        }
        if (feedbackTimeout) clearTimeout(feedbackTimeout);

        selectedOptionButton = button;
        selectedOptionButton.classList.add("selected");

        const points = parseInt(button.dataset.points);
        const feedbackId = button.dataset.feedbackId;
        const feedbackEl = document.getElementById(feedbackId);
        if (feedbackEl) {
            feedbackEl.textContent = `+${points} pontos!`;
            feedbackEl.classList.add("show");
            feedbackTimeout = setTimeout(() => {
                if(feedbackEl) feedbackEl.classList.remove("show");
            }, 1500);
        }

        // Auto-advance logic
        userScore += points;
        currentQuestionIndex++;

        setTimeout(() => {
            if (currentQuestionIndex < quizData.length) {
                loadQuestion(currentQuestionIndex);
            } else {
                showResults();
            }
        }, 1800); // Delay for user to see feedback
    }

    function updateProgressBar() {
        const progress = ((currentQuestionIndex) / quizData.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function showResults() {
        quizContainer.classList.add("hidden");
        resultContainer.classList.remove("hidden"); // This makes the container visible
        progressBar.style.width = `100%`;
        displayResults(userScore);
        // Animation is handled by adding/removing 'visible' class in displayResults
    }

    function startCountdown(duration, displayElement) {
        let timer = duration;
        if (countdownInterval) clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            displayElement.textContent = minutes + ":" + seconds;
            if (--timer < 0) {
                clearInterval(countdownInterval);
                displayElement.textContent = "00:00";
                timerArea.innerHTML = "<p class=\"text-[#F76C6C] font-semibold\">Seu tempo esgotou!</p>";
                if (ctaButton) ctaButton.disabled = true;
                if (submitCaptureButton) submitCaptureButton.disabled = true;
            }
        }, 1000);
    }

    function displayResults(score) {
        let title = "";
        let message = "";
        let discountText = "";
        let paymentMessageText = "";
        let ctaText = "";
        let currentRedirectUrl = ""; 
        let showTimer = false;
        let showCapture = false;
        let showPaymentMessage = false;
        let iconHtml = ""; 
        let resultCardClasses = [];
        
        // Clear previous dynamic content and classes
        resultIconArea.innerHTML = "";
        resultTitle.innerHTML = "";
        resultMessage.innerHTML = "";
        discountArea.innerHTML = "";
        paymentOnDeliveryMessageArea.innerHTML = "";
        resultContainer.classList.remove("efeito-presente"); // Remove specific style class if it was added before

        if (score <= 12) {
            iconHtml = "<span class=\"result-icon text-4xl\">💛</span>";
            title = `Seu corpo está pedindo atenção`;
            message = "Cuidar de si é um ato de amor. Explore nossos conteúdos e descubra como Candilib pode te ajudar a reencontrar o equilíbrio.";
            ctaText = "Conhecer Candilib";
            currentRedirectUrl = "https://candilib.com.br/"; 
        } else if (score <= 20) {
            iconHtml = "<span class=\"result-icon text-4xl\">🎁</span>";
            title = `Você ganhou 10% OFF!`;
            message = "Um passo importante para seu bem-estar! Aproveite seu desconto exclusivo e comece a transformação com Candilib.";
            discountText = "<span class=\"font-bold text-xl text-[#F76C6C]\">10% de Desconto</span> aplicado.";
            paymentMessageText = "<p class=\"text-sm text-gray-600 mt-4\"><span class=\"font-semibold\">🛍️ Importante:</span> você só paga quando o produto chegar na sua casa. É seguro, prático e você não precisa inserir dados de cartão.</p>";
            ctaText = "Liberar meu desconto";
            currentRedirectUrl = finalCheckoutUrl; 
            showTimer = true;
            showPaymentMessage = true;
        } else if (score <= 28) {
            iconHtml = "<span class=\"result-icon text-4xl\">💖</span>";
            title = `Você conquistou 15% OFF!`;
            message = "Seu corpo merece esse cuidado especial! Use seu desconto e sinta os benefícios de Candilib na sua rotina.";
            discountText = "<span class=\"font-bold text-xl text-[#F76C6C]\">15% de Desconto</span> aplicado.";
            paymentMessageText = "<p class=\"text-sm text-gray-600 mt-4\"><span class=\"font-semibold\">🛍️ Importante:</span> você só paga quando o produto chegar na sua casa. É seguro, prático e você não precisa inserir dados de cartão.</p>";
            ctaText = "Quero meu desconto";
            currentRedirectUrl = finalCheckoutUrl; 
            showTimer = true;
            showPaymentMessage = true;
        } else { 
            iconHtml = "<span class=\"result-icon text-5xl\">🎀</span>"; 
            title = `Presente Especial Desbloqueado!`;
            message = `🎉 Parabéns! Você ganhou <span class="font-bold">20% de desconto + frete grátis + um ebook exclusivo</span> no tratamento com Candilib. Preencha abaixo para resgatar!`;
            discountText = ""; 
            paymentMessageText = "<p class=\"text-sm text-gray-600 mt-4\"><span class=\"font-semibold\">🛍️ Importante:</span> você só paga quando o produto chegar na sua casa. É seguro, prático e você não precisa inserir dados de cartão.</p>";
            ctaText = "Resgatar meu presente completo";
            currentRedirectUrl = finalCheckoutUrl; 
            showTimer = true;
            showCapture = true;
            resultCardClasses.push("efeito-presente"); 
            showPaymentMessage = true;
        }

        resultIconArea.innerHTML = iconHtml;
        resultTitle.innerHTML = title; 
        resultMessage.innerHTML = message;
        discountArea.innerHTML = discountText;

        if (showPaymentMessage) {
            paymentOnDeliveryMessageArea.innerHTML = paymentMessageText;
        } else {
            paymentOnDeliveryMessageArea.innerHTML = "";
        }

        if (resultCardClasses.length > 0) {
            resultContainer.classList.add(...resultCardClasses);
        }

        if (showTimer) {
            timerArea.classList.remove("hidden");
            startCountdown(15 * 60, countdownTimerElement);
        } else {
            timerArea.classList.add("hidden");
        }

        if (showCapture) {
            ctaButtonArea.classList.add("hidden");
            captureFormArea.classList.remove("hidden");
            submitCaptureButton.textContent = ctaText;
            submitCaptureButton.onclick = () => { 
                const name = captureNameInput.value.trim();
                const email = captureEmailInput.value.trim();
                if (name && email && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
                    console.log("Capture Data:", { name, email });
                    window.location.href = currentRedirectUrl;
                } else {
                    alert("Por favor, preencha seu nome e um e-mail válido.");
                }
            };
        } else {
            ctaButtonArea.classList.remove("hidden");
            captureFormArea.classList.add("hidden");
            ctaButton.textContent = ctaText;
            ctaButton.onclick = () => {
                window.location.href = currentRedirectUrl;
            };
        }
        
        // Animation handling: remove 'visible' to reset, then add 'visible' in next frame to trigger animation
        resultContainer.classList.remove("visible");
        requestAnimationFrame(() => {
            resultContainer.classList.add("visible");
        });
    }

    if (questionCardTemplate) {
         questionCardTemplate.remove(); // Remove template from DOM after cloning
    }
    
    // Não carregamos a primeira pergunta automaticamente, pois agora temos a tela inicial
    // loadQuestion(currentQuestionIndex);
});
