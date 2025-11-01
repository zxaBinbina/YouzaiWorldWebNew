document.addEventListener('DOMContentLoaded', function() {
    const serverStatusElements = document.querySelectorAll('.server-status');

    serverStatusElements.forEach(element => {
        const server = element.getAttribute('data-server');
        const port = element.getAttribute('data-port') || 25565;
        
        element.classList.add('inloading');
        element.innerHTML = `
            <div class="server-status-content">
                <div class="server-status-details">
                    <div class="server-status-title">
                    <span class="status-indicator inloading"></span>
                    ${server} - 正在获取在线玩家数量...
                    </div>
                </div>
            </div>
        `;
        
        fetchServerStatus(server, port)
            .then(data => {
                if (data.online) {
                    element.classList.remove('inloading');
                    element.classList.add('online');
                    element.innerHTML = `
                        <div class="server-status-content">
                            <div class="server-status-details">
                                <div class="server-status-title">
                                    <span class="status-indicator online"></span>
                                    ${server} - 在线玩家数量: ${data.players.online}/${data.players.max}
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    element.classList.remove('inloading');
                    element.classList.add('offline');
                    element.innerHTML = `
                        <div class="server-status-content">
                            <div class="server-status-details">
                                <div class="server-status-title">
                                    <span class="status-indicator offline"></span>
                                    ${server} - 无法获取在线玩家数量
                                </div>
                            </div>
                        </div>
                    `;
                }
            })
            .catch(error => {
                element.classList.remove('inloading');
                element.classList.add('offline');
                element.innerHTML = `
                    <div class="server-status-content">
                        <div class="server-status-details">
                            <div class="server-status-title">
                                <span class="status-indicator offline"></span>
                                ${server} - 无法获取在线玩家数量
                            </div>
                        </div>
                    </div>
                `;
            });
    });
});

function fetchServerStatus(host, port) {
    return fetch(`https://api.mcsrvstat.us/bedrock/2/${host}:${port}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network Error');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        })
        .catch(error => {
            return {
                online: false,
                host: host,
                port: port,
                error: error.message
            };
        });
}