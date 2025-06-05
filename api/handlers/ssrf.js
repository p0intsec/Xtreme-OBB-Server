/**
 * Xtreme Serverless OOB - SSRF Handler
 * Developed by p0intsec (06/2025)
 * MIT Licensed
 */

export async function handleSSRF(requestData) {
  const attackDetails = {
    type: 'SSRF',
    targetUrl: requestData.query.url || '',
    method: requestData.method,
    headers: {
      host: requestData.headers['host'],
      referer: requestData.headers['referer'] || 'none'
    }
  };

  return {
    ...requestData,
    attackType: 'SSRF',
    details: attackDetails
  };
}
