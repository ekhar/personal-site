---
title: Doom-style Graphics
description: My first foray into computer graphics
date: '2024-09-05'
categories:
  - graphics
  - webassembly
  - go
published: true
---

<script>
  import MapEditor from './doom/map-editor.svelte';
  import Step2 from './raycasting-tutorial/DDA.svelte';
  import Step3 from './raycasting-tutorial/SingleRaycast.svelte';
  import Step4 from './raycasting-tutorial/FullFOV.svelte';
</script>
<style>
  h2 {
    font-size: 1.25em; /* Makes subtitles larger */
  }
  .center {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
<MapEditor />
