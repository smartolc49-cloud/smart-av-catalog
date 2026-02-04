// Вставьте этот код ВМЕСТО текущей функции createPages() в script.js

async function createPages() {
    console.log('=== СОЗДАНИЕ СТРАНИЦ ===');
    
    const pageGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 8, 8);
    
    // Создаем все страницы
    for (let i = 0; i < PAGE_IMAGES.length; i++) {
        console.log(`Создаем страницу ${i}: ${PAGE_IMAGES[i]}`);
        
        const pageGroup = new THREE.Group();
        let frontMaterial, backMaterial;
        
        // ТЕСТОВАЯ ТЕКСТУРА (закомментируйте этот блок, если хотите реальные изображения)
        // ==============================
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 768;
        const ctx = canvas.getContext('2d');
        
        // Градиентный фон
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        if (i === 0) {
            gradient.addColorStop(0, '#1a237e');
            gradient.addColorStop(1, '#283593');
        } else if (i === PAGE_IMAGES.length - 1) {
            gradient.addColorStop(0, '#0d47a1');
            gradient.addColorStop(1, '#1565c0');
        } else {
            gradient.addColorStop(0, i % 2 === 0 ? '#f5f5f5' : '#ffffff');
            gradient.addColorStop(1, i % 2 === 0 ? '#eeeeee' : '#fafafa');
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Текст
        ctx.fillStyle = i === 0 || i === PAGE_IMAGES.length - 1 ? '#ffffff' : '#333333';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (i === 0) {
            ctx.fillText('SMART-AV', canvas.width/2, canvas.height/2 - 60);
            ctx.font = 'bold 32px Arial';
            ctx.fillStyle = '#4fc3f7';
            ctx.fillText('КАТАЛОГ 2024', canvas.width/2, canvas.height/2);
            ctx.font = '24px Arial';
            ctx.fillStyle = '#bbdefb';
            ctx.fillText('3D бумажная версия', canvas.width/2, canvas.height/2 + 60);
        } else if (i === PAGE_IMAGES.length - 1) {
            ctx.fillText('КОНЕЦ', canvas.width/2, canvas.height/2 - 40);
            ctx.font = '28px Arial';
            ctx.fillText('Спасибо за просмотр!', canvas.width/2, canvas.height/2 + 40);
        } else {
            ctx.fillText(`Страница ${i}`, canvas.width/2, canvas.height/2 - 40);
            ctx.font = '28px Arial';
            ctx.fillStyle = '#666666';
            ctx.fillText(PAGE_IMAGES[i], canvas.width/2, canvas.height/2 + 40);
            
            // Добавляем линии для реалистичности
            ctx.strokeStyle = '#e0e0e0';
            ctx.lineWidth = 1;
            for (let y = 100; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(100, y);
                ctx.lineTo(canvas.width - 100, y);
                ctx.stroke();
            }
        }
        
        // Номер страницы в углу
        ctx.font = '20px Arial';
        ctx.fillStyle = '#999999';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        ctx.fillText(`${i}/${PAGE_IMAGES.length-1}`, canvas.width - 50, canvas.height - 30);
        
        const testTexture = new THREE.CanvasTexture(canvas);
        testTexture.encoding = THREE.sRGBEncoding;
        testTexture.needsUpdate = true;
        
        frontMaterial = new THREE.MeshStandardMaterial({ 
            map: testTexture,
            roughness: 0.6,
            metalness: 0.1,
            side: THREE.FrontSide
        });
        // ==============================
        // КОНЕЦ ТЕСТОВОЙ ТЕКСТУРЫ
        
        /*
        // РЕАЛЬНЫЕ ИЗОБРАЖЕНИЯ (раскомментируйте этот блок)
        try {
            console.log(`Попытка загрузить: images/${PAGE_IMAGES[i]}`);
            const textureLoader = new THREE.TextureLoader();
            
            const texture = await new Promise((resolve, reject) => {
                textureLoader.load(
                    `images/${PAGE_IMAGES[i]}`,
                    (tex) => {
                        tex.encoding = THREE.sRGBEncoding;
                        tex.flipY = false;
                        tex.needsUpdate = true;
                        console.log(`✅ Загружено: ${PAGE_IMAGES[i]}`);
                        resolve(tex);
                    },
                    undefined,
                    (err) => {
                        console.error(`❌ Ошибка: ${PAGE_IMAGES[i]}`, err);
                        reject(err);
                    }
                );
            });
            
            frontMaterial = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.6,
                metalness: 0.1,
                side: THREE.FrontSide
            });
        } catch (error) {
            console.warn(`Использую тестовую текстуру: ${error.message}`);
            frontMaterial = new THREE.MeshStandardMaterial({ 
                color: getPageColor(i),
                roughness: 0.6,
                metalness: 0.1,
                side: THREE.FrontSide
            });
        }
        */
        
        // Задняя сторона всегда серая
        backMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xf0f0f0,
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
            console.log(`Страница ${i}: Обложка (правая)`);
        } else if (i === PAGE_IMAGES.length - 1) {
            // Задняя обложка (левая)
            pageGroup.rotation.y = -Math.PI / 2;
            pageGroup.position.x = -PAGE_WIDTH / 2;
            pageGroup.userData.isFlipped = false;
            console.log(`Страница ${i}: Задняя обложка (левая)`);
        } else {
            // Внутренние страницы
            pageGroup.rotation.y = isRightPage ? Math.PI / 2 : -Math.PI / 2;
            pageGroup.position.x = isRightPage ? PAGE_WIDTH / 2 : -PAGE_WIDTH / 2;
            pageGroup.userData.isFlipped = !isRightPage;
            console.log(`Страница ${i}: ${isRightPage ? 'Правая' : 'Левая'}, перевернута: ${!isRightPage}`);
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
        
        console.log(`✓ Страница ${i} создана`);
    }
    
    console.log(`=== ВСЕГО СОЗДАНО ${pages.length} СТРАНИЦ ===`);
}

// ОСТАВЬТЕ функцию getPageColor без изменений
function getPageColor(index) {
    if (index === 0) return 0x1a237e; // Обложка
    if (index === PAGE_IMAGES.length - 1) return 0x0d47a1; // Задняя обложка
    return index % 2 === 0 ? 0xf5f5f5 : 0xffffff; // Чередующиеся цвета для страниц
}
