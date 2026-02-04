// Замените функцию createPages() на эту версию:
async function createPages() {
    // Простая геометрия для страницы
    const pageGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 8, 8);
    
    // Создаем все страницы
    for (let i = 0; i < PAGE_IMAGES.length; i++) {
        const pageGroup = new THREE.Group();
        
        // Создаем материал для страницы
        let frontMaterial, backMaterial;
        
        // Для тестирования используем цветные заглушки
        // Если хотите использовать реальные изображения - поместите их в папку images/
        try {
            // Пробуем загрузить текстуру из папки images
            const texture = await loadTexture(`./images/${PAGE_IMAGES[i]}`);
            frontMaterial = new THREE.MeshStandardMaterial({ 
                map: texture,
                roughness: 0.7,
                metalness: 0.1,
                side: THREE.FrontSide
            });
        } catch (error) {
            // Создаем цветную заглушку с номером страницы
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // Фон страницы
            const color = getPageColor(i);
            ctx.fillStyle = `#${color.toString(16).padStart(6, '0')}`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Текст "Страница X"
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 40px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`Страница ${i}`, canvas.width/2, canvas.height/2);
            
            // Подпись
            ctx.font = '20px Arial';
            ctx.fillStyle = '#666666';
            ctx.fillText('SMART-AV Каталог', canvas.width/2, canvas.height/2 + 60);
            
            const texture = new THREE.CanvasTexture(canvas);
            frontMaterial = new THREE.MeshStandardMaterial({ 
                map: texture,
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
function debugImageLoading() {
    console.log('Проверка наличия изображений:');
    PAGE_IMAGES.forEach((img, i) => {
        const imgUrl = `./images/${img}`;
        const imgTest = new Image();
        imgTest.onload = () => console.log(`✓ ${img} - доступно`);
        imgTest.onerror = () => console.log(`✗ ${img} - не найдено по пути: ${imgUrl}`);
        imgTest.src = imgUrl;
    });
}

// Вызовите эту функцию в init():
debugImageLoading();
