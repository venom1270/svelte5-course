<script lang="ts">
	import Button from "../Button.svelte";
    import logo from "$assets/logo.png";
	import { getUserState } from "../../state/user-state.svelte";


    let userContext = getUserState();

    let {user, userName} = $derived(userContext);

</script>

<header>
    <a href="/">
        <img class="logo" src={logo} alt="Go to home" />
    </a>
    <nav>
        {#if !user}
        <ul>
            <li>
                <Button isMenu={true} href="/register">Create account</Button>
            </li>
            <li>
                <Button isMenu={true} isSecondary={true} href="/login">Login</Button>
            </li>
        </ul>
        {:else}
        <ul>
            <li>
                {userName}
            </li>
            <li>
                <Button isMenu={true} onclick={() => userContext.logout()}>Logout</Button>
            </li>
        </ul>
        {/if}
    </nav>
</header>

<style>
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 4vw;
    }

    .logo {
        height: 100px;
    }

    ul {
        display: flex;
        column-gap: 24px;
        align-items: center;
    }
</style>