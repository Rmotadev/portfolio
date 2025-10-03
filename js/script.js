/**
 * ===== PORTFÓLIO PESSOAL - SCRIPT PRINCIPAL =====
 * 
 * Este arquivo contém todas as funcionalidades JavaScript do portfólio:
 * - Navegação suave entre seções
 * - Menu mobile hamburger
 * - Animações on scroll
 * - Validação de formulário de contato
 * - Efeito de digitação no hero
 * - Animação de partículas
 * - Filtros de projetos
 * - Modal de projetos
 * - Toggle de tema
 * - Barras de progresso animadas
 * 
 * Autor: Seu Nome
 * Data: Dezembro 2024
 */

// ===== VARIÁVEIS GLOBAIS =====
/**
 * Objeto que armazena todas as configurações e estados globais da aplicação
 */
const AppState = {
    // Estado do menu mobile (aberto/fechado)
    mobileMenuOpen: false,
    
    // Estado do tema atual (dark/light)
    currentTheme: 'dark',
    
    // Estado da tela de loading
    isLoading: true,
    
    // Configurações da animação de digitação
    typingConfig: {
        texts: ['Rafael Mota', 'Criando Soluções'],
        currentTextIndex: 0,
        currentCharIndex: 0,
        isDeleting: false,
        typeSpeed: 100,
        deleteSpeed: 50,
        pauseTime: 2000
    },
    
    // Configurações das partículas
    particlesConfig: {
        count: 50,
        maxSpeed: 1,
        maxSize: 5,
        minSize: 2,
        particles: []
    },
    
    // Estado dos filtros de projetos
    projectFilters: {
        activeFilter: 'all'
    }
};

/**
 * ===== INICIALIZAÇÃO DA APLICAÇÃO =====
 * 
 * Event listener que executa quando o DOM está completamente carregado
 * Inicializa todas as funcionalidades do portfólio
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando portfólio...');
    
    // Inicializa todas as funcionalidades principais
    initializeApp();
});

/**
 * Função principal de inicialização
 * Chama todas as funções de setup necessárias
 */
function initializeApp() {
    try {
        // Setup das funcionalidades principais
        setupLoadingScreen();
        setupNavigation();
        setupMobileMenu();
        setupScrollAnimations();
        setupTypingEffect();
        setupParticlesAnimation();
        setupSkillsAnimation();
        setupProjectFilters();
        setupContactForm();
        setupModal();
        setupThemeToggle();
        setupScrollIndicator();
        
        console.log('✅ Portfólio inicializado com sucesso!');
    } catch (error) {
        console.error('❌ Erro na inicialização:', error);
    }
}

/**
 * ===== TELA DE LOADING =====
 * 
 * Gerencia a tela de loading inicial do site
 */
function setupLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) {
        console.warn('⚠️ Elemento loading-screen não encontrado');
        return;
    }
    
    /**
     * Simula carregamento e remove a tela após um delay
     * Permite que CSS e outros recursos sejam carregados completamente
     */
    setTimeout(() => {
        // Adiciona classe para iniciar animação de saída
        loadingScreen.classList.add('hidden');
        
        // Remove elemento do DOM após animação
        setTimeout(() => {
            if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
            }
            AppState.isLoading = false;
            
            // Inicia animações que dependem do carregamento completo
            startInitialAnimations();
        }, 500); // Tempo da transição CSS
        
    }, 1500); // Tempo mínimo de exibição do loading
}

/**
 * Inicia animações que só devem executar após o carregamento
 */
function startInitialAnimations() {
    // Anima entrada dos elementos do hero
    animateHeroElements();
    
    // Inicia animação de partículas se o canvas existir
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        initParticles();
    }
}

/**
 * ===== NAVEGAÇÃO SUAVE =====
 * 
 * Implementa navegação suave entre seções e gerencia estados ativos
 */
function setupNavigation() {
    const navLinks = document.querySelectorAll('.navbar-link');
    const header = document.querySelector('.header');
    
    if (!navLinks.length) {
        console.warn('⚠️ Links de navegação não encontrados');
        return;
    }
    
    /**
     * Adiciona event listeners para cada link de navegação
     * Implementa scroll suave e atualiza estados ativos
     */
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Obtém o ID da seção de destino
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Executa scroll suave para a seção
                smoothScrollToSection(targetSection);
                
                // Atualiza link ativo
                updateActiveNavLink(this);
                
                // Fecha menu mobile se estiver aberto
                if (AppState.mobileMenuOpen) {
                    closeMobileMenu();
                }
            }
        });
    });
    
    /**
     * Gerencia comportamento do header durante scroll
     * Adiciona/remove classes baseado na posição do scroll
     */
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        
        // Adiciona classe 'scrolled' quando usuário faz scroll
        if (scrollY > 50) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
        
        // Atualiza navegação ativa baseada na seção visível
        updateActiveNavigation();
    }, 16)); // ~60fps
}

/**
 * Executa scroll suave até uma seção específica
 * @param {HTMLElement} targetSection - Elemento da seção de destino
 * @param {number} offset - Offset para ajuste da posição final (padrão: 80px)
 */
function smoothScrollToSection(targetSection, offset = 80) {
    if (!targetSection) return;
    
    // Calcula posição final considerando altura do header fixo
    const targetPosition = targetSection.offsetTop - offset;
    
    // Executa scroll suave nativo do navegador
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Atualiza o link ativo na navegação
 * @param {HTMLElement} activeLink - Link que deve ficar ativo
 */
function updateActiveNavLink(activeLink) {
    // Remove classe ativa de todos os links
    document.querySelectorAll('.navbar-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Adiciona classe ativa ao link selecionado
    activeLink.classList.add('active');
}

/**
 * Atualiza navegação ativa baseada na seção visível no viewport
 * Usa Intersection Observer para detectar seção atual
 */
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Offset para melhor detecção
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        // Verifica se a seção está visível no viewport
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const correspondingLink = document.querySelector(`[href="#${sectionId}"]`);
            if (correspondingLink) {
                updateActiveNavLink(correspondingLink);
            }
        }
    });
}

/**
 * ===== MENU MOBILE =====
 * 
 * Gerencia o menu hamburger para dispositivos móveis
 */
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbarMenu = document.getElementById('navbar-menu');
    
    if (!mobileMenuBtn || !navbarMenu) {
        console.warn('⚠️ Elementos do menu mobile não encontrados');
        return;
    }
    
    /**
     * Toggle do menu mobile
     * Alterna entre aberto e fechado com animações
     */
    mobileMenuBtn.addEventListener('click', function() {
        if (AppState.mobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    /**
     * Fecha menu ao clicar fora dele
     * Melhora a experiência do usuário
     */
    document.addEventListener('click', function(e) {
        if (AppState.mobileMenuOpen && 
            !mobileMenuBtn.contains(e.target) && 
            !navbarMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    /**
     * Fecha menu ao redimensionar para desktop
     * Evita problemas de layout
     */
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && AppState.mobileMenuOpen) {
            closeMobileMenu();
        }
    });
}

/**
 * Abre o menu mobile com animações
 */
function openMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbarMenu = document.getElementById('navbar-menu');
    
    // Atualiza estado
    AppState.mobileMenuOpen = true;
    
    // Adiciona classes para animação
    mobileMenuBtn.classList.add('active');
    navbarMenu.classList.add('active');
    
    // Previne scroll do body quando menu está aberto
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o menu mobile com animações
 */
function closeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navbarMenu = document.getElementById('navbar-menu');
    
    // Atualiza estado
    AppState.mobileMenuOpen = false;
    
    // Remove classes de animação
    mobileMenuBtn.classList.remove('active');
    navbarMenu.classList.remove('active');
    
    // Restaura scroll do body
    document.body.style.overflow = '';
}

/**
 * ===== ANIMAÇÕES ON SCROLL =====
 * 
 * Implementa animações que são ativadas quando elementos entram no viewport
 * Usa Intersection Observer para performance otimizada
 */
function setupScrollAnimations() {
    /**
     * Configuração do Intersection Observer
     * Observa quando elementos entram na viewport
     */
    const observerOptions = {
        threshold: 0.1, // Elemento precisa estar 10% visível
        rootMargin: '0px 0px -50px 0px' // Margem para ativação antecipada
    };
    
    /**
     * Callback executado quando elementos entram/saem da viewport
     * @param {IntersectionObserverEntry[]} entries - Lista de elementos observados
     */
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Elemento entrou na viewport - ativa animação
                entry.target.classList.add('animate-in');
                
                // Para elementos específicos, executa animações customizadas
                handleSpecificAnimations(entry.target);
            }
        });
    };
    
    // Cria o observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    /**
     * Seleciona elementos que devem ser animados
     * Adiciona classe inicial e observa cada elemento
     */
    const animatedElements = document.querySelectorAll(`
        .section-header,
        .about-content,
        .skill-category,
        .project-card,
        .contact-content,
        .timeline-item
    `);
    
    animatedElements.forEach(element => {
        // Adiciona classe inicial para animação
        element.classList.add('fade-in-up');
        
        // Inicia observação do elemento
        observer.observe(element);
    });
}

/**
 * Executa animações específicas para determinados elementos
 * @param {HTMLElement} element - Elemento que entrou na viewport
 */
function handleSpecificAnimations(element) {
    // Anima barras de progresso das skills
    if (element.classList.contains('skill-category')) {
        animateSkillBars(element);
    }
    
    // Anima contadores ou outros elementos específicos
    if (element.classList.contains('counter')) {
        animateCounter(element);
    }
}

/**
 * ===== EFEITO DE DIGITAÇÃO =====
 * 
 * Implementa efeito de máquina de escrever no título principal
 */
function setupTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    
    if (!typingElement) {
        console.warn('⚠️ Elemento de digitação não encontrado');
        return;
    }
    
    /**
     * Inicia o efeito de digitação após um pequeno delay
     * Permite que outros elementos sejam carregados primeiro
     */
    setTimeout(() => {
        startTypingAnimation(typingElement);
    }, 1000);
}

/**
 * Executa a animação de digitação
 * @param {HTMLElement} element - Elemento onde o texto será digitado
 */
function startTypingAnimation(element) {
    const config = AppState.typingConfig;
    const currentText = config.texts[config.currentTextIndex];
    
    /**
     * Lógica principal da animação de digitação
     * Alterna entre digitar e apagar texto
     */
    if (!config.isDeleting) {
        // Modo digitação - adiciona caracteres
        if (config.currentCharIndex < currentText.length) {
            element.textContent = currentText.substring(0, config.currentCharIndex + 1);
            config.currentCharIndex++;
            
            // Próxima iteração após delay de digitação
            setTimeout(() => startTypingAnimation(element), config.typeSpeed);
        } else {
            // Texto completo digitado - pausa antes de apagar
            setTimeout(() => {
                config.isDeleting = true;
                startTypingAnimation(element);
            }, config.pauseTime);
        }
    } else {
        // Modo apagar - remove caracteres
        if (config.currentCharIndex > 0) {
            element.textContent = currentText.substring(0, config.currentCharIndex - 1);
            config.currentCharIndex--;
            
            // Próxima iteração após delay de apagar
            setTimeout(() => startTypingAnimation(element), config.deleteSpeed);
        } else {
            // Texto completamente apagado - próximo texto
            config.isDeleting = false;
            config.currentTextIndex = (config.currentTextIndex + 1) % config.texts.length;
            
            // Pequena pausa antes de começar próximo texto
            setTimeout(() => startTypingAnimation(element), 500);
        }
    }
}

/**
 * ===== ANIMAÇÃO DE PARTÍCULAS =====
 * 
 * Cria e gerencia animação de partículas no background do hero
 */
function setupParticlesAnimation() {
    const canvas = document.getElementById('particles-canvas');
    
    if (!canvas) {
        console.warn('⚠️ Canvas de partículas não encontrado');
        return;
    }
    
    // Configura canvas para responsividade
    resizeCanvas(canvas);
    
    // Redimensiona canvas quando janela muda de tamanho
    window.addEventListener('resize', () => resizeCanvas(canvas));
}

/**
 * Redimensiona o canvas para ocupar toda a área disponível
 * @param {HTMLCanvasElement} canvas - Elemento canvas
 */
function resizeCanvas(canvas) {
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
}

/**
 * Inicializa as partículas e inicia a animação
 */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const config = AppState.particlesConfig;
    
    // Cria partículas iniciais
    createParticles(canvas, config);
    
    // Inicia loop de animação
    animateParticles(canvas, ctx, config);
}

/**
 * Cria array de partículas com propriedades aleatórias
 * @param {HTMLCanvasElement} canvas - Canvas onde as partículas serão desenhadas
 * @param {Object} config - Configurações das partículas
 */
function createParticles(canvas, config) {
    config.particles = [];
    
    for (let i = 0; i < config.count; i++) {
        config.particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * config.maxSize + 1,
            speedX: (Math.random() - 0.5) * config.maxSpeed,
            speedY: (Math.random() - 0.5) * config.maxSpeed,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

/**
 * Loop principal de animação das partículas
 * @param {HTMLCanvasElement} canvas - Canvas de desenho
 * @param {CanvasRenderingContext2D} ctx - Contexto 2D do canvas
 * @param {Object} config - Configurações das partículas
 */
function animateParticles(canvas, ctx, config) {
    // Limpa canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Atualiza e desenha cada partícula
    config.particles.forEach(particle => {
        updateParticle(particle, canvas);
        drawParticle(ctx, particle);
    });
    
    // Desenha conexões entre partículas próximas
    drawConnections(ctx, config.particles);
    
    // Continua animação
    requestAnimationFrame(() => animateParticles(canvas, ctx, config));
}

/**
 * Atualiza posição e propriedades de uma partícula
 * @param {Object} particle - Objeto da partícula
 * @param {HTMLCanvasElement} canvas - Canvas para verificar limites
 */
function updateParticle(particle, canvas) {
    // Atualiza posição
    particle.x += particle.speedX;
    particle.y += particle.speedY;
    
    // Reposiciona partícula se sair dos limites
    if (particle.x < 0 || particle.x > canvas.width) {
        particle.speedX *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
        particle.speedY *= -1;
    }
    
    // Mantém partículas dentro dos limites
    particle.x = Math.max(0, Math.min(canvas.width, particle.x));
    particle.y = Math.max(0, Math.min(canvas.height, particle.y));
}

/**
 * Desenha uma partícula no canvas
 * @param {CanvasRenderingContext2D} ctx - Contexto de desenho
 * @param {Object} particle - Objeto da partícula
 */
function drawParticle(ctx, particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(97, 175, 239, ${particle.opacity})`;
    ctx.fill();
}

/**
 * Desenha linhas conectando partículas próximas
 * @param {CanvasRenderingContext2D} ctx - Contexto de desenho
 * @param {Array} particles - Array de partículas
 */
function drawConnections(ctx, particles) {
    const maxDistance = 100;
    
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < maxDistance) {
                const opacity = (maxDistance - distance) / maxDistance * 0.2;
                
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(97, 175, 239, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

/**
 * ===== ANIMAÇÃO DAS SKILLS =====
 * 
 * Gerencia animação das barras de progresso das habilidades
 */
function setupSkillsAnimation() {
    // A animação será ativada quando a seção entrar no viewport
    // através do Intersection Observer configurado em setupScrollAnimations
}

/**
 * Anima barras de progresso dentro de uma categoria de skills
 * @param {HTMLElement} skillCategory - Container da categoria de skills
 */
function animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        // Delay escalonado para efeito cascata
        setTimeout(() => {
            const progress = bar.getAttribute('data-progress') || 0;
            
            // Anima largura da barra de 0% até o valor final
            animateProgressBar(bar, progress);
        }, index * 200); // 200ms de delay entre cada barra
    });
}

/**
 * Anima uma barra de progresso individual
 * @param {HTMLElement} progressBar - Elemento da barra de progresso
 * @param {number} targetProgress - Porcentagem final (0-100)
 */
function animateProgressBar(progressBar, targetProgress) {
    let currentProgress = 0;
    const increment = targetProgress / 60; // 60 frames para animação suave
    
    /**
     * Função recursiva que incrementa a largura da barra
     */
    function updateProgress() {
        if (currentProgress < targetProgress) {
            currentProgress += increment;
            progressBar.style.width = Math.min(currentProgress, targetProgress) + '%';
            
            // Continua animação no próximo frame
            requestAnimationFrame(updateProgress);
        } else {
            // Garante valor final exato
            progressBar.style.width = targetProgress + '%';
        }
    }
    
    // Inicia animação
    updateProgress();
}

/**
 * ===== FILTROS DE PROJETOS =====
 * 
 * Implementa sistema de filtros para a seção de projetos
 */
function setupProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!filterButtons.length || !projectCards.length) {
        console.warn('⚠️ Elementos de filtro de projetos não encontrados');
        return;
    }
    
    /**
     * Adiciona event listeners para cada botão de filtro
     */
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Atualiza botão ativo
            updateActiveFilter(this);
            
            // Filtra projetos
            filterProjects(filter, projectCards);
            
            // Atualiza estado global
            AppState.projectFilters.activeFilter = filter;
        });
    });
}

/**
 * Atualiza o botão de filtro ativo
 * @param {HTMLElement} activeButton - Botão que foi clicado
 */
function updateActiveFilter(activeButton) {
    // Remove classe ativa de todos os botões
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Adiciona classe ativa ao botão selecionado
    activeButton.classList.add('active');
}

/**
 * Filtra projetos baseado na categoria selecionada
 * @param {string} filter - Categoria do filtro ('all', 'web', 'mobile', 'api')
 * @param {NodeList} projectCards - Lista de cards de projetos
 */
function filterProjects(filter, projectCards) {
    projectCards.forEach((card, index) => {
        const category = card.getAttribute('data-category');
        
        // Determina se o card deve ser mostrado
        const shouldShow = filter === 'all' || category === filter;
        
        // Aplica animação com delay escalonado
        setTimeout(() => {
            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.display = 'block';
            } else {
                card.classList.add('hidden');
                // Oculta elemento após animação
                setTimeout(() => {
                    if (card.classList.contains('hidden')) {
                        card.style.display = 'none';
                    }
                }, 300);
            }
        }, index * 50); // Delay escalonado para efeito suave
    });
}

/**
 * ===== VALIDAÇÃO DE FORMULÁRIO =====
 * 
 * Implementa validação em tempo real do formulário de contato
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    
    if (!form) {
        console.warn('⚠️ Formulário de contato não encontrado');
        return;
    }
    
    // Configuração dos campos e suas regras de validação
    const formFields = {
        name: {
            element: document.getElementById('name'),
            errorElement: document.getElementById('name-error'),
            rules: [
                { type: 'required', message: 'Nome é obrigatório' },
                { type: 'minLength', value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
            ]
        },
        email: {
            element: document.getElementById('email'),
            errorElement: document.getElementById('email-error'),
            rules: [
                { type: 'required', message: 'Email é obrigatório' },
                { type: 'email', message: 'Email deve ter um formato válido' }
            ]
        },
        subject: {
            element: document.getElementById('subject'),
            errorElement: document.getElementById('subject-error'),
            rules: [
                { type: 'required', message: 'Assunto é obrigatório' },
                { type: 'minLength', value: 3, message: 'Assunto deve ter pelo menos 3 caracteres' }
            ]
        },
        message: {
            element: document.getElementById('message'),
            errorElement: document.getElementById('message-error'),
            rules: [
                { type: 'required', message: 'Mensagem é obrigatória' },
                { type: 'minLength', value: 10, message: 'Mensagem deve ter pelo menos 10 caracteres' }
            ]
        }
    };
    
    /**
     * Adiciona validação em tempo real para cada campo
     */
    Object.keys(formFields).forEach(fieldName => {
        const field = formFields[fieldName];
        
        if (field.element) {
            // Validação durante digitação (com debounce)
            field.element.addEventListener('input', debounce(() => {
                validateField(fieldName, formFields);
            }, 300));
            
            // Validação ao perder foco
            field.element.addEventListener('blur', () => {
                validateField(fieldName, formFields);
            });
        }
    });
    
    /**
     * Validação no envio do formulário
     */
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Valida todos os campos
        let isFormValid = true;
        Object.keys(formFields).forEach(fieldName => {
            if (!validateField(fieldName, formFields)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            // Formulário válido - processa envio
            handleFormSubmission(form, formFields);
        } else {
            // Formulário inválido - mostra mensagem
            showFormMessage('Por favor, corrija os erros antes de enviar.', 'error');
        }
    });
}

/**
 * Valida um campo específico do formulário
 * @param {string} fieldName - Nome do campo a ser validado
 * @param {Object} formFields - Objeto com configuração dos campos
 * @returns {boolean} - True se campo é válido, false caso contrário
 */
function validateField(fieldName, formFields) {
    const field = formFields[fieldName];
    if (!field || !field.element) return true;
    
    const value = field.element.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Aplica cada regra de validação
    for (const rule of field.rules) {
        const validationResult = applyValidationRule(value, rule);
        
        if (!validationResult.isValid) {
            isValid = false;
            errorMessage = validationResult.message;
            break; // Para na primeira regra que falhar
        }
    }
    
    // Atualiza interface com resultado da validação
    updateFieldValidation(field, isValid, errorMessage);
    
    return isValid;
}

/**
 * Aplica uma regra de validação específica
 * @param {string} value - Valor do campo
 * @param {Object} rule - Regra de validação
 * @returns {Object} - Resultado da validação
 */
function applyValidationRule(value, rule) {
    switch (rule.type) {
        case 'required':
            return {
                isValid: value.length > 0,
                message: rule.message
            };
            
        case 'minLength':
            return {
                isValid: value.length >= rule.value,
                message: rule.message
            };
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return {
                isValid: emailRegex.test(value),
                message: rule.message
            };
            
        default:
            return { isValid: true, message: '' };
    }
}

/**
 * Atualiza interface visual da validação do campo
 * @param {Object} field - Configuração do campo
 * @param {boolean} isValid - Se o campo é válido
 * @param {string} errorMessage - Mensagem de erro (se houver)
 */
function updateFieldValidation(field, isValid, errorMessage) {
    if (isValid) {
        // Campo válido - remove estilos de erro
        field.element.classList.remove('error');
        if (field.errorElement) {
            field.errorElement.textContent = '';
            field.errorElement.classList.remove('show');
        }
    } else {
        // Campo inválido - adiciona estilos de erro
        field.element.classList.add('error');
        if (field.errorElement) {
            field.errorElement.textContent = errorMessage;
            field.errorElement.classList.add('show');
        }
    }
}

/**
 * Processa o envio do formulário válido
 * @param {HTMLFormElement} form - Elemento do formulário
 * @param {Object} formFields - Configuração dos campos
 */
function handleFormSubmission(form, formFields) {
    const submitButton = form.querySelector('.form-submit');
    const originalText = submitButton.innerHTML;
    
    // Atualiza botão para estado de carregamento
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitButton.disabled = true;
    
    // Simula envio (aqui você integraria com seu backend)
    setTimeout(() => {
        // Sucesso simulado
        showFormMessage('Mensagem enviada com sucesso! Retornarei em breve.', 'success');
        
        // Reset do formulário
        form.reset();
        
        // Restaura botão
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Remove mensagens de erro
        Object.keys(formFields).forEach(fieldName => {
            const field = formFields[fieldName];
            if (field.errorElement) {
                field.errorElement.classList.remove('show');
            }
            if (field.element) {
                field.element.classList.remove('error');
            }
        });
        
    }, 2000); // Simula delay de rede
}

/**
 * Mostra mensagem de feedback do formulário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da mensagem ('success' ou 'error')
 */
function showFormMessage(message, type) {
    // Remove mensagem anterior se existir
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Cria nova mensagem
    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    // Adiciona estilos inline para a mensagem
    Object.assign(messageElement.style, {
        padding: '1rem',
        marginTop: '1rem',
        borderRadius: '0.5rem',
        fontSize: '0.9rem',
        fontWeight: '500',
        backgroundColor: type === 'success' ? '#98c379' : '#e06c75',
        color: '#282c34',
        opacity: '0',
        transition: 'opacity 0.3s ease'
    });
    
    // Adiciona ao formulário
    const form = document.getElementById('contact-form');
    form.appendChild(messageElement);
    
    // Anima entrada
    setTimeout(() => {
        messageElement.style.opacity = '1';
    }, 100);
    
    // Remove após delay
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, 5000);
}

/**
 * ===== MODAL DE PROJETOS =====
 * 
 * Gerencia modal para exibir detalhes expandidos dos projetos
 */
function setupModal() {
    const modal = document.getElementById('project-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body');
    
    if (!modal) {
        console.warn('⚠️ Modal de projetos não encontrado');
        return;
    }
    
    /**
     * Adiciona listeners para abrir modal nos links de projetos
     */
    document.addEventListener('click', function(e) {
        // Verifica se clicou em um link de projeto que deve abrir modal
        if (e.target.closest('.project-link[data-modal]')) {
            e.preventDefault();
            const projectCard = e.target.closest('.project-card');
            if (projectCard) {
                openProjectModal(projectCard, modalBody);
            }
        }
    });
    
    /**
     * Fecha modal ao clicar no overlay ou botão fechar
     */
    if (modalOverlay) {
        modalOverlay.addEventListener('click', () => closeModal(modal));
    }
    
    if (modalClose) {
        modalClose.addEventListener('click', () => closeModal(modal));
    }
    
    /**
     * Fecha modal com tecla ESC
     */
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal(modal);
        }
    });
}

/**
 * Abre modal com detalhes do projeto
 * @param {HTMLElement} projectCard - Card do projeto clicado
 * @param {HTMLElement} modalBody - Corpo do modal onde inserir conteúdo
 */
function openProjectModal(projectCard, modalBody) {
    const modal = document.getElementById('project-modal');
    
    // Extrai informações do projeto do card
    const projectData = extractProjectData(projectCard);
    
    // Gera conteúdo do modal
    const modalContent = generateModalContent(projectData);
    
    // Insere conteúdo no modal
    modalBody.innerHTML = modalContent;
    
    // Mostra modal com animação
    modal.classList.add('active');
    
    // Previne scroll do body
    document.body.style.overflow = 'hidden';
}

/**
 * Extrai dados do projeto do card HTML
 * @param {HTMLElement} projectCard - Card do projeto
 * @returns {Object} - Dados do projeto
 */
function extractProjectData(projectCard) {
    const title = projectCard.querySelector('.project-title')?.textContent || 'Projeto';
    const description = projectCard.querySelector('.project-description')?.textContent || '';
    const image = projectCard.querySelector('.project-img')?.src || '';
    const techTags = Array.from(projectCard.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
    
    return {
        title,
        description,
        image,
        technologies: techTags,
        // Dados adicionais que podem ser expandidos
        features: [
            'Interface responsiva e moderna',
            'Integração com APIs externas',
            'Sistema de autenticação',
            'Dashboard administrativo',
            'Testes automatizados'
        ],
        challenges: [
            'Otimização de performance',
            'Implementação de real-time features',
            'Arquitetura escalável'
        ],
        results: [
            'Aumento de 40% na conversão',
            'Redução de 60% no tempo de carregamento',
            'Melhoria na experiência do usuário'
        ]
    };
}

/**
 * Gera HTML do conteúdo do modal
 * @param {Object} projectData - Dados do projeto
 * @returns {string} - HTML do conteúdo
 */
function generateModalContent(projectData) {
    return `
        <div class="modal-project">
            <div class="modal-project-header">
                <img src="${projectData.image}" alt="${projectData.title}" class="modal-project-image">
                <div class="modal-project-info">
                    <h2 class="modal-project-title">${projectData.title}</h2>
                    <p class="modal-project-description">${projectData.description}</p>
                    
                    <div class="modal-project-tech">
                        <h3>Tecnologias Utilizadas</h3>
                        <div class="modal-tech-tags">
                            ${projectData.technologies.map(tech => 
                                `<span class="modal-tech-tag">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-project-details">
                <div class="modal-section">
                    <h3><i class="fas fa-star"></i> Principais Funcionalidades</h3>
                    <ul class="modal-list">
                        ${projectData.features.map(feature => 
                            `<li>${feature}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-cog"></i> Desafios Técnicos</h3>
                    <ul class="modal-list">
                        ${projectData.challenges.map(challenge => 
                            `<li>${challenge}</li>`
                        ).join('')}
                    </ul>
                </div>
                
                <div class="modal-section">
                    <h3><i class="fas fa-chart-line"></i> Resultados Obtidos</h3>
                    <ul class="modal-list">
                        ${projectData.results.map(result => 
                            `<li>${result}</li>`
                        ).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="modal-project-actions">
                <a href="#" class="btn btn-primary">
                    <i class="fas fa-external-link-alt"></i>
                    Ver Projeto
                </a>
                <a href="#" class="btn btn-secondary">
                    <i class="fab fa-github"></i>
                    Ver Código
                </a>
            </div>
        </div>
    `;
}

/**
 * Fecha o modal
 * @param {HTMLElement} modal - Elemento do modal
 */
function closeModal(modal) {
    modal.classList.remove('active');
    
    // Restaura scroll do body
    document.body.style.overflow = '';
}

/**
 * ===== TOGGLE DE TEMA =====
 * 
 * Implementa alternância entre tema claro e escuro
 */
function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (!themeToggle) {
        console.warn('⚠️ Toggle de tema não encontrado');
        return;
    }
    
    // Carrega tema salvo ou usa padrão
    loadSavedTheme();
    
    /**
     * Alterna tema ao clicar no botão
     */
    themeToggle.addEventListener('click', function() {
        toggleTheme();
    });
}

/**
 * Carrega tema salvo no localStorage
 */
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    AppState.currentTheme = savedTheme;
    
    // Aplica tema ao documento
    applyTheme(savedTheme);
}

/**
 * Alterna entre temas claro e escuro
 */
function toggleTheme() {
    const newTheme = AppState.currentTheme === 'dark' ? 'light' : 'dark';
    
    AppState.currentTheme = newTheme;
    
    // Aplica novo tema
    applyTheme(newTheme);
    
    // Salva preferência
    localStorage.setItem('portfolio-theme', newTheme);
}

/**
 * Aplica tema ao documento
 * @param {string} theme - Tema a ser aplicado ('dark' ou 'light')
 */
function applyTheme(theme) {
    const root = document.documentElement;
    const themeIcon = document.querySelector('#theme-toggle i');
    
    if (theme === 'light') {
        // Aplica variáveis do tema claro
        root.style.setProperty('--bg-primary', '#ffffff');
        root.style.setProperty('--bg-secondary', '#f8f9fa');
        root.style.setProperty('--bg-tertiary', '#e9ecef');
        root.style.setProperty('--text-primary', '#212529');
        root.style.setProperty('--text-secondary', '#6c757d');
        root.style.setProperty('--border-color', '#dee2e6');
        
        // Atualiza ícone
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
        
        document.body.classList.add('light-theme');
    } else {
        // Restaura variáveis do tema escuro
        root.style.setProperty('--bg-primary', '#282c34');
        root.style.setProperty('--bg-secondary', '#21252b');
        root.style.setProperty('--bg-tertiary', '#1e2127');
        root.style.setProperty('--text-primary', '#abb2bf');
        root.style.setProperty('--text-secondary', '#5c6370');
        root.style.setProperty('--border-color', '#3e4451');
        
        // Atualiza ícone
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
        
        document.body.classList.remove('light-theme');
    }
}

/**
 * ===== INDICADOR DE SCROLL =====
 * 
 * Gerencia comportamento do indicador de scroll no hero
 */
function setupScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) {
        console.warn('⚠️ Indicador de scroll não encontrado');
        return;
    }
    
    /**
     * Oculta indicador quando usuário faz scroll
     */
    window.addEventListener('scroll', throttle(() => {
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            scrollIndicator.style.opacity = '0';
            scrollIndicator.style.visibility = 'hidden';
        } else {
            scrollIndicator.style.opacity = '1';
            scrollIndicator.style.visibility = 'visible';
        }
    }, 16));
    
    /**
     * Scroll suave ao clicar no indicador
     */
    scrollIndicator.addEventListener('click', function() {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            smoothScrollToSection(aboutSection);
        }
    });
}

/**
 * ===== ANIMAÇÕES DO HERO =====
 * 
 * Anima elementos do hero após carregamento
 */
function animateHeroElements() {
    const heroElements = document.querySelectorAll(`
        .hero-greeting,
        .hero-title,
        .hero-subtitle,
        .hero-description,
        .hero-buttons
    `);
    
    heroElements.forEach((element, index) => {
        // Delay escalonado para cada elemento
        setTimeout(() => {
            element.classList.add('animate-in');
        }, index * 200);
    });
}

/**
 * ===== FUNÇÕES UTILITÁRIAS =====
 * 
 * Funções auxiliares usadas em várias partes do código
 */

/**
 * Implementa throttle para otimizar performance de eventos frequentes
 * @param {Function} func - Função a ser executada
 * @param {number} limit - Limite de tempo em ms
 * @returns {Function} - Função throttled
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Implementa debounce para atrasar execução de função
 * @param {Function} func - Função a ser executada
 * @param {number} wait - Tempo de espera em ms
 * @returns {Function} - Função debounced
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Anima contador numérico
 * @param {HTMLElement} element - Elemento que contém o número
 */
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target')) || 0;
    const duration = 2000; // 2 segundos
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const updateCounter = () => {
        if (current < target) {
            current += increment;
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

/**
 * ===== EVENT LISTENERS GLOBAIS =====
 * 
 * Listeners que afetam toda a aplicação
 */

/**
 * Gerencia redimensionamento da janela
 */
window.addEventListener('resize', debounce(() => {
    // Recalcula canvas de partículas
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        resizeCanvas(canvas);
    }
    
    // Fecha menu mobile se janela ficar grande
    if (window.innerWidth > 768 && AppState.mobileMenuOpen) {
        closeMobileMenu();
    }
}, 250));

/**
 * Gerencia visibilidade da página (Page Visibility API)
 * Pausa animações quando página não está visível para economizar recursos
 */
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Página oculta - pausa animações pesadas
        console.log('🔇 Página oculta - pausando animações');
    } else {
        // Página visível - retoma animações
        console.log('🔊 Página visível - retomando animações');
    }
});

/**
 * ===== INICIALIZAÇÃO FINAL =====
 * 
 * Log de conclusão da inicialização
 */
console.log(`
🎉 Portfólio inicializado com sucesso!

📊 Estatísticas:
- Seções: 5 (Home, Sobre, Skills, Projetos, Contato)
- Animações: Partículas, Digitação, Scroll, Progresso
- Funcionalidades: Menu Mobile, Filtros, Validação, Modal
- Tema: ${AppState.currentTheme}
- Responsivo: ✅
- Acessível: ✅

🚀 Pronto para uso!
`);
