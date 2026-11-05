// =========================
// ELEMENTS
// =========================

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

const themeToggle = document.getElementById("theme-toggle");

const scrollTopButton =
    document.getElementById("scroll-top");

const progressBar =
    document.querySelector(".scroll-progress-bar");

const cursorDot =
    document.querySelector(".cursor-dot");

const cursorRing =
    document.querySelector(".cursor-ring");


// =========================
// MOBILE NAVIGATION
// =========================

if (menuToggle && navMenu) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navMenu.classList.toggle("active");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

    });

}

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        if (menuToggle) {
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.setAttribute("aria-label", "Open navigation menu");
        }

    });

});


// =========================
// DARK / LIGHT MODE
// =========================

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "light") {

    document.body.classList.add("light-mode");

    if (themeToggle) {
        themeToggle.textContent = "🌙";
    }

} else {

    document.body.classList.remove("light-mode");

    if (themeToggle) {
        themeToggle.textContent = "☀️";
    }

}


if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");

        const isLightMode =
            document.body.classList.contains("light-mode");

        if (isLightMode) {

            themeToggle.textContent = "🌙";

            localStorage.setItem(
                "theme",
                "light"
            );

        } else {

            themeToggle.textContent = "☀️";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

    });

}


// =========================
// TYPING EFFECT
// =========================

const typingText =
    document.getElementById("typing-text");

if (typingText) {

    const typingWords = [

        "Computer Science Engineering Student",

        "Aspiring Software Developer",

        "Web Developer",

        "Problem Solver",

        "Technology Enthusiast"

    ];

    let wordIndex = 0;

    let characterIndex = 0;

    let deleting = false;


    function typeEffect() {

        const currentWord =
            typingWords[wordIndex];


        if (!deleting) {

            typingText.textContent =
                currentWord.substring(
                    0,
                    characterIndex + 1
                );

            characterIndex++;


            if (
                characterIndex ===
                currentWord.length
            ) {

                deleting = true;

                setTimeout(
                    typeEffect,
                    1600
                );

                return;

            }

        } else {

            typingText.textContent =
                currentWord.substring(
                    0,
                    characterIndex - 1
                );

            characterIndex--;


            if (characterIndex === 0) {

                deleting = false;

                wordIndex++;

                if (
                    wordIndex ===
                    typingWords.length
                ) {

                    wordIndex = 0;

                }

            }

        }


        setTimeout(
            typeEffect,
            deleting ? 45 : 80
        );

    }


    typeEffect();

}


// =========================
// SCROLL REVEAL
// =========================

const revealElements =
    document.querySelectorAll(".reveal");

if (revealElements.length > 0) {

    const revealObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("active");

                    } else {

                        entry.target.classList.remove("active");

                    }

                });

            },
            {
                threshold: 0.15
            }
        );

    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

}


// =========================
// SCROLL PROGRESS
// =========================

function updateScrollProgress() {

    if (!progressBar) {
        return;
    }


    const scrollTop =
        window.scrollY;

    const documentHeight =
        document.documentElement
            .scrollHeight -
        window.innerHeight;


    if (documentHeight <= 0) {

        progressBar.style.width = "0%";

        return;

    }


    const percentage =
        (scrollTop / documentHeight) * 100;


    progressBar.style.transform =
        `scaleX(${percentage / 100})`;

}


// =========================
// SCROLL TO TOP
// =========================

function updateScrollTopButton() {

    if (!scrollTopButton) {
        return;
    }


    if (window.scrollY > 500) {

        scrollTopButton
            .classList
            .add("show");

    } else {

        scrollTopButton
            .classList
            .remove("show");

    }

}


if (scrollTopButton) {

    scrollTopButton.addEventListener(
        "click",
        () => {

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }
    );

}


// =========================
// ACTIVE NAVIGATION
// =========================

function updateActiveNavigation() {

    const sections =
        document.querySelectorAll(
            "main section"
        );


    let currentSection = "";


    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;


        if (
            window.scrollY >= sectionTop &&
            window.scrollY <
                sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navLinks.forEach(link => {

        link.classList.remove("active");


        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}


// =========================
// SCROLL EVENT
// =========================

let scrollTicking = false;

function handleScroll() {

    if (scrollTicking) {
        return;
    }

    scrollTicking = true;

    requestAnimationFrame(() => {

        updateScrollProgress();
        updateScrollTopButton();
        updateActiveNavigation();

        scrollTicking = false;

    });

}

window.addEventListener(
    "scroll",
    handleScroll,
    { passive: true }
);


// Run once on page load

updateScrollProgress();

updateScrollTopButton();

updateActiveNavigation();


// =========================
// CUSTOM CURSOR
// =========================

const isTouchDevice =
    window.matchMedia(
        "(pointer: coarse)"
    ).matches;


if (
    cursorDot &&
    cursorRing &&
    !isTouchDevice
) {

    let cursorX = 0;
    let cursorY = 0;
    let cursorTicking = false;

    document.addEventListener(
        "mousemove",
        event => {

            cursorX = event.clientX;
            cursorY = event.clientY;

            if (cursorTicking) {
                return;
            }

            cursorTicking = true;

            requestAnimationFrame(() => {

                cursorDot.style.transform =
                    `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

                cursorRing.style.transform =
                    `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;

                cursorTicking = false;

            });

        },
        { passive: true }
    );


    const interactiveElements =
        document.querySelectorAll(
            "a, button, input, textarea, select"
        );


    interactiveElements.forEach(
        element => {

            element.addEventListener(
                "mouseenter",
                () => {

                    cursorRing
                        .classList
                        .add("hover");

                }
            );


            element.addEventListener(
                "mouseleave",
                () => {

                    cursorRing
                        .classList
                        .remove("hover");

                }
            );

        }
    );

}


// =========================
// REDUCED MOTION
// =========================

if (
    window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches
) {

    document.documentElement
        .style
        .scrollBehavior = "auto";

}


/* =========================
   CONTACT FORM
========================= */

const contactForm = document.getElementById("contact-form");
const contactSubmit = document.getElementById("contact-submit");
const contactSubmitText = contactSubmit
    ? contactSubmit.querySelector("#contact-submit-text")
    : null;
const formStatus = document.getElementById("form-status");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearFormErrors();

        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        const subjectInput = document.getElementById("contact-subject");
        const messageInput = document.getElementById("contact-message");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const subject = subjectInput.value.trim();
        const message = messageInput.value.trim();

        let isValid = true;

        /* =========================
           VALIDATION
        ========================= */

        if (name.length < 2) {
            showFieldError(
                nameInput,
                "Please enter your name."
            );
            isValid = false;
        }

        if (!isValidEmail(email)) {
            showFieldError(
                emailInput,
                "Please enter a valid email address."
            );
            isValid = false;
        }

        if (message.length < 10) {
            showFieldError(
                messageInput,
                "Message must contain at least 10 characters."
            );
            isValid = false;
        }

        if (!isValid) {
            showFormStatus(
                "Please correct the highlighted fields.",
                "error"
            );
            return;
        }

        /* =========================
           SUBMITTING
        ========================= */

        setSubmitState(true);

        showFormStatus(
            "Sending your message...",
            "sending"
        );

        /*
         * Submit through the hidden iframe.
         * This keeps the visitor on the portfolio page.
         */
        contactForm.submit();

        /*
         * Apps Script receives the POST request
         * asynchronously through the iframe.
         *
         * Give it a moment before showing success.
         */
        setTimeout(function () {
            setSubmitState(false);

            showFormStatus(
                "Message sent successfully! Thank you for contacting me.",
                "success"
            );

            contactForm.reset();

        }, 2000);
    });
}


/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email) {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
}


/* =========================
   FIELD ERROR
========================= */

function showFieldError(input, message) {
    if (!input) return;

    input.classList.add("input-error");

    const errorElement = document.createElement("div");

    errorElement.className = "field-error";
    errorElement.textContent = message;

    input.parentElement.appendChild(errorElement);
}


/* =========================
   CLEAR FORM ERRORS
========================= */

function clearFormErrors() {
    const errorFields = document.querySelectorAll(".input-error");

    errorFields.forEach(function (field) {
        field.classList.remove("input-error");
    });

    const errorMessages = document.querySelectorAll(".field-error");

    errorMessages.forEach(function (message) {
        message.remove();
    });

    if (formStatus) {
        formStatus.textContent = "";
        formStatus.className = "form-status";
    }
}


/* =========================
   FORM STATUS
========================= */

function showFormStatus(message, type) {
    if (!formStatus) return;

    formStatus.textContent = message;

    formStatus.className = "form-status";

    if (type) {
        formStatus.classList.add(type);
    }
}


/* =========================
   SUBMIT BUTTON STATE
========================= */

function setSubmitState(isSubmitting) {
    if (!contactSubmit) return;

    contactSubmit.disabled = isSubmitting;

    if (contactSubmitText) {
        contactSubmitText.textContent = isSubmitting
            ? "Sending..."
            : "Send Message";
    }
}

/* =========================================
   CINEMATIC PORTFOLIO INTRO
   Image sequence + scroll animation
========================================= */

(() => {
    "use strict";

    const config = window.PORTFOLIO_CONFIG;

    const intro = document.getElementById("cinematic-intro");
    const hero = document.getElementById("cinematic-hero");
    const canvas = document.getElementById("cinematic-canvas");
    const preloader = document.getElementById("cinematic-preloader");
    const preloaderProgress = document.getElementById("preloader-progress");
    const preloaderCounter = document.getElementById("preloader-counter");
    const frameCounter = document.getElementById("cinematic-frame-counter");
    const progressBar = document.getElementById("cinematic-progress-bar");
    const skipButton = document.getElementById("skip-cinematic-intro");
    const enterButton = document.querySelector(".cinematic-enter");

    if (
        !config ||
        !intro ||
        !hero ||
        !canvas ||
        !preloader ||
        !config.hero?.transitions
    ) {
        console.warn("Cinematic intro: required elements or config are missing.");
        return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
        console.warn("Cinematic intro: canvas is not supported.");
        preloader.classList.add("is-loaded");
        return;
    }

    const transitions = config.hero.transitions;
    const totalFrames = transitions.reduce(
        (total, transition) => total + transition.frames,
        0
    );

    const frameSources = [];

    transitions.forEach((transition) => {
        for (let frame = 1; frame <= transition.frames; frame++) {
            const frameNumber = String(frame).padStart(
                config.hero.frameDigits,
                "0"
            );

            frameSources.push(
                `${config.hero.basePath}${transition.name}/` +
                `${config.hero.framePrefix}${frameNumber}` +
                `${config.hero.frameExtension}`
            );
        }
    });

    const images = new Array(totalFrames);
    const loadedFrames = new Set();

    let currentFrame = 0;
    let targetFrame = 0;
    let animationStarted = false;
    let animationFrameId = null;
    let isSkipped = false;
    let preloadStarted = false;

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const smoothing = reducedMotion
        ? 1
        : config.animation.smoothing;

    /* -------------------------------------
       CANVAS SIZE
    ------------------------------------- */

    function resizeCanvas() {
        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            config.animation.pixelRatioLimit
        );

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);

        context.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        drawFrame(Math.round(currentFrame));
    }

    /* -------------------------------------
       DRAW IMAGE FRAME
    ------------------------------------- */

    function drawFrame(index) {
        const image = images[index];

        if (!image || !image.complete || !image.naturalWidth) {
            return;
        }

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        const imageRatio = image.naturalWidth / image.naturalHeight;
        const canvasRatio = width / height;

        let drawWidth;
        let drawHeight;
        let offsetX;
        let offsetY;

        if (canvasRatio > imageRatio) {
            drawWidth = width;
            drawHeight = width / imageRatio;
        } else {
            drawHeight = height;
            drawWidth = height * imageRatio;
        }

        offsetX = (width - drawWidth) / 2;
        offsetY = (height - drawHeight) / 2;

        context.clearRect(0, 0, width, height);
        context.drawImage(
            image,
            offsetX,
            offsetY,
            drawWidth,
            drawHeight
        );
    }

    /* -------------------------------------
       FIND NEAREST LOADED FRAME
    ------------------------------------- */

    function drawNearestLoadedFrame(index) {
        if (loadedFrames.has(index)) {
            drawFrame(index);
            return;
        }

        for (let distance = 1; distance < totalFrames; distance++) {
            const before = index - distance;
            const after = index + distance;

            if (before >= 0 && loadedFrames.has(before)) {
                drawFrame(before);
                return;
            }

            if (after < totalFrames && loadedFrames.has(after)) {
                drawFrame(after);
                return;
            }
        }
    }

    /* -------------------------------------
       LOAD A SINGLE FRAME
    ------------------------------------- */

    function loadFrame(index) {
        if (
            index < 0 ||
            index >= totalFrames ||
            images[index] ||
            isSkipped
        ) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const image = new Image();

            image.decoding = "async";

            image.onload = () => {
                images[index] = image;
                loadedFrames.add(index);
                resolve();
            };

            image.onerror = () => {
                console.warn("Could not load cinematic frame:", frameSources[index]);
                resolve();
            };

            image.src = frameSources[index];
        });
    }

    /* -------------------------------------
       PRELOAD INITIAL FRAMES
    ------------------------------------- */

    async function preloadInitialFrames() {
        if (preloadStarted) return;
        preloadStarted = true;

        const initialCount = Math.min(40, totalFrames);
        let completed = 0;

        const initialLoads = [];

        for (let index = 0; index < initialCount; index++) {
            initialLoads.push(
                loadFrame(index).then(() => {
                    completed++;

                    const percentage = Math.round(
                        (completed / initialCount) * 100
                    );

                    preloaderProgress.style.width = `${percentage}%`;
                    preloaderCounter.textContent = String(percentage).padStart(3, "0");
                })
            );
        }

        await Promise.all(initialLoads);

        if (isSkipped) return;

        drawNearestLoadedFrame(0);
        preloader.classList.add("is-loaded");

        animationStarted = true;
        startBackgroundLoading();
        startAnimation();
    }

    /* -------------------------------------
       LOAD REMAINING FRAMES IN BACKGROUND
    ------------------------------------- */

    async function startBackgroundLoading() {
        const batchSize = 12;

        for (
            let start = 40;
            start < totalFrames && !isSkipped;
            start += batchSize
        ) {
            const end = Math.min(start + batchSize, totalFrames);
            const batch = [];

            for (let index = start; index < end; index++) {
                batch.push(loadFrame(index));
            }

            await Promise.all(batch);

            if (isSkipped) break;
        }
    }

    /* -------------------------------------
       CHAPTER TEXT TIMING
    ------------------------------------- */

    function updateChapters(progress) {
        const chapters = document.querySelectorAll(
            ".cinematic-chapter"
        );

        const chapterRanges = [
            [0.00, 0.20],
            [0.22, 0.43],
            [0.48, 0.69],
            [0.76, 1.01]
        ];

        chapters.forEach((chapter, index) => {
            const range = chapterRanges[index];

            if (!range) return;

            const active =
                progress >= range[0] &&
                progress < range[1];

            chapter.classList.toggle("is-active", active);
        });
    }

    /* -------------------------------------
       UPDATE SCROLL PROGRESS
    ------------------------------------- */

    function updateScrollProgress() {
        if (isSkipped || !animationStarted) return;

        const rect = hero.getBoundingClientRect();

        const scrollDistance =
            hero.offsetHeight - window.innerHeight;

        if (scrollDistance <= 0) return;

        const progress = Math.min(
            1,
            Math.max(0, -rect.top / scrollDistance)
        );

        targetFrame = progress * (totalFrames - 1);

        if (progressBar) {
            progressBar.style.width = `${progress * 100}%`;
        }

        if (frameCounter) {
            const displayedFrame = Math.round(targetFrame) + 1;

            frameCounter.textContent =
                `${String(displayedFrame).padStart(4, "0")} / ` +
                `${String(totalFrames).padStart(4, "0")}`;
        }

        updateChapters(progress);
    }

    /* -------------------------------------
       ANIMATION LOOP
    ------------------------------------- */

    function animate() {
        if (!animationStarted || isSkipped) return;

        currentFrame += (targetFrame - currentFrame) * smoothing;

        if (Math.abs(targetFrame - currentFrame) < 0.1) {
            currentFrame = targetFrame;
        }

        const frameIndex = Math.max(
            0,
            Math.min(totalFrames - 1, Math.round(currentFrame))
        );

        drawNearestLoadedFrame(frameIndex);

        animationFrameId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        animationFrameId = requestAnimationFrame(animate);
    }

    /* -------------------------------------
       SKIP INTRO
    ------------------------------------- */

    function skipIntro(event) {
        if (event) event.preventDefault();

        if (isSkipped) return;

        isSkipped = true;
        animationStarted = false;

        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
        }

        intro.classList.add("is-skipped");
        preloader.classList.add("is-loaded");

        window.scrollTo({
            top: document.getElementById("home")?.offsetTop || 0,
            behavior: reducedMotion ? "auto" : "smooth"
        });
    }

    if (skipButton) {
        skipButton.addEventListener("click", skipIntro);
    }

    if (enterButton) {
        enterButton.addEventListener("click", skipIntro);
    }

    /* -------------------------------------
       EVENT LISTENERS
    ------------------------------------- */

    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });

    window.addEventListener("resize", resizeCanvas);

    /* -------------------------------------
       START
    ------------------------------------- */

    resizeCanvas();

    if (reducedMotion) {
        preloader.classList.add("is-loaded");
        intro.classList.add("is-skipped");
        isSkipped = true;
        return;
    }

    preloadInitialFrames();

})();