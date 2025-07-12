export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = '';

  try {
    // Read the raw body
    for await (const chunk of req) {
      body += chunk;
    }

    if (!body) {
      return res.status(400).json({ error: 'Empty request body' });
    }

    const data = JSON.parse(body);
    const { idnumber, mobile } = data;

    if (!idnumber || !mobile) {
      return res.status(400).json({ error: 'Missing ID number or mobile number' });
    }

    const apiUrl = `https://srd.sassa.gov.za/srdweb/api/web/outcome/${idnumber}/${mobile}`;

    const fetchResponse = await fetch(apiUrl);
    const result = await fetchResponse.json();

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Proxy server error', details: error.message });
  }
}
