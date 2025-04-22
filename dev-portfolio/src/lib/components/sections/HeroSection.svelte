<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "../Button.svelte";

    function onclick() {
        goto("/#contact-form");
    }

</script>
<section class="hero-section default-margin">
    <h3>Hello! I'm Žiga</h3>
    <div class="underscore mb-m"></div>
    <h1>I'm a Software developer creating all sorts of</h1>
    <h1 class="dark-grey mb-m">software!</h1>
    <Button {onclick}>Let's talk!</Button>
</section>

<style>
    .hero-section {
        padding-top: 60px;
}
</style>