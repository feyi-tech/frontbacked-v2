import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Palette, Github, Activity, Plus, ArrowRight, Loader2 } from 'lucide-react';
import Head from 'next/head';
import { sitesApi } from '@/api/sites';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const DashboardIndex = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: "Total Sites", value: "0", icon: Globe, color: "text-blue-500", href: "/sites" },
    { title: "Active Themes", value: "0", icon: Palette, color: "text-purple-500", href: "/themes" },
    { title: "GitHub Repos", value: "0", icon: Github, color: "text-gray-500", href: "/github" },
    { title: "Monthly Deployments", value: "0", icon: Activity, color: "text-green-500", href: "#" },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const sitesData = await sitesApi.list();
            setStats(prev => [
                { ...prev[0], value: sitesData.totalCount.toString() },
                { ...prev[1], value: user?.totalThemes.toString() || "0" },
                { ...prev[2], value: user?.totalRepos.toString() || "0" },
                { ...prev[3], value: "0" },
            ]);
        } catch (error) {
            // keep default 0s
        } finally {
            setLoading(false);
        }
    };
    fetchStats();
  }, [user]);

  return (
    <DashboardLayout>
      <Head>
        <title>Dashboard | FrontBacked</title>
      </Head>

      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Overview</h1>
            <p className="text-muted-foreground">Everything looks good today.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {!user?.emailVerified && (
              <div className="text-xs text-amber-500 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full">
                Email not verified
              </div>
            )}
            <div className="text-sm text-muted-foreground bg-card border border-border px-3 py-1 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              API Connected
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Link key={i} href={stat.href}>
                <Card className="bg-card border-border shadow-elegant hover:shadow-glow transition-all duration-300 group">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                        <div className={cn("p-2 rounded-lg bg-surface group-hover:bg-background transition-colors", stat.color)}>
                            <stat.icon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{loading ? "..." : stat.value}</div>
                        <div className="mt-2 flex items-center text-xs text-green-500 font-medium">
                            <Activity className="h-3 w-3 mr-1" />
                            Active now
                        </div>
                    </CardContent>
                </Card>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-card border-border shadow-elegant">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                            <div className="bg-surface p-4 rounded-full">
                                <Activity className="h-8 w-8 text-muted-foreground/40" />
                            </div>
                            <p className="text-muted-foreground text-sm max-w-[200px]">No recent activity to show yet.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                <Card className="bg-primary text-primary-foreground border-none shadow-glow">
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Start</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-primary-foreground/80">
                            Launch your first website in minutes using our professional themes.
                        </p>
                        <Button className="w-full bg-white text-primary hover:bg-white/90" asChild>
                            <Link href="/themes">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Site
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardIndex;
