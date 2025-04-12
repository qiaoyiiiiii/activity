// 1. 创建WebSocket连接
const socket = new WebSocket("ws://your-websocket-address/send.message"); // 替换为您的WebSocket地址

// 2. 监听连接事件
socket.onopen = () => {
    console.log("WebSocket连接已建立");
};

// 3. 监听消息接收事件
socket.onmessage = (event) => {
    console.log("收到消息:", event.data);
    // 在这里处理接收到的消息
};

// 4. 监听错误事件
socket.onerror = (error) => {
    console.error("WebSocket错误:", error);
};

// 5. 监听连接关闭事件
socket.onclose = () => {
    console.log("WebSocket连接已关闭");
};

// 6. 发送私信 (MessageDTO)
function sendPrivateMessage(messageDTO) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(messageDTO));
    } else {
        console.error("WebSocket连接未打开，无法发送消息");
    }
}

// 7. 发送广播 (后端调用，前端通常不直接调用)
// 示例：socket.send(JSON.stringify({ type: "broadcast", ...MessageDTO }));

// 8. 发送活动通知 (后端调用，前端通常不直接调用)
// 示例：socket.send(JSON.stringify({ type: "activityNotification", activityId: 123, ...MessageDTO }));

// 9. 发送给特定用户 (后端调用，前端通常不直接调用)
// 示例：socket.send(JSON.stringify({ type: "sendToUser", userId: 456, ...MessageDTO }));

// MessageDTO 示例
const messageDTO = {
    senderId: 1,
    receiverId: 2,
    content: "你好！",
    timestamp: Date.now(),
    // ... 其他消息字段
};

// 发送私信示例
sendPrivateMessage(messageDTO);