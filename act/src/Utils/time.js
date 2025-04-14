export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate(); // 获取日期（1-31）
    const month = date.getMonth() + 1; // 获取月份（1-12）
    const year = date.getFullYear(); // 获取年份（如 2025）
  
    return {
      day: day.toString().padStart(2, '0'), // 转换为字符串并补零
      monthYear: `${year}-${month.toString().padStart(2, '0')}`, // 格式化为 "2025-04"
    };
  };