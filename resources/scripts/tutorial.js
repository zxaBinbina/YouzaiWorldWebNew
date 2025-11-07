document.addEventListener('DOMContentLoaded', function() {
    // 移动端目录切换
    const tutorialNavToggle = document.getElementById('tutorialNavToggle');
    const tutorialSidebar = document.querySelector('.tutorial-sidebar');
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    
    if (tutorialNavToggle) {
        tutorialNavToggle.addEventListener('click', function() {
            tutorialSidebar.classList.toggle('active');
            tutorialOverlay.classList.toggle('active');
        });
        
        tutorialOverlay.addEventListener('click', function() {
            tutorialSidebar.classList.remove('active');
            tutorialOverlay.classList.remove('active');
        });
    }
    
    // 目录点击滚动
    const tutorialNavLinks = document.querySelectorAll('.tutorial-nav a');
    
    tutorialNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // 更新活跃状态
                tutorialNavLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
                
                // 滚动到目标位置
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // 移动端点击后关闭目录
                if (window.innerWidth <= 768) {
                    tutorialSidebar.classList.remove('active');
                    tutorialOverlay.classList.remove('active');
                }
            }
        });
    });
    
    // 监听滚动，更新活跃目录项
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 150;
        
        tutorialNavLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetTop = targetElement.offsetTop;
                const targetBottom = targetTop + targetElement.offsetHeight;
                
                if (scrollPosition >= targetTop && scrollPosition < targetBottom) {
                    tutorialNavLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
});