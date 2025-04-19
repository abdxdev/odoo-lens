"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

// Animation variants
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

// Component prop types
interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  buttonText: string;
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
      className="flex-1 p-6 space-y-8 2xl:mx-40"
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <FeatureCard
          title="Review Permissions"
          description="Analyze and manage access controls across your Odoo instance"
          icon="/file.svg"
          link="/review-permissions"
          buttonText="Get Started"
        />

        <FeatureCard
          title="Search Faculty"
          description="Find and review faculty profiles and their associated permissions"
          icon="/globe.svg"
          link="/search-faculty"
          buttonText="Explore"
        />

        <FeatureCard
          title="Explore Model"
          description="Examine and understand Odoo data models and their relationships"
          icon="/window.svg"
          link="/explore-model"
          buttonText="Discover"
        />
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mt-12"
      >
        <Card className="bg-transparent text-center border-0">
          <CardHeader>
            <CardTitle>About Odoo Lens</CardTitle>
            <CardDescription>
              Your powerful tool for Odoo ERP management and analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Odoo Lens provides comprehensive visibility into your Odoo ERP system's permission structure and faculty management. Our application helps administrators and managers gain insights, optimize access controls, and efficiently manage user roles.
            </p>
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <FeatureBox
                title="Permission Analysis"
                description="Visualize and understand complex permission structures with intuitive interfaces."
              />
              <FeatureBox
                title="Faculty Management"
                description="Easily search and manage faculty profiles and their associated access rights."
              />
              <FeatureBox
                title="Model Exploration"
                description="Explore and understand Odoo data models and their relationships for better system comprehension."
              />
            </motion.div>
          </CardContent>
        </Card>
      </motion.section>
    </motion.main>
  );
}

function FeatureCard({ title, description, icon, link, buttonText }: FeatureCardProps) {
  return (
    <motion.div variants={item}>
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
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link href={link}>{buttonText}</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function FeatureBox({ title, description }: FeatureBoxProps) {
  return (
    <motion.div variants={item}>
      <Card className="h-full transition-all duration-300 hover:shadow-md hover:translate-y-[-3px] hover:bg-primary/5">
        <CardHeader>
          <h3 className="font-medium">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
