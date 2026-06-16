interface Env {
  MAILERLITE_TOKEN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;

    const body = await request.json() as { name?: string; email?: string };
    const { name, email } = body;

    // Basic validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return new Response(
        JSON.stringify({ success: false, error: 'Valid email required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Forward to MailerLite with the secret token
    const mailerliteResponse = await fetch(
      'https://connect.mailerlite.com/api/subscribers',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.MAILERLITE_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email,
          fields: name ? { name } : undefined,
        }),
      }
    );

    if (!mailerliteResponse.ok) {
      const errorText = await mailerliteResponse.text();
      console.error('MailerLite error:', mailerliteResponse.status, errorText);
      return new Response(
        JSON.stringify({ success: false, error: 'Subscription failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Subscribe handler error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
