<script lang="ts">
    import type {Question} from "./types";
    import {normalize} from "./util";

    export let q: Question = null as any
    export let md
    export let pos
    export let score

    let answered = false

    let correct = []
    let incorrect = []

    let textAnswer = ""
    let objectAnswer = {}
    let arrayAnswer = []

    let strings = []
    let gap_possibilities = []
    if (q.type === "text-complete") {
        let re = /([^{]*)\{([^}]*)}/g
        for (let match of q.text.matchAll(re)) {
            strings.push(match[1])
            gap_possibilities.push(match[2])
        }
        strings.push(q.text.slice(q.text.lastIndexOf("}") + 1))
    }

    let btn = () => {
        if (answered) return $pos += 1
        if (q.type === "text") {
            let ok = normalize(textAnswer) === normalize(q.correct)
            correct = [ok]
            incorrect = [!ok]
            $score += ok ? 1 : 0
        } else if (q.type === "choice") {
            let ok = textAnswer === q.correct.toString()
            if (!ok) {
                correct[textAnswer] = true
                incorrect[q.correct] = true
            } else {
                correct[textAnswer] = true
            }
            $score += ok ? 1 : 0
        } else if (q.type === "multiple-choice") {
            for (let [id, _] of Object.entries(q.answers)) {
                let ok = (objectAnswer[id] || false) == q.correct[id];
                (ok ? correct : incorrect)[id] = true
            }
            $score += correct.every(x => x) ? 1 : 0
        } else if (q.type === "text-complete") {
            let ok = true
            for (let i in arrayAnswer) {
                if (normalize(arrayAnswer[i]) !== normalize(gap_possibilities[i])) {
                    ok = false
                    incorrect[i] = gap_possibilities[i]
                } else {
                    correct[i] = true
                }
            }
            $score += ok ? 1 : 0
        }
        correct = correct
        incorrect = incorrect
        answered = true
    }

</script>

<h2 class="text-2xl font-bold mt-4">{q.name}</h2>
{#if q.desc}<p>{@html md(q.desc)}</p>{/if}

<div class="my-4">
    {#if q.type === "text"}
        <div class="form-control">
            <input type="text" bind:value={textAnswer} placeholder="Answer" class="input input-bordered w-full"
                   class:input-error={incorrect[0]} class:input-success={correct[0]}/>
            {#if incorrect[0]}<label class="label">Correct answer: {q.correct}</label>{/if}
        </div>
    {/if}

    {#if q.type === "choice"}
        {#each Object.entries(q.answers) as [id, choice]}
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">{@html md(choice)}</span>
                    <input type="radio" name="radio-10" class="radio" value="{id}" bind:group={textAnswer}
                           class:radio-error={incorrect[id]} class:radio-success={correct[id]}/>
                </label>
            </div>
        {/each}
    {/if}

    {#if q.type === "multiple-choice"}
        {#each Object.entries(q.answers) as [id, choice]}
            <div class="form-control">
                <label class="label cursor-pointer">
                    <span class="label-text">{@html md(choice)}</span>
                    <input type="checkbox" class="checkbox" bind:checked={objectAnswer[id]}
                           class:checkbox-error={incorrect[id]} class:checkbox-success={correct[id]}/>
                </label>
            </div>
        {/each}
    {/if}

    {#if q.type === "text-complete"}
        {#each strings as str, i}
            {@html md(str).replace('<p>', '').replace('</p>', '')}
            {#if gap_possibilities[i]}
                <select bind:value={arrayAnswer[i]} class="select select-bordered select-sm w-24 inline-block"
                        class:select-error={incorrect[i]} class:select-success={correct[i]}>
                    <option value="" disabled selected>Choose...</option>
                    {#each gap_possibilities as choice}
                        <option value="{choice}">{choice}</option>
                    {/each}
                </select>&nbsp;
                {#if incorrect[i]}<span>(Correct: {incorrect[i]}) </span>{/if}
            {/if}
        {/each}
    {/if}
</div>

<label class="input-group">
    <span class="grow">Score: {$score}</span>
    <button class="btn" on:click={btn}>
        {answered ? "Next" : "Check"}
    </button>
</label>
