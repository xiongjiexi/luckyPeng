function doPrint(printContent) {
    hiprintTemplate.print2({ text: printContent}, { printer:'HPRT N31C',title:'欧皇的购物车' });
}

class WebSocketClient {
    constructor(url) {
        this.url = url;
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 1; // 最大重连次数  
        this.reconnectInterval = 3000; // 重连间隔时间 3秒
        this.statusDot = document.getElementById('statusDot');
        this.statusText = document.getElementById('statusText');
        
        this.connect();
    }

    connect() {
        this.setStatus('connecting');
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            console.log('已连接到服务器');
            this.setStatus('connected');
            this.reconnectAttempts = 0;
        };

        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
    
            if (message.action === 'doPrint') {
                const printContent = message.content;
                doPrint(printContent);
            }
        };

        this.ws.onclose = () => {
            console.log('连接已断开');
            this.setStatus('disconnected');
            this.scheduleReconnect();
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket 错误:', error);
            this.setStatus('disconnected');
        };
    }

    setStatus(status) {
        this.statusDot.className = 'dot';
        switch(status) {
            case 'connected':
                this.statusDot.classList.add('connected');
                this.statusText.textContent = '已连接';
                break;
            case 'connecting':
                this.statusDot.classList.add('connecting');
                this.statusText.textContent = '连接中...';
                break;
            case 'disconnected':
                this.statusText.textContent = '未连接';
                break;
        }
    }

    scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`尝试重新连接 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            setTimeout(() => this.connect(), this.reconnectInterval);
        } else {
            console.log('达到最大重连次数');
            this.statusText.textContent = '连接失败';
        }
    }

    reconnectWebSocket() {
        if (this.ws.readyState === WebSocket.CLOSED) {
            console.log('尝试重新连接...');
            this.connect();
        }
    }
}

// 创建 WebSocket 客户端实例
const wsClient = new WebSocketClient('ws://192.168.3.26:8080');

function reconnectWebSocket() {
    wsClient.reconnectWebSocket();
}

// 打印购物清单
function printCart() {
    console.log('打印购物清单');
    showMessage('正在打印，请稍等...');
    
    const printContent = getPrintContent();
    console.log(printContent);

    const cartItems = getAllItems();
    wsClient.ws.send(JSON.stringify({ action: 'saveToFeishu', content: cartItems }));
    wsClient.ws.send(JSON.stringify({ action: 'doPrint', content: printContent }));
    // console.log(hiprintTemplate.getPrinterList());
    // hiprintTemplate.print2({ text: printContent}, { printer:'HPRT N31C',title:'欧皇的购物车' });
    // hiprintTemplate.print2({ text: printContent}, { printer:'Microsoft Print to PDF',title:'欧皇的购物车' });
    // hiprintTemplate.print2([{ text: printContent}], { printer:'Microsoft Print To PDF',title:'打印任务名称' });
}

function getPrintContent() {
    const cartItems = getAllItems();
    let printContent = "欧皇的包裹\n";
    printContent += "------------------------\n";
    
    let total = 0;
    let totalCount = 0;
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        printContent += `${item.name}×${item.quantity}\n`;
        total += itemTotal;
        totalCount += item.quantity;
    });
    
    printContent += "------------------------\n";
    printContent += `总计：${totalCount}件`; //${total.toFixed(2)}元，
    
    return printContent;
}
