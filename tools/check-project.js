import { readdir, readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { smokeTestStoryRendering } from './render-smoke.js';
import { validateStories } from './validate-stories.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

async function findFiles(directory, extension) {
    const entries = await readdir(directory, { withFileTypes: true });
    const files = [];
    for (const entry of entries) {
        const target = path.join(directory, entry.name);
        if (entry.isDirectory()) files.push(...await findFiles(target, extension));
        if (entry.isFile() && target.endsWith(extension)) files.push(target);
    }
    return files;
}

const errors = await validateStories();
errors.push(...smokeTestStoryRendering());
const javascriptFiles = [
    ...await findFiles(path.join(projectRoot, 'js'), '.js'),
    ...await findFiles(path.join(projectRoot, 'tools'), '.js')
];

for (const file of javascriptFiles) {
    const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (result.status !== 0) errors.push(`${path.relative(projectRoot, file)}: ${result.stderr.trim()}`);
}

const cssFiles = await findFiles(path.join(projectRoot, 'css'), '.css');
for (const file of cssFiles) {
    const css = await readFile(file, 'utf8');
    const openBraces = (css.match(/\{/g) || []).length;
    const closeBraces = (css.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
        errors.push(`${path.relative(projectRoot, file)}: unbalanced CSS braces (${openBraces}/${closeBraces})`);
    }
}

if (errors.length) {
    console.error(`Project check failed with ${errors.length} error(s):`);
    errors.forEach((error) => console.error(`- ${error}`));
    process.exitCode = 1;
} else {
    console.log(`Project check passed: ${javascriptFiles.length} JavaScript files, ${cssFiles.length} CSS files.`);
}
