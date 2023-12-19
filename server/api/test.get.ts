import { Helper, Location, LocationType, Parser, Renderer } from "translator";
import sizeOf from "image-size";

import fs from "fs";

class PreviewHelper extends Helper
{
    isEditor(): boolean { return true; }

    async hasAsset(location: Location): Promise<boolean>
    {
        return fs.existsSync('public' + location.target);
    }

    async getAssetSrc(location: Location): Promise<string>
    {
        return  location.target;
    }

    async getImageSize(location: Location): Promise<{ width: number; height: number; }>
    {
        const dimensions = sizeOf('public' + location.target);

        if (!dimensions.width || !dimensions.height)
            throw new Error('Undefined image size!');

        return { width: dimensions.width, height: dimensions.height };
    }

    i18n(phrase: string): string
    {
        // Include i18n phrases inside Translator!

        let phraseMap = {
            error: 'Error!',
            anchor: 'Link to this section',
            accentBlock:
            {
                important: { name: 'Important' },
                example:
                {
                    name: 'Example',
                    expand: 'Solution'
                },
                definition: { name: 'Definition' },
                theorem:
                {
                    name: 'Theorem',
                    expand: 'Proof'
                }
            },
            task:
            {
                hint:       'Hint',
                answer:     'Answer',
                note:       'Note',
                solution:   'Solution',
                similar:    'Similar tasks',
                similarNum: 'Similar task',
                generate:   'Generate similar task',
            }
        };

        let cursor = phraseMap;
        let phraseParts = phrase.split('.');
        let result = phrase;

        for (let i = 0; i < phraseParts.length; i++)
        {
            try
            {
                let value = cursor[phraseParts[i]];
                cursor = value;

                if (i === phraseParts.length - 1)
                    if (typeof value === 'string')
                        result = value;
            } catch { break; }
        }

        return result;
    }

    getMathMacros() { return {}; }

    async getUnique() { return []; }
}

export default defineEventHandler(async event =>
{
    const topic = fs.readFileSync('public/test/topic.md', { encoding: 'utf-8' });
    const translateResult = await translate(topic);

    return translateResult;
});

function getLocation()
{
    let location = new Location;
        location.type = LocationType.Article;
        location.path = 'preivew';

    return location;
}

async function translate(content: string)
{
    const location = getLocation();
    const helper = new PreviewHelper;

    const parser =      new Parser(location, helper);
    const renderer =    new Renderer(location, helper);

    renderer.onRenderError = (product, error) =>
    {
        console.error('Render error!');
        console.error(product);
        console.error(error);
    }

    const parseResult = await parser.parse(content);

    const result = {
        content: await renderer.renderBlocks(parseResult.blocks),
        uniques: {}
    };

    for (const unique of parseResult.uniques)
    {
        if (!unique.content)
            continue;

        result.uniques[unique.id] = await renderer.renderBlocks(unique.content);
    }

    return result;
}