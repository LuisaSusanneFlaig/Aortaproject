import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { storyVersions } from '../js/modules/storyContent.js';
import { collectStoryAssets, validateStory } from '../js/stories/validateStory.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export async function validateStories() {
    const errors = [];

    for (const [storyKey, story] of Object.entries(storyVersions)) {
        errors.push(...validateStory(story, storyKey));
        for (const asset of collectStoryAssets(story)) {
            try {
                await access(path.join(projectRoot, asset.value));
            } catch {
                errors.push(`${storyKey}.${asset.path}: missing asset "${asset.value}"`);
            }
        }
    }

    return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const errors = await validateStories();
    if (errors.length) {
        console.error(`Story validation failed with ${errors.length} error(s):`);
        errors.forEach((error) => console.error(`- ${error}`));
        process.exitCode = 1;
    } else {
        console.log(`Validated ${Object.keys(storyVersions).length} stories successfully.`);
    }
}
