<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>SMART-AV | 3D Бумажный каталог</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            margin: 0;
            overflow: hidden;
            background: linear-gradient(135deg, #0a0a1a, #1a1a3a);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: white;
            user-select: none;
        }
        
        canvas {
            display: block;
        }
        
        .header {
            position: absolute;
            top: 20px;
            left: 0;
            width: 100%;
            text-align: center;
            z-index: 100;
            pointer-events: none;
        }
        
        .logo {
            font-size: 48px;
            font-weight: 800;
            color: white;
            margin-bottom: 5px;
            text-shadow: 0 2px 10px rgba(0, 200, 255, 0.4);
        }
        
        .logo span {
            color: #00c8ff;
        }
        
        .subtitle {
            color: #a0b0ff;
            font-size: 16px;
            opacity: 0.9;
        }
        
        .controls {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            z-index: 100;
        }
        
        .btn {
            padding: 12px 30px;
            background: linear-gradient(135deg, rgba(0, 200, 255, 0.9), rgba(0, 136, 221, 0.9));
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            min-width: 120px;
            box-shadow: 0 5px 15px rgba(0, 200, 255, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 200, 255, 0.5);
        }
        
        .btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
            transform: none !important;
        }
        
        .page-indicator {
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 16px;
            font-weight: 500;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 100;
        }
        
        .hint {
            position: absolute;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            color: #8899cc;
            text-align: center;
            line-height: 1.6;
            max-width: 600px;
            background: rgba(0, 0, 0, 0.5);
            padding: 15px 25px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 100;
        }
        
        .loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: #00c8ff;
            z-index: 1000;
        }
        
        .fullscreen-btn {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 200, 255, 0.15);
            border: 2px solid rgba(0, 200, 255, 0.4);
            color: white;
            font-size: 24px;
            cursor: pointer;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .fullscreen-btn:hover {
            background: rgba(0, 200, 255, 0.3);
            transform: scale(1.1);
        }
        
        /* Панель быстрой навигации */
        .quick-nav-panel {
            position: absolute;
            bottom: 120px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            padding: 15px 25px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 100;
            display: none;
        }
        
        .quick-nav-title {
            color: #00c8ff;
            font-size: 14px;
            margin-bottom: 10px;
            text-align: center;
        }
        
        .quick-nav-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            max-width: 300px;
        }
        
        .quick-nav-btn {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            background: rgba(0, 200, 255, 0.1);
            border: 1px solid rgba(0, 200, 255, 0.3);
            color: white;
            cursor: pointer;
            font-size: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
        }
        
        .quick-nav-btn:hover {
            background: rgba(0, 200, 255, 0.3);
            transform: scale(1.1);
        }
        
        .quick-nav-btn.active {
            background: #00c8ff;
            color: #0a0a1a;
            box-shadow: 0 0 10px rgba(0, 200, 255, 0.5);
        }
        
        /* Кнопка навигации */
        .nav-toggle-btn {
            position: absolute;
            bottom: 120px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 200, 255, 0.15);
            border: 2px solid rgba(0, 200, 255, 0.4);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .nav-toggle-btn:hover {
            background: rgba(0, 200, 255, 0.3);
            transform: scale(1.1);
        }
        
        /* Кнопка звука */
        .sound-btn {
            position: absolute;
            bottom: 120px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(0, 200, 255, 0.15);
            border: 2px solid rgba(0, 200, 255, 0.4);
            color: white;
            font-size: 20px;
            cursor: pointer;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .sound-btn:hover {
            background: rgba(0, 200, 255, 0.3);
            transform: scale(1.1);
        }
        
        .sound-btn.muted {
            opacity: 0.5;
        }
        
        /* Уведомление */
        .notification {
            position: absolute;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 200, 255, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 10px;
            font-size: 14px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
        }
        
        .notification.show {
            opacity: 1;
        }
    </style>
    <!-- Font Awesome для иконок -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <div class="header">
        <div class="logo">SMART<span>AV</span></div>
        <p class="subtitle">3D бумажный каталог с реалистичной физикой</p>
    </div>
    
    <button class="fullscreen-btn" id="fullscreen-btn" title="Полный экран">
        <i class="fas fa-expand"></i>
    </button>
    
    <button class="sound-btn" id="sound-btn" title="Звук вкл/выкл">
        <i class="fas fa-volume-up"></i>
    </button>
    
    <button class="nav-toggle-btn" id="nav-toggle-btn" title="Быстрая навигация">
        <i class="fas fa-layer-group"></i>
    </button>
    
    <div class="page-indicator">
        Страница: <span id="current-page">0</span> / <span id="total-pages">15</span>
    </div>
    
    <div class="quick-nav-panel" id="quick-nav-panel">
        <div class="quick-nav-title">Быстрая навигация</div>
        <div class="quick-nav-buttons" id="quick-nav-buttons"></div>
    </div>
    
    <div class="notification" id="notification"></div>
    
    <div class="controls">
        <button id="prev-btn" class="btn">
            <i class="fas fa-chevron-left"></i> Назад
        </button>
        <button id="next-btn" class="btn">
            Вперед <i class="fas fa-chevron-right"></i>
        </button>
        <button id="reset-btn" class="btn">
            <i class="fas fa-redo"></i> Сброс
        </button>
    </div>
    
    <div class="hint">
        <p>• <strong>ЛКМ + движение</strong> – вращать книгу</p>
        <p>• <strong>Колесо мыши</strong> – приблизить/отдалить</p>
        <p>• <strong>Клик по странице</strong> – перевернуть</p>
        <p>• <strong>Стрелки ← →</strong> – листать страницы</p>
        <p>• <strong>Пробел</strong> – перевернуть текущую страницу</p>
    </div>
    
    <div class="loading" id="loading">
        <i class="fas fa-spinner fa-spin"></i> Загрузка 3D книги...
    </div>

    <script type="importmap">
        {
            "imports": {
                "three": "https://unpkg.com/three@0.164.1/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.164.1/examples/jsm/"
            }
        }
    </script>

    <script type="module">
        import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

        // Глобальные переменные
        let scene, camera, renderer, orbitControls;
        let book, pages = [];
        let currentPageIndex = 0;
        let isTurning = false;
        
        // Настройки
        const PAGE_WIDTH = 8;
        const PAGE_HEIGHT = 6;
        const PAGE_THICKNESS = 0.02;
        const TOTAL_PAGES = 16;
        
        // Звук и состояние
        let soundEnabled = true;
        let flipSound, clickSound;
        
        // Изображения для страниц (0-15)
        const PAGE_IMAGES = [
            'SMART-AV_company0.jpg',   // 0 - Обложка
            'SMART-AV_company1.jpg',   // 1
            'SMART-AV_company2.jpg',   // 2
            'SMART-AV_company3.jpg',   // 3
            'SMART-AV_company4.jpg',   // 4
            'SMART-AV_company5.jpg',   // 5
            'SMART-AV_company6.jpg',   // 6
            'SMART-AV_company7.jpg',   // 7
            'SMART-AV_company8.jpg',   // 8
            'SMART-AV_company9.jpg',   // 9
            'SMART-AV_company10.jpg',  // 10
            'SMART-AV_company11.jpg',  // 11
            'SMART-AV_company12.jpg',  // 12
            'SMART-AV_company13.jpg',  // 13
            'SMART-AV_company14.jpg',  // 14
            'SMART-AV_company15.jpg'   // 15 - Задняя обложка
        ];

        // Система анимаций
        const animations = [];
        function animateTo(target, property, endValue, duration = 1000, easing = 'easeInOut', onComplete) {
            const startValue = target[property];
            const startTime = Date.now();
            
            const animation = {
                target,
                property,
                startValue,
                endValue,
                startTime,
                duration,
                easing,
                update: function() {
                    const elapsed = Date.now() - this.startTime;
                    let progress = Math.min(elapsed / this.duration, 1);
                    
                    if (this.easing === 'easeInOut') {
                        progress = progress < 0.5 
                            ? 2 * progress * progress 
                            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                    } else if (this.easing === 'easeOut') {
                        progress = 1 - Math.pow(1 - progress, 3);
                    }
                    
                    this.target[this.property] = this.startValue + (this.endValue - this.startValue) * progress;
                    
                    if (progress >= 1) {
                        const index = animations.indexOf(this);
                        if (index > -1) animations.splice(index, 1);
                        if (onComplete) onComplete();
                    }
                }
            };
            
            animations.push(animation);
            return animation;
        }

        // Инициализация звуков
        function initSounds() {
            // Создаем Audio элементы для звуков
            flipSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-book-page-turn-014.mp3');
            flipSound.volume = 0.3;
            flipSound.preload = 'auto';
            
            clickSound = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3');
            clickSound.volume = 0.2;
            clickSound.preload = 'auto';
        }

        // Воспроизведение звука
        function playSound(sound) {
            if (!soundEnabled) return;
            
            try {
                sound.currentTime = 0;
                sound.play().catch(e => {
                    console.log('Звук не воспроизведен:', e);
                });
            } catch (e) {
                console.log('Ошибка воспроизведения звука:', e);
            }
        }

        // Показать уведомление
        function showNotification(message, duration = 2000) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, duration);
        }

        // Создать быструю навигацию
        function createQuickNavigation() {
            const container = document.getElementById('quick-nav-buttons');
            container.innerHTML = '';
            
            // Создаем кнопки для каждой страницы (кроме обложек)
            for (let i = 1; i <= TOTAL_PAGES - 2; i++) {
                const btn = document.createElement('button');
                btn.className = 'quick-nav-btn';
                btn.textContent = i;
                btn.title = `Перейти к странице ${i}`;
                btn.dataset.page = i;
                
                // Первая кнопка - это разворот страниц 1-2
                // Преобразуем номер кнопки в индекс страницы
                const pageIndex = i * 2 - 1;
                
                btn.addEventListener('click', () => {
                    goToPage(pageIndex);
                    playSound(clickSound);
                });
                
                container.appendChild(btn);
            }
            
            updateQuickNavButtons();
        }

        // Обновить активную кнопку в навигации
        function updateQuickNavButtons() {
            const buttons = document.querySelectorAll('.quick-nav-btn');
            buttons.forEach(btn => {
                btn.classList.remove('active');
                
                // Вычисляем какой разворот сейчас активен
                // currentPageIndex - это индекс страницы (0-15)
                // Для отображения в навигации: разворот = Math.floor((currentPageIndex - 1) / 2) + 1
                const currentSpread = Math.max(1, Math.floor((currentPageIndex - 1) / 2) + 1);
                
                if (parseInt(btn.dataset.page) === currentSpread) {
                    btn.classList.add('active');
                }
            });
        }

        // Переключить панель навигации
        function toggleNavPanel() {
            const panel = document.getElementById('quick-nav-panel');
            const isVisible = panel.style.display === 'block';
            
            if (isVisible) {
                panel.style.display = 'none';
            } else {
                panel.style.display = 'block';
                updateQuickNavButtons();
            }
            
            playSound(clickSound);
        }

        // Переключить звук
        function toggleSound() {
            soundEnabled = !soundEnabled;
            const soundBtn = document.getElementById('sound-btn');
            
            if (soundEnabled) {
                soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
                soundBtn.classList.remove('muted');
                showNotification('Звук включен');
            } else {
                soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
                soundBtn.classList.add('muted');
                showNotification('Звук выключен');
            }
            
            playSound(clickSound);
        }

        // Инициализация
        async function init() {
            // Инициализируем звуки
            initSounds();
            
            // Создаем сцену
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a1a);
            
            // Создаем камеру
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 2, 12);
            
            // Создаем рендерер
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            document.body.appendChild(renderer.domElement);
            
            // Освещение
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 10, 7);
            directionalLight.castShadow = true;
            scene.add(directionalLight);
            
            // Создаем книгу
            book = new THREE.Group();
            scene.add(book);
            
            // Загружаем текстуры и создаем страницы
            await createPages();
            
            // Настройка управления
            setupControls();
            
            // Создаем быструю навигацию
            createQuickNavigation();
            
            // Скрываем загрузку
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 1000);
            
            // Обновляем индикатор
            updatePageIndicator();
            
            // Анимационный цикл
            animate();
        }

        async function createPages() {
            // Простая геометрия для страницы
            const pageGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 8, 8);
            
            // Создаем все страницы
            for (let i = 0; i < PAGE_IMAGES.length; i++) {
                const pageGroup = new THREE.Group();
                
                // Создаем материал для страницы
                let frontMaterial, backMaterial;
                
                try {
                    // Загружаем текстуру
                    const texture = await loadTexture(`images/${PAGE_IMAGES[i]}`);
                    frontMaterial = new THREE.MeshStandardMaterial({ 
                        map: texture,
                        roughness: 0.7,
                        metalness: 0.1,
                        side: THREE.FrontSide
                    });
                } catch (error) {
                    // Создаем заглушку
                    const color = getPageColor(i);
                    frontMaterial = new THREE.MeshStandardMaterial({ 
                        color: color,
                        roughness: 0.7,
                        metalness: 0.1,
                        side: THREE.FrontSide
                    });
                }
                
                // Задняя сторона всегда серая
                backMaterial = new THREE.MeshStandardMaterial({ 
                    color: 0xf5f5f5,
                    roughness: 0.8,
                    metalness: 0.05,
                    side: THREE.BackSide
                });
                
                // Создаем меш с двойным материалом
                const pageMesh = new THREE.Mesh(pageGeometry, [backMaterial, frontMaterial]);
                pageMesh.castShadow = true;
                pageMesh.receiveShadow = true;
                
                // Определяем тип страницы
                const isRightPage = i % 2 === 0; // Четные - правые страницы
                const isCover = i === 0 || i === PAGE_IMAGES.length - 1;
                
                // Настройка позиции и поворота
                if (i === 0) {
                    // Обложка (правая)
                    pageGroup.rotation.y = Math.PI / 2;
                    pageGroup.position.x = PAGE_WIDTH / 2;
                    pageGroup.userData.isFlipped = false;
                } else if (i === PAGE_IMAGES.length - 1) {
                    // Задняя обложка (левая)
                    pageGroup.rotation.y = -Math.PI / 2;
                    pageGroup.position.x = -PAGE_WIDTH / 2;
                    pageGroup.userData.isFlipped = false;
                } else {
                    // Внутренние страницы
                    pageGroup.rotation.y = isRightPage ? Math.PI / 2 : -Math.PI / 2;
                    pageGroup.position.x = isRightPage ? PAGE_WIDTH / 2 : -PAGE_WIDTH / 2;
                    pageGroup.userData.isFlipped = !isRightPage; // Левые страницы сразу перевернуты
                }
                
                // Смещаем страницы по Z (толщина книги)
                pageGroup.position.z = -i * PAGE_THICKNESS * 1.2;
                
                pageGroup.add(pageMesh);
                book.add(pageGroup);
                
                // Сохраняем страницу
                pages.push({
                    group: pageGroup,
                    mesh: pageMesh,
                    index: i,
                    isRightPage: isRightPage,
                    isCover: isCover,
                    isFlipped: pageGroup.userData.isFlipped
                });
            }
        }

        function getPageColor(index) {
            if (index === 0) return 0x2c3e50; // Обложка
            if (index === PAGE_IMAGES.length - 1) return 0x34495e; // Задняя обложка
            return index % 2 === 0 ? 0xf8f9fa : 0xffffff; // Чередующиеся цвета для страниц
        }

        async function loadTexture(url) {
            return new Promise((resolve, reject) => {
                const loader = new THREE.TextureLoader();
                
                const timeout = setTimeout(() => {
                    reject(new Error(`Таймаут загрузки ${url}`));
                }, 3000);
                
                loader.load(
                    url,
                    (texture) => {
                        clearTimeout(timeout);
                        texture.encoding = THREE.sRGBEncoding;
                        resolve(texture);
                    },
                    undefined,
                    (error) => {
                        clearTimeout(timeout);
                        reject(error);
                    }
                );
            });
        }

        function setupControls() {
            // OrbitControls для вращения камеры
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            orbitControls.dampingFactor = 0.05;
            orbitControls.minDistance = 5;
            orbitControls.maxDistance = 25;
            orbitControls.maxPolarAngle = Math.PI / 2;
            
            // Обработчики кнопок
            document.getElementById('prev-btn').addEventListener('click', () => {
                flipToPage(-1);
                playSound(clickSound);
            });
            
            document.getElementById('next-btn').addEventListener('click', () => {
                flipToPage(1);
                playSound(clickSound);
            });
            
            document.getElementById('reset-btn').addEventListener('click', () => {
                resetBook();
                playSound(clickSound);
            });
            
            document.getElementById('fullscreen-btn').addEventListener('click', toggleFullscreen);
            document.getElementById('sound-btn').addEventListener('click', toggleSound);
            document.getElementById('nav-toggle-btn').addEventListener('click', toggleNavPanel);
            
            // Клик по странице для перелистывания
            renderer.domElement.addEventListener('click', (event) => {
                event.preventDefault();
                
                // Просто переворачиваем следующую страницу
                if (!isTurning && currentPageIndex < pages.length - 2) {
                    flipToPage(1);
                }
            });
            
            // Клавиатура
            document.addEventListener('keydown', (event) => {
                if (event.key === 'ArrowLeft') {
                    flipToPage(-1);
                    playSound(clickSound);
                }
                if (event.key === 'ArrowRight') {
                    flipToPage(1);
                    playSound(clickSound);
                }
                if (event.key === ' ') {
                    flipCurrentPage();
                    playSound(clickSound);
                }
                if (event.key === 'Home') {
                    goToPage(0);
                    playSound(clickSound);
                }
                if (event.key === 'End') {
                    goToPage(PAGE_IMAGES.length - 1);
                    playSound(clickSound);
                }
                if (event.key === 'f' || event.key === 'F') {
                    toggleFullscreen();
                    playSound(clickSound);
                }
                if (event.key === 'n' || event.key === 'N') {
                    toggleNavPanel();
                    playSound(clickSound);
                }
                if (event.key === 's' || event.key === 'S') {
                    toggleSound();
                }
            });
        }

        function flipToPage(direction) {
            if (isTurning) return;
            
            // Определяем какую страницу переворачивать
            let targetIndex = -1;
            
            if (direction > 0) {
                // Ищем следующую неперевернутую правую страницу
                for (let i = currentPageIndex + 1; i < pages.length - 1; i++) {
                    const page = pages[i];
                    if (!page.isCover && page.isRightPage && !page.isFlipped) {
                        targetIndex = i;
                        break;
                    }
                }
            } else {
                // Ищем предыдущую перевернутую левую страницу
                for (let i = currentPageIndex - 1; i > 0; i--) {
                    const page = pages[i];
                    if (!page.isCover && !page.isRightPage && page.isFlipped) {
                        targetIndex = i;
                        break;
                    }
                }
            }
            
            if (targetIndex > -1) {
                flipPage(targetIndex, direction);
            }
        }

        function flipPage(pageIndex, direction) {
            if (isTurning) return;
            
            const page = pages[pageIndex];
            if (!page || page.isCover) return;
            
            isTurning = true;
            
            // Воспроизводим звук перелистывания
            playSound(flipSound);
            
            // Определяем целевой поворот
            const targetRotation = direction > 0 
                ? (page.isRightPage ? -Math.PI / 2 : Math.PI / 2)
                : (page.isRightPage ? Math.PI / 2 : -Math.PI / 2);
            
            // Анимируем поворот
            animateTo(page.group.rotation, 'y', targetRotation, 1200, 'easeOut', () => {
                // Обновляем состояние
                page.isFlipped = !page.isFlipped;
                page.group.userData.isFlipped = page.isFlipped;
                isTurning = false;
                
                // Обновляем текущую страницу
                if (direction > 0) {
                    currentPageIndex = page.isRightPage ? pageIndex + 1 : pageIndex;
                } else {
                    currentPageIndex = page.isRightPage ? pageIndex - 1 : pageIndex - 2;
                }
                
                // Ограничиваем границы
                currentPageIndex = Math.max(0, Math.min(pages.length - 1, currentPageIndex));
                
                updatePageIndicator();
                updateQuickNavButtons();
            });
        }

        function flipCurrentPage() {
            // Переворачиваем текущую страницу
            const currentPage = pages[currentPageIndex];
            if (currentPage && !currentPage.isCover) {
                const direction = currentPage.isFlipped ? -1 : 1;
                flipPage(currentPageIndex, direction);
            }
        }

        function goToPage(pageIndex) {
            if (isTurning) return;
            
            playSound(clickSound);
            
            // Возвращаем все страницы в исходное положение
            pages.forEach((page) => {
                if (!page.isCover) {
                    const targetRotation = page.isRightPage ? Math.PI / 2 : -Math.PI / 2;
                    page.group.rotation.y = targetRotation;
                    page.isFlipped = !page.isRightPage;
                    page.group.userData.isFlipped = page.isFlipped;
                }
            });
            
            // Если переходим к странице больше 0, переворачиваем нужные страницы
            if (pageIndex > 0) {
                const sheetsToFlip = Math.floor((pageIndex - 1) / 2) + 1;
                
                // Переворачиваем листы один за другим
                let flipCounter = 0;
                const flipNextSheet = () => {
                    if (flipCounter < sheetsToFlip) {
                        const sheetIndex = flipCounter * 2 + 1; // Индекс правой страницы листа
                        setTimeout(() => {
                            flipPage(sheetIndex, 1);
                            flipCounter++;
                            setTimeout(flipNextSheet, 400);
                        }, 100);
                    }
                };
                
                flipNextSheet();
            } else {
                currentPageIndex = pageIndex;
                updatePageIndicator();
                updateQuickNavButtons();
            }
        }

        function resetBook() {
            goToPage(0);
        }

        function updatePageIndicator() {
            // Показываем текущую страницу разворота
            const displayPage = Math.floor(currentPageIndex / 2);
            document.getElementById('current-page').textContent = displayPage;
            document.getElementById('total-pages').textContent = Math.floor((PAGE_IMAGES.length - 2) / 2);
            
            // Включаем/выключаем кнопки
            document.getElementById('prev-btn').disabled = isTurning || currentPageIndex <= 0;
            document.getElementById('next-btn').disabled = isTurning || currentPageIndex >= pages.length - 2;
        }

        function toggleFullscreen() {
            playSound(clickSound);
            
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
                document.getElementById('fullscreen-btn').innerHTML = '<i class="fas fa-compress"></i>';
                showNotification('Полноэкранный режим');
            } else {
                document.exitFullscreen();
                document.getElementById('fullscreen-btn').innerHTML = '<i class="fas fa-expand"></i>';
                showNotification('Обычный режим');
            }
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function animate() {
            requestAnimationFrame(animate);
            
            // Обновляем анимации
            animations.forEach(anim => anim.update());
            
            // Обновляем управление
            orbitControls.update();
            
            // Рендерим сцену
            renderer.render(scene, camera);
        }

        // Инициализация
        window.addEventListener('load', init);
        window.addEventListener('resize', onWindowResize);
        
        // Обработчик полноэкранного режима
        document.addEventListener('fullscreenchange', () => {
            if (!document.fullscreenElement) {
                document.getElementById('fullscreen-btn').innerHTML = '<i class="fas fa-expand"></i>';
            }
        });
    </script>
</body>
</html>
