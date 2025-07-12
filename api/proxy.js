export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Manually parse JSON body
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const rawBody = Buffer.concat(buffers).toString();
    const { idnumber, mobile } = JSON.parse(rawBody);

    if (!idnumber || !mobile) {
      return res.status(400).json({ error: 'Missing ID number or mobile number' });
    }

    const response = await fetch('https://srd.sassa.gov.za/srdweb/api/web/outcome/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idnumber, mobile }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({
      error: 'Proxy server error',
      details: error.message,
    });
  }
}
