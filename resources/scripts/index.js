document.addEventListener('DOMContentLoaded', function () {
    // 初始化轮播
    initHeroSlider();
    // Swiper
    const bgSwiper = new Swiper('.hero-bg-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        effect: 'fade',
        fadeEffect: {
            crossFade: true
        },
        speed: 1000,
        allowTouchMove: false,
    });

    const contentSwiper = new Swiper('.hero-content-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });

    contentSwiper.on('slideChange', function () {
        bgSwiper.slideToLoop(contentSwiper.realIndex, 1000);
    });

    const showMoreBtn = document.querySelector('.show-more-btn');
    const trendList = document.querySelector('.trend-list');
    const trendItems = document.querySelectorAll('.trend-item');

    if (showMoreBtn && trendItems.length > 3) {
        // 初始隐藏第4条及以后的动态
        for (let i = 3; i < trendItems.length; i++) {
            trendItems[i].style.display = 'none';
        }

        showMoreBtn.addEventListener('click', function () {
            const isExpanded = this.classList.contains('expanded');

            if (isExpanded) {
                // 收起，只显示前3条
                for (let i = 3; i < trendItems.length; i++) {
                    trendItems[i].style.display = 'none';
                }
                trendList.classList.remove('expanded');
                this.textContent = '查看更多动态';
                this.classList.remove('expanded');
            } else {
                // 展开，显示所有
                for (let i = 3; i < trendItems.length; i++) {
                    trendItems[i].style.display = 'flex';
                    // 添加淡入动画
                    trendItems[i].style.animation = 'fadeIn 0.5s ease forwards';
                }
                trendList.classList.add('expanded');
                this.textContent = '收起动态';
                this.classList.add('expanded');
            }
        });
    } else if (trendItems.length <= 3) {
        // 如果动态少于等于3条，隐藏查看更多按钮
        showMoreBtn.style.display = 'none';
    }

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

// 添加淡入动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// 首页横幅轮播功能
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;

    if (slides.length === 0) return;

    function preloadImages() {
        const imagePaths = [
            'resources/images/background_1.webp',
            'resources/images/background_2.webp',
            'resources/images/background_3.webp',
            'resources/images/background_4.webp',
            'resources/images/background_5.webp',
            'resources/images/background_6.webp',
            'resources/images/background_7.webp',
            'resources/images/background_8.webp',
            'resources/images/background_9.webp',
            'resources/images/background_10.webp'
        ];

        let loadedImages = 0;
        const totalImages = imagePaths.length;

        imagePaths.forEach(path => {
            const img = new Image();
            img.onload = function () {
                loadedImages++;
                // 当所有图片加载完成后开始轮播
                if (loadedImages === totalImages) {
                    startSlider();
                }
            };
            img.onerror = function () {
                console.warn('Failed to load image:', path);
                loadedImages++;
                if (loadedImages === totalImages) {
                    startSlider();
                }
            };
            img.src = path;
        });
    }

    // 每5秒切换一次背景
    setInterval(() => {
        // 隐藏当前幻灯片
        slides[currentSlide].classList.remove('active');

        // 移动到下一张
        currentSlide = (currentSlide + 1) % slides.length;

        // 显示新幻灯片
        slides[currentSlide].classList.add('active');
    }, 3000);
}