import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { themesApi } from '@/api/themes';
import { githubApi } from '@/api/github';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { Github, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Repo } from '@/types/api';
import Head from 'next/head';
import { useQueryError } from '@/hooks/useQueryError';
import useGithub from '@/hooks/useGithub';
import { useAuth } from '@/hooks/useAuth';
import { getVisiblePages } from '../../utils';
import Meta from '@/compos/components/Meta';

const MAX_NAME = 80;
const MAX_DESCRIPTION = 500;

const CreateSitePage = () => {

    useQueryError();
    const { user } = useAuth();

    return (
        <>
            <Meta />
            <DashboardLayout>
                <div className="max-w-4xl mx-auto space-y-8">

                </div>
            </DashboardLayout>
        </>
    );
};

export default CreateSitePage;