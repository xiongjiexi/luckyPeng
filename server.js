const WebSocket = require('ws');
const url = require('url');
const lark = require('@larksuiteoapi/node-sdk');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const client = new lark.Client({
	appId: 'cli_a70d5789f5fad00e',
	appSecret: 'Voto8w67pUGe7RFf6lDG5DgycNBpj1h0'
});


// 创建 WebSocket 服务器
const wss = new WebSocket.Server({ port: 8080 });

// 存储所有连接的客户端
const clients = new Set();
// 分类存储客户端，管理页面客户端分开存储
const clients4Manage = new Set();
// 游戏页面客户端分开存储
const clients4Game = new Set();


// 处理新的连接
wss.on('connection', (ws, request) => {
    logClientConnection(ws, 'connect');

    // 通过URL参数传递客户端类型
    console.log("request.url", request.url);
    const queryParams = url.parse(request.url, true).query;
    const clientType = queryParams.clientType;
    console.log("clientType", clientType);

    if (clientType === 'manage') {
        clients4Manage.add(ws);
    } else if (clientType === 'game') {
        clients4Game.add(ws);
    }

    console.log("clients4Manage count", clients4Manage.size);
    console.log("clients4Game count", clients4Game.size);


    // 处理接收到的消息
    ws.on('message', (message) => {
        // 向客户端广播消息
        sendMessage(message, clientType);

        // 假设消息是 JSON 格式并包含要发送到飞书的数据
        try {
            const data = JSON.parse(message);
            if (data.action === 'saveToFeishu') {
                saveData(data.content, data.combo);
            }
        } catch (error) {
            console.error('处理消息时出错:', error);
        }
    });

    // 处理客户端断开连接
    ws.on('close', () => {
        logClientConnection(ws, 'disconnect');
        clients4Manage.delete(ws);
        clients4Game.delete(ws);
    });
});


function sendMessage(message, clientType) {
    if (clientType === 'manage') {
        console.log("no support sendMessage to manage");
    } else if (clientType === 'game') {
        clients4Manage.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    }
}

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
function saveData(data, combo) {
    const { totalPrice, totalCount } = data.reduce((acc, item) => {
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
                    "info": JSON.stringify(data),
                    "total": totalPrice,
                    "count": totalCount,
                    "combo": combo
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

    // 将data保存到数据库
    saveDataToDB(data, totalPrice, totalCount, combo);
}

async function saveDataToDB(data, totalPrice, totalCount, combo) {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('INSERT INTO picking_order (combo, content, amount, count, create_time) VALUES (?, ?, ?, ?, ?)', [combo, JSON.stringify(data), totalPrice, totalCount, new Date().toLocaleString()]);
        connection.release();
        console.log("保存数据成功", rows);
    } catch (error) {
        console.error('保存数据失败:', error);
    }
}

// 定时获取退单数据，然后调用ws，将退单数据发送到前端，每10秒获取一次
setInterval(() => {
    getReturnOrder4Cancel();
}, 20 * 1000);


setInterval(() => {
    getOrder();
}, 5 * 1000);


async function getReturnOrder4Cancel() {
    try {
        const response = await fetch('https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/return_orders_cancel', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64'),
                'endpoint-type': 'draft'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("定时获取退单数据, 有%d条退单数据", data.data.rows.length);

        // 将data发送到ws
        clients4Manage.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ action: 'printReturnOrder', content: data }));
            }
        });
    } catch (error) {
        console.error('获取退单数据失败:', error);
    }
}


async function getOrder() {
    try {
        const response = await fetch('https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/orders/unprint', {
            method: 'GET',
            headers: {
            'Authorization': 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64'), 
            'endpoint-type': 'draft'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("定时获取下单数据, 有%d条下单数据", data.data.rows.length);

    // 将data发送到ws
    clients4Manage.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ action: 'printOrder', content: data }));
        }
    });

    } catch (error) {
        console.error('获取下单数据失败:', error);
    }
}

const app = express();

// 添加 CORS 中间件


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // 允许所有来源（生产环境应限制为具体域名）
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

// 静态文件服务（前端页面）
app.use(express.static('./'));


// 启动服务器
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

const PUBLIC_KEY = '01VDGUE0';
const PRIVATE_KEY = 'a406f325-195f-459d-8de9-e52239cbfca7';

// 获取订单数据
app.get('/api/return_orders_page', async (req, res) => {
    try {

        const response = await fetch('https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/return_orders_page', {
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64'),
                'endpoint-type': 'draft'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('获取订单数据失败:', error);
        res.status(500).json({ error: '获取订单数据失败' });
    }
});


app.get('/api/return_order/print', async (req, res) => {   
    try {
        // 接口传参order_number
        const order_number = req.query.order_number;
        console.log('修改退单状态为Print', order_number);
        
        const response = await fetch('https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/return_order/print', {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64'),
                'endpoint-type': 'draft',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_number: order_number
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('获取订单数据失败:', error);
        res.status(500).json({ error: '获取订单数据失败' });
    }
});

app.get('/api/orders/print', async (req, res) => {   
    try {
        // 接口传参order_number
        const order_number = req.query.order_number;
        console.log('修改下单状态为Print', order_number);
        
        const response = await fetch('https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/orders/print', {
            method: 'PUT',
            headers: {
                'Authorization': 'Basic ' + Buffer.from(`${PUBLIC_KEY}:${PRIVATE_KEY}`).toString('base64'),
                'endpoint-type': 'draft',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order_number: order_number
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('获取订单数据失败:', error);
        res.status(500).json({ error: '获取订单数据失败' });
    }
});

// 创建数据库连接配置
const dbConfig = {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: '3dK6oXsgVJ4oPyt.root',
  password: 'SWUTVxvVKRkql5Jb',
  database: 'ddp',
  waitForConnections: true,
  connectionLimit: 4, // 根据负载调整
  queueLimit: 0,
  idleTimeout: 60000, // 空闲连接60秒后释放
  enableKeepAlive: true,
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, 'isrgrootx1.pem')),
    minVersion: 'TLSv1.2',
    rejectUnauthorized: true
  }
};

// 创建数据库连接池
// 不要断开链接，不要断开链接，不要断开链接
const pool = mysql.createPool({
    ...dbConfig,
    enableKeepAlive: true, // 启用 Keep-Alive
    keepAliveInitialDelay: 0, // 立即开始发送 Ping
  });

// 添加新的API端点用于获取MySQL数据
app.get('/api/combo', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM combo');
        connection.release();
        // 接口返回rows
        res.json(rows);
    } catch (error) {
        console.error('MySQL查询失败:', error);
        res.status(500).json({ error: '获取数据失败' });
    }
});

// 添加新的API端点用于获取combo_detail表数据，返回json
app.get('/api/combo_detail', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM combo_detail where combo_id = ?', [req.query.combo_id]);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('MySQL查询失败:', error);
        res.status(500).json({ error: '获取数据失败' });
    }
});

// 添加新的API端点用于修改combo_detail表数据
app.put('/api/combo_detail', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        // 删除combo_detail表数据
        const [rows1] = await connection.query('DELETE FROM combo_detail WHERE combo_id = ?', [req.body.combo_id]);
        connection.release();

        // 插入combo_detail表数据
        const [rows2] = await connection.query('INSERT INTO combo_detail (combo_id, name, price, weight) VALUES (?, ?, ?, ?)', [req.body.combo_id, req.body.name, req.body.price, req.body.weight]);
        connection.release();
        res.json(rows2);
    } catch (error) {
        console.error('MySQL查询失败:', error);
        res.status(500).json({ error: '获取数据失败' });
    }
});

app.get('/api/picking_order', async (req, res) => {
    console.log('获取拣货单', req.query.time);
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM picking_order where create_time >= ? and data_type = ?', [req.query.time, 'production']);
        connection.release();
        // 定义一个data，存储name对应的quantity，遍历每一行的content，然后解析成json，json是一个数组，将每一项的内容是name和quantity，将所有行都按name分组，相同name的quantity相加
        const data = {};
        rows.forEach(row => {
            const content = JSON.parse(row.content);
            content.forEach(item => {
                if (!data[item.name]) {
                    data[item.name] = 0;
                }
                data[item.name] += item.quantity;
            });
        });
        res.json(data);
    } catch (error) {
        console.error('获取拣货单失败:', error);
        res.status(500).json({ error: '获取拣货单失败' });
    }
});

app.get('/api/bill', async (req, res) => {
    console.log('获取账单', req.query.time);
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT combo, sum(amount) amount, count(1) count FROM picking_order where create_time >= ? and data_type = ? group by combo', [req.query.time, 'production']);
        connection.release();
        res.json(rows);
    } catch (error) {
        console.error('获取账单失败:', error);
        res.status(500).json({ error: '获取账单失败' });
    }
});
