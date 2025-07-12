export default async function handler(req, res) {
  const { idnumber, mobile } = req.body || {};

  if (!idnumber || !mobile) {
    return res.status(400).json({ error: 'Missing ID number or mobile number' });
  }

  const targetURL = `https://srd.sassa.gov.za/srdweb/api/web/outcome/${idnumber}/${mobile}`;

  try {
    const response = await fetch(targetURL, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0', // mimicking browser
      },
    });

    if (!response.ok) {
      const error = await response.json();
      return res.status(response.status).json({ error: error.message || 'Failed to fetch SASSA data' });
    }

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: `Proxy error: ${err.message}` });
  }
}
