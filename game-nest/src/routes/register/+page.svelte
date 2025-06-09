<script>
	import AuthForm from "$lib/components/AuthForm.svelte";

    let {form} = $props();
    $inspect(form);

</script>
<AuthForm isRegistration={true} {form} />