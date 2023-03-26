import type {PageServerLoad} from "./$types";
import {error} from "@sveltejs/kit";

export const load: PageServerLoad = async ({url}) => {
    let path = url.searchParams.get('url')
    if (!path) throw error(400, 'Missing URL parameter')
    let res = await fetch(path)
    if (!res.ok) throw error(400, 'Invalid URL')
    let raw = await res.text()
    let params = Array.from(url.searchParams.entries())
    return { raw, params }
}
