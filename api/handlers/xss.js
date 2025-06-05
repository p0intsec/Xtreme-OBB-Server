/**
 * Xtreme Serverless OOB - XSS Handler
 * Developed by p0intsec (06/2025)
 * MIT Licensed
 */

export async function handleXSS(requestData) {
  const attackDetails = {
    type: 'XSS',
    payload: requestData.query.payload || '',
    vulnerableParam: requestData.query.param || '',
    userAgent: requestData.headers['user-agent'],
    cookies: requestData.cookies,
    origin: requestData.headers['origin'] || 'unknown'
  };

  return {
    ...requestData,
    attackType: 'XSS',
    details: attackDetails
  };
}
