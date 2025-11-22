document.addEventListener('DOMContentLoaded', function () {
    // 初始化二级菜单
    initDropdownMenus();

    // 导航栏切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            const isOpening = !navMenu.classList.contains('active');

            navMenu.classList.toggle('active');
            this.classList.toggle('active');

            // 菜单打开时强制显示背景色
            if (isOpening) {
                navbar.classList.add('menu-open');
            } else {
                // 菜单关闭时根据滚动位置决定是否显示背景色
                navbar.classList.remove('menu-open');
                updateNavbarState(); // 使用新的状态更新函数
            }
        });
    }

    // 点击菜单项后关闭菜单
    document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-link').forEach(link => {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navbar.classList.remove('menu-open');

                // 关闭所有下拉菜单
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.classList.remove('active');
                });
                document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                    toggle.classList.remove('active');
                });

                updateNavbarState(); // 使用新的状态更新函数
            }
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 导航栏滚动效果 - 使用新的状态更新函数
    window.addEventListener('scroll', function () {
        updateNavbarState();
    });

    // 页面加载时检查滚动位置
    window.dispatchEvent(new Event('scroll'));

    // 点击特效
    document.addEventListener('click', function (e) {
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.style.left = e.clientX + 'px';
        clickEffect.style.top = e.clientY + 'px';
        document.body.appendChild(clickEffect);

        setTimeout(() => {
            clickEffect.remove();
        }, 600);
    });

    // 加载动画
    window.addEventListener('load', function () {
        const loader = document.querySelector('.loader');
        const loadStartTime = Date.now();
        const minimumLoadTime = 500;

        function hideLoader() {
            loader.classList.add('hidden');
            loader.addEventListener('transitionend', function () {
                loader.style.display = 'none';
            }, { once: true });
        }

        const elapsedTime = Date.now() - loadStartTime;

        if (elapsedTime >= minimumLoadTime) {
            hideLoader();
        } else {
            setTimeout(hideLoader, minimumLoadTime - elapsedTime);
        }
    });

    // 运行时间计算
    function updateUptime() {
        const startTime = new Date('2025-10-31T20:00:00'); // 设置开始时间
        const now = new Date();
        const diff = now - startTime;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        const uptimeElement = document.getElementById('uptime-counter');
        if (uptimeElement) {
            uptimeElement.textContent = `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
        }
    }

    // 初始更新
    updateUptime();

    // 每秒更新一次
    setInterval(updateUptime, 1000);

    // 复制按钮功能
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', function () {
            const textToCopy = this.getAttribute('data-text');

            // 使用现代 Clipboard API
            navigator.clipboard.writeText(textToCopy).then(() => {
                // 复制成功反馈
                const originalText = this.textContent;
                this.textContent = '成功';
                this.classList.add('copied');

                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 1000);
            }).catch(err => {
                // 降级方案：使用传统方法
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);

                // 反馈
                const originalText = this.textContent;
                this.textContent = '成功';
                this.classList.add('copied');

                setTimeout(() => {
                    this.textContent = originalText;
                    this.classList.remove('copied');
                }, 1000);
            });
        });
    });
});

// 二级菜单功能
function initDropdownMenus() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const navbar = document.querySelector('.navbar');

    // 关闭所有下拉菜单
    function closeAllDropdowns() {
        dropdownMenus.forEach(menu => {
            menu.classList.remove('active');
        });
        dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
        });

        // 只有在页面顶端时才移除下拉菜单打开状态
        if (window.scrollY <= 50) {
            navbar.classList.remove('dropdown-open');
            navbar.style.padding = '20px 0';
        }
    }

    // 点击下拉菜单切换
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            // 在移动端，阻止默认行为以允许展开菜单
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
            }

            const dropdownMenu = this.nextElementSibling;
            const isActive = dropdownMenu.classList.contains('active');

            // 关闭所有其他菜单
            closeAllDropdowns();

            // 切换当前菜单
            if (!isActive) {
                dropdownMenu.classList.add('active');
                this.classList.add('active');

                // 在桌面端且页面在顶部时，显示导航栏背景
                if (window.innerWidth > 768 && window.scrollY <= 50) {
                    navbar.classList.add('dropdown-open');
                    navbar.style.padding = '15px 0';
                }
            }
        });
    });

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.nav-item.dropdown')) {
            closeAllDropdowns();
            updateNavbarState(); // 更新导航栏状态
        }
    });

    // 窗口大小改变时重置菜单状态
    window.addEventListener('resize', function () {
        closeAllDropdowns();
        updateNavbarState();
    });
}

// 更新导航栏状态的函数
function updateNavbarState() {
    const navbar = document.querySelector('.navbar');
    const hasActiveDropdown = document.querySelector('.dropdown-menu.active');
    const navMenu = document.querySelector('.nav-menu');
    // 如果下拉菜单是打开的，不处理背景色变化
    if (hasActiveDropdown) {
        return;
    }
    // 如果移动端菜单是打开的，不处理背景色变化
    if (navMenu && navMenu.classList.contains('active')) {
        return;
    }
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        navbar.style.padding = '15px 0';
    } else {
        navbar.classList.remove('scrolled');
        navbar.classList.remove('dropdown-open');
        navbar.style.padding = '20px 0';
    }
}