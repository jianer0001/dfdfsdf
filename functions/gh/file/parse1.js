export async function onRequestPost(context) {
    context.request.url = 'https://guanhen.821330378.workers.dev'
    return context.env.JIAN.fetch(context.request, {method: 'GET'});
}
