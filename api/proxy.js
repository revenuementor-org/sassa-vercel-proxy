export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let rawBody = '';

  try {
    // Manually read body stream
    for await (const chunk of req) {
      rawBody += chunk;
    }

    if (!rawBody) {
      return res.status(400).json({ error: 'Empty request body' });
    }

    const body = JSON.parse(rawBody);
    const { idnumber, mobile } = body;

    if (!idnumber || !mobile) {
      return res.status(400).json({ error: 'Missing ID number or mobile number' });
    }

    const sassaResponse = await fetch('https://srd.sassa.gov.za/srdweb/api/web/outcome/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idnumber, mobile }),
    });

    const result = await sassaResponse.json();
    return res.status(sassaResponse.status).json(result);
  } catch (error) {
    return res.status(500).json({
      error: 'Proxy server error',
      details: error.message,
    });
  }
}
