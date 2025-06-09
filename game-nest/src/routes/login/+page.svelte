<script>
	import AuthForm from "$lib/components/AuthForm.svelte";

    let {form} = $props();

</script>
<AuthForm isRegistration={false} {form} />