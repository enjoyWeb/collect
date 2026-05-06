// popup.js - 处理 UI 交互

const urlsInput = document.getElementById('urlsInput');
const selectorInput = document.getElementById('selectorInput');
const applyBtn = document.getElementById('applyBtn');
const urlCount = document.getElementById('urlCount');

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');

const statusSpan = document.getElementById('status');
const progressSpan = document.getElementById('progress');
const currentUrlSpan = document.getElementById('currentUrl');
const logBox = document.getElementById('logBox');

let config = {
  urls: [],
  selector: '',
  running: false,
  paused: false,
  currentIndex: 0,
};

// ✅ 存储textarea的原始值，用于保留用户的精确输入格式
let textareaRawText = '';
let selectorRawText = '';

// 初始化 - 从存储加载配置
function initConfig() {
  chrome.storage.local.get(['automationConfig', 'automationLogs', 'textareaRawText', 'selectorRawText'], (result) => {
    if (result.automationConfig) {
      config = result.automationConfig;
      console.log('[Popup] 从storage恢复config，URLs:', config.urls);
      console.log('[Popup] 恢复running状态:', config.running, ', paused状态:', config.paused);
    } else {
      console.log('[Popup] storage中没有automationConfig，使用默认值');
    }
    
    // ✅ 恢复textarea的原始文本（优先使用原始值）
    if (result.textareaRawText !== undefined) {
      textareaRawText = result.textareaRawText;
      console.log('[Popup] 恢复textarea原始值');
    } else if (config.urls && config.urls.length > 0) {
      textareaRawText = config.urls.join('\n');
      console.log('[Popup] 从config.urls生成textarea值');
    }
    
    // ✅ 恢复选择器的原始文本
    if (result.selectorRawText !== undefined) {
      selectorRawText = result.selectorRawText;
      console.log('[Popup] 恢复选择器原始值');
    } else if (config.selector) {
      selectorRawText = config.selector;
    }
    
    updateDisplay();
    updateStatus();
    
    // 清空日志框，然后从存储恢复日志
    logBox.innerHTML = '';
    
    // ✅ 从存储恢复日志
    if (result.automationLogs && result.automationLogs.length > 0) {
      console.log('[Popup] 恢复了 ' + result.automationLogs.length + ' 条历史日志');
      result.automationLogs.forEach(log => {
        displayLogItem(log.message, log.type, log.timestamp);
      });
    }
  });
}

// 保存配置
function saveConfig() {
  chrome.storage.local.set({ automationConfig: config }, () => {
    console.log('配置已保存');
  });
}

// 应用配置 - 将选择器应用到所有 URL
function applyConfig() {
  const urlTexts = urlsInput.value
    .trim()
    .split('\n')
    .filter(u => u.trim());

  const selector = selectorInput.value.trim();

  if (urlTexts.length === 0) {
    alert('❌ 请先输入至少一个 URL');
    return;
  }

  if (!selector) {
    alert('❌ 请先输入选择器');
    return;
  }

  config.urls = urlTexts.map(url => url.trim());
  config.selector = selector;

  saveConfig();
  updateDisplay();
  addLog(
    `✅ 已应用配置\n• URL 数量: ${config.urls.length}\n• 选择器: ${selector}`,
    'success'
  );
}

// 更新显示
function updateDisplay() {
  // ✅ 使用原始TextArea值而不是join()后的数组（保留用户的精确输入格式）
  urlsInput.value = textareaRawText;
  
  // ✅ 使用原始选择器值
  selectorInput.value = selectorRawText || '.el-button.el-button--primary.el-button--mini';
  
  // 更新计数显示
  const displayUrls = textareaRawText.trim().split('\n').filter(u => u.trim());
  urlCount.textContent = `已添加：${displayUrls.length} 个URL`;
}

// 监听来自 background script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateProgress') {
    config.currentIndex = request.index;
    currentUrlSpan.textContent = request.url;
    progressSpan.textContent = `${request.index + 1}/${config.urls.length}`;
    sendResponse({ received: true });
  } else if (request.action === 'addLog') {
    addLog(request.message, request.type);
    sendResponse({ received: true });
  } else if (request.action === 'updateStatus') {
    // 更新自动化状态（来自 background 的通知）
    config.running = request.running || false;
    config.paused = request.paused || false;
    saveConfig();
    updateStatus();
    sendResponse({ received: true });
  } else if (request.action === 'automateFinished') {
    config.running = false;
    config.paused = false;  // ✅ 确保暂停状态也重置
    config.currentIndex = 0;  // ✅ 重置进度为 0/0
    currentUrlSpan.textContent = '-';  // ✅ 清空当前 URL
    saveConfig();
    updateStatus();
    addLog('✅ 自动化已完成！所有链接已处理', 'success');
    sendResponse({ received: true });
  } else if (request.action === 'showAlert') {
    // ✅ 显示alert提示
    alert(request.message);
    sendResponse({ received: true });
  }
});

// 应用配置按钮
// applyBtn.addEventListener('click', applyConfig);  // 移到 DOMContentLoaded

// ✅ 实时缓存 URL 列表和选择器
// 这些事件监听器已移到 DOMContentLoaded 中

// 添加日志（同时保存到存储）
function addLog(message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString('zh-CN');
  displayLogItem(message, type, timestamp);
  
  // ✅ 保存日志到 chrome.storage
  chrome.storage.local.get(['automationLogs'], (result) => {
    let logs = result.automationLogs || [];
    
    // 限制日志数量在 500 条以内（防止存储过大）
    logs.push({ message, type, timestamp });
    if (logs.length > 500) {
      logs = logs.slice(-500);
    }
    
    chrome.storage.local.set({ automationLogs: logs });
  });
}

// 在 DOM 中显示日志项
function displayLogItem(message, type = 'info', timestamp = null) {
  const logItem = document.createElement('p');
  logItem.className = `log-item ${type}`;
  const time = timestamp || new Date().toLocaleTimeString('zh-CN');
  logItem.textContent = time + ' - ' + message;
  logBox.appendChild(logItem);
  logBox.scrollTop = logBox.scrollHeight;
}

// 更新状态显示
function updateStatus() {
  if (config.running) {
    if (config.paused) {
      statusSpan.textContent = '已暂停';
      statusSpan.className = 'status-paused';
      if (pauseBtn) pauseBtn.textContent = '▶️ 继续';
    } else {
      statusSpan.textContent = '运行中...';
      statusSpan.className = 'status-running';
      if (pauseBtn) pauseBtn.textContent = '⏸️ 暂停';
    }
    startBtn.disabled = true;
    if (pauseBtn) pauseBtn.disabled = false;
    stopBtn.disabled = false;
  } else {
    statusSpan.textContent = '未运行';
    statusSpan.className = 'status-idle';
    if (pauseBtn) pauseBtn.textContent = '⏸️ 暂停';
    startBtn.disabled = false;
    if (pauseBtn) pauseBtn.disabled = true;
    stopBtn.disabled = true;
  }

  // ✅ 完成状态下显示 0/0，运行状态下显示当前进度
  if (!config.running && config.currentIndex === 0) {
    progressSpan.textContent = '0/0';
  } else {
    progressSpan.textContent = `${config.currentIndex + 1}/${config.urls.length}`;
  }
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', () => {
  initConfig();
  updateStatus();
  
  // ✅ 在 DOMContentLoaded 后绑定所有事件监听器
  
  // 应用配置按钮
  applyBtn.addEventListener('click', applyConfig);
  
  // 开始运行按钮
  startBtn.addEventListener('click', () => {
    if (config.urls.length === 0) {
      alert('❌ 请先【应用配置】');
      return;
    }

    config.running = true;
    config.paused = false;
    config.currentIndex = 0;

    saveConfig();
    updateStatus();

    console.log('[Popup] 开始自动化，发送配置:', {
      urls: config.urls,
      selector: config.selector,
      urlCount: config.urls.length,
    });

    chrome.runtime.sendMessage(
      {
        action: 'startAutomate',
        config: config,
      },
      (response) => {
        if (response && response.error) {
          addLog('❌ 错误: ' + response.error, 'error');
        }
      }
    );

    addLog('▶️ 自动化已启动，开始打开第 1 个链接...', 'info');
  });

  // 暂停运行按钮
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      config.paused = !config.paused;
      saveConfig();
      updateStatus();

      chrome.runtime.sendMessage({
        action: 'pauseAutomate',
        paused: config.paused,
      });

      if (config.paused) {
        addLog('⏸️ 自动化已暂停', 'warning');
      } else {
        addLog('▶️ 自动化已继续', 'info');
      }
    });
  }

  // 停止运行按钮
  stopBtn.addEventListener('click', () => {
    config.running = false;
    config.paused = false;
    saveConfig();
    updateStatus();

    chrome.runtime.sendMessage({ action: 'stopAutomate' });

    addLog('⏹️ 自动化已停止', 'warning');
  });
  
  // URL 输入框事件监听
  let urlSaveTimeout;
  urlsInput.addEventListener('input', () => {
    clearTimeout(urlSaveTimeout);
    urlSaveTimeout = setTimeout(() => {
      textareaRawText = urlsInput.value;
      const urlTexts = textareaRawText.trim().split('\n').filter(u => u.trim());
      config.urls = urlTexts.map(url => url.trim());
      
      chrome.storage.local.set({ 
        automationConfig: config,
        textareaRawText: textareaRawText 
      });
      
      urlCount.textContent = `已添加：${config.urls.length} 个URL`;
      console.log('[Popup] URL列表已实时缓存，共', config.urls.length, '个');
    }, 500);
  });

  urlsInput.addEventListener('blur', () => {
    clearTimeout(urlSaveTimeout);
    textareaRawText = urlsInput.value;
    const urlTexts = textareaRawText.trim().split('\n').filter(u => u.trim());
    config.urls = urlTexts.map(url => url.trim());
    
    chrome.storage.local.set({ 
      automationConfig: config,
      textareaRawText: textareaRawText 
    });
    
    urlCount.textContent = `已添加：${config.urls.length} 个URL`;
    console.log('[Popup] URL列表已保存（blur事件），共', config.urls.length, '个');
  });

  // 选择器输入框事件监听
  let selectorSaveTimeout;
  selectorInput.addEventListener('input', () => {
    clearTimeout(selectorSaveTimeout);
    selectorSaveTimeout = setTimeout(() => {
      selectorRawText = selectorInput.value.trim();
      config.selector = selectorRawText;
      
      chrome.storage.local.set({ 
        automationConfig: config,
        selectorRawText: selectorRawText 
      });
      
      console.log('[Popup] 选择器已实时缓存:', selectorRawText);
    }, 500);
  });

  selectorInput.addEventListener('blur', () => {
    clearTimeout(selectorSaveTimeout);
    selectorRawText = selectorInput.value.trim();
    config.selector = selectorRawText;
    
    chrome.storage.local.set({ 
      automationConfig: config,
      selectorRawText: selectorRawText 
    });
    
    console.log('[Popup] 选择器已保存（blur事件）:', selectorRawText);
  });
  
  // ✅ 定期检查运行状态（在 DOMContentLoaded 后执行）
  setInterval(() => {
    chrome.storage.local.get(['automationConfig'], (result) => {
      if (result.automationConfig) {
        if (result.automationConfig.running !== config.running) {
          config = result.automationConfig;
          updateStatus();
          updateDisplay();
        }
      }
    });
  }, 500);
  
  // ✅ 当popup被隐藏/关闭时，强制保存当前的URL和选择器（在 DOMContentLoaded 后执行）
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('[Popup] 页面即将隐藏，强制保存数据...');
      
      textareaRawText = urlsInput.value;
      selectorRawText = selectorInput.value.trim();
      
      const urlTexts = textareaRawText.trim().split('\n').filter(u => u.trim());
      config.urls = urlTexts.map(url => url.trim());
      config.selector = selectorRawText;
      
      chrome.storage.local.set({ 
        automationConfig: config,
        textareaRawText: textareaRawText,
        selectorRawText: selectorRawText 
      }, () => {
        console.log('[Popup] 数据已强制保存，URL数:', config.urls.length);
      });
    }
  });
});
