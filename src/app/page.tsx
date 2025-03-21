import { ContentRepurposingTool } from "@/components/ContentRepurposingTool";
import { Settings } from "@/components/Settings";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] relative">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Image
            src="/datasaur_logo.svg"
            alt="Datasaur Logo"
            className="h-11"
            width={160}
            height={48}
          />
        </div>
        <Settings />
      </div>
      <main className="flex flex-col items-center gap-[32px] w-full max-w-4xl mx-auto mt-16">
        <h1 className="text-2xl font-bold">Content Repurposing Tool</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl">
          Transform your content across multiple social media platforms with
          ease. Simply select your target platform (Twitter, LinkedIn, Facebook,
          Blog), then provide URLs to the content you want to repurpose, and
          optionally include example posts to match your brand&apos;s style and
          tone.
        </p>
        <ContentRepurposingTool />
      </main>
    </div>
  );
}
