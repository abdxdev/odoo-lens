import React from "react";
import { motion } from "framer-motion";
import { Activity, AppWindow, Plus, BarChart4, Database, Globe, Network, PieChart, Shield, Sparkles, TrendingUp, Users, Workflow } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ShowcaseCard } from "@/components/home/showcase-card";

interface ShowcaseSectionProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

export function ShowcaseSection({
  title = "Smart Data Insights",
  subtitle = "Powered by AI and advanced visualization",
  className = ""
}: ShowcaseSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`mt-16 relative ${className}`}
    >
      <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl p-8 overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Data Visualization Card */}
          <ShowcaseCard
            title="Advanced Charts"
            icon={<AppWindow className="h-5 w-5" />}
            delay={0.1}
          >
            <div className="h-52 bg-card rounded-md shadow-sm flex items-center justify-center overflow-hidden">
              <div className="w-full h-full p-4 flex items-end justify-center">
                <div className="flex items-end space-x-1 h-36 w-full">
                  {[65, 40, 85, 35, 60, 75, 50, 90, 30, 70].map((height, i) => (
                    <div
                      key={i}
                      className={`rounded-t w-full ${i % 2 === 0 ? 'bg-primary/75' : 'bg-primary/40'}`}
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </ShowcaseCard>

          {/* AI Analytics Card */}
          <ShowcaseCard
            title="AI-Powered Insights"
            icon={<Globe className="h-5 w-5" />}
            delay={0.2}
          >
            <div className="h-52 bg-card rounded-md shadow-sm overflow-hidden">
              <div className="p-4 space-y-2 w-full h-full flex flex-col">
                <div className="flex-1 bg-muted rounded p-3 flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <div className="h-4 w-3/4 bg-primary/20 rounded"></div>
                  </div>
                  <div className="h-3 w-full bg-primary/10 rounded"></div>
                  <div className="h-3 w-5/6 bg-primary/10 rounded"></div>
                  <div className="h-3 w-4/5 bg-primary/10 rounded"></div>
                </div>
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="bg-muted/70 rounded flex items-center justify-center">
                    <PieChart className="h-8 w-8 text-primary/50" />
                  </div>
                  <div className="bg-muted/70 rounded flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-green-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </ShowcaseCard>

          {/* Integration Card */}
          <ShowcaseCard
            title="Odoo Integrations"
            icon={<Plus className="h-5 w-5" />}
            delay={0.3}
          >
            <div className="h-52 bg-card rounded-md shadow-sm overflow-hidden">
              <div className="p-4 w-full h-full flex flex-col">
                <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-3">
                  {[
                    { icon: <Database className="h-6 w-6" />, label: "Models" },
                    { icon: <Users className="h-6 w-6" />, label: "Users" },
                    { icon: <Shield className="h-6 w-6" />, label: "Access" },
                    { icon: <Workflow className="h-6 w-6" />, label: "Flow" }
                  ].map((item, i) => (
                    <div key={i} className="bg-muted/60 rounded-lg p-2 flex flex-col items-center justify-center space-y-1">
                      <div className="text-primary/60">
                        {item.icon}
                      </div>
                      <div className="text-xs font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="h-8 mt-3 bg-muted rounded flex items-center justify-center">
                  <div className="flex items-center space-x-2">
                    <Network className="h-4 w-4 text-primary/70" />
                    <div className="h-3 w-24 bg-primary/20 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </ShowcaseCard>
        </div>

        {/* Interactive Demo Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 bg-card/50 backdrop-blur-sm rounded-lg overflow-hidden border border-border/50 shadow-md"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Real-time Analytics Dashboard</h3>
              </div>
              <Badge variant="outline" className="bg-primary/10">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  Live
                </span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-muted/50 rounded-md h-48 p-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-32 bg-primary/20 rounded"></div>
                  <div className="flex space-x-2">
                    <div className="h-6 w-6 bg-muted rounded-md"></div>
                    <div className="h-6 w-6 bg-muted rounded-md"></div>
                  </div>
                </div>
                <div className="h-32 w-full flex items-end space-x-1">
                  {[20, 40, 35, 60, 45, 75, 50, 65, 80, 70, 90, 60].map((height, i) => (
                    <div key={i} className="relative group flex-1">
                      <div
                        className="absolute -top-5 left-1/2 transform -translate-x-1/2 h-4 w-8 bg-primary/90 rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center text-white"
                        style={{ display: i === 6 ? 'flex' : 'none' }}
                      >
                        {height}%
                      </div>
                      <div
                        className="bg-gradient-to-t from-primary/80 to-primary/40 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-muted/50 rounded-md h-22 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <div className="h-3 w-24 bg-primary/20 rounded"></div>
                  </div>
                  <div className="h-12 w-full bg-gradient-to-r from-yellow-100/30 to-yellow-300/30 rounded flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-yellow-500/50" />
                  </div>
                </div>
                <div className="bg-muted/50 rounded-md h-22 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart4 className="h-4 w-4 text-blue-500" />
                    <div className="h-3 w-20 bg-primary/20 rounded"></div>
                  </div>
                  <div className="h-12 w-full bg-gradient-to-r from-blue-100/30 to-blue-300/30 rounded flex items-center justify-center">
                    <BarChart4 className="h-6 w-6 text-blue-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      </div>
    </motion.section>
  );
}
