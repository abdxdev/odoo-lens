"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  buttonText: string;
  className?: string;
}

interface FeatureBoxProps {
  title: string;
  description: string;
}

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
          icon="/globe.svg"
          link="/search-faculty"
          buttonText="Get Started"
        />

        <FeatureCard
          title="Review Permissions"
          description="Analyze and manage access controls across your Odoo instance"
          icon="/file.svg"
          link="/review-permissions"
          buttonText="Explore"
        />

        <FeatureCard
          title="Explore Model"
          description="Examine and understand Odoo data models and their relationships"
          icon="/window.svg"
          link="/explore-model"
          buttonText="Discover"
        />

        <FeatureCard
          title="Data Query"
          description="Run customized queries to extract specific data from your Odoo instance"
          icon="/file.svg"
          link="/data-query"
          buttonText="Query Data"
          className="md:col-span-2 lg:col-span-1"
        />
      </motion.section>

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

function FeatureCard({ title, description, icon, link, buttonText, className }: FeatureCardProps) {
  return (
    <motion.div variants={item} className={className}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Image
                src={icon}
                alt={`${title} Icon`}
                width={32}
                height={32}
              />
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
