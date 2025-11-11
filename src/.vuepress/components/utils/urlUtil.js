/**
 * 提取URL中主域名之后的部分（包含第一个/），将/转译成_，并截取掉最后五个字符
 * @param {string} url - 可选参数，要处理的URL，默认使用当前页面URL
 * @returns {string} 处理后的路径结果，若路径长度≤5则返回空字符串；解析失败也返回空字符串
 */
export function getPathAfterDomain(url = window.location.href) {
  try {
    // 1. 解析URL并提取主域名后的原始路径
    const parsedUrl = new URL(url);
    const domainPart = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const domainLength = domainPart.length + 1; // +1 是为了跳过主域名后的第一个 "/"
    let pathPart = url.substring(domainLength);

    // 2. 解码URL中的中文字符
    const decodedPath = decodeURIComponent(pathPart);
    
    // 3. 将所有斜杠/转译为下划线_
    const withUnderscores = decodedPath.replace(/\//g, '_');

    // 4. 截取最后五个字符
    const result = withUnderscores.length > 5 
      ? withUnderscores.substring(0, withUnderscores.length - 5) 
      : '';

    return result;

  } catch (error) {
    console.error('解析URL或处理路径时出错:', error);
    return '';
  }
}
