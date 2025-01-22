const WebSocket = require('ws');
const lark = require('@larksuiteoapi/node-sdk');

const client = new lark.Client({
	appId: 'cli_a70d5789f5fad00e',
	appSecret: 'Voto8w67pUGe7RFf6lDG5DgycNBpj1h0'
});


// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

// 存储所有连接的客户端
const clients = new Set();

// 处理新的连接
wss.on('connection', (ws) => {
    logClientConnection(ws, 'connect');
    clients.add(ws);

    // 处理接收到的消息
    ws.on('message', (message) => {
        // 向除发送者外的所有客户端广播消息
        clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });

        // 假设消息是 JSON 格式并包含要发送到飞书的数据
        try {
            const data = JSON.parse(message);
            if (data.action === 'saveToFeishu') {
                saveToFeishuTable(data.content);
            }
        } catch (error) {
            console.error('处理消息时出错:', error);
        }
    });

    // 处理客户端断开连接
    ws.on('close', () => {
        logClientConnection(ws, 'disconnect');
        clients.delete(ws);
    });
});

console.log('WebSocket 服务器运行在端口 8080'); 


function logClientConnection(ws, action) {
    const clientId = `${ws._socket.remoteAddress}:${ws._socket.remotePort}`;
    const nowTime = new Date().toLocaleString();
    const actionMessage = action === 'connect' 
        ? `新客户端连接，客户端: ${clientId}，连接时间: ${nowTime}` 
        : `客户端断开连接，客户端: ${clientId}，断开时间: ${nowTime}`;
    console.log(actionMessage);
}


// 调用飞书 API 将数据存入多维表格
function saveToFeishuTable(info) {
    const { totalPrice, totalCount } = info.reduce((acc, item) => {
        acc.totalPrice += item.price * item.quantity;
        acc.totalCount += item.quantity;
        return acc;
    }, { totalPrice: 0, totalCount: 0 });

    const msg = new Date().toLocaleString() + " -- totalPrice: " + totalPrice + "  totalCount: " + totalCount;
    
    client.bitable.v1.appTableRecord.create({
            path: {
                app_token: 'MWFEb6aoNa0PE9sIFiCcM4LKnsg',
                table_id: 'tblAhreMIRHPQOap',
            },
            params: {
                user_id_type: 'user_id',
            },
            data: {
                fields: {
                    "info": JSON.stringify(info),
                    "total": totalPrice,
                    "count": totalCount
                },
            },
        }
    ).then(res => {
        console.log(res.code? msg + " -- 上传飞书失败" : msg + " -- 上传飞书成功");
    }).catch(e => {
        if (e.response && e.response.data) {
            console.error(JSON.stringify(e.response.data, null, 4));
        } else {
            console.error('没有响应数据或响应为空');
        }
    });
}




