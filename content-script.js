// content-script.js - 在网页中运行，负责点击页面元素和选择元素

console.log('[Content Script] 已在页面加载:', window.location.href);

let selectionMode = false;
let highlightedElement = null;
let isClickProcessing = false;  // ✅ 防抖标志：防止重复点击
const highlightStyle = document.createElement('style');

// 添加高亮样式
highlightStyle.textContent = `
  .element-highlight {
    outline: 3px solid #667eea !important;
    background-color: rgba(102, 126, 234, 0.2) !important;
  }
  
  .element-selection-overlay {
    cursor: crosshair !important;
  }
`;

// 向 popup 转发日志
function notifyPopupLog(message, type = 'info') {
  try {
    chrome.runtime.sendMessage({
      action: 'addLog',
      message: message,
      type: type,
    }).catch(err => {
      console.log('[Content Script] 无法发送日志到 popup/background:', err.message);
    });
  } catch (err) {
    console.log('[Content Script] notifyPopupLog 异常:', err.message);
    // 继续执行，不中断主流程
  }
}

// ✅ 安全的 sendResponse 包装，确保重置防抖标志
function sendResponseAndResetDebounce(response, sendResponse) {
  isClickProcessing = false;  // 重置防抖标志
  console.log('[Content Script] ← 重置防抖标志后，发送响应:', response);
  try {
    sendResponse(response);
  } catch (err) {
    console.error('[Content Script] sendResponse 失败:', err.message);
  }
}

// ✅ 处理点击元素的异步函数（不使用 async/await）
function processClickElement(selector, waitForSuccess) {
  console.log('[processClickElement] 开始处理，selector=' + selector);
  
  // 第一次尝试查找元素
  let element = document.querySelector(selector);
  
  if (element) {
    // 找到元素，直接执行点击
    handleElementFound(element, selector, waitForSuccess);
  } else {
    // 未找到元素，等待4秒后重试
    notifyPopupLog('⏸️ 第一次未找到元素，等待 4 秒后重试...', 'warning');
    console.log('[processClickElement] 第一次未找到元素，等待4秒后重试');
    
    setTimeout(function() {
      console.log('[processClickElement 重试] 4秒已过，重新查询元素');
      element = document.querySelector(selector);
      
      if (element) {
        console.log('[processClickElement 重试] ✅ 找到元素');
        handleElementFound(element, selector, waitForSuccess);
      } else {
        console.log('[processClickElement 重试] ❌ 仍未找到元素');
        
        // 获取当前URL
        const currentUrl = window.location.href;
        console.log('[processClickElement] 📍 当前商品URL:', currentUrl);
        console.log('[processClickElement] 📍 未找到的选择器:', selector);
        
        notifyPopupLog(`❌ 未找到页面元素\n选择器: ${selector}\n当前URL: ${currentUrl}`, 'error');
        
        // 发送"元素未找到"消息给background，让它继续下一条链接
        chrome.runtime.sendMessage({
          action: 'elementNotFound',
          selector: selector,
          url: currentUrl,
          message: '元素未找到（重试后仍未找到），跳过此链接继续下一条',
        }, function(bgResponse) {
          console.log('[processClickElement] background 收到 elementNotFound 消息');
        });
        
        isClickProcessing = false;
      }
    }, 4000);
  }
}

// ✅ 处理找到元素后的逻辑（不使用 async/await）
function handleElementFound(element, selector, waitForSuccess) {
  console.log('[handleElementFound] 找到元素，准备点击');
  notifyPopupLog(`✅ 找到页面元素\n标签: ${element.tagName.toLowerCase()}\n类名: ${element.className}`, 'success');
  
  // 滚动到元素位置
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  });
  
  // 等待 100ms 后点击
  setTimeout(function() {
    // 触发鼠标移入事件
    const mouseOverEvent = new MouseEvent('mouseover', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    element.dispatchEvent(mouseOverEvent);
    
    // 等待 50ms 后点击
    setTimeout(function() {
      // 触发点击事件
      if (element.click && typeof element.click === 'function') {
        element.click();
      }
      
      console.log('[handleElementFound] ✅ 元素点击成功');
      notifyPopupLog('✅ 元素已点击成功', 'success');
      
      // 如果需要等待成功弹窗
      if (waitForSuccess) {
        notifyPopupLog('⏳ 等待成功弹窗（最多60秒）...', 'info');
        console.log('[handleElementFound] 开始等待成功弹窗');
        waitForSuccessPopupPromise()
          .then(function(result) {
            console.log('[handleElementFound] 弹窗检测完成:', result);
            
            if (result.found) {
              // 找到成功弹窗
              console.log('[handleElementFound] ✅ 检测到成功弹窗');
              notifyPopupLog(`✅ 检测到成功弹窗\n弹窗内容: ${result.message}`, 'success');
              
              // 发送成功消息给 background
              chrome.runtime.sendMessage({
                action: 'elementSuccess',
                selector: selector,
                message: result.message,
              }, function(bgResponse) {
                console.log('[handleElementFound] background 收到 elementSuccess 消息');
              });
            } else {
              // 未找到成功弹窗
              console.log('[handleElementFound] ❌ 未检测到成功弹窗');
              notifyPopupLog(`❌ 未检测到成功弹窗\n${result.message}\n自动化已停止`, 'error');
              
              // 发送失败消息给 background
              chrome.runtime.sendMessage({
                action: 'elementFailed',
                selector: selector,
                message: result.message,
              }, function(bgResponse) {
                console.log('[handleElementFound] background 收到 elementFailed 消息');
              });
            }
            
            isClickProcessing = false;
          })
          .catch(function(error) {
            console.error('[handleElementFound] 等待弹窗时出错:', error);
            notifyPopupLog(`❌ 点击元素时出错\n错误: ${error.message}`, 'error');
            
            chrome.runtime.sendMessage({
              action: 'elementFailed',
              selector: selector,
              message: error.message,
            }, function(bgResponse) {
              console.log('[handleElementFound] background 收到 elementFailed 消息');
            });
            
            isClickProcessing = false;
          });
      } else {
        // 不等待弹窗
        console.log('[handleElementFound] 不需要等待弹窗，直接发送成功消息');
        notifyPopupLog('✅ 元素已点击成功（无需等待弹窗）', 'success');
        
        chrome.runtime.sendMessage({
          action: 'elementSuccess',
          selector: selector,
          message: '元素已点击',
        }, function(bgResponse) {
          console.log('[handleElementFound] background 收到 elementSuccess 消息');
        });
        
        isClickProcessing = false;
      }
    }, 50);
  }, 100);
}

// ✅ 将 waitForSuccessPopup 改造为返回 Promise 的函数
function waitForSuccessPopupPromise() {
  return new Promise(function(resolve, reject) {
    // 这里调用原来的 waitForSuccessPopup，但需要等待它完成
    const resultPromise = waitForSuccessPopup();
    
    // 如果 waitForSuccessPopup 返回 Promise
    if (resultPromise && typeof resultPromise.then === 'function') {
      resultPromise
        .then(function(result) {
          resolve(result);
        })
        .catch(function(error) {
          reject(error);
        });
    } else {
      // 如果不是 Promise，直接解决
      resolve(resultPromise);
    }
  });
}

// 监听来自 background.js 的消息
// ✅ 移除 async，避免 await 破坏消息上下文
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[Content Script] ⬇️ 收到来自 Background 的消息:', request);
  
  if (request.action === 'enableElementSelection') {
    enableElementSelection();
    const responseData = { success: true };
    console.log('[Content Script] ← sendResponse 数据:', responseData);
    sendResponse(responseData);
    return true;
  } else if (request.action === 'clickElement' || request.action === 'clickElementAndWaitPopup') {
    // ✅ 防抖检查：防止重复点击
    if (isClickProcessing) {
      console.log('[Content Script] ⚠️ 上一个点击操作还在进行中，忽略本次点击');
      const responseData = { success: false, message: '点击操作已在进行中，请稍候' };
      console.log('[Content Script] ← sendResponse 数据:', responseData);
      notifyPopupLog('⚠️ 点击操作已在进行中，忽略此次请求', 'warning');
      isClickProcessing = false;  // 重置防抖（防止卡死）
      sendResponse(responseData);
      return true;
    }
    
    // 标记开始处理
    isClickProcessing = true;
    
    const selector = request.selector;
    const waitForSuccess = request.waitForSuccess || false;
    console.log('[Content Script] 📍 开始处理点击指令');
    console.log('[Content Script] 📍  选择器:', selector);
    console.log('[Content Script] 📍  等待弹窗:', waitForSuccess);
    
    notifyPopupLog(`🔍 开始处理点击指令\n选择器: ${selector}\n等待弹窗: ${waitForSuccess ? '是' : '否'}`, 'info');

    // ✅ 立即发送初始响应（表示消息已接收），然后异步处理
    sendResponse({ success: true, message: '消息已接收' });
    
    
    // 异步处理点击逻辑（不使用 try-catch 作为外层包裹）
    processClickElement(selector, waitForSuccess);
    
    return true;
  }
});

// 启用元素选择模式
function enableElementSelection() {
  console.log('[Content Script] 启用元素选择模式');
  
  if (selectionMode) {
    return; // 已经启用了
  }

  selectionMode = true;

  // 添加高亮样式到页面
  if (!highlightStyle.parentElement) {
    document.head.appendChild(highlightStyle);
  }

  // 给 body 添加选择模式类
  document.body.classList.add('element-selection-overlay');

  // 监听鼠标移动 - 高亮元素
  document.addEventListener('mouseover', onElementHover, true);

  // 监听点击 - 选择元素
  document.addEventListener('click', onElementClick, true);

  // 监听 ESC 退出
  document.addEventListener('keydown', onEscapeKey, true);

  console.log('[Content Script] 元素选择模式已启用');
}

// 禁用元素选择模式
function disableElementSelection() {
  console.log('[Content Script] 禁用元素选择模式');
  
  selectionMode = false;

  // 移除事件监听
  document.removeEventListener('mouseover', onElementHover, true);
  document.removeEventListener('click', onElementClick, true);
  document.removeEventListener('keydown', onEscapeKey, true);

  // 移除高亮
  if (highlightedElement) {
    highlightedElement.classList.remove('element-highlight');
    highlightedElement = null;
  }

  // 移除类
  document.body.classList.remove('element-selection-overlay');

  console.log('[Content Script] 元素选择模式已禁用');
}

// 鼠标悬停事件
function onElementHover(event) {
  if (!selectionMode) return;

  // 移除之前的高亮
  if (highlightedElement && highlightedElement !== event.target) {
    highlightedElement.classList.remove('element-highlight');
  }

  // 高亮当前元素
  const element = event.target;
  if (element && element !== document.body && element !== document.html) {
    highlightedElement = element;
    element.classList.add('element-highlight');
  }
}

// 点击事件 - 选择元素
function onElementClick(event) {
  if (!selectionMode) return;

  event.preventDefault();
  event.stopPropagation();

  const element = event.target;

  // 生成选择器
  const selector = generateSelector(element);

  console.log('[Content Script] 选择的选择器:', selector);

  // 发送选择器回 popup
  chrome.runtime.sendMessage({
    action: 'elementSelected',
    selector: selector,
    element: element.tagName,
  });

  // 禁用选择模式
  disableElementSelection();
}

// ESC 键退出
function onEscapeKey(event) {
  if (event.key === 'Escape' && selectionMode) {
    event.preventDefault();
    disableElementSelection();
    chrome.runtime.sendMessage({
      action: 'elementSelectionCancelled',
    });
  }
}

// 生成选择器
function generateSelector(element) {
  // 优先返回 ID
  if (element.id) {
    return `#${element.id}`;
  }

  // 然后尝试 class
  if (element.className && typeof element.className === 'string') {
    const classes = element.className
      .split(/\s+/)
      .filter(c => c && !c.startsWith('element-'))
      .join('.');
    
    if (classes) {
      return `.${classes}`;
    }
  }

  // 尝试 data 属性
  for (const attr of element.attributes) {
    if (attr.name.startsWith('data-')) {
      return `[${attr.name}="${attr.value}"]`;
    }
  }

  // 其他属性
  if (element.name) {
    return `[name="${element.name}"]`;
  }

  if (element.type) {
    return `${element.tagName}[type="${element.type}"]`;
  }

  // 使用标签名和索引
  const tagName = element.tagName.toLowerCase();
  const siblings = Array.from(element.parentElement?.children || []).filter(
    el => el.tagName === element.tagName
  );

  if (siblings.length === 1) {
    return tagName;
  }

  const index = siblings.indexOf(element);
  return `${tagName}:nth-of-type(${index + 1})`;
}

// 等待成功弹窗出现（最多等待 60 秒）
function waitForSuccessPopup() {
  return new Promise((resolve) => {
    let attempts = 0;
    const maxAttempts = 120; // 60 秒（每 500ms 检查一次）
    let foundProcessing = false; // 标记是否看到了"采集中"
    console.log('[Content Script] 开始等待弹窗流程: 采集中 → 成功...');

    const checkPopup = setInterval(() => {
      attempts++;

      // 搜索页面中的弹窗元素
      const popupTexts = [];
      
      // 检查各常见的弹窗选择器和属性
      const popupSelectors = [
        '.popup',
        '.modal',
        '.dialog',
        '.alert',
        '.success',
        '.message',
        '.notification',
        '.toast',
        '[role="dialog"]',
        '[role="alert"]',
        '.ant-message',
        '.el-message',
        '.v-dialog',
        '.layui-layer-content',
        '[class*="dialog"]',
        '[class*="popup"]',
        '[class*="modal"]',
      ];

      let foundProcessingPopup = false;
      let foundSuccessPopup = false;

      // 先用选择器搜索
      for (const selector of popupSelectors) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const text = el.textContent || el.innerText || '';
          
          if (text.includes('采集中')) {
            foundProcessingPopup = true;
            foundProcessing = true;
            popupTexts.push({
              selector,
              text: text.slice(0, 100),
              type: 'processing',
            });
          } else if (text.includes('成功')) {
            foundSuccessPopup = true;
            popupTexts.push({
              selector,
              text: text.slice(0, 100),
              type: 'success',
            });
          }
        });
      }

      // 如果未找到，搜索所有可见的 div，找弹窗
      if (!foundProcessingPopup && !foundSuccessPopup) {
        const allElements = document.querySelectorAll('div, span, p, h1, h2, h3, .popup-content, [class*="popup"], [class*="modal"]');
        for (const el of allElements) {
          // 只检查可见的元素
          if (el.offsetParent !== null) {
            const text = el.textContent || el.innerText || '';
            // 如果文本不太长（可能是弹窗），且包含关键词
            if (text.length < 1000 && text.length > 2) {
              const rect = el.getBoundingClientRect();
              const isLikelyPopup = rect.width < window.innerWidth * 0.9 && 
                                   rect.height < window.innerHeight * 0.9;
              
              if (isLikelyPopup || el.className.includes('popup') || el.className.includes('modal')) {
                if (text.includes('采集中')) {
                  foundProcessingPopup = true;
                  foundProcessing = true;
                  popupTexts.push({
                    element: el.className || el.id || el.tagName,
                    text: text.slice(0, 100),
                    type: 'processing',
                  });
                  break;
                } else if (text.includes('成功')) {
                  foundSuccessPopup = true;
                  popupTexts.push({
                    element: el.className || el.id || el.tagName,
                    text: text.slice(0, 100),
                    type: 'success',
                  });
                  break;
                }
              }
            }
          }
        }
      }

      // 检测流程
      if (foundProcessingPopup) {
        console.log('[Content Script] ⏳ 检测到"采集中"弹窗，等待"成功"弹窗...', popupTexts);
      }

      if (foundSuccessPopup) {
        clearInterval(checkPopup);
        console.log('[Content Script] ✅ 成功弹窗检测到:', popupTexts);
        notifyPopupLog(`✅ 检测到成功弹窗 (${foundProcessing ? '采集中 → ' : ''}成功)\n${popupTexts[0]?.text || '成功'}`, 'success');
        resolve({
          found: true,
          message: popupTexts[0]?.text || '成功',
          details: popupTexts,
          hasProcessing: foundProcessing,
        });
        return;
      }

      // 如果超过最大尝试次数，返回失败
      if (attempts >= maxAttempts) {
        clearInterval(checkPopup);
        const timeoutMsg = foundProcessing ? '检测到"采集中"但未等到"成功"(超时60秒)' : '未找到弹窗(超时60秒)';
        console.log('[Content Script] 等待弹窗超时:', timeoutMsg);
        notifyPopupLog(`⏱️ 等待弹窗超时\n${timeoutMsg}\n自动化已停止`, 'warning');
        resolve({
          found: false,
          message: timeoutMsg,
          hasProcessing: foundProcessing,
        });
      }
      
      // 每 10 次检查输出一次日志
      if (attempts % 10 === 0) {
        console.log(`[Content Script] 继续检测弹窗... 已耗时 ${attempts * 0.5} 秒`);
      }
    }, 500); // 每 500ms 检查一次
  });
}

// 页面加载完成时执行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[Content Script] DOM 已加载');
  });
} else {
  console.log('[Content Script] 页面已加载');
}
