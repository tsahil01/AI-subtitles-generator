import React from 'react';
import { Upload, Cpu, Download, DollarSign } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Your Media',
    description: 'Upload your audio or video file in any common format.'
  },
  {
    icon: DollarSign,
    title: 'Pay via Solana',
    description: 'Pay for your transcription using Solana cryptocurrency.'
  },
  {
    icon: Cpu,
    title: 'AI Processing',
    description: 'Our AI analyzes and transcribes your content with high accuracy.'
  },
  {
    icon: Download,
    title: 'Get Results',
    description: 'Download your transcription in your preferred format.'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 my-16 bg-gray-50 dark:bg-gray-800 rounded-3xl">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <step.icon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-indigo-200"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}