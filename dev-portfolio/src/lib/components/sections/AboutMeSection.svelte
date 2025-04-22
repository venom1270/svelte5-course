<script lang="ts">
    import SectionHeadline from "../SectionHeadline.svelte";
    import image from "$assets/about-me.png"
	import Button from "../Button.svelte";
	import { goto } from "$app/navigation";
	import ExperienceTable from "../ExperienceTable.svelte";

    interface AboutMeProps {
        workExperience: SanityWorkExperience[];
    }

    let { workExperience }: AboutMeProps = $props();

    function onclick() {
        goto("/#contact-form");
    }
</script>

<section class="about-me mt-l">
    <SectionHeadline sectionName={"about-me"}>About Me</SectionHeadline>

    <div class="mt-m content-container default-margin">
        <img class="image" src={image} alt="" />
        <div class="text">
            <p>I’m a passionate and adaptable developer with a strong foundation in multiple technologies, always eager to learn and evolve with the industry. Whether it’s frontend, backend, or full-stack work, I enjoy solving real-world problems with clean, scalable code and thoughtful design.</p>

            <p>My experience spans across Java, C#, C++, Svelte, Angular, PHP, databases, Azure, and AI—giving me the flexibility to take on diverse challenges across the stack. I’m just as comfortable building interactive UIs as I am working with complex backend systems, cloud infrastructure, or intelligent applications. This breadth allows me to contribute meaningfully in dynamic, cross-functional environments.</p>

            <p>What drives me most is the opportunity to build useful, intuitive experiences that make people’s lives easier. I thrive in collaborative settings, but I’m also confident taking initiative and leading when needed. No matter the stack or challenge, I bring curiosity, clarity, and a strong commitment to quality in every line of code.</p>
            <Button className="mt-m" {onclick}>Tell me about your project</Button>
        </div>
    </div>

    <ExperienceTable {workExperience} />

</section>

<style>
    .content-container {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
    }

    .image {
        width: 42%;
        border-radius: 20px;
        object-fit: cover;
    }

    .text {
        width: 55%;
        text-align: left;
    }
</style>