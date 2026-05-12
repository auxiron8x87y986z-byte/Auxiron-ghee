import { dbFetch, prisma } from "@/lib/prisma";
import AboutSettingsForm from "./AboutSettingsForm";

export const dynamic = "force-dynamic";

export default async function AboutSettingsPage() {
  const keys = ["about_heading", "about_intro", "about_hero_image", "about_method_heading", "about_method_text", "about_farm_image", "about_promise_heading", "about_purity_image", "about_promise_items", "about_extra_sections"];
  
  const blocks = await dbFetch(
    () => prisma.$queryRaw`SELECT \`key\`, \`value\` FROM ContentBlock WHERE \`key\` IN (${keys.join(',')})` as Promise<Array<{ key: string; value: string }>>,
    []
  );

  const getVal = (key: string, def: string) => {
    const block = blocks.find(b => b.key === key);
    return block ? block.value : def;
  };

  const initialHeading = getVal("about_heading", "The Identity of Purity");
  const initialIntro = getVal("about_intro", "At Auxiron, we believe that true health comes from nature. Born in the vibrant lands of Rajasthan, we are on a mission to bring back the lost authenticity of Indian culinary traditions, starting with our golden elixir: Shuddh Deshi Bilona Ghee.");
  const initialHeroImage = getVal("about_hero_image", "");

  const initialMethodHeading = getVal("about_method_heading", "The Bilona Method");
  const initialMethod = getVal("about_method_text", "Unlike commercial ghee which is made directly from milk cream using machines, our ghee is crafted the ancient way. Fresh milk from indigenous cows is boiled over slow wood fire and naturally cooled.\n\nThe milk is then converted into curd in earthen pots. This curd is hand-churned (Bilona) using a wooden churner in a bi-directional motion to extract the purest butter (Makkhan). Finally, this butter is slowly heated to separate the pure, aromatic ghee.");
  const initialFarmImage = getVal("about_farm_image", "");

  const initialPromiseHeading = getVal("about_promise_heading", "Our Promise");
  const initialPurityImage = getVal("about_purity_image", "");
  
  const defaultPromises = JSON.stringify([
    '100% pure and organic, with no added preservatives or colors.',
    'Made strictly from A2 milk of grass-fed indigenous cows.',
    'Crafted in small batches to ensure premium quality.',
    'Delivered fresh locally in Jaipur & Jodhpur.'
  ]);
  const initialPromises = getVal("about_promise_items", defaultPromises);
  const initialExtraSections = getVal("about_extra_sections", "[]");

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-secondary-dark)' }}>About Us Page Settings</h1>
      <AboutSettingsForm 
        initialHeading={initialHeading}
        initialIntro={initialIntro}
        initialHeroImage={initialHeroImage}
        initialMethodHeading={initialMethodHeading}
        initialMethod={initialMethod}
        initialFarmImage={initialFarmImage}
        initialPromiseHeading={initialPromiseHeading}
        initialPurityImage={initialPurityImage}
        initialPromises={initialPromises}
        initialExtraSections={initialExtraSections}
      />
    </div>
  );
}
