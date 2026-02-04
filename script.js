async function createPages() {
    console.log('=== СОЗДАНИЕ СТРАНИЦ ===');
    
    // Используем PlaneGeometry для страниц [3]
    const pageGeometry = new THREE.PlaneGeometry(PAGE_WIDTH, PAGE_HEIGHT, 8, 8);

    for (let i = 0; i < PAGE_IMAGES.length; i++) {
        console.log(`Создаем страницу ${i}: ${PAGE_IMAGES[i]}`);

        const pageGroup = new THREE.Group();
        let frontMaterial;

        // --- ЛОГИКА ЗАГРУЗКИ ИЗОБРАЖЕНИЯ ---
        try {
            const textureLoader = new THREE.TextureLoader();
            const texture = await new Promise((resolve, reject) => {
                textureLoader.load(
                    `images/${PAGE_IMAGES[i]}`,
                    (tex) => {
                        tex.encoding = THREE.sRGBEncoding; // Настройка цветопередачи [1]
                        tex.flipY = false;
                        tex.needsUpdate = true;
                        console.log(`✅ Загружено: ${PAGE_IMAGES[i]}`);
                        resolve(tex);
                    },
                    undefined,
                    (err) => {
                        console.error(`❌ Ошибка загрузки: ${PAGE_IMAGES[i]}`, err);
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
            // ФОЛБЭК: Если картинка не загрузилась, создаем текстовую заглушку [2, 4]
            console.warn(`Использую тестовую текстуру для страницы ${i}`);
            frontMaterial = new THREE.MeshStandardMaterial({
                color: getPageColor(i),
                roughness: 0.6,
                metalness: 0.1,
                side: THREE.FrontSide
            });
        }

        // Задняя сторона страницы (всегда серая для экономии ресурсов) [2, 5]
        const backMaterial = new THREE.MeshStandardMaterial({
            color: 0xf0f0f0,
            roughness: 0.8,
            metalness: 0.05,
            side: THREE.BackSide
        });

        // Создаем меш с двумя материалами [5]
        const pageMesh = new THREE.Mesh(pageGeometry, [backMaterial, frontMaterial]);
        pageMesh.castShadow = true;
        pageMesh.receiveShadow = true;

        // --- ЛОГИКА ПОЗИЦИОНИРОВАНИЯ [5-7] ---
        const isRightPage = i % 2 === 0; // Четные — правые, нечетные — левые
        const isCover = i === 0 || i === PAGE_IMAGES.length - 1;

        if (i === 0) {
            // Первая обложка
            pageGroup.rotation.y = Math.PI / 2;
            pageGroup.position.x = PAGE_WIDTH / 2;
            pageGroup.userData.isFlipped = false;
        } else if (i === PAGE_IMAGES.length - 1) {
            // Последняя обложка
            pageGroup.rotation.y = -Math.PI / 2;
            pageGroup.position.x = -PAGE_WIDTH / 2;
            pageGroup.userData.isFlipped = false;
        } else {
            // Внутренние страницы
            pageGroup.rotation.y = isRightPage ? Math.PI / 2 : -Math.PI / 2;
            pageGroup.position.x = isRightPage ? PAGE_WIDTH / 2 : -PAGE_WIDTH / 2;
            pageGroup.userData.isFlipped = !isRightPage;
        }

        // Смещение по Z для предотвращения мерцания (Z-fighting) [7]
        pageGroup.position.z = -i * PAGE_THICKNESS * 1.2;

        pageGroup.add(pageMesh);
        book.add(pageGroup); // Добавляем в основной объект книги

        // Сохраняем данные о странице для управления [7]
        pages.push({
            group: pageGroup,
            mesh: pageMesh,
            index: i,
            isRightPage: isRightPage,
            isCover: isCover,
            isFlipped: pageGroup.userData.isFlipped
        });
    }
    console.log(`=== ВСЕГО СОЗДАНО ${pages.length} СТРАНИЦ ===`);
}
