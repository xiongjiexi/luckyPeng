// 定义颜色和商品
const colorNum = 6;
const colors = {
    1: '#cc99fd', // 紫色
    2: '#3A3A3D', // 黑色
    3: '#884939', // 黄色
    4: '#fea33f', // 橙色
    5: '#fe99c1', // 粉色
    6: '#A6DFFF' // 蓝色
};

// 经典版
const products1 = [
    { name: '法国进口巧克力饼干', price: 0.449, weight: 5, curr_weight: 1 },
    { name: '智利无核西梅', price: 0.514, weight: 5, curr_weight: 1 },
    { name: 'MM薯脆薄饼干(黑松露味&蒜味)', price: 0.446, weight: 5, curr_weight: 1 },
    { name: 'MM黑金芝士薄脆饼干', price: 0.570, weight: 5, curr_weight: 1 },
    { name: 'MM无糖黑芝麻酥', price: 0.667, weight: 5, curr_weight: 1 },
    { name: 'MM海盐苏打饼干', price: 0.667, weight: 5, curr_weight: 1 },
    { name: '嘉顿幸运饼干', price: 0.857, weight: 5, curr_weight: 1 },
    { name: 'MM芝士夹心饼干', price: 0.893, weight: 5, curr_weight: 1 },
    { name: '溜溜梅皇梅', price: 0.714, weight: 5, curr_weight: 1 },
    { name: 'Bouchard什锦巧克力', price: 0.785, weight: 5, curr_weight: 1 },
    { name: 'FFIT8燕麦蛋白曲奇', price: 1.093, weight: 1, curr_weight: 1 },
    { name: 'Tafe黑松露火腿苏打饼干', price: 1.000, weight: 1, curr_weight: 1 },
    { name: 'Tafe千层酥', price: 1.029, weight: 1, curr_weight: 1 },
    { name: '奥赛山楂棒', price: 1.064, weight: 1, curr_weight: 1 },
    { name: '德芙茶萃黑巧', price: 1.250, weight: 1, curr_weight: 1 },
    { name: '彩虹酸粉糖', price: 1.304, weight: 1, curr_weight: 1 },
    { name: 'MM脆米黑巧', price: 1.429, weight: 1, curr_weight: 1 },
    { name: '彩虹熊猫软糖', price: 1.458, weight: 1, curr_weight: 1 },
];

// 豪华版
const products2 = [
    { name: 'MM黄油华夫饼', price: 1.563, weight: 5, curr_weight: 1 },
    { name: '蛋皇鹌鹑蛋', price: 1.628, weight: 5, curr_weight: 1 },
    { name: 'HRYOUP苹果干', price: 1.629, weight: 5, curr_weight: 1 },
    { name: '吉香居萝卜干', price: 1.667, weight: 5, curr_weight: 1 },
    { name: 'MM鲜牛乳饼干', price: 1.667, weight: 5, curr_weight: 1 },
    { name: '甘源黑金蒜香菜味翡翠豆', price: 1.727, weight: 5, curr_weight: 1 },
    { name: 'Tafe豆乳夹心面包', price: 2.000, weight: 5, curr_weight: 1 },
    { name: 'MM岩烧芝士华夫饼', price: 2.000, weight: 5, curr_weight: 1 },
    { name: 'MM有机果汁蓝莓干', price: 2.000, weight: 5, curr_weight: 1 },
    { name: '吉百利欢聚装巧克力', price: 2.272, weight: 5, curr_weight: 1 },
    { name: 'MM三重芝士半蒸蛋糕', price: 2.174, weight: 5, curr_weight: 1 },
    { name: '枫糖浆味核桃仁', price: 2.500, weight: 1, curr_weight: 1 },
    { name: '大马碧富薄荷咸柠檬糖', price: 2.500, weight: 1, curr_weight: 1 },
    { name: 'MM黑芝麻谷物粉', price: 2.500, weight: 1, curr_weight: 1 },
    { name: '都乐一颗小橘干', price: 2.632, weight: 1, curr_weight: 1 },
    { name: 'MM太妃巧克力', price: 2.632, weight: 1, curr_weight: 1 },
    { name: '口福莱巧克力', price: 2.778, weight: 1, curr_weight: 1 },
    { name: '有友脱骨鸭掌', price: 2.692, weight: 1, curr_weight: 1 },
];

// 经典体验版
const products3 = [
    { name: '法国进口巧克力饼干', price: 0.449, weight: 5, curr_weight: 1 },
    { name: 'MM薯脆薄饼干(黑松露味&蒜味)', price: 0.446, weight: 5, curr_weight: 1 },
    { name: '智利无核西梅', price: 0.514, weight: 5, curr_weight: 1 },
    { name: 'MM黑金芝士薄脆饼干', price: 0.570, weight: 5, curr_weight: 1 },
    { name: 'MM无糖黑芝麻酥', price: 0.667, weight: 5, curr_weight: 1 },
    { name: 'MM海盐苏打饼干', price: 0.667, weight: 5, curr_weight: 1 },
    { name: '嘉顿幸运饼干', price: 0.857, weight: 2, curr_weight: 1 },
    { name: 'MM芝士夹心饼干', price: 0.893, weight: 2, curr_weight: 1 },
    { name: 'Bouchard什锦巧克力', price: 0.785, weight: 2, curr_weight: 1 },
    { name: '溜溜梅皇梅', price: 0.714, weight: 2, curr_weight: 1 },
    { name: 'Tafe黑松露火腿苏打饼干', price: 1.000, weight: 1, curr_weight: 1 },
    { name: 'Tafe千层酥', price: 1.029, weight: 1, curr_weight: 1 },
];

// 豪华体验版
const products4 = [
    { name: 'MM黄油华夫饼', price: 1.563, weight: 5, curr_weight: 1 },
    { name: '德芙茶萃黑巧', price: 1.250, weight: 5, curr_weight: 1 },
    { name: '彩虹酸粉糖', price: 1.304, weight: 5, curr_weight: 1 },
    { name: 'MM脆米黑巧', price: 1.429, weight: 5, curr_weight: 1 },
    { name: '蛋皇鹌鹑蛋', price: 1.628, weight: 5, curr_weight: 1 },
    { name: 'HRYOUP苹果干', price: 1.629, weight: 5, curr_weight: 1 },
    { name: '甘源黑金蒜香菜味翡翠豆', price: 1.727, weight: 5, curr_weight: 1 },
    { name: 'MM鲜牛乳饼干', price: 1.667, weight: 5, curr_weight: 1 },
    { name: 'Tafe豆乳夹心面包', price: 2.000, weight: 2, curr_weight: 1 },
    { name: 'MM岩烧芝士华夫饼', price: 2.000, weight: 2, curr_weight: 1 },
    { name: 'MM有机果汁蓝莓干', price: 2.000, weight: 2, curr_weight: 1 },
    { name: '吉百利欢聚装巧克力', price: 2.272, weight: 1, curr_weight: 1 },
];

// 默认使用豪华版
let products = copyArrayWithMap(products2);

// 使用map拷贝数组对象
function copyArrayWithMap(array) {
    return array.map(item => ({...item, curr_weight: item.weight}));
}

// 九宫格样式
const gridItemStyle = {
    color: 'white',
    textAlign: 'center',
    fontSize: '40px',
    fontWeight: 'bold'
};

const sd = {
    match: new Howl({src: ['match.mp3']}),
    bingo: new Howl({src: ['bingo.mp3']}),
    luck:  new Howl({src: ['luck.mp3']}),
    start: new Howl({src: ['start.mp3']})
    
}

// 定义购物车变量
const cart = {};

// 重置购物车
function resetCart() {
    for (let key in cart) {
        delete cart[key];
    }
    updateCartDisplay();
    console.log('购物车更新:', cart);
}

// 颜色和商品的映射,每个颜色对应一个不同的随机商品
function generateColorProductMapping() {
    const mapping = {};
    const availableProducts = [...products];
    for (let i = 1; i <= colorNum; i++) {
        const randomProductIndex = Math.floor(Math.random() * availableProducts.length);
        mapping[i] = availableProducts[randomProductIndex];
        availableProducts.splice(randomProductIndex, 1);
    }
    return mapping;
}

// 开始游戏（暂时不使用）
// 遍历九宫格，随机选一个颜色，随机选一个商品（商品不重复）
function randomizeColors() {
    const availableProducts = [...products];
    for (let i = 1; i <= 9; i++) {
        const cell = document.getElementById(`cell-${i}`);
        const randomColorIndex = Math.floor(Math.random() * colorNum) + 1;
        const randomProductIndex = Math.floor(Math.random() * availableProducts.length);
        cell.style.backgroundColor = colors[randomColorIndex];
        cell.dataset.colorId = randomColorIndex;
        cell.textContent = availableProducts[randomProductIndex].name;
        Object.assign(cell.style, gridItemStyle);
        availableProducts.splice(randomProductIndex, 1);
    }
}

// 添加商品到购物车
function addToCart(productName, quantity = 1) {
    if (cart.hasOwnProperty(productName)) {
        cart[productName] += quantity;
    } else {
        cart[productName] = quantity;
    }
    
    updateCartDisplay();
    console.log('购物车更新:', cart);
}

// 更新购物车显示
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    cartItems.innerHTML = '';
    
    for (const [product, quantity] of Object.entries(cart)) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.textContent = `${product} × ${quantity}`;
        cartItems.appendChild(cartItem);
    }
}

// 根据权重随机选择商品
function selectProductByWeight() {
    // 计算总权重
    const totalWeight = products.reduce((sum, product) => sum + product.weight, 0);
    console.log('总权重:', totalWeight);
    // 生成随机数 (0 到总权重之间)
    const randomValue = Math.random() * totalWeight;
    console.log('随机数:', randomValue);
    // 轮盘赌选择
    let weightSum = 0;
    for (const product of products) {
        weightSum += product.weight;
        if (randomValue <= weightSum) {
            console.log('选中商品:', product);
            return product;
        }
    }
    
    // 保险起见，如果没有选中则返回第一个商品
    return products[0];
}

// 定义已选中商品集合
const picked = new Set();

// 清空picked
function clearPicked(){
    picked.clear();
    console.log('已选中商品清空:', picked); 
}

// 动态权重随机选择商品
function selectProductByDynamicWeight() {
    // 计算当前总权重
    const totalWeight = products.reduce((sum, product) => sum + product.curr_weight, 0);
    console.log('当前总权重:', totalWeight);
    
    // 生成随机数 (0 到总权重之间)
    const randomValue = Math.random() * totalWeight;
    console.log('随机数:', randomValue);
    
    // 轮盘赌选择
    let weightSum = 0;
    let selectedProduct = null;
    for (const product of products) {
        weightSum += product.curr_weight;
        if (randomValue <= weightSum) {
            console.log('选中商品:', product);
            selectedProduct = product;
            break;
        }
    }

    if (selectedProduct && !picked.has(selectedProduct.name)) {
        picked.add(selectedProduct.name);
        // 选中后重置当前权重为原始权重
        selectedProduct.curr_weight = selectedProduct.weight;
        // 增加其他未选中商品的权重
        increaseUnpickedWeights(selectedProduct.name);
    }
    
    // 保险起见，如果没有选中则返回第一个商品
    return selectedProduct || products[0];
}

// 增加未选中商品的权重
function increaseUnpickedWeights(selectedProductName, increment = 1) {
    products.forEach(product => {
        if (product.name !== selectedProductName && !picked.has(product.name)) {
            product.curr_weight += increment;
        }
    });
    console.log('%c更新后的商品权重:', 'color: #2196F3; font-weight: bold;', JSON.parse(JSON.stringify(products)));
}



// 随机填充白色格子
function setRandomColorToWhiteCell() {
    const whiteCells = Array.from(document.querySelectorAll('.grid-item')).filter(
        cell => cell.style.backgroundColor === 'white' || cell.style.backgroundColor === ''
    );
    
    if (whiteCells.length > 0) {
        const randomCell = whiteCells[Math.floor(Math.random() * whiteCells.length)];
        const randomColorNum = Math.floor(Math.random() * colorNum) + 1;
        // 使用权重随机选择商品
        const selectedProduct = selectProductByDynamicWeight();
        
        randomCell.style.backgroundColor = colors[randomColorNum];
        randomCell.dataset.colorId = randomColorNum;
        randomCell.textContent = selectedProduct.name;
        Object.assign(randomCell.style, gridItemStyle);
    }
}

// 抽
function upLuck() {
    if (luckValue > 0) {
        const whiteCells = Array.from(document.querySelectorAll('.grid-item')).filter(
            cell => cell.style.backgroundColor === 'white' || cell.style.backgroundColor === ''
        );
        if (whiteCells.length > 0) {
            playSound('luck');
            luckValue--;
            updateLuckValue();
            setRandomColorToWhiteCell();
        }
    } else {
        showMessage('欧气不足！');
    }
}


// 显示消息
function showMessage(message) {
    const messageBox = document.createElement('div');
    messageBox.style.position = 'fixed';
    messageBox.style.left = '50%';
    messageBox.style.top = '50%';
    messageBox.style.transform = 'translate(-50%, -50%)';
    messageBox.style.padding = '20px 40px';
    messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    messageBox.style.color = 'white';
    messageBox.style.borderRadius = '5px';
    messageBox.style.fontSize = '20px';
    messageBox.style.zIndex = '9999';
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    setTimeout(() => messageBox.remove(), 1000);
}

// 显示模态框
function showModal() {
    const modalTitle = document.querySelectorAll('.modal-content h2')[0];
    modalTitle.textContent = `✨ 恭喜欧皇 ✨`; //带走 ${totalItems}件 ${totalPrice + whitePrice}元 

    document.getElementById('confirmModal').style.display = 'block';
}

// 关闭模态框
function closeModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

// 重新开始
function handleConfirm() {
    playSound('start');
    clearPicked();
    luckValue = 9;
    updateLuckValue();
    resetCart();
    setAllWhiteCell();
    closeModal();
}

// 清台
function clearDesk() {
    console.log('清台');
    clearPicked();
    // 清零欧气值
    luckValue = 0;
    updateLuckValue();
    // 清零购物车
    resetCart();
    setAllWhiteCell();
    closeModal();
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('confirmModal');
    if (event.target == modal) {
        closeModal();
    }
}

// 添加格子点击事件处理
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.grid-item').forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('selected');
            
            const selectedCells = document.querySelectorAll('.grid-item.selected');
            
            if (selectedCells.length === 2) {
                const color1 = selectedCells[0].style.backgroundColor;
                const color2 = selectedCells[1].style.backgroundColor;
                
                if (color1 === color2 && color1 !== 'white' && color1 !== '') {
                    playSound('match');
                    showMessage('恭喜你!');
                    
                    addToCart(selectedCells[0].textContent, 1);
                    addToCart(selectedCells[1].textContent, 1);
                    selectedCells.forEach(cell => {
                        cell.style.backgroundColor = 'white';
                        cell.dataset.colorId = '';
                        cell.textContent = '';
                    });

                    updateCartDisplay();

                    setTimeout(() => {
                        setRandomColorToWhiteCell();
                    }, 600);
                }
                
                setTimeout(() => {
                    selectedCells.forEach(cell => {
                        cell.classList.remove('selected');
                    });
                }, 600);
            }
        });
    });
});

// 添加欧气值变量
let luckValue = 0;

// 更新欧气值显示
function updateLuckValue() {
    const luckValueElement = document.querySelector('.counter-value');
    luckValueElement.textContent = luckValue;
    
    // 添加动画效果
    luckValueElement.classList.remove('animate');
    void luckValueElement.offsetWidth;
    luckValueElement.classList.add('animate');
}

function handleMediumLuck() {
    // 增加欧气值
    playSound('bingo');
    luckValue++;
    updateLuckValue();
}


// 显示购物车模态框
function showCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartList = document.querySelector('.cart-list');
    cartList.innerHTML = '';
    
    // 获取购物车中的商品
    const cartItems = getAllItems();
    let total = 0;
    let totalCount = 0;
    // 显示所有商品
    cartItems.forEach(item => {
        const itemRow = document.createElement('div');
        itemRow.className = 'cart-item-row';
        itemRow.innerHTML = `
            <span>${item.name} × ${item.quantity}</span>
        `;
        // <span>${(item.price * item.quantity).toFixed(2)}元</span>
        cartList.appendChild(itemRow);
        total += item.price * item.quantity;
        totalCount += item.quantity;
    });

    // 显示总价
    document.querySelector('.cart-total').textContent = `欧王清单（${totalCount}件）`;
    cartModal.style.display = 'block';
}

// 获取所有商品（包括购物车和九宫格中的商品）
function getAllItems() {
    const items = [];
    
    // 获取购物车中的商品
    for (const [product, quantity] of Object.entries(cart)) {
        items.push({
            name: product,
            quantity: quantity,
            price:  products.find(item => item.name === product)?.price || 0
        });
    }
    
    // 获取九宫格中非白色格子的商品
    document.querySelectorAll('.grid-item').forEach(cell => {
        if (cell.style.backgroundColor !== 'white' && cell.style.backgroundColor !== '') {
            const productName = cell.textContent;
            if (productName) {
                const existingItem = items.find(item => item.name === productName);
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    items.push({
                        name: productName,
                        quantity: 1,
                        price: products.find(item => item.name === productName)?.price || 0
                    });
                }
            }
        }
    });
    
    return items;
}

// 关闭购物车模态框
function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function playSound(soundKey) {
    const sound = sd[soundKey];
    sound.load();
    sound.play();
}

// 显示套餐选择模态框
function showPackageModal() {
    document.getElementById('packageModal').style.display = 'block';
}

// 关闭套餐选择模态框
function closePackageModal() {
    document.getElementById('packageModal').style.display = 'none';
}

// 选择套餐
function handlePackageSelect() {
    const selectedPackage = document.querySelector('input[name="package"]:checked');
    if (selectedPackage) {
        if (selectedPackage.value === 'classic-lite') {
            products = copyArrayWithMap(products3);
            document.getElementById('combo').textContent = '山姆对对碰（经典体验版）';
        } else if (selectedPackage.value === 'deluxe-lite') {
            products = copyArrayWithMap(products4);
            document.getElementById('combo').textContent = '山姆对对碰（豪华体验版）';
        } else if (selectedPackage.value === 'classic') {
            products = copyArrayWithMap(products1);
            document.getElementById('combo').textContent = '山姆对对碰（经典版）';
        } else if (selectedPackage.value === 'deluxe') {
            products = copyArrayWithMap(products2);
            document.getElementById('combo').textContent = '山姆对对碰（豪华版）';
        }
        closePackageModal();
    }
}

// 将九宫格的一个格子颜色变为白色
function setWhiteCell(cell) {
    cell.style.backgroundColor = 'white';
    cell.dataset.colorId = '';
    cell.textContent = '';
}

// 将九宫格的所有格子颜色变为白色
function setAllWhiteCell() {
    document.querySelectorAll('.grid-item').forEach(cell => {
        setWhiteCell(cell);
    });
}
