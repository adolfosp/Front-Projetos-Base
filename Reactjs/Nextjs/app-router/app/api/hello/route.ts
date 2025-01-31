export async function GET() {
    return new Response(JSON.stringify({ message: 'Olá do App API!' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }