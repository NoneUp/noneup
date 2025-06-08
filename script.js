const grid = document.getElementById("grid");
        const scoreDisplay = document.getElementById("score");
        const bestDisplay = document.getElementById("best");
        const startBtn = document.getElementById("start");
        const playPauseBtnTop = document.getElementById("playPauseBtnTop");
        const playLine = startBtn.querySelector('.play-line');
        const pauseOverlay = document.getElementById("pauseOverlay");
        const continueBtn = document.getElementById("continueBtn");

        let size = 4;
        let tiles = [];
        let paused = true;
        let gameStarted = false;
        let gameOver = false;
        let currentScore = 0;

        // PWA елементи
        const installButton = document.getElementById('installButton'); // Кнопка "Встановити" у верхньому лівому куті
        const installModalOverlay = document.getElementById('installModalOverlay');
        const closeInstallModalBtn = document.getElementById('closeInstallModalBtn');
        const pwaInstallBtn = document.getElementById('pwaInstallBtn'); // Кнопка "Встановити" всередині модалки
        const installMessage = document.getElementById('installMessage');
        let deferredPrompt; // Для PWA встановлення

        // Мовні налаштування
        const translations = {
            uk: {
                gameTitle: "NoneUp",
                scoreLabel: "Очки",
                bestLabel: "Рекорд",
                startButton: "Грати",
                playButtonTitle: "Продовжити",
                pauseButtonTitle: "Пауза",
                rulesButton: "?",
                settingsButtonTitle: "Налаштування",
                rulesTitle: "Правила гри 2048",
                pcLabel: "На ПК:",
                pcControls: "керуй грою за допомогою стрілок: ← ↑ → ↓ або WASD.",
                phoneLabel: "На телефоні:",
                phoneControls: "керуй грою свайпами вгору, вниз, вліво та вправо.",
                gameGoal: "З'єднуй однакові числа, щоб отримати 2048!",
                settingsTitle: "Налаштування",
                controlsButton: "Управління",
                languageButton: "Мова ▼",
                themeButton: "Тема ▼",
                darkTheme: "Темна тема",
                lightTheme: "Світла тема",
                controlsTitle: "Управління",
                arrows: "Стрілки: ← ↑ → ↓",
                wasdControls: "альтернативне управління",
                spacePause: "Пробіл: пауза",
                closeButton: "Закрити",
                backButton: "Повернутися",
                pauseTitle: "Гра на паузі",
                pauseDescription: "Натисніть кнопку \"Продовжити\" або клавішу пробілу",
                continueButton: "Продовжити",
                // Нові переклади для модалки встановлення
                installModalTitle: "Встановити додаток",
                installModalDescription: "", // Змінено на порожній рядок
                installButtonText: "Встановити",
                installMessageUnable: "Наразі встановлення неможливе. Спробуйте пізніше або використовуйте функцію 'Додати на головний екран' у меню браузера.", 
                installMessageSuccess: "Додаток успішно встановлено!",
                installMessagePrompt: "" // Змінено на порожній рядок
            },
            en: {
                gameTitle: "NoneUp",
                scoreLabel: "Score",
                bestLabel: "Best",
                startButton: "Play",
                playButtonTitle: "Continue",
                pauseButtonTitle: "Pause",
                rulesButton: "?",
                settingsButtonTitle: "Settings",
                rulesTitle: "2048 Game Rules",
                pcLabel: "On PC:",
                pcControls: "control the game using arrow keys: ← ↑ → ↓ or WASD.",
                phoneLabel: "On Phone:",
                phoneControls: "control the game with swipes up, down, left, and right.",
                gameGoal: "Combine identical numbers to get 2048!",
                settingsTitle: "Settings",
                controlsButton: "Controls",
                languageButton: "Language ▼",
                themeButton: "Theme ▼",
                darkTheme: "Dark Theme",
                lightTheme: "Light Theme",
                controlsTitle: "Controls",
                arrows: "Arrows: ← ↑ → ↓",
                wasdControls: "alternative controls",
                spacePause: "Spacebar: pause",
                closeButton: "Close",
                backButton: "Back",
                pauseTitle: "Game Paused",
                pauseDescription: "Press the 'Continue' button or spacebar",
                continueButton: "Continue",
                installModalTitle: "Install App",
                installModalDescription: "", // Changed to empty string
                installButtonText: "Install",
                installMessageUnable: "Installation is currently not possible. Try again later or use the 'Add to Home Screen' feature in your browser menu.",
                installMessageSuccess: "App successfully installed!",
                installMessagePrompt: "" // Changed to empty string
            },
            zh: { // Китайська
                gameTitle: "NoneUp",
                scoreLabel: "分數",
                bestLabel: "最佳",
                startButton: "玩",
                playButtonTitle: "繼續",
                pauseButtonTitle: "暫停",
                rulesButton: "?",
                settingsButtonTitle: "設置",
                rulesTitle: "2048 遊戲規則",
                pcLabel: "在電腦上:",
                pcControls: "使用方向鍵控制遊戲：← ↑ → ↓ 或 WASD。",
                phoneLabel: "在手機上:",
                phoneControls: "通過向上、向下、向左和向右滑動來控制遊戲。",
                gameGoal: "合併相同的數字以獲得 2048！",
                settingsTitle: "設置",
                controlsButton: "控制",
                languageButton: "語言 ▼",
                themeButton: "主題 ▼",
                darkTheme: "深色主題",
                lightTheme: "淺色主題",
                controlsTitle: "控制",
                arrows: "箭頭: ← ↑ → ↓",
                wasdControls: "替代控制",
                spacePause: "空格鍵: 暫停",
                closeButton: "關閉",
                backButton: "返回",
                pauseTitle: "遊戲暫停",
                pauseDescription: "按\"繼續\"按鈕或空格鍵",
                continueButton: "繼續",
                installModalTitle: "安裝應用程式",
                installModalDescription: "", // 更改為空字符串
                installButtonText: "安裝",
                installMessageUnable: "目前無法安裝。請稍後再試或使用瀏覽器菜單中的\"新增至主螢幕\"功能。",
                installMessageSuccess: "應用程式已成功安裝！",
                installMessagePrompt: "" // 更改為空字符串
            },
            ja: { // Японська
                gameTitle: "NoneUp",
                scoreLabel: "スコア",
                bestLabel: "最高",
                startButton: "プレイ",
                playButtonTitle: "続行",
                pauseButtonTitle: "一時停止",
                rulesButton: "?",
                settingsButtonTitle: "設定",
                rulesTitle: "2048 ゲームルール",
                pcLabel: "PCで:",
                pcControls: "矢印キー：← ↑ → ↓ または WASD を使ってゲームを操作します。",
                phoneLabel: "携帯電話で:",
                phoneControls: "上下左右にスワイプしてゲームを操作します。",
                gameGoal: "同じ数字を結合して2048に到達しよう！",
                settingsTitle: "設定",
                controlsButton: "操作",
                languageButton: "言語 ▼",
                themeButton: "テーマ ▼",
                darkTheme: "ダークテーマ",
                lightTheme: "ライトテーマ",
                controlsTitle: "操作",
                arrows: "矢印: ← ↑ → ↓",
                wasdControls: "代替操作",
                spacePause: "スペースキー: 一時停止",
                closeButton: "閉じる",
                backButton: "戻る",
                pauseTitle: "ゲーム一時停止中",
                pauseDescription: "「続行」ボタンまたはスペースキーを押してください",
                continueButton: "続行",
                installModalTitle: "アプリをインストール",
                installModalDescription: "", // 空の文字列に変更
                installButtonText: "インストール",
                installMessageUnable: "現在インストールできません。後でもう一度試すか、ブラウザのメニューから「ホーム画面に追加」機能を使用してください。",
                installMessageSuccess: "アプリが正常にインストールされました！",
                installMessagePrompt: "" // 空の文字列に変更
            }
        };

        let currentLang = localStorage.getItem('lang') || 'uk'; // Отримуємо збережену мову або встановлюємо за замовчуванням українську

        // Функція для застосування перекладів
        function applyTranslations(lang) {
            const elements = document.querySelectorAll('[data-lang-key]');
            elements.forEach(element => {
                const key = element.dataset.langKey;
                // Перевіряємо на undefined, щоб дозволити порожні рядки
                if (translations[lang] && translations[lang][key] !== undefined) { 
                    element.textContent = translations[lang][key];
                }
            });

            // Оновлення title для кнопок, які не мають data-lang-key для title
            document.getElementById('installButton').title = translations[lang].installButtonText || 'Install';
            document.getElementById('settingsBtn').title = translations[lang].settingsButtonTitle || 'Settings';
            
            // Оновіть title для playPauseBtnTop відповідно до поточного стану (play/pause)
            if (playPauseBtnTop.classList.contains('play-icon')) {
                playPauseBtnTop.title = translations[lang].playButtonTitle;
            } else {
                playPauseBtnTop.title = translations[lang].pauseButtonTitle;
            }
            
            // Оновлення тексту кнопки закриття модалок
            document.querySelectorAll('.close-btn').forEach(btn => {
                btn.ariaLabel = translations[lang].closeButton || 'Close';
            });

            // Оновлення тексту кнопки повернення
            if (controlsBackBtn) {
                controlsBackBtn.ariaLabel = translations[lang].backButton || 'Back';
            }

            // Оновлення тексту кнопки "Встановити" в модалці встановлення (якщо PWA доступний)
            if (pwaInstallBtn) {
                pwaInstallBtn.textContent = translations[lang].installButtonText || 'Install';
            }
            
            // Оновлення повідомлення встановлення
            if (installMessage && installMessage.dataset.messageType) { 
                const messageType = installMessage.dataset.messageType;
                if (messageType === 'prompt') {
                    installMessage.textContent = translations[lang].installMessagePrompt;
                } else if (messageType === 'unable') {
                    installMessage.textContent = translations[lang].installMessageUnable;
                } else if (messageType === 'success') {
                    installMessage.textContent = translations[lang].installMessageSuccess;
                }
            }
        }

        // Функція для зміни теми
        function applyTheme(theme) {
            document.body.classList.remove('light', 'dark'); // Видаляємо всі теми
            if (theme === 'light') {
                document.body.classList.add('light');
            }
            // Якщо тема dark, то body.light не додається, залишаючи значення за замовчуванням
            localStorage.setItem('theme', theme);
        }

        function updateButtonVisibility() {
            if (gameOver || !gameStarted) {
                startBtn.style.display = 'block';
                playPauseBtnTop.style.display = 'none';
                pauseOverlay.style.display = 'none';
            } else if (paused) {
                startBtn.style.display = 'none';
                playPauseBtnTop.style.display = 'flex';
                playPauseBtnTop.classList.remove('pause-icon');
                playPauseBtnTop.classList.add('play-icon');
                playPauseBtnTop.querySelector('span').innerHTML = '▶';
                playPauseBtnTop.title = translations[currentLang].playButtonTitle;
                pauseOverlay.style.display = 'flex';
            } else {
                startBtn.style.display = 'none';
                playPauseBtnTop.style.display = 'flex';
                playPauseBtnTop.classList.remove('play-icon');
                playPauseBtnTop.classList.add('pause-icon');
                playPauseBtnTop.querySelector('span').innerHTML = '⏸︎';
                playPauseBtnTop.title = translations[currentLang].pauseButtonTitle;
                pauseOverlay.style.display = 'none';
            }
        }
        
        function setupNewGame() {
            startBtn.classList.add('animate');
            
            setTimeout(() => {
                grid.innerHTML = '';
                tiles = [];
                for (let i = 0; i < size * size; i++) {
                    const tile = document.createElement("div");
                    tile.className = "tile";
                    tile.dataset.val = '';
                    tile.textContent = '';
                    grid.appendChild(tile);
                    tiles.push(tile);
                }
                
                setTimeout(() => {
                    grid.classList.add('show');
                    addRandomTile();
                    setTimeout(() => {
                        addRandomTile();
                    }, 150);
                }, 100);
                
                updateScore(0);
                updateTileStyles();

                paused = false;
                gameStarted = true;
                gameOver = false;
                updateButtonVisibility();
                
                setTimeout(() => {
                    startBtn.classList.remove('animate');
                }, 500);
            }, 500);
        }

        function continueGame() {
            if (gameStarted && !gameOver) {
                paused = false;
                updateButtonVisibility();
            }
        }

        function pauseGame() {
            if (gameStarted && !gameOver) {
                paused = true;
                updateButtonVisibility();
            }
        }

        function togglePause() {
            if (gameStarted && !gameOver) {
                paused ? continueGame() : pauseGame();
            }
        }

        function addRandomTile() {
            const empty = tiles.filter(t => t.textContent === '');
            if (empty.length === 0) return;
            const tile = empty[Math.floor(Math.random() * empty.length)];
            tile.textContent = Math.random() < 0.9 ? 2 : 4;
            tile.classList.add('appear');
            setTimeout(() => {
                tile.classList.remove('appear');
            }, 300);
            updateTileStyles();
        }

        function updateTileStyles() {
            tiles.forEach(tile => {
                tile.dataset.val = tile.textContent || '';
            });
        }

        function merge(line) {
            let result = [];
            for (let i = 0; i < line.length; i++) {
                if (line[i] === null) continue;
                if (line[i] === line[i + 1]) {
                    result.push(line[i] * 2);
                    updateScore(currentScore + line[i] * 2);
                    i++;
                } else {
                    result.push(line[i]);
                }
            }
            while (result.length < size) result.push(null);
            return result;
        }

        function move(dir) {
            if (paused || gameOver) return;
            let moved = false;

            if (dir === 'up' || dir === 'down') {
                for (let col = 0; col < size; col++) {
                    let column = [];
                    for (let row = 0; row < size; row++) {
                        const i = row * size + col;
                        const val = parseInt(tiles[i].textContent) || null;
                        if (val) column.push(val);
                    }
                    if (dir === 'down') column.reverse();
                    const merged = merge(column);
                    if (dir === 'down') merged.reverse();
                    for (let row = 0; row < size; row++) {
                        const i = row * size + col;
                        const prev = tiles[i].textContent;
                        tiles[i].textContent = merged[row] || '';
                        if (prev !== tiles[i].textContent && tiles[i].textContent !== '') {
                            moved = true;
                            tiles[i].classList.add('merge');
                            setTimeout(() => {
                                tiles[i].classList.remove('merge');
                            }, 300);
                        }
                    }
                }
            } else {
                for (let row = 0; row < size; row++) {
                    let line = [];
                    for (let col = 0; col < size; col++) {
                        const i = row * size + col;
                        const val = parseInt(tiles[i].textContent) || null;
                        if (val) line.push(val);
                    }
                    if (dir === 'right') line.reverse();
                    const merged = merge(line);
                    if (dir === 'right') merged.reverse();
                    for (let col = 0; col < size; col++) {
                        const i = row * size + col;
                        const prev = tiles[i].textContent;
                        tiles[i].textContent = merged[col] || '';
                        if (prev !== tiles[i].textContent && tiles[i].textContent !== '') {
                            moved = true;
                            tiles[i].classList.add('merge');
                            setTimeout(() => {
                                tiles[i].classList.remove('merge');
                            }, 300);
                        }
                    }
                }
            }

            if (moved) {
                setTimeout(() => {
                    addRandomTile();
                    updateTileStyles();
                    if (isGameOver()) {
                        gameOver = true;
                        paused = true;
                        gameStarted = false;
                        updateButtonVisibility();
                    }
                }, 300);
            }
        }

        function isGameOver() {
            const copy = tiles.map(t => parseInt(t.textContent) || 0);
            for (let i = 0; i < size * size; i++) {
                if (copy[i] === 0) return false;
                const x = i % size;
                const y = Math.floor(i / size);
                if (x < size - 1 && copy[i] === copy[i + 1]) return false;
                if (y < size - 1 && copy[i] === copy[i + size]) return false;
            }
            return true;
        }

        function updateScore(score = 0) {
            currentScore = score;
            scoreDisplay.textContent = currentScore;
            const best = Math.max(score, parseInt(localStorage.getItem("best") || 0));
            localStorage.setItem("best", best);
            bestDisplay.textContent = best;
        }

        // Обробка клавіш
        document.addEventListener("keydown", e => {
            if (e.key === " ") { // Пробіл для паузи
                togglePause();
                e.preventDefault(); // Запобігаємо прокрутці сторінки
                return;
            }
            
            if (paused || gameOver) return;
            
            switch(e.key) {
                case "ArrowUp":
                case "w":
                case "W":
                    move("up");
                    break;
                case "ArrowDown":
                case "s":
                case "S":
                    move("down");
                    break;
                case "ArrowLeft":
                case "a":
                case "A":
                    move("left");
                    break;
                case "ArrowRight":
                case "d":
                case "D":
                    move("right");
                    break;
            }
        });

        // Обробка свайпів
        let startX, startY;
        document.addEventListener("touchstart", e => {
            if (paused || gameOver) return;
            // Перевіряємо, чи торкання не відбулося в межах модального вікна
            if (e.target.closest('.modal-overlay')) {
                return;
            }
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        });

        document.addEventListener("touchend", e => {
            if (paused || gameOver) return;
            // Перевіряємо, чи торкання не відбулося в межах модального вікна
            if (e.target.closest('.modal-overlay')) {
                return;
            }
            const touch = e.changedTouches[0];
            const dx = touch.clientX - startX;
            const dy = touch.clientY - startY;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 30) move("right");
                else if (dx < -30) move("left");
            } else {
                if (dy > 30) move("down");
                else if (dy < -30) move("up");
            }
        });

        // Ініціалізація модалок
        const rulesBtn = document.getElementById('rulesBtn');
        const settingsBtn = document.getElementById('settingsBtn');
        const controlsBtn = document.getElementById('controlsBtn');
        const rulesModal = document.getElementById('rulesModal');
        const settingsModal = document.getElementById('settingsModal');
        const controlsModal = document.getElementById('controlsModal');
        const langBtn = document.getElementById('langBtn');
        const langPopup = document.getElementById('langPopup');
        const themeBtn = document.getElementById('themeBtn');
        const themePopup = document.getElementById('themePopup');
        const controlsBackBtn = document.getElementById('controlsBackBtn');

        // Функції для відкриття/закриття модалок
        function openModal(modalElement) {
            modalElement.style.display = 'flex';
            if (gameStarted && !gameOver) { // Тільки якщо гра вже йде
                pauseGame(); // Пауза гри при відкритті будь-якої модалки
            }
        }

        function closeModal(modalElement) {
            modalElement.style.display = 'none';
            if (gameStarted && !gameOver && modalElement.id !== 'installModalOverlay') { // Не продовжувати, якщо закриваємо модалку встановлення після успіху
                continueGame(); // Продовжити гру при закритті модалки (крім модалки встановлення)
            }
        }

        // Обробники кліків для кнопок відкриття модалок
        rulesBtn.addEventListener('click', () => openModal(rulesModal));
        settingsBtn.addEventListener('click', () => openModal(settingsModal));
        controlsBtn.addEventListener('click', () => {
            closeModal(settingsModal); // Закриваємо налаштування перед відкриттям управління
            openModal(controlsModal);
        });
        controlsBackBtn.addEventListener('click', () => {
            closeModal(controlsModal); // Закриваємо управління
            openModal(settingsModal); // Відкриваємо налаштування назад
        });

        // Обробники кліків для кнопок закриття модалок (на X)
        document.querySelectorAll('.modal .close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                closeModal(e.target.closest('.modal-overlay'));
            });
        });

        // Обробники кліків для вибору мови
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Запобігти закриттю попапу, якщо клікнуто на кнопку
            langPopup.style.display = langPopup.style.display === 'flex' ? 'none' : 'flex';
            themePopup.style.display = 'none'; // Закрити інший попап
        });

        document.querySelectorAll('#langPopup button').forEach(button => {
            button.addEventListener('click', () => {
                const selectedLang = button.dataset.lang;
                currentLang = selectedLang;
                localStorage.setItem('lang', currentLang);
                applyTranslations(currentLang);
                langPopup.style.display = 'none'; // Закрити попап після вибору
            });
        });

        // Обробники кліків для вибору теми
        themeBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Запобігти закриттю попапу, якщо клікнуто на кнопку
            themePopup.style.display = themePopup.style.display === 'flex' ? 'none' : 'flex';
            langPopup.style.display = 'none'; // Закрити інший попап
        });

        document.querySelectorAll('#themePopup button').forEach(button => {
            button.addEventListener('click', () => {
                const selectedTheme = button.dataset.theme;
                applyTheme(selectedTheme);
                themePopup.style.display = 'none'; // Закрити попап після вибору
            });
        });

        // Закрити попапи, якщо клікнути десь поза ними
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langPopup.contains(e.target)) {
                langPopup.style.display = 'none';
            }
            if (!themeBtn.contains(e.target) && !themePopup.contains(e.target)) {
                themePopup.style.display = 'none';
            }
        });

        // Обробник для кнопки "Грати"
        startBtn.addEventListener('click', () => {
            setupNewGame();
        });

        // Обробник для кнопки "Продовжити/Пауза" у верхньому лівому куті
        playPauseBtnTop.addEventListener('click', togglePause);

        // Обробник для кнопки "Продовжити" в модалці паузи
        continueBtn.addEventListener('click', continueGame);

        // PWA логіка
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installButton.style.display = 'flex'; // Показуємо кнопку "Встановити" у верхньому лівому куті
            // Не показуємо модалку автоматично, чекаємо на клік користувача
        });

        // Обробник кліку для кнопки встановлення PWA (у верхньому лівому куті)
        installButton.addEventListener('click', () => {
            if (deferredPrompt) {
                showInstallModal('prompt'); // Показуємо модалку із закликом до встановлення
            } else {
                showInstallModal('unable'); // Якщо prompt недоступний, показуємо повідомлення про неможливість
            }
        });

        // Обробник кліку для кнопки "Встановити" всередині модалки
        pwaInstallBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                pwaInstallBtn.style.display = 'none'; // Приховуємо кнопку під час встановлення
                installMessage.textContent = ''; // Очищаємо попереднє повідомлення

                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                    showInstallModal('success'); // Показуємо повідомлення про успіх
                } else {
                    console.log('User dismissed the A2HS prompt');
                    hideInstallModal(); // Закриваємо модалку, якщо користувач відхилив
                }
                deferredPrompt = null; // Використали prompt, скидаємо його
            }
        });

        // Обробник для закриття модалки встановлення PWA
        closeInstallModalBtn.addEventListener('click', hideInstallModal);

        // Функція для відображення модалки встановлення з відповідним повідомленням
        function showInstallModal(messageType) {
            installModalOverlay.style.display = 'flex';
            installMessage.dataset.messageType = messageType; // Встановлюємо тип повідомлення
            
            // Оновлюємо видимість кнопки та текст повідомлення
            // Тут використовуємо порожні рядки для "prompt" та "description"
            if (messageType === 'prompt') {
                pwaInstallBtn.style.display = 'block';
                installMessage.textContent = translations[currentLang].installMessagePrompt; // Тепер буде порожнім
            } else if (messageType === 'unable') {
                pwaInstallBtn.style.display = 'none';
                installMessage.textContent = translations[currentLang].installMessageUnable;
            } else if (messageType === 'success') {
                pwaInstallBtn.style.display = 'none';
                installMessage.textContent = translations[currentLang].installMessageSuccess;
            }
            // Переконайтесь, що заголовок та опис також оновлюються
            applyTranslations(currentLang);
        }

        // Функція для приховування модалки встановлення PWA
        function hideInstallModal() {
            installModalOverlay.style.display = 'none';
            installMessage.textContent = ''; // Очищаємо повідомлення при закритті
            installMessage.dataset.messageType = ''; // Скидаємо тип повідомлення
        }

        // Обробник події після встановлення PWA
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            installButton.style.display = 'none'; // Приховуємо кнопку "Встановити" у верхньому лівому куті
            hideInstallModal(); // Закриваємо модалку, якщо вона була відкрита
        });

        // Ініціалізація при завантаженні сторінки
        document.addEventListener('DOMContentLoaded', () => {
            applyTranslations(currentLang); // Застосувати переклади
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                applyTheme(savedTheme); // Застосувати збережену тему
            } else {
                applyTheme('dark'); // Тема за замовчуванням
            }
            updateScore(0); // Оновити рекорд при завантаженні
            updateButtonVisibility(); // Оновити видимість кнопок після застосування мови
            // Початкове приховання кнопки PWA, якщо deferredPrompt ще не спрацював
            if (!deferredPrompt) {
                installButton.style.display = 'none';
            }
        });

        