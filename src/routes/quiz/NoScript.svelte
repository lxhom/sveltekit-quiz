<script>
    import {onMount} from "svelte";

    let el;
    onMount(() => {
        if (el) {
            el.style.animation = '';
            el.style.display = 'none';
        }
    })
</script>

<div class="noscript" bind:this={el}>The quiz requires JavaScript! Disable extensions such as NoScript
    or upgrade your browser to use this app</div>

<style>
    @keyframes noscript {
        0%, 99% {
            opacity: 0;
        }
        100% {
            opacity: 100%;
        }
    }
    .noscript {
        animation: noscript 3s;
        animation-fill-mode: forwards;
        animation-iteration-count: 1;
    }
</style>
