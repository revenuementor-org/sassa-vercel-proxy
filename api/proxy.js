export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { idnumber, mobile } = req.body;

    // Validate inputs
    if (!idnumber || !mobile) {
      return res.status(400).json({ error: 'Missing ID number or mobile number' });
    }

    const sassaApiUrl = `https://srd.sassa.gov.za/srdweb/api/web/outcome/`;

    const response = await fetch(sassaApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idnumber, mobile }),
    });

    const data = await response.json();

    res.status(response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy server error', details: err.message });
  }
}
