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
        // 通过URL参数传递客户端类型
        this.ws = new WebSocket(this.url + '?clientType=' + clientType);

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
            } else if (message.action === 'printReturnOrder') { 
                const data = message.content;
                printReturnOrder(data);
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
    // 获取套餐名字
    let combo = document.getElementById('combo').textContent;
    const cartItems = getAllItems();
    wsClient.ws.send(JSON.stringify({ action: 'saveToFeishu', content: cartItems, combo: combo }));
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

function printreturnorderPage(currentRow) {
    // 直接使用传入的currentRow而不是重新查询DOM
    if (!currentRow) {
        alert('未找到订单数据');
        return;
    }

    // 从传入的行中获取所有数据
    const cells = currentRow.getElementsByTagName('td');
    const orderData = {
        order_number: cells[0].textContent.trim(),
        product_name: cells[1].textContent.trim(),
        product_specification: cells[2].textContent.trim(),
        amount: cells[3].textContent.trim(),
        source: cells[4].textContent.trim(),
        nickname: cells[5].textContent.trim(),
        name: cells[6].textContent.trim(),
        order_time: cells[7].textContent.trim(),
        status: cells[8].textContent.trim()
    };

    printReturnOrderByOrderNumber(orderData.order_number);
    doPrintReturnOrder(stringifyReturnOrder(orderData));
}



// 拼接退单信息
function stringifyReturnOrder(order) {
    let printContent = "退单信息\n";
    printContent += "------------------------\n";
    printContent += `订单编号: ${order.order_number}\n`;
    printContent += `商品名称: ${order.product_name}\n`;
    printContent += `商品规格: ${order.product_specification}\n`;
    printContent += `金额: ${order.amount}\n`;
    printContent += `来源: ${order.source}\n`;
    printContent += `用户昵称: ${order.nickname}\n`;
    printContent += `用户姓名: ${order.name}\n`;
    printContent += `下单时间: ${order.order_time}\n`;
    printContent += `状态: ${order.status}\n`;
    printContent += "------------------------\n";
    return printContent;
}



function printReturnOrder(data) {
    const contentArray = [];

    data.data.rows.forEach(order => {
        printReturnOrderByOrderNumber(order.order_number);
        contentArray.push(stringifyReturnOrder(order));
    });

    console.log('1秒后打印退单');
    function printNext(index) {
        if (index >= contentArray.length) return;
        
        doPrintReturnOrder(contentArray[index]);
        // 等待2秒后打印下一个
        setTimeout(() => printNext(index + 1), 2000);
    }

    // 开始打印第一个
    printNext(0);
}


function doPrintReturnOrder(printContent) {
    console.log('打印退单', printContent);
    hiprintTemplate.print2({ text: printContent}, { printer:'HPRT N31C',title:'退单' });
}


// 调用/api/return_order/print，且将ordernumber传入
function printReturnOrderByOrderNumber(orderNumber) {
    fetch(`/api/return_order/print?order_number=${orderNumber}`)
        .then(response => response.json())
        .then(data => {
            console.log('退单数据:', data);
        })
        .catch(error => console.error('获取退单数据失败:', error));
}