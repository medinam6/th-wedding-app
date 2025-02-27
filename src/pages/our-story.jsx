import Image from 'next/image';

const OurStory = () => <div class="max-w-3xl mx-auto">
  <h1 class="font-bodo text-4xl font-bold text-center mb-6 p-6">Our Story, as told by the groom</h1>
  <div class="bg-white p-6">
  <Image src="/smiles.jpeg" alt="A meaningful description" width={500} height={300} />
  <p class="font-bodo text-md mb-4 text-black pt-5">
        On a scorching August day in 2015, fate led us to a table at Public 702. She arrived early, waiting in the cool air, while I rushed in, slightly out of breath, apologizing for being late when I wasn’t. She was tall, beautiful, and had the kindest smile. I was instantly drawn to her. What I didn’t know then was that this woman—who made me nervous in the best way—would become my everything. From that first night, conversation flowed effortlessly, hours slipping away as if time itself had paused just for us. She was captivated by my words, and I was lost in her presence.
    </p>
    <Image src="/back.jpeg" alt="A meaningful description" width={500} height={300} />
    <p class="font-bodo text-md mb-4 text-black pt-5">
        Through the years, we built a life woven with music, laughter, and quiet moments of understanding. She embraced my world—concerts with bands she’d never heard of, watching me play drums with admiration in her eyes—and I found myself wanting to experience everything through her lens. My family saw how she lit up my life, and hers welcomed me with open arms. When I proposed in Portland last April, every detail carried meaning, a reflection of the depth of what we share. She was overwhelmed, speechless for a moment—but in her eyes, I saw everything I needed to know.
    </p>
    <Image src="/front.jpeg" alt="A meaningful description" width={500} height={300} />
    <p class="font-bodo text-md text-black pt-5 pb-5">
        I never imagined marriage for myself, but then I met her. She is my greatest adventure, my unwavering support, my home. Together, we dream of traveling the world, growing old side by side, and pushing each other to become the best versions of ourselves. We are like oil and water in so many ways, but love has made us inseparable. She is my heart, my happiness, my forever.
    </p>
    <Image src="/window.jpeg" alt="A meaningful description" width={500} height={300} />

  </div>
</div>


export default OurStory