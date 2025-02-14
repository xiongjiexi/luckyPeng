// ==UserScript==
// @name         实时查下单数据
// @namespace    www.xiongjiexi.cn
// @version      0.1
// @description  循环点击指定网页中的列表查询按钮，实时查询下单数据
// @author       You
// @match        https://ark.xiaohongshu.com/app-order/order/query
// @match        https://ark.xiaohongshu.com/app-order/order/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      ap-southeast-1.data.tidbcloud.com
// @run-at       document-start
// @require https://scriptcat.org/lib/637/1.4.3/ajaxHooker.js#sha256=y1sWy1M/U5JP1tlAY5e80monDp27fF+GMRLsOiIrSUY=
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数（按需修改）
    const config = {
        interval: 15000, // 点击间隔时间（毫秒）
        maxClicks: 9999, // 最大点击次数（0表示无限）
        buttonSelector: '.d-button', // 按钮CSS选择器
        no: 4,
        controlBtnPosition: {    // 控制按钮位置
            top: '10px',
            right: '500px'
        }
    };

    // 运行状态
    let isRunning = false;      // 默认暂停状态
    let timerId = null;

    // 创建控制按钮
    function createControlButton() {
        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'clickBlockOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.3);
            z-index: 9998;
            display: none;
            cursor: not-allowed;
        `;
        document.body.appendChild(overlay);

        const btn = document.createElement('button');
        btn.id = 'autoClickToggle';
        btn.textContent = '▶ 查下单';
        btn.style.cssText = `
            position: fixed;
            top: ${config.controlBtnPosition.top};
            right: ${config.controlBtnPosition.right};
            z-index: 9999;
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            transition: 0.3s;
        `;

        // 点击事件处理
        btn.addEventListener('click', toggleTask);
        document.body.appendChild(btn);
    }

    // 任务切换函数
    function toggleTask() {
        isRunning = !isRunning;
        this.textContent = isRunning ? '⏸ 查下单' : '▶ 查下单';
        this.style.background = isRunning ? '#f44336' : '#4CAF50';

        // 控制遮罩层显示/隐藏
        const overlay = document.getElementById('clickBlockOverlay');
        overlay.style.display = isRunning ? 'block' : 'none';

        if (isRunning) {
            startTask();
            // 立即执行一次
            clickButtons();
        } else {
            stopTask();
        }
    }

    // 启动任务
    function startTask() {
        timerId = setInterval(() => {
            if (clickCount >= config.maxClicks && config.maxClicks !== 0) {
                stopTask();
                return;
            }
            clickButtons();
        }, config.interval);
    }

    // 停止任务
    function stopTask() {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        document.getElementById('autoClickToggle').textContent = '▶ 查下单';
    }


    let clickCount = 0;
    let clickInterval;

    function clickButtons() {
        // 获取所有符合条件的按钮
        const button = document.querySelectorAll(config.buttonSelector)[config.no];

        if (!button) {
            console.log('未找到查询按钮');
            return;
        }

        // 遍历所有按钮并点击
        console.log('正在点击按钮');
        button.click();

        clickCount++;
        console.log(`已完成第 ${clickCount} 次点击`);

        // 检查点击次数限制
        if (config.maxClicks > 0 && clickCount >= config.maxClicks) {
            clearInterval(clickInterval);
            console.log('已达到最大点击次数，停止运行');
        }
    }

    // 初始化函数
    function init() {
        // 添加控制按钮
        createControlButton();
    }

    // 等待页面加载完成后执行
    window.addEventListener('load', function() {
        // 延迟1秒确保所有元素加载完成
        setTimeout(init, 1000);
    });
//01VDGUE0:a406f325-195f-459d-8de9-e52239cbfca7
const PUBLIC_KEY = '01VDGUE0';
const PRIVATE_KEY = 'a406f325-195f-459d-8de9-e52239cbfca7';

// 获取订单时间
function getOrderTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const order_time = `${year}-${month}-${day}`;
    return order_time;
}

// 获取当前时间
function getCurrentTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;

}

    // ajaxHooker.hook(request => {
    //     if (request.url === '/api/edith/fulfillment/order/page') {
    //         request.response = res => {
    //             // 获取响应数据
    //             const responseData = res.response;
    //             // 发送到指定接口
    //             getOrderCount_GM_query_order(responseData);
    //         };
    //     }

    // });

    function getOrderCount_GM_query_order(pageResponseData) {
        // 获取页面上的订单总数
        const pageData = JSON.parse(pageResponseData).data;
        const pageTotal = pageData.total;
        console.log('页面总数:', pageTotal);

        console.log('开始同步下单数据');
        // 获取已存在的下单数据, 将rows转为set
        const existRowsSet = new Set(getOrder());
        console.log('已存在的下单数据:', existRowsSet);
        // 对比pageData中的数据，pageData.packages是一个数组，表示多个订单，将每个订单的packageId与rows数组中的每个order_number对比
        // 如果pageData.packages中的packageId在rows数组中不存在，则表示该订单需要同步，否则不需要同步
        console.log('pageData.packages:', pageData.packages);
        for (let i = 0; i < pageData.packages.length; i++) {
            const packageId = pageData.packages[i].packageId;
            // 如果statusDesc为已取消，且afterSaleStatusDesc为售后完成，则表示订单是退单
            if (pageData.packages[i].statusDesc === '待配货' && pageData.packages[i].afterSaleStatusDesc === '无售后') {
                // 如果退单的packageId在rowsSet中不存在，则表示该订单需要同步，否则不需要同步
                if (!existRowsSet.has(packageId)) {
                    console.log('正在同步下单数据：' + packageId);
                    syncOrder(pageData.packages[i]);
                }
            }
        }
    }

    function getOrder() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/orders?order_time=' + getOrderTime(),
            headers: {
                'endpoint-type': 'draft',
                'Authorization': 'Basic ' + btoa(`${PUBLIC_KEY}:${PRIVATE_KEY}`),
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                console.log('获取下单数据成功');
                const data = JSON.parse(response.responseText);
                const rows = data.data.rows;
                console.log(rows);
                return rows;
            },
            onerror: function(error) {
                console.error('获取下单数据时出错:', error);
            }

        });
    }


    function syncOrder(p) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/orders',
            headers: {
                'endpoint-type': 'draft',
                'Authorization': 'Basic ' + btoa(`${PUBLIC_KEY}:${PRIVATE_KEY}`),
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                amount: p.totalOrderAmount,
                nickname: p.userInfo.nickName,
                order_number: p.packageId,
                order_time: p.orderedAt,
                product_name: p.skus[0].displayName,
                product_specification: p.skus[0].skuSpecification,
                source: 'xhs',
                status: 'unprint',
                create_time: getCurrentTime(),
                name:p.userInfo.name,
                // 多加的
                province:p.userInfo.province,
                city:p.userInfo.city,
                district:p.userInfo.district,
                note:p.userInfo.note,
                sku_name:p.skus[0].skuName,
            }),
            onload: function(response) {
                console.log('同步下单成功:', p.packageId + ' ' + response.responseText);
            },
            onerror: function(error) {
                console.error('同步下单失败:', error);
            }

        });
    }

})();

