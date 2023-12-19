<script setup lang="ts">
    import "~/assets/importTranslator";
    import TaskGenWorker from "translator/content/worker_taskGen?worker";

    import { Command } from "~/src/index";

    useHead({
        title: 'OMath Предпростор',
        script: [{ src: '/preview/theme.js' }]
    });

    const config = useRuntimeConfig();

    //
    // Test
    //

    let testData;

    if (config.public.env !== 'production')
        testData = await $fetch('/api/test');

    //
    // Receiving commands
    //

    let uniques = {};
    const mainContent = ref<HTMLElement | null>(null) as Ref<HTMLElement>;
    let currentPreviewLink;

    onMounted(() =>
    {
        globalThis.TaskGenWorker = new TaskGenWorker;

        window.addEventListener('message', e =>
        {
            switch (e.data.command)
            {
                case Command.SwitchTheme:
                    switchTheme();
                    break;
                case Command.SetContent:
                    mainContent.value.innerHTML = e.data.content;
                    uniques = e.data.uniques;
                    globalThis.OMath_initProducts(mainContent.value);
                    break;
            }
        });

        if (testData)
            window.postMessage({ command: Command.SetContent, content: testData.content, uniques: testData.uniques });

        globalThis.OMathEvent = globalThis.OMathEvent || {};

        globalThis.OMathEvent.onLinkClick = (link: HTMLElement, e) =>
        {
            e.preventDefault();

            if (link.isEqualNode(currentPreviewLink))
            {
                clearPreview();
                return;
            }

            let strLocation = link.getAttribute('data-preview');
            if (!strLocation)
                return;

            setPreview(strLocation, uniques[strLocation]);
            currentPreviewLink = link;
        };

        document.body.setAttribute('preview-ready', '');
        window.parent.postMessage('preview-ready');
    });

    function _switchTheme() { globalThis.switchTheme(); }

    //
    // Preview
    //

    const previewShowing = ref(false);
    const preview = ref<{ location: string, data: string } | null>(null);

    function setPreview(location: string, data: string)
    {
        if (!data)
            data = 'Не найден контент уникального элемента!';

        preview.value = { location, data };
        globalThis.OMath_initProducts(document.getElementById('preview')?.querySelector('[data-content]'));
        previewShowing.value = true;
    }

    function clearPreview()
    {
        previewShowing.value = false;
        currentPreviewLink = null;
    }
</script>

<template>
    <div class="bg-slate-300 dark:bg-slate-900">
        <article class="max-w-[var(--contentWidth)] h-full m-0 mx-auto shadow-xl min-h-screen bg-slate-100 dark:bg-[#2d2d2d]">
            <button v-if="testData" @click="_switchTheme">Переключить тему</button>
            <div data-content ref="mainContent"></div>

            <div id="preview" :class="{ showing: !!previewShowing }">
                <div class="max-h-[50vh] overflow-auto">
                    <div data-content v-html="preview?.data"></div>
                </div>
                <footer>
                    <div>{{ preview?.location }}</div>
                    <button title="Закрыть" @click="clearPreview">×</button>
                </footer>
            </div>
        </article>
    </div>
</template>

<style lang="scss">
    @use '~/assets/style/fonts';

    :root
    {
        --contentWidth: 860px;
    }

    body
    {
        font-family: "Open Sans";
    }

    #preview
    {
        @apply fixed z-10 bottom-0 border-t bg-slate-200 dark:bg-[#262626] border-slate-300 dark:border-[#404040];
        @apply transition-[opacity] duration-200;

        width: min(100%, var(--contentWidth));
        box-shadow: 0px -10px 10px -5px rgba(0,0,0,0.07);

        &:not(.showing)
        {
            opacity: 0;
            pointer-events: none;
            touch-action: none;
        }

        > div
        {
            &::-webkit-scrollbar
            {
                width: 7px;
            }

            &::-webkit-scrollbar-thumb
            {
                @apply bg-slate-300 dark:bg-[#404040];
            }
        }

        > footer
        {
            @apply flex justify-between;
            @apply border-t border-slate-300 dark:border-[#404040];
            box-shadow: 0px -10px 10px -5px rgba(0,0,0,0.05);

            > div
            {
                @apply self-center px-5 font-semibold text-lg text-gray-500 dark:text-gray-400;
            }

            > button
            {
                @apply font-mono px-5 pt-2 pb-3 font-bold text-4xl text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300;
                @apply transition-[color] duration-200;
            }
        }
    }
</style>