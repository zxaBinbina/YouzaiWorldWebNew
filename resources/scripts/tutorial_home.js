document.addEventListener('DOMContentLoaded', function () {
    // 教程数据
    const tutorials = [
        {
            id: 1,
            title: "快速游玩指南",
            description: "了解如何快速开始悠哉世界的冒险。",
            image: "resources/images/background_9.webp",
            category: "入门",
            date: "2025-11-23",
            link: "tutorials/quick_play_guide"
        }
    ];

    // DOM元素
    const tutorialList = document.getElementById('tutorialList');
    const searchInput = document.getElementById('tutorialSearch');
    const resultCount = document.getElementById('resultCount');

    // 渲染教程列表
    function renderTutorials(tutorialsToRender) {
        tutorialList.innerHTML = '';

        if (tutorialsToRender.length === 0) {
            tutorialList.innerHTML = `
                        <div class="empty-state">
                            <h3>未找到相关教程</h3>
                            <p>尝试使用不同的关键词搜索，或浏览所有教程</p>
                        </div>
                    `;
            resultCount.textContent = '0';
            return;
        }

        resultCount.textContent = tutorialsToRender.length;

        tutorialsToRender.forEach(tutorial => {
            const tutorialElement = document.createElement('div');
            tutorialElement.className = 'tutorial-item';
            tutorialElement.innerHTML = `
                        <div class="tutorial-image">
                            <img src="${tutorial.image}" alt="${tutorial.title}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMDAgMTYwIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2VjZjVlMSIvPjx0ZXh0IHg9IjE1MCIgeT0iODAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+5paH5Lu25Zu+5YOPPC90ZXh0Pjwvc3ZnPg=='">
                        </div>
                        <div class="tutorial-content">
                            <h3>${tutorial.title}</h3>
                            <p>${tutorial.description}</p>
                            <div class="tutorial-meta">
                                <span class="tutorial-category">${tutorial.category}</span>
                                <span>${formatDate(tutorial.date)}</span>
                            </div>
                        </div>
                    `;

            // 添加点击事件
            tutorialElement.addEventListener('click', () => {
                window.location.href = tutorial.link;
            });

            tutorialList.appendChild(tutorialElement);
        });
    }

    // 格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }

    // 搜索功能
    function searchTutorials() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            renderTutorials(tutorials);
            return;
        }

        const filteredTutorials = tutorials.filter(tutorial =>
            tutorial.title.toLowerCase().includes(searchTerm) ||
            tutorial.description.toLowerCase().includes(searchTerm) ||
            tutorial.category.toLowerCase().includes(searchTerm)
        );

        renderTutorials(filteredTutorials);
    }

    // 事件监听
    searchInput.addEventListener('input', searchTutorials);

    // 初始渲染
    renderTutorials(tutorials);
});