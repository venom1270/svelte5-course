<script>
    import authorPic from "$assets/profile_pic.png";
</script>

<section class="landing-page-section">
    <h2 class="mb-l">About the author</h2>
    <div class="author-container">
        <div class="author-text">
            <p class="mb-xs">Meet Jake, a laid-back digital nomad turned savvy entrepreneur who's just dropped his latest gem: The Effortless Hustle. This isn't your average ebook — it’s a cleverly crafted guide packed with unconventional wisdom, real-life hacks, and the kind of honest advice you wish someone had handed you years ago. Whether you're building a side hustle from your kitchen table or chasing a full-time freedom lifestyle, Jake’s got you covered.</p>
            <p>What makes this ebook so marvelous? It's brutally practical, refreshingly funny, and totally no-BS. Jake doesn't sugarcoat the grind — instead, he hands you the shortcuts, mindset shifts, and tools that actually work. People who've read it say it feels like getting mentored by that one cool friend who actually knows what they’re doing. And the best part? It’s instantly downloadable and surprisingly affordable.</p>
        </div>
        <img src={authorPic} alt="Author" />
    </div>
</section>

<style>
    .author-container {
        display: flex;
        justify-content: space-between;
    }

    .author-container img {
        width: 40%;
        border: 6px solid black;
        box-shadow: 0 4px 24px rgba(0,0,0,0.5);
    }

    .author-text {
        width: 55%;
    }

</style>