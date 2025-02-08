// ==UserScript==
// @name         循环点击查询按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  循环点击指定网页中的列表查询按钮
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
    console.log('test');

    // 配置参数（按需修改）
    const config = {
        interval: 10000, // 点击间隔时间（毫秒）
        maxClicks: 3, // 最大点击次数（0表示无限）
        buttonSelector: '.d-button', // 按钮CSS选择器
        no: 4
    };


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

        // 设置定时器循环执行
        clickInterval = setInterval(clickButtons, config.interval);
        console.log('自动点击已启动');
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

    ajaxHooker.hook(request => {
        if (request.url === '/api/edith/fulfillment/order/page') {
            request.response = res => {
                // 获取响应数据
                const responseData = res.response;
                console.log(responseData);
                // 发送到指定接口
                getOrderCount(responseData);


            };
        }

    });

    function getOrderCount(pageResponseData) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/return_orders/count?order_time=' + getOrderTime(),
            headers: {
                'endpoint-type': 'draft',
                'Authorization': 'Basic ' + btoa(`${PUBLIC_KEY}:${PRIVATE_KEY}`)
            },
            onload: function(response) {
                console.log('数据获取成功');
                const data = JSON.parse(response.responseText);
                console.log('响应数据:', data);
                
                // 获取 count(*) 的值
                const tidbCount = parseInt(data.data.rows[0]['count(*)']);
                console.log('TiDB中的订单数:', tidbCount);
                
                // 获取页面上的订单总数
                const pageData = JSON.parse(pageResponseData).data;
                const pageTotal = pageData.total;
                console.log('退单总数:', pageTotal);

                // 判断是否需要调用另一个接口
                if (pageTotal > tidbCount) {
                    console.log('开始同步退单');
                    // 获取已存在的退单数据, 将rows转为set
                    const existRowsSet = new Set(getReturnOrder());
                    // 对比pageData中的数据，pageData.packages是一个数组，表示多个订单，将每个订单的packageId与rows数组中的每个order_number对比
                    // 如果pageData.packages中的packageId在rows数组中不存在，则表示该订单需要同步，否则不需要同步
                    for (let i = 0; i < pageData.packages.length; i++) {
                        const packageId = pageData.packages[i].packageId;
                        // 如果statusDesc为已取消，且afterSaleStatusDesc为售后完成，则表示订单是退单
                        if (pageData.packages[i].statusDesc === '已取消' && pageData.packages[i].afterSaleStatusDesc === '售后完成') {
                            // 如果退单的packageId在rowsSet中不存在，则表示该订单需要同步，否则不需要同步
                            if (!existRowsSet.has(packageId)) {
                                console.log('正在同步退单：' + packageId);
                                syncReturnOrder(pageData.packages[i]);
                            }
                        }
                    }
                } else {
                    console.log('无需同步退单');
                }

            },
            onerror: function(error) {
                console.error('获取数据时出错:', error);
            } 
        });
    }

    function getReturnOrder() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/return_orders?order_time=' + getOrderTime(),
            headers: {
                'endpoint-type': 'draft',
                'Authorization': 'Basic ' + btoa(`${PUBLIC_KEY}:${PRIVATE_KEY}`),
                'Content-Type': 'application/json'
            },
            onload: function(response) {
                console.log('获取退单数据成功');
                const data = JSON.parse(response.responseText);
                const rows = data.data.rows;
                console.log(rows);
                return rows;
            },
            onerror: function(error) {
                console.error('获取退单数据时出错:', error);
            }

        });
    }


    function syncReturnOrder(p) {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://ap-southeast-1.data.tidbcloud.com/api/v1beta/app/dataapp-GlpQgLxA/endpoint/return_orders',
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

                status: '1'
            }),
            onload: function(response) {
                console.log('同步退单成功:', p.packageId + ' ' + response.responseText);
            },
            onerror: function(error) {
                console.error('同步退单失败:', error);
            }

        });
    }

})();

