// log-manager.js - 日志管理功能扩展模块

document.addEventListener('DOMContentLoaded', () => {
  initializeLogButtons();
});

function initializeLogButtons() {
  // 清空日志按钮
  const clearLogsBtn = document.getElementById('clearLogsBtn');
  if (clearLogsBtn) {
    clearLogsBtn.addEventListener('click', clearLogs);
  }
  
  // 导出日志按钮
  const exportLogsBtn = document.getElementById('exportLogsBtn');
  if (exportLogsBtn) {
    exportLogsBtn.addEventListener('click', exportLogs);
  }
}

function clearLogs() {
  if (confirm('确定要清空所有日志吗？')) {
    const logBox = document.getElementById('logBox');
    logBox.innerHTML = '';
    chrome.storage.local.set({ automationLogs: [] }, () => {
      // 添加一条清空日志的记录
      const timestamp = new Date().toLocaleTimeString('zh-CN');
      logBox.innerHTML = `<p class="log-item info">${timestamp} - 📋 日志已清空</p>`;
      
      // 保存这一条日志
      const logs = [{
        message: '📋 日志已清空',
        type: 'info',
        timestamp: timestamp
      }];
      chrome.storage.local.set({ automationLogs: logs });
    });
  }
}

function exportLogs() {
  chrome.storage.local.get(['automationLogs'], (result) => {
    const logs = result.automationLogs || [];
    if (logs.length === 0) {
      alert('没有日志可以导出');
      return;
    }
    
    // 构建导出内容
    let exportText = '自动化工具运行日志\n';
    exportText += '导出时间: ' + new Date().toLocaleString('zh-CN') + '\n';
    exportText += '='.repeat(60) + '\n\n';
    
    logs.forEach((log, index) => {
      exportText += `[${index + 1}] ${log.timestamp} - ${log.message}\n`;
    });
    
    // 创建 Blob 并触发下载
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `automation-logs-${new Date().getTime()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
    
    // 记录导出操作
    const timestamp = new Date().toLocaleTimeString('zh-CN');
    const logBox = document.getElementById('logBox');
    if (logBox) {
      const logItem = document.createElement('p');
      logItem.className = 'log-item success';
      logItem.textContent = timestamp + ' - ✅ 日志已导出';
      logBox.appendChild(logItem);
      logBox.scrollTop = logBox.scrollHeight;
    }
    
    // 同时保存导出记录
    logs.push({
      message: '✅ 日志已导出',
      type: 'success',
      timestamp: timestamp
    });
    if (logs.length > 500) {
      logs = logs.slice(-500);
    }
    chrome.storage.local.set({ automationLogs: logs });
  });
}
