export default async function fetchText(URL: string) : Promise<string> {
    return await (await fetch(URL)).text();
}