"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Shield, Database, FileQuestion } from "lucide-react";
import { ShowcaseSection } from "@/components/home/showcase-section";
import { Tract } from "@/components/ui/tract";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.section
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-8"
      >
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to <span className="text-primary">Odoo Lens</span>
        </h1>
        <p className="text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
          Analyze, manage, and optimize Odoo permissions and faculty profiles with powerful insights
        </p>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-6"
      >
        <FeatureCard
          title="Search Faculty"
          description="Find and review faculty profiles and their associated permissions"
          icon={<Search />}
          link="/search-faculty"
          buttonText="Get Started"
        />

        <FeatureCard
          title="Review Permissions"
          description="Analyze and manage access controls across your Odoo instance"
          icon={<Shield />}
          link="/review-permissions"
          buttonText="Explore"
        />

        <FeatureCard
          title="Explore Model"
          description="Examine and understand Odoo data models and their relationships"
          icon={<Database />}
          link="/explore-model"
          buttonText="Discover"
        />

        <FeatureCard
          title="Data Query"
          description="Run customized queries to extract specific data from your Odoo instance"
          icon={<FileQuestion />}
          link="/data-query"
          buttonText="Query Data"
        />
      </motion.section>

      {/* Showcase Section */}
      <ShowcaseSection
        title="Smart Data Insights"
        subtitle="Powered by AI and advanced visualization"
      />

      {/* Image Grid Section */}
      {/* <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-12 mb-12"
        >
        <Tract
          images={[
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-3.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-1-row-4.png", alt: "UI Block" }
            ],
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-3.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-4.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-5.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-2-row-6.png", alt: "UI Block" }
            ],
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-3.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-4.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-5.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-6.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-3-row-7.png", alt: "UI Block" }
            ],
            [
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-1.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-2.png", alt: "UI Block" },
              { src: "https://tailwindcss.com/plus-assets/img/heroes/ui-blocks-col-4-row-3.png", alt: "UI Block" }
            ]
          ]}
          columnWidth={1200}
          className="relative h-[700px] aspect-video"
        />
      </motion.section> */}

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-12"
      >
        <div className="text-center">
          <div>
            <p className="text-muted-foreground max-w-2xl mx-auto my-30">
              Odoo Lens provides comprehensive visibility into your Odoo ERP system&apos;s permission structure and faculty management. Our application helps administrators and managers gain insights, optimize access controls, and efficiently manage user roles.
            </p>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
}

function FeatureCard({ title, description, icon, link, buttonText, className }: { title: string; description: string; icon: React.ReactNode; link: string; buttonText: string; className?: string; }) {
  return (
    <motion.div variants={item} className={className}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              {icon}
            </div>
          </div>
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center h-full items-end">
          <Button asChild>
            <Link href={link}>{buttonText}</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
