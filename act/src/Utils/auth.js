function isLoggedIn() {
    const token = localStorage.getItem('token');
  
    if (!token) {
      return false; // 令牌不存在，用户未登录
    }
  
    // 在这里，你可以添加额外的检查以验证令牌的有效性，例如：
    // - 检查令牌是否已过期
    // - 检查令牌的签名是否有效（需要一个 JWT 库）
  
    // 如果你需要验证令牌有效性，并使用jsonwebtoken验证token
    // 需要安装jsonwebtoken: npm install jsonwebtoken
    // const jwt = require('jsonwebtoken');
    // try {
    //   const decoded = jwt.verify(token, 'your_secret_key'); // 替换为你的密钥
    //   // 检查解码后的令牌是否包含必要的用户信息
    //   return !!decoded.userId; // 或者其他你需要的检查
    // } catch (error) {
    //   // 令牌无效或已过期
    //   return false;
    // }
    return true; // 令牌存在，假设用户已登录
  }

export default {
  mounted(el, binding) {
    el.addEventListener('click', (event) => {
      if (!isLoggedIn()) {
        event.preventDefault(); // 阻止默认行为
        alert('请先登录');
        router.push('/login'); // 跳转到登录页面
      }
    });
  },
};