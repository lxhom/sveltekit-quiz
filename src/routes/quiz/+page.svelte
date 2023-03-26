<script lang="ts">
    import type {PageData} from "./$types";
    import {parse} from "yaml";
    import {error} from "@sveltejs/kit";
    import type {Quiz} from "./types";
    import hljs from "highlight.js";
    import md_it from "markdown-it";
    import Question from "./Question.svelte";
    import NoScript from "./NoScript.svelte";
    import {writable} from "svelte/store";

    export let data: PageData = null as any;

    let quiz: Quiz; try {
         quiz = parse(data.raw) as Quiz
    } catch (e) {
        throw error(400, `Failed to parse YAML: ${e.message}`)
    }

    let md_instance = md_it({
        highlight: function (str, lang) {
            if (lang && (hljs["getLanguage"])(lang)) {
                try {
                    return hljs.highlight(str, {language: lang}).value;
                } catch (__) {
                }
            }

            return ''; // use external default escaping
        }
    });
    let md = (s: any) => md_instance.render(s.toString());
    let pos = writable(0);
    let score = writable(0);
</script>

<div class="flex flex-col items-center">
    <div class="max-w-md">
        <h1 class="text-2xl font-bold my-2">{quiz.name}</h1>
        {#if quiz.desc}<p>{@html md(quiz.desc)}</p>{/if}
        {#if $pos < quiz.questions.length}
            {#key $pos}
                <Question q={quiz.questions[$pos]} {pos} {score} {md}/>
            {/key}
        {:else}
            <div class="text-3xl font-bold">Done! Your score: {$score}</div>
        {/if}
    </div>
</div>
<NoScript/>
