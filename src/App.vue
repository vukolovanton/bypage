<script setup lang="ts">
import Container from './components/Container.vue';

</script>

<template>
    <Container />
</template>

<style>
:root {
    font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

* {
    margin: 0;
}

@media (prefers-reduced-motion: no-preference) {
    html {
        interpolate-size: allow-keywords;
    }
}

body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
}

img,
picture,
video,
canvas,
svg {
    display: block;
    max-width: 100%;
}

input,
button,
textarea,
select {
    font: inherit;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
    overflow-wrap: break-word;
}

p {
    text-wrap: pretty;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    text-wrap: balance;
}

#root,
#__next {
    isolation: isolate;
}
</style>
