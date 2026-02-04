// Конфигурация
const TOTAL_PAGES = 16;
let currentPage = 1;
let soundEnabled = true;

// Звуки
const flipSound = new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-book-page-turn-014.mp3'],
    volume: 0.3
});

const clickSound = new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3'],
    volume: 0.2
});

// Загрузка страниц
function loadPages() {
    const flipbook = $('#flipbook');
    
    for (let i = 1; i <= TOTAL_PAGES; i++) {
        flipbook.append(`
            <div class="page">
                <img src="images/page${i}.jpg" alt="Страница ${i}" class="page-image">
                <div class="page-number">${i}</div>
            </div>
        `);
    }
    
    return flipbook;
}

// Инициализация
$(document).ready(function() {
    // Скрываем загрузчик
    setTimeout(() => {
        $('#loader').fadeOut(500);
    }, 1500);
    
    // Загружаем страницы
    const flipbook = loadPages().turn({
        width: '100%',
        height: '100%',
        autoCenter: true,
        duration: 800,
        when: {
            turning: function(e, page) {
                currentPage = page;
                $('#current-page').text(page);
                
                if (soundEnabled) {
                    flipSound.play();
                }
            }
        }
    });
    
    $('#total-pages').text(TOTAL_PAGES);
    
    // Управление кнопками
    $('#prev-btn').click(() => {
        flipbook.turn('previous');
        if (soundEnabled) clickSound.play();
    });
    
    $('#next-btn').click(() => {
        flipbook.turn('next');
        if (soundEnabled) clickSound.play();
    });
    
    // Навигация
    $('.nav-btn').click(function() {
        const page = $(this).data('page');
        flipbook.turn('page', page);
        if (soundEnabled) clickSound.play();
    });
    
    // Управление звуком
    $('#sound-toggle').click(function() {
        soundEnabled = !soundEnabled;
        $(this).html(soundEnabled ? 
            '<i class="fas fa-volume-up"></i><span>Звук: Вкл</span>' :
            '<i class="fas fa-volume-mute"></i><span>Звук: Выкл</span>'
        );
        if (soundEnabled) clickSound.play();
    });
    
    // Клавиатура
    $(document).keydown(function(e) {
        if (e.keyCode === 37) flipbook.turn('previous');
        if (e.keyCode === 39) flipbook.turn('next');
    });
});
