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
                    {JSON.stringify(id)}
                </label>
            </div>
        {/each}
    {/if}
</div>

<label class="input-group">
    <span class="grow">Score: {$score}</span>
    <button class="btn" on:click={btn}>
        {answered ? "Next" : "Check"}
    </button>
</label>
