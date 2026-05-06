// background.js - 后台服务脚本，管理自动化逻辑

let automateState = {
  running: false,
  paused: false,
  currentIndex: 0,
  config: null,
  options: {},
  currentTabId: null,
};

// 监听来自 popup.js 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'startAutomate') {
    automateState.running = true;
    automateState.paused = false;
    automateState.currentIndex = 0;
    automateState.config = request.config;
    automateState.options = {
      closeTab: request.closeTab,
      autoNext: request.autoNext,
    };

    console.log('[Background] 自动化已启动', automateState.config);
    notifyPopup('addLog', {
      message: `🎯 后台自动化已启动\n配置:\n• URL数量: ${request.config.urls.length}\n• 选择器: ${request.config.selector}`,
      type: 'info',
    });
    
    // ✅ 延迟 500ms 确保 popup 完全初始化后再开始处理第一个链接
    // 这样可以避免第一个链接因为 popup 未就绪而丢失数据
    setTimeout(() => {
      console.log('[Background] 500ms 延迟后启动 openNextUrl()');
      openNextUrl();
    }, 500);
    
    sendResponse({ status: 'started' });
  } else if (request.action === 'pauseAutomate') {
    automateState.paused = request.paused;
    console.log('暂停状态:', request.paused);
    sendResponse({ status: 'paused' });
  } else if (request.action === 'stopAutomate') {
    automateState.running = false;
    automateState.paused = false;
    console.log('自动化已停止');
    // 关闭当前标签页
    if (automateState.currentTabId) {
      chrome.tabs.remove(automateState.currentTabId);
      automateState.currentTabId = null;
    }
    sendResponse({ status: 'stopped' });
  } else if (request.action === 'addLog') {
    // 来自 content-script 的日志消息
    console.log('[Background] 收到日志消息:', request.message);
    notifyPopup('addLog', {
      message: request.message,
      type: request.type || 'info',
    });
    sendResponse({ status: 'logged' });
  } else if (request.action === 'elementSuccess') {
    // ✅ content-script 检测到成功弹窗或完成点击
    console.log('[Background] 收到 elementSuccess 消息:', request.message);
    notifyPopup('addLog', {
      message: `✅ 成功: ${request.message}`,
      type: 'success',
    });
    handleAfterClick();
    sendResponse({ status: 'success-handled' });
  } else if (request.action === 'elementFailed') {
    // ❌ content-script 未检测到成功弹窗
    console.log('[Background] 收到 elementFailed 消息:', request.message);
    notifyPopup('addLog', {
      message: `❌ 失败: ${request.message}`,
      type: 'error',
    });
    
    automateState.running = false;
    automateState.paused = false;
    
    notifyPopup('updateStatus', {
      running: false,
      paused: false,
    });
    
    // 关闭标签页
    if (automateState.currentTabId) {
      console.log('关闭标签页（因为检测失败）');
      chrome.tabs.remove(automateState.currentTabId);
      automateState.currentTabId = null;
    }
    
    sendResponse({ status: 'failed-handled' });
  }
});

// 打开下一个 URL
function openNextUrl() {
  // 立即打印诊断信息，看是否被调用
  notifyPopup('addLog', {
    message: `🔍 openNextUrl() 被调用 | 状态: running=${automateState.running}, paused=${automateState.paused}, index=${automateState.currentIndex}, urls=${automateState.config?.urls?.length || 0}`,
    type: 'debug',
  });
  
  console.log('[openNextUrl] 开始执行，状态检查:');
  console.log('  - running:', automateState.running);
  console.log('  - paused:', automateState.paused);
  console.log('  - currentIndex:', automateState.currentIndex);
  console.log('  - config:', automateState.config);
  
  // 检查是否暂停
  if (automateState.paused) {
    console.log('[openNextUrl] 处于暂停状态，等待继续...');
    notifyPopup('addLog', {
      message: '⏸️ ⚠️ 处于暂停状态，等待继续...',
      type: 'warning',
    });
    setTimeout(openNextUrl, 1000);
    return;
  }

  // 检查配置是否存在
  if (!automateState.config || !automateState.config.urls) {
    console.error('[openNextUrl] ❌ 配置不完整，无法继续');
    automateState.running = false;
    notifyPopup('addLog', {
      message: `❌ 检查失败: 配置不完整 | config=${!!automateState.config}, urls=${!!automateState.config?.urls}`,
      type: 'error',
    });
    return;
  }

  // 检查是否已完成
  if (automateState.currentIndex >= automateState.config.urls.length) {
    console.log('[openNextUrl] 所有链接已处理完成');
    automateState.running = false;
    automateState.currentIndex = 0;
    automateState.currentTabId = null;
    console.log('自动化已完成');
    notifyPopup('addLog', {
      message: `✅ 所有 ${automateState.config.urls.length} 个链接已处理完成！`,
      type: 'success',
    });
    notifyPopup('automateFinished', {});
    return;
  }

  if (!automateState.running) {
    console.log('[openNextUrl] 自动化未运行，返回');
    notifyPopup('addLog', {
      message: '⚠️ 检查失败: 自动化未运行 (running=false)',
      type: 'warning',
    });
    return;
  }

  const url = automateState.config.urls[automateState.currentIndex];
  const selector = automateState.config.selector;
  console.log(`[openNextUrl] 打开第 ${automateState.currentIndex + 1} 个链接: ${url}`);
  notifyPopup('addLog', {
    message: `[${automateState.currentIndex + 1}/${automateState.config.urls.length}] 🔗 开始打开链接: ${url}`,
    type: 'info',
  });

  // 通知 popup 更新进度
  notifyPopup('updateProgress', {
    index: automateState.currentIndex,
    url: url,
  });

  notifyPopup('addLog', {
    message: `🔗 打开链接: ${url}`,
    type: 'info',
  });

  // 打开新标签页
  notifyPopup('addLog', {
    message: `⏳ 正在创建新标签页...`,
    type: 'info',
  });
  
  console.log('[openNextUrl] 即将调用 chrome.tabs.create()');
  
  chrome.tabs.create({ url: url }, (tab) => {
    console.log('[chrome.tabs.create 回调] 被触发，tab:', tab);
    notifyPopup('addLog', {
      message: `📌 chrome.tabs.create 回调被触发 | tab=${!!tab}, tabId=${tab?.id}`,
      type: 'debug',
    });
    
    if (!tab) {
      console.error('[chrome.tabs.create] ❌ 无法创建标签页，tab 为 undefined');
      notifyPopup('addLog', {
        message: `❌ 无法打开链接: ${url} (tab is null)`,
        type: 'error',
      });
      handleAfterClick();
      return;
    }

    automateState.currentTabId = tab.id;
    console.log(`[chrome.tabs.create] ✅ 新标签页已创建，ID: ${tab.id}`);
    notifyPopup('addLog', {
      message: `✅ 新标签页已打开 (ID: ${tab.id})`,
      type: 'success',
    });

    // ✅ 等待页面加载完成后点击元素
    const waitTime = 4000;
    console.log(`[openNextUrl] 第 ${automateState.currentIndex + 1} 个链接：等待 ${waitTime}ms 后点击元素: ${selector}`);
    notifyPopup('addLog', {
      message: `⏳ 第 ${automateState.currentIndex + 1} 个链接：等待页面加载 ${waitTime}ms (${waitTime/1000}秒)...`,
      type: 'info',
    });

    setTimeout(() => {
      console.log('[延迟回调] 2秒后被触发，检查状态:', {
        running: automateState.running,
        tabId: automateState.currentTabId,
      });
      notifyPopup('addLog', {
        message: `⏳ 2秒延迟回调被触发 | running=${automateState.running}, tabId=${automateState.currentTabId}`,
        type: 'debug',
      });
      
      if (automateState.running && automateState.currentTabId) {
        // 向打开的标签页注入 content script
        notifyPopup('addLog', {
          message: `📤 准备向标签页 ${automateState.currentTabId} 发送点击指令...`,
          type: 'info',
        });
        
        chrome.tabs.sendMessage(
          automateState.currentTabId,
          {
            action: 'clickElement',
            selector: selector,
            waitForSuccess: true,  // ✅ 启用等待成功弹窗
          },
          (response) => {
            console.log('[sendMessage 回调] 响应:', response, 'lastError:', chrome.runtime.lastError);
            
            // 这个回调只用于记录日志，实际处理通过 elementSuccess/elementFailed 消息进行
            if (chrome.runtime.lastError) {
              console.log('标签页响应错误:', chrome.runtime.lastError);
              notifyPopup('addLog', {
                message: `⚠️ 发送消息到标签页失败: ${chrome.runtime.lastError.message}`,
                type: 'warning',
              });
            } else if (response) {
              console.log('[sendMessage] 收到初始确认响应');
              notifyPopup('addLog', {
                message: `📨 内容脚本已收到点击指令，开始处理...`,
                type: 'info',
              });
            }
          }
        );
      } else {
        notifyPopup('addLog', {
          message: `⚠️ 延迟回调中: running=${automateState.running}, tabId=${automateState.currentTabId}`,
          type: 'warning',
        });
      }
    }, waitTime);
  });
}

// 处理点击后的逻辑
function handleAfterClick() {
  console.log('[handleAfterClick] 被调用，状态:', {
    running: automateState.running,
    currentIndex: automateState.currentIndex,
    urlCount: automateState.config?.urls?.length,
    currentTabId: automateState.currentTabId,
  });
  
  if (
    automateState.running &&
    automateState.currentIndex < automateState.config.urls.length
  ) {
    // 延迟 2 秒让弹窗完全显示和消失，然后关闭标签页
    setTimeout(() => {
      // 关闭标签页
      console.log('[handleAfterClick 2秒回调] 准备关闭标签页，currentTabId:', automateState.currentTabId);
      
      if (automateState.currentTabId) {
        console.log('关闭标签页 ID:', automateState.currentTabId);
        notifyPopup('addLog', {
          message: '⏳ 正在关闭当前标签页...', 
          type: 'info',
        });
        chrome.tabs.remove(automateState.currentTabId);
        automateState.currentTabId = null;
      } else {
        console.warn('[handleAfterClick] ⚠️ currentTabId 为 null/undefined，无法关闭标签页！');
        notifyPopup('addLog', {
          message: '⚠️ 警告：currentTabId 为 null，无法关闭标签页',
          type: 'warning',
        });
      }

      // 移到下一个链接
      console.log('[handleAfterClick] 递增 currentIndex:', automateState.currentIndex, '→', automateState.currentIndex + 1);
      automateState.currentIndex++;
      const nextIndex = automateState.currentIndex + 1;
      const totalCount = automateState.config.urls.length;


      if (nextIndex <= totalCount) { 
        console.log(`移到下一个链接，索引: ${automateState.currentIndex}/${totalCount}`);
        notifyPopup('addLog', {
          message: `➡️ 标签页已关闭，准备打开第 ${nextIndex}/${totalCount} 个链接...`,
          type: 'info',
        });

        // 等待 1 秒后打开下一个
        setTimeout(openNextUrl, 1000);
      } else {
        // ✅ 所有链接已处理完成
        console.log('✅ 所有链接已处理完成！');
        automateState.running = false;
        automateState.paused = false;
        automateState.currentIndex = 0;  // ✅ 重置进度
        
        notifyPopup('addLog', {
          message: `🎉 所有 ${totalCount} 个链接已全部处理完成！`,
          type: 'success',
        });
        
        // 发送完成消息到popup
        notifyPopup('automateFinished', {
          completedCount: totalCount,
          message: '自动化任务已完成！'
        });
        
        // ✅ 显示alert提示用户
        notifyPopup('showAlert', {
          title: '✅ 自动化完成',
          message: `已成功处理全部 ${totalCount} 个链接！`
        });
      }
    }, 5000);  // ✅ 增加到 5 秒，给网站更多时间完成后台保存操作
  }
}

// 通知 popup 更新信息
function notifyPopup(action, data) {
  // 对于 addLog 类型的消息，同时保存到 storage 作为备份
  if (action === 'addLog') {
    chrome.storage.local.get(['automationLogs'], (result) => {
      let logs = result.automationLogs || [];
      
      // 添加时间戳
      const logEntry = {
        message: data.message,
        type: data.type || 'info',
        timestamp: new Date().toLocaleTimeString('zh-CN'),
      };
      
      logs.push(logEntry);
      
      // 限制最多 500 条日志
      if (logs.length > 500) {
        logs = logs.slice(-500);
      }
      
      chrome.storage.local.set({
        automationLogs: logs,
      });
    });
  }
  
  // ✅ 对于 automateFinished 消息，保存状态到 storage
  if (action === 'automateFinished') {
    chrome.storage.local.set({
      automationConfig: {
        ...automateState.config,
        running: false,
        paused: false,
        currentIndex: 0,  // ✅ 确保保存重置后的 currentIndex
      }
    }, () => {
      console.log('[notifyPopup] automateFinished 状态已保存到 storage');
    });
  }
  
  // ✅ 对于 updateStatus 消息，保存状态到 storage
  if (action === 'updateStatus') {
    chrome.storage.local.set({
      automationConfig: {
        ...automateState.config,
        running: data.running || false,
        paused: data.paused || false,
        currentIndex: automateState.currentIndex,
      }
    }, () => {
      console.log('[notifyPopup] updateStatus 状态已保存到 storage');
    });
  }
  
  // 尝试发送到 popup
  chrome.runtime.sendMessage(
    {
      action: action,
      ...data,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.log('[notifyPopup] popup 未打开，消息已保存到 storage:', action, data.message);
      }
    }
  );
}

// 监听标签页关闭事件
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('[chrome.tabs.onRemoved] 标签页被关闭，tabId:', tabId, ', currentTabId:', automateState.currentTabId);
  
  if (tabId === automateState.currentTabId) {
    console.log('[chrome.tabs.onRemoved] 匹配当前标签页，清空 currentTabId');
    automateState.currentTabId = null;

    // 如果还在运行中，且没有 handleAfterClick 正在处理中，才继续打开下一个
    if (automateState.running) {
      console.log('[chrome.tabs.onRemoved] 自动化仍在运行，但等待 handleAfterClick 的处理（不直接递增 index）');
      // ✅ 改正：不在这里递增 currentIndex，由 handleAfterClick 负责
      // automateState.currentIndex++;
      // setTimeout(openNextUrl, 1000);
    } else {
      console.log('[chrome.tabs.onRemoved] 自动化已停止，不继续处理');
    }
  } else {
    console.log('[chrome.tabs.onRemoved] tabId 不匹配，忽略');
  }
});

// 监听扩展安装事件
chrome.runtime.onInstalled.addListener(() => {
  console.log('自动化扩展已安装');
});

