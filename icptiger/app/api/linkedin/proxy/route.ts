import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Only allow LinkedIn login URL for security
    if (url !== 'https://www.linkedin.com/login') {
      return NextResponse.json({ error: 'Only LinkedIn login URL is allowed' }, { status: 403 });
    }

    console.log('🔗 Proxying request to:', url);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    
    // Remove X-Frame-Options and other frame-blocking headers
    const modifiedHtml = html
      .replace(/<head>/i, `<head>
        <script>
          // Remove any frame-blocking scripts
          if (window.top !== window.self) {
            // We're in an iframe, allow it
            console.log('LinkedIn loaded in iframe');
          }
        </script>
      `)
      .replace(/X-Frame-Options[^;]*;?/gi, '')
      .replace(/Content-Security-Policy[^;]*;?/gi, '');

    return new NextResponse(modifiedHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('❌ Proxy error:', error);
    return NextResponse.json({ error: 'Failed to proxy request' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Only allow LinkedIn login URL for security
    if (url !== 'https://www.linkedin.com/login') {
      return NextResponse.json({ error: 'Only LinkedIn login URL is allowed' }, { status: 403 });
    }

    console.log('🔗 Proxying POST request to:', url);

    const body = await request.text();
    const headers = new Headers(request.headers);
    
    // Remove problematic headers
    headers.delete('host');
    headers.delete('origin');
    headers.delete('referer');

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseText = await response.text();
    
    // Remove X-Frame-Options and other frame-blocking headers
    const modifiedResponse = responseText
      .replace(/<head>/i, `<head>
        <script>
          // Remove any frame-blocking scripts
          if (window.top !== window.self) {
            // We're in an iframe, allow it
            console.log('LinkedIn loaded in iframe');
          }
        </script>
      `)
      .replace(/X-Frame-Options[^;]*;?/gi, '')
      .replace(/Content-Security-Policy[^;]*;?/gi, '');

    return new NextResponse(modifiedResponse, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('❌ Proxy POST error:', error);
    return NextResponse.json({ error: 'Failed to proxy POST request' }, { status: 500 });
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 