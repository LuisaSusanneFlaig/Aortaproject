// Fetches a .glb as an ArrayBuffer.
//
// The models are stored with Git LFS. GitHub Pages does not resolve LFS, so
// on the published site a model URL returns the small pointer file
// ("version https://git-lfs..."). In that case the real file is fetched from
// GitHub's LFS media server, which allows cross-origin requests.
// LFS_BRANCH must be the branch GitHub Pages publishes.
const LFS_BRANCH = 'flow-storytelling';
const LFS_POINTER_PREFIX = 'version https://git-lfs';

function isLfsPointer(buffer) {
    if (buffer.byteLength > 512) return false;
    return new TextDecoder().decode(buffer).startsWith(LFS_POINTER_PREFIX);
}

// https://<owner>.github.io/<repo>/<path> ->
// https://media.githubusercontent.com/media/<owner>/<repo>/<branch>/<path>
function lfsMediaUrl(modelUrl) {
    const url = new URL(modelUrl, window.location.href);
    const owner = url.hostname.endsWith('.github.io') ? url.hostname.split('.')[0] : null;
    const [repo, ...path] = url.pathname.split('/').filter(Boolean);
    if (!owner || !repo || !path.length) return null;
    return `https://media.githubusercontent.com/media/${owner}/${repo}/${LFS_BRANCH}/${path.join('/')}`;
}

async function fetchBuffer(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
    return response.arrayBuffer();
}

export async function fetchModelBuffer(modelUrl) {
    const buffer = await fetchBuffer(modelUrl);
    if (!isLfsPointer(buffer)) return buffer;
    const mediaUrl = lfsMediaUrl(modelUrl);
    if (!mediaUrl) throw new Error(`${modelUrl} is a Git LFS pointer; run "git lfs pull"`);
    return fetchBuffer(mediaUrl);
}
