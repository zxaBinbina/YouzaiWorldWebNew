// 处罚数据
const penaltyData = [
    {
        id: 1,
        player: "AlmondBark7820",
        type: "ban",
        reason: "指使别人放火烧山导致服务器卡顿掉tips到15",
        penaltyTime: "2025-11-28 22:30",
        unbanTime: "2025-12-05 22:30",
        operator: "zxaBinbin",
        status: "active"
    },
    {
        id: 2,
        player: "IvoryBook9092",
        type: "ban",
        reason: "放火烧山导致服务器卡顿掉tips到15",
        penaltyTime: "2025-11-28 22:30",
        unbanTime: "2025-12-05 22:30",
        operator: "zxaBinbin",
        status: "active"
    }
];

// 检查处罚状态的函数
function checkPenaltyStatus(item) {
    // 如果处罚类型是警告，没有过期时间，直接使用原始状态
    if (item.type === 'warning') {
        return item.status;
    }
    
    // 如果是永久封禁/禁言
    if (item.unbanTime === "永久") {
        return "active";
    }
    
    // 如果unbanTime是"-"或空，也视为永久
    if (item.unbanTime === "-" || !item.unbanTime) {
        return "active";
    }
    
    // 解析unbanTime
    const unbanDate = new Date(item.unbanTime.replace(' ', 'T') + ':00');
    const now = new Date();
    
    // 如果当前时间晚于解封时间，则处罚已过期
    if (now > unbanDate) {
        return "expired";
    } else {
        return "active";
    }
}

// 更新所有处罚状态
function updateAllPenaltyStatuses() {
    penaltyData.forEach(item => {
        item.calculatedStatus = checkPenaltyStatus(item);
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    const tableBody = document.getElementById('penalty-table-body');
    const noResults = document.getElementById('no-results');
    const resultsInfo = document.getElementById('results-info');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const searchInput = document.getElementById('search-player');
    const typeFilter = document.getElementById('filter-type');
    const statusFilter = document.getElementById('filter-status');
    const operatorFilter = document.getElementById('filter-operator');

    // 统计元素
    const activeCount = document.getElementById('active-count');
    const todayCount = document.getElementById('today-count');
    const banCount = document.getElementById('ban-count');
    const muteCount = document.getElementById('mute-count');

    // 初始化处罚状态
    updateAllPenaltyStatuses();

    // 初始化统计数据
    updateStats();

    // 渲染表格
    renderTable(penaltyData);

    // 重置筛选按钮事件
    resetFiltersBtn.addEventListener('click', resetFilters);

    // 搜索框输入事件（实时筛选）
    searchInput.addEventListener('input', applyFilters);

    // 其他筛选条件变化事件
    typeFilter.addEventListener('change', applyFilters);
    statusFilter.addEventListener('change', applyFilters);
    operatorFilter.addEventListener('change', applyFilters);

    // 应用筛选函数
    function applyFilters() {
        const searchText = searchInput.value.toLowerCase();
        const selectedType = typeFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedOperator = operatorFilter.value;

        const filteredData = penaltyData.filter(item => {
            // 搜索文本匹配（玩家名或原因）
            const matchesSearch = searchText === '' ||
                item.player.toLowerCase().includes(searchText) ||
                item.reason.toLowerCase().includes(searchText);

            // 处罚类型匹配
            const matchesType = selectedType === 'all' || item.type === selectedType;

            // 状态匹配 - 使用计算后的状态
            const currentStatus = item.calculatedStatus || checkPenaltyStatus(item);
            const matchesStatus = selectedStatus === 'all' || currentStatus === selectedStatus;

            // 操作员匹配
            const matchesOperator = selectedOperator === 'all' || item.operator === selectedOperator;

            return matchesSearch && matchesType && matchesStatus && matchesOperator;
        });

        renderTable(filteredData);
    }

    // 重置筛选函数
    function resetFilters() {
        searchInput.value = '';
        typeFilter.value = 'all';
        statusFilter.value = 'all';
        operatorFilter.value = 'all';

        renderTable(penaltyData);
    }

    // 渲染表格函数
    function renderTable(data) {
        tableBody.innerHTML = '';

        if (data.length === 0) {
            noResults.style.display = 'block';
            resultsInfo.textContent = '找到 0 条匹配的处罚记录';
        } else {
            noResults.style.display = 'none';
            resultsInfo.textContent = `找到 ${data.length} 条处罚记录`;

            data.forEach(item => {
                const row = document.createElement('tr');

                // 玩家名单元格 - 移除头像
                const playerCell = document.createElement('td');
                const playerDiv = document.createElement('div');
                playerDiv.className = 'player-name';
                
                const playerNameSpan = document.createElement('span');
                playerNameSpan.textContent = item.player;
                
                playerDiv.appendChild(playerNameSpan);
                playerCell.appendChild(playerDiv);

                // 处罚类型单元格
                const typeCell = document.createElement('td');
                const typeSpan = document.createElement('span');
                typeSpan.className = `penalty-type penalty-${item.type}`;

                switch (item.type) {
                    case 'ban':
                        typeSpan.textContent = '封禁';
                        break;
                    case 'mute':
                        typeSpan.textContent = '禁言';
                        break;
                    case 'kick':
                        typeSpan.textContent = '踢出群聊';
                        break;
                    case 'warning':
                        typeSpan.textContent = '警告';
                        break;
                }

                typeCell.appendChild(typeSpan);

                // 处罚原因单元格
                const reasonCell = document.createElement('td');
                reasonCell.textContent = item.reason;

                // 处罚时间单元格
                const timeCell = document.createElement('td');
                timeCell.textContent = item.penaltyTime;

                // 解封时间单元格
                const unbanCell = document.createElement('td');
                unbanCell.textContent = item.unbanTime;

                // 操作员单元格
                const operatorCell = document.createElement('td');
                operatorCell.textContent = item.operator;

                // 状态单元格 - 使用计算后的状态
                const statusCell = document.createElement('td');
                const currentStatus = item.calculatedStatus || checkPenaltyStatus(item);
                statusCell.className = currentStatus === 'active' ? 'status-active' : 'status-expired';
                statusCell.textContent = currentStatus === 'active' ? '生效中' : '已过期';

                // 将所有单元格添加到行
                row.appendChild(playerCell);
                row.appendChild(typeCell);
                row.appendChild(reasonCell);
                row.appendChild(timeCell);
                row.appendChild(unbanCell);
                row.appendChild(operatorCell);
                row.appendChild(statusCell);

                // 将行添加到表格
                tableBody.appendChild(row);
            });
        }

        // 更新统计数据
        updateStats();
    }

    // 更新统计数据函数
    function updateStats() {
        // 使用计算后的状态进行统计
        const activePenalties = penaltyData.filter(item => {
            const currentStatus = item.calculatedStatus || checkPenaltyStatus(item);
            return currentStatus === 'active';
        }).length;
        
        const today = new Date().toISOString().split('T')[0];
        const todayPenalties = penaltyData.filter(item =>
            item.penaltyTime.split(' ')[0] === today
        ).length;
        
        const banPenalties = penaltyData.filter(item => {
            const currentStatus = item.calculatedStatus || checkPenaltyStatus(item);
            return item.type === 'ban' && currentStatus === 'active';
        }).length;
        
        const mutePenalties = penaltyData.filter(item => {
            const currentStatus = item.calculatedStatus || checkPenaltyStatus(item);
            return item.type === 'mute' && currentStatus === 'active';
        }).length;

        activeCount.textContent = activePenalties;
        todayCount.textContent = todayPenalties;
        banCount.textContent = banPenalties;
        muteCount.textContent = mutePenalties;
    }
    
    // 每分钟更新一次状态，确保实时性
    setInterval(function() {
        updateAllPenaltyStatuses();
        applyFilters(); // 重新应用筛选以更新显示
    }, 60000);
});