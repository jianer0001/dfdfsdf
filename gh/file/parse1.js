export async function onRequestPost(context) {
    return await context.env.JIAN.fetch(context.request);
}
