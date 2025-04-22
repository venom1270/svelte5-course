<script>
	import AboutMeSection from "$lib/components/sections/AboutMeSection.svelte";
	import ContactSection from "$lib/components/sections/ContactSection.svelte";
	import HeroSection from "$lib/components/sections/HeroSection.svelte";
	import MyWorkSection from "$lib/components/sections/MyWorkSection.svelte";
	import SkillsSection from "$lib/components/sections/SkillsSection.svelte";

	const {data} = $props();

	let { workExperience, projects, skills } = data;

</script>

<HeroSection/>
<AboutMeSection {workExperience} />
<MyWorkSection {projects} />
<SkillsSection {skills} />
<ContactSection />