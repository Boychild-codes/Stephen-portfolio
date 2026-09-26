// Vercel Serverless Function — handles POST /api/contact
// Keeps the Resend API key on the server; the browser never sees it.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  // Very basic email format check
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Until you verify your own domain in Resend, you must send FROM
        // this onboarding address — see the setup notes below.
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['stephenjiru@gmail.com'],
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.json().catch(() => null);
      console.error('Resend error:', errBody);
      return res.status(502).json({ error: 'Failed to send message. Please try again later.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
}

// Minimal HTML-escaping so a message can't inject markup into the email
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}