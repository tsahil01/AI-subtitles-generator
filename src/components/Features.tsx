import { Subtitles, Wallet, Zap } from "lucide-react";

export function Features(){
    return <>
          <section
        id="features"
        className="py-16 bg-gray-50 dark:bg-gray-800 rounded-3xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold font-sans  text-center mb-12">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Subtitles className="h-10 w-10 text-indigo-600" />}
              title="Get SRT & VTT Files"
              description="Download subtitles in SRT and VTT formats for easy integration."
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-indigo-600" />}
              title="Lightning Fast"
              description="Get your subtitles in minutes, not hours. Save time and effort."
            />
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-indigo-600" />}
              title="Pay-per-Use Model"
              description="Only pay for what you use, with microtransactions powered by Solana."
            />
          </div>
        </div>
      </section>
    </>
}

function FeatureCard({
    icon,
    title,
    description,
  }: {
    icon: React.ReactNode;
    title: string;
    description: string;
  }) {
    return (
      <div className="flex flex-col items-center p-6 bg-white dark:bg-gray-700 shadow-lg rounded-3xl">
         <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
            {icon}
         </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          {description}
        </p>
      </div>
    );
  }