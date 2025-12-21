// ===== ПАРОЛЬНАЯ ЗАЩИТА С ХЭШИРОВАНИЕМ =====
(function() {
    'use strict';
    
    const CORRECT_HASH = '5a1359915cede405e86c4c0fc4e73bd6eeb0598eb12251de9e1d5113f78a28f8';
    const SALT = '__get_the_fuck_out';
    
    // Ждём загрузки DOM
    document.addEventListener('DOMContentLoaded', function() {
        // Проверка доступа
        const stored = sessionStorage.getItem('bi_auth_v2');
        
        if (!stored) {
            // Сразу скрываем body
            document.body.style.display = 'none';
            
            // Небольшая задержка для гарантии, что body скрыт
            setTimeout(() => {
                // Запрашиваем пароль
                const input = prompt('🔐 BI WEEKLY DIGEST\n\nВведите пароль для доступа:');
                
                if (!input) {
                    showAccessDenied();
                    return;
                }
                
                // Показываем экран проверки
                showLoadingScreen();
                
                // Асинхронная проверка пароля
                checkPassword(input).then(isValid => {
                    if (isValid) {
                        sessionStorage.setItem('bi_auth_v2', 'true');
                        // Показываем контент
                        document.body.style.display = 'block';
                        hideLoadingScreen();
                        // Перезагружаем, чтобы анимации сработали
                        location.reload();
                    } else {
                        showAccessDenied();
                    }
                }).catch(() => {
                    showAccessDenied();
                });
            }, 100);
        }
    });
    
    // ===== ФУНКЦИИ =====
    
    function showLoadingScreen() {
        const overlay = document.createElement('div');
        overlay.id = 'auth-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #1a1f35 0%, #2F364E 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        `;
        
        overlay.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="width: 50px; height: 50px; border: 3px solid rgba(255, 204, 51, 0.3);
                           border-radius: 50%; border-top-color: #FFCC33;
                           animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <h2 style="color: #FFCC33; margin-bottom: 10px;">Проверка доступа...</h2>
                <p>Идёт проверка пароля. Пожалуйста, подождите.</p>
                <style>
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                </style>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
    
    function hideLoadingScreen() {
        const overlay = document.getElementById('auth-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    async function checkPassword(password) {
        try {
            const hash = await sha256(password + SALT);
            return hash === CORRECT_HASH;
        } catch {
            return false;
        }
    }
    
    async function sha256(message) {
        const encoder = new TextEncoder();
        const data = encoder.encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    function showAccessDenied() {
        // Полностью заменяем документ
        document.documentElement.innerHTML = `
            <!DOCTYPE html>
            <html lang="ru">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Доступ ограничен</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        background: linear-gradient(135deg, #1a1f35 0%, #2F364E 100%);
                        color: white;
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 20px;
                    }
                    .container {
                        max-width: 500px;
                        text-align: center;
                        background: rgba(255, 255, 255, 0.05);
                        padding: 40px 30px;
                        border-radius: 20px;
                        backdrop-filter: blur(10px);
                        border: 1px solid rgba(255, 204, 51, 0.1);
                        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    }
                    .lock-icon {
                        font-size: 64px;
                        margin-bottom: 20px;
                        color: #FFCC33;
                    }
                    h1 {
                        color: #FFCC33;
                        margin-bottom: 15px;
                        font-size: 28px;
                    }
                    p {
                        color: rgba(255, 255, 255, 0.8);
                        line-height: 1.6;
                        margin-bottom: 10px;
                    }
                    .error-code {
                        background: rgba(237, 25, 37, 0.1);
                        border: 1px solid rgba(237, 25, 37, 0.3);
                        border-radius: 10px;
                        padding: 15px;
                        margin: 25px 0;
                        font-family: monospace;
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.9);
                    }
                    .retry-btn {
                        background: #FFCC33;
                        color: #2F364E;
                        border: none;
                        padding: 14px 35px;
                        border-radius: 25px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        margin-top: 20px;
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                    }
                    .retry-btn:hover {
                        background: #ffd966;
                        transform: translateY(-2px);
                        box-shadow: 0 10px 20px rgba(255, 204, 51, 0.3);
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid rgba(255, 255, 255, 0.1);
                        font-size: 14px;
                        color: rgba(255, 255, 255, 0.5);
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="lock-icon">🔒</div>
                    <h1>Доступ ограничен</h1>
                    <p>Неверный пароль или истёк срок действия доступа.</p>
                    <p>Этот дайджест предназначен только для членов команды BI Analytics.</p>
                    
                    <div class="error-code">
                        Ошибка: AUTH_2025_ACCESS_DENIED<br>
                        Код: 0xBI_DIGEST_SECURITY
                    </div>
                    
                    <button class="retry-btn" onclick="location.reload()">
                        <span>🔄</span> Попробовать снова
                    </button>
                    
                    <div class="footer">
                        BI Weekly Digest • Версия 3.5 • Только для внутреннего использования
                    </div>
                </div>
            </body>
            </html>
        `;
    }
})();

        
        // Simple animations on scroll
        document.addEventListener('DOMContentLoaded', function() {
            const animateElements = document.querySelectorAll('.animate');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1
            });
            animateElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
            // Animate chart bars
            const chartBars = document.querySelectorAll('.chart-bar');
            chartBars.forEach(bar => {
                const originalHeight = bar.style.height;
                bar.style.height = '0';
                setTimeout(() => {
                    bar.style.height = originalHeight;
                }, 300);
            });
        });


// ===== КАРУСЕЛЬ СОБЫТИЙ =====
let currentEventIndex = 0;
let autoSlideInterval;

// Объявляем функции в глобальной области ВИДИМОСТИ
function nextEvent() {
    const events = document.querySelectorAll('.event-card');
    currentEventIndex = (currentEventIndex + 1) % events.length;
    updateEvents();
    restartAutoSlide();
}

function prevEvent() {
    const events = document.querySelectorAll('.event-card');
    currentEventIndex = (currentEventIndex - 1 + events.length) % events.length;
    updateEvents();
    restartAutoSlide();
}

function goToEvent(index) {
    currentEventIndex = index;
    updateEvents();
    restartAutoSlide();
}

function updateEvents() {
    const events = document.querySelectorAll('.event-card');
    const dots = document.querySelectorAll('.carousel-dot');
    const eventCounter = document.getElementById('event-counter');

    events.forEach((event, index) => {
        event.classList.remove('active', 'prev', 'next');

        if (index === currentEventIndex) {
            event.classList.add('active');
        } else if (index === currentEventIndex - 1) {
            event.classList.add('prev');
        } else if (index === currentEventIndex + 1) {
            event.classList.add('next');
        } else if (currentEventIndex === 0 && index === events.length - 1) {
            event.classList.add('prev');
        } else if (currentEventIndex === events.length - 1 && index === 0) {
            event.classList.add('next');
        }
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentEventIndex);
    });

    if (eventCounter) {
        eventCounter.textContent = `${currentEventIndex + 1} / ${events.length}`;
    }
}

function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(nextEvent, 8000);
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
}

function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}

// Инициализация после загрузки
document.addEventListener('DOMContentLoaded', function() {
    // Создаем точки навигации
    const dotsContainer = document.getElementById('event-dots');
    const events = document.querySelectorAll('.event-card');

    if (dotsContainer && events.length > 0) {
        dotsContainer.innerHTML = '';
        events.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('carousel-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToEvent(index));
            dotsContainer.appendChild(dot);
        });
    }

    updateEvents();
    startAutoSlide();

    const carousel = document.querySelector('.events-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
    }
});
