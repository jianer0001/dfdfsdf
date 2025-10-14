export async function onRequestPost(context) {
    return new Response(JSON.stringify({
        url :context.request.url,
    }, null, 2), {
        status: 200,
        headers: {'Content-Type': 'application/json'}
    });
}
