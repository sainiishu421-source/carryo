/* ============================================
   CARRYO — Antigravity Bag Brand
   script.js — Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- PARTICLE CANVAS ---------- */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            // Random neon color
            const colors = ['0, 212, 255', '168, 85, 247', '255, 51, 102', '57, 255, 20'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const particleCount = Math.min(120, Math.floor(window.innerWidth / 10));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Draw lines between nearby particles
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        drawConnections();
        animId = requestAnimationFrame(animateParticles);
    }
    animateParticles();

    /* ---------- NAVBAR SCROLL ---------- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    });

    /* ---------- MOBILE NAV TOGGLE ---------- */
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    /* ---------- STAT COUNTER ANIMATION ---------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsCounted = false;

    function animateCounters() {
        if (statsCounted) return;
        statsCounted = true;
        statNumbers.forEach(num => {
            const target = parseInt(num.getAttribute('data-target'));
            const duration = 2000;
            const startTime = performance.now();

            function updateCount(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                num.textContent = Math.floor(target * eased);
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    num.textContent = target;
                }
            }
            requestAnimationFrame(updateCount);
        });
    }

    /* ---------- SCROLL REVEAL ---------- */
    const revealElements = document.querySelectorAll('.reveal-up');
    const statsSection = document.querySelector('.hero-stats');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));

    // Stat counter observer
    if (statsSection) {
        const statsObs = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                statsObs.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        statsObs.observe(statsSection);
    }

    /* ---------- ADD TO CART TOAST ---------- */
    const cartButtons = document.querySelectorAll('.btn-add-cart');
    const toast = document.getElementById('cart-toast');
    const toastMsg = document.getElementById('toast-msg');
    let toastTimeout;

    cartButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productName = btn.getAttribute('data-name') || 'Item';
            toastMsg.textContent = `${productName} added to cart!`;
            toast.classList.add('show');
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);

            // Button feedback
            btn.textContent = '✓ ADDED';
            btn.style.background = 'linear-gradient(135deg, #39ff14, #00d4ff)';
            setTimeout(() => {
                btn.textContent = 'ADD TO CART';
                btn.style.background = '';
            }, 1500);
        });
    });

    /* ---------- DYNAMIC GLOW ON MOUSE (HERO) ---------- */
    const heroSection = document.querySelector('.hero-section');
    const heroGlow = document.querySelector('.hero-glow');

    if (heroSection && heroGlow) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            heroGlow.style.left = x + 'px';
            heroGlow.style.top = y + 'px';
            heroGlow.style.transform = 'translate(-50%, -50%)';
        });
    }

    /* ---------- TECH CARDS TILT EFFECT ---------- */
    const techCards = document.querySelectorAll('.tech-card, .product-card, .why-card');
    techCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `translateY(-8px) perspective(800px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ---------- ACTIVE NAV LINK HIGHLIGHT ---------- */
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 150;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            const link = document.querySelector(`.nav-links a[href="#${id}"]`);
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    link.style.color = '#00d4ff';
                } else {
                    link.style.color = '';
                }
            }
        });
    });

    /* ---------- SCROLL INDICATOR HIDE ON SCROLL ---------- */
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        window.addEventListener('scroll', () => {
            scrollIndicator.style.opacity = window.scrollY > 100 ? '0' : '1';
        });
    }

    /* ========================================
       CHATBOT
       ======================================== */
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatbot = document.getElementById('chatbot');
    const chatClose = document.getElementById('chatbot-close');
    const chatMessages = document.getElementById('chatbot-messages');
    const chatInput = document.getElementById('chatbot-input');
    const chatSend = document.getElementById('chatbot-send');
    const quickBtns = document.querySelectorAll('.quick-btn');

    // Toggle chat open/close
    chatToggle.addEventListener('click', () => {
        chatbot.classList.toggle('open');
        if (chatbot.classList.contains('open') && chatMessages.children.length === 0) {
            addBotMessage("Hey there! ⚡ I'm Carryo AI. Ask me about our antigravity bags, technology, shipping, or anything else!");
        }
    });
    chatClose.addEventListener('click', () => chatbot.classList.remove('open'));

    // Add a bot message bubble
    function addBotMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg bot';
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Add a user message bubble
    function addUserMessage(text) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg user';
        msg.textContent = text;
        chatMessages.appendChild(msg);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator, then reply
    function botReply(text) {
        const typing = document.createElement('div');
        typing.className = 'chat-typing';
        typing.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typing);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            typing.remove();
            addBotMessage(text);
        }, 800 + Math.random() * 600);
    }

    // Knowledge base — keyword to response mapping
    const knowledge = [
        {
            keys: ['product', 'bag', 'bags', 'lineup', 'models', 'which', 'what do you sell'],
            reply: "We have 3 beasts: 🎒 PHANTOM PACK ($499) — 35L backpack, 80% weight reduction. 💼 SPECTRE SLING ($399) — 20L messenger, stealth carbon body. 🧳 VORTEX DUFFEL ($699) — 50L travel duffel, dual EM cores. Want details on any of these?"
        },
        {
            keys: ['phantom', 'backpack', 'pack'],
            reply: "The PHANTOM PACK is our flagship. 35L capacity that feels like 7L. Features: 80% weight reduction, Quantum Weave shell, 48h battery, Neural Sync AI. All for $499. It's the #1 bestseller for a reason. 🔥"
        },
        {
            keys: ['spectre', 'sling', 'messenger'],
            reply: "The SPECTRE SLING is stealth meets force. 20L messenger bag with 75% weight reduction, stealth carbon body, 36h battery life, and USB-C quick charging. Just $399. Perfect for daily carry. 💼"
        },
        {
            keys: ['vortex', 'duffel', 'travel', 'big'],
            reply: "The VORTEX DUFFEL is a 50L beast. 85% weight reduction with DUAL electromagnetic cores, Kevlar fusion build, and 60h battery. At $699, it's the ultimate travel companion. 🧳"
        },
        {
            keys: ['tech', 'technology', 'how', 'work', 'antigravity', 'science'],
            reply: "Carryo uses electromagnetic suspension (EM Core) to create micro-levitation zones inside the bag. Combined with Quantum Weave carbon fabric (10x stronger than steel), solid-state graphene batteries (48h), and Neural Sync AI that adapts to your movements. It's real science, not magic. ⚡"
        },
        {
            keys: ['price', 'cost', 'how much', 'expensive', 'cheap', 'afford'],
            reply: "Our lineup: Phantom Pack — $499, Spectre Sling — $399, Vortex Duffel — $699. We also offer payment plans. Gravity is priceless — but freedom from it isn't. 💰"
        },
        {
            keys: ['ship', 'shipping', 'deliver', 'delivery', 'when'],
            reply: "We ship worldwide! 🌍 Standard shipping: 5-7 business days (free on orders over $300). Express: 2-3 business days ($19.99). All orders include tracking and insurance."
        },
        {
            keys: ['return', 'refund', 'exchange', 'money back', 'warranty'],
            reply: "30-day no-questions-asked returns. 2-year warranty on all products covering EM core, battery, and materials. If it breaks, we fix or replace it. We stand behind our tech. 🛡️"
        },
        {
            keys: ['battery', 'charge', 'power', 'last', 'long'],
            reply: "Battery life varies by model: Phantom Pack — 48h, Spectre Sling — 36h, Vortex Duffel — 60h. All use solid-state graphene cells with USB-C fast charging. Full charge in ~2 hours. 🔋"
        },
        {
            keys: ['weight', 'heavy', 'light', 'reduce', 'reduction'],
            reply: "Weight reduction: Phantom Pack 80%, Spectre Sling 75%, Vortex Duffel 85%. Our EM Core creates micro-levitation zones that counteract gravity on your contents. A 10kg load feels like 1.5–2.5kg! 🪶"
        },
        {
            keys: ['material', 'durable', 'strong', 'tough', 'waterproof'],
            reply: "All bags use Quantum Weave — a nano-engineered carbon lattice that's 10x stronger than steel, water-resistant, and scratch-proof. The Vortex Duffel adds Kevlar fusion for extreme durability. Built to survive anything. 💪"
        },
        {
            keys: ['ai', 'neural', 'smart', 'intelligent'],
            reply: "Neural Sync AI is our onboard intelligence system. It uses motion sensors to learn your walking/running patterns and redistributes weight in real-time for maximum comfort. It gets smarter the more you use it. 🧠"
        },
        {
            keys: ['hello', 'hi', 'hey', 'sup', 'yo', 'greetings'],
            reply: "Hey! Welcome to Carryo. ⚡ Ready to defy gravity? Ask me about our products, technology, or anything else!"
        },
        {
            keys: ['thank', 'thanks', 'awesome', 'great', 'cool'],
            reply: "You're welcome! If you have more questions, I'm here. Gravity waits for no one — but Carryo does. 😎"
        },
        {
            keys: ['buy', 'order', 'purchase', 'cart', 'checkout'],
            reply: "Ready to break free from gravity? 🚀 Scroll up to our Products section and hit 'ADD TO CART' on any bag. You can also click 'BUY CARRYO' in the navigation!"
        }
    ];

    // Match user input to knowledge base
    function getResponse(input) {
        const lower = input.toLowerCase().trim();
        for (const item of knowledge) {
            for (const key of item.keys) {
                if (lower.includes(key)) {
                    return item.reply;
                }
            }
        }
        return "I'm not sure I understood that. Try asking about our products, technology, pricing, shipping, or returns. Or click one of the quick buttons below! 🤖";
    }

    // Handle sending a message
    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;
        addUserMessage(text);
        chatInput.value = '';
        botReply(getResponse(text));
    }

    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Quick reply buttons
    const quickResponses = {
        products: "Tell me about your products",
        technology: "How does the antigravity technology work?",
        shipping: "What are your shipping options?",
        returns: "What's your return policy?"
    };

    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.getAttribute('data-q');
            const userText = quickResponses[q] || q;
            addUserMessage(userText);
            botReply(getResponse(userText));
        });
    });

});

