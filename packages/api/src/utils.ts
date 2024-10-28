export const commonFetch = async (
  url: string,
  paramOrData?: Record<string, unknown>,
  method: "GET" | "POST" = "GET"
): Promise<any> => {
  // 初始化请求选项
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  // 处理 GET 请求的查询参数
  if (method === "GET" && paramOrData) {
    url +=
      "?" +
      Object.keys(paramOrData)
        .map((key) => {
          return `${key}=${paramOrData[key]}`;
        })
        .join("&");
  } else if (method === "POST" && paramOrData) {
    // 为 POST 请求设置请求体
    options.body = JSON.stringify(paramOrData);
  }

  try {
    // 发送 fetch 请求
    const response = await fetch(url, options);

    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析响应数据
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
