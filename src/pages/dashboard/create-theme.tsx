import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Github, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useBackend } from "@/compos/lib/BackendProvider";
import { useGithub } from "@/compos/hooks/useGithub";


const CreateTheme = () => {
  const [activeTab, setActiveTab] = useState<"github" | "upload">("github");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const { user, isAuthenticating } = useBackend();
  const { 
    connect, isLoading, selectRepo, githubConnected, repos, 
    nextPage, prevPage, page
  } = useGithub(user);

  const handleTabSwitch = (tab: "github" | "upload") => {
    setActiveTab(tab);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    setSelectedFiles(files);
  };

  const handleDragDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Create a New Theme
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your theme files or connect your GitHub repository to share
              your creation with the community
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card rounded-2xl shadow-elegant p-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-border mb-8">
              <button
                onClick={() => handleTabSwitch("upload")}
                className={`py-3 px-6 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === "upload"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Upload className="inline-block mr-2 h-4 w-4" />
                Upload Folder
              </button>
              <button
                onClick={() => handleTabSwitch("github")}
                className={`py-3 px-6 font-medium transition-colors duration-200 border-b-2 ${
                  activeTab === "github"
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Github className="inline-block mr-2 h-4 w-4" />
                Connect GitHub
              </button>
            </div>

            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div className="space-y-8">
                <div
                  className="p-12 border-2 border-dashed border-border rounded-xl text-center cursor-pointer hover:border-primary/50 transition-colors duration-200 bg-surface"
                  onDrop={handleDragDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Drag & drop a folder here
                  </p>
                  <p className="text-muted-foreground">or click to browse</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  {...({ webkitdirectory: "" } as any)}
                  multiple
                  className="hidden"
                  onChange={handleFileUpload}
                />

                {selectedFiles.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Selected Files:
                    </h3>
                    <div className="bg-surface rounded-lg p-4 max-h-60 overflow-y-auto">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="text-sm text-muted-foreground py-1"
                        >
                          {(file as any).webkitRelativePath || file.name}
                        </div>
                      ))}
                    </div>

                    {uploadProgress > 0 && (
                      <div className="space-y-2">
                        <div className="w-full bg-surface rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* GitHub Tab */}
            {activeTab === "github" && (
              <div className="space-y-8">
                {!githubConnected ? (
                  <div className="text-center py-12">
                    <Github className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Connect your GitHub account
                    </h3>
                    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                      Import a theme directly from your GitHub repository to
                      share with the community.
                    </p>
                    {
                      isAuthenticating? (
                        <div className="mb-4">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="mt-2 text-muted-foreground">
                            Authenticating...
                          </p>
                        </div>
                      )
                      :isLoading? (
                        <div className="mb-4">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <p className="mt-2 text-muted-foreground">
                            Loading...
                          </p>
                        </div>
                      )
                      :
                      <Button
                        size="lg"
                        onClick={connect}
                        className="bg-[#24292e] hover:bg-[#1c2022] text-white"
                      >
                        <Github className="mr-2 h-5 w-5" />
                        Connect with GitHub
                      </Button>
                    }
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">
                      Your Repositories
                    </h3>

                    {isLoading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground">
                          Loading repositories...
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4">
                        {repos.map((repo, index) => (
                          <div
                            key={index}
                            className="bg-surface rounded-lg p-6 border border-border hover:border-primary/30 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground text-lg mb-2">
                                  {repo.name}
                                </h4>
                                <p className="text-muted-foreground text-sm">
                                  {repo.description || "No description provided."}
                                </p>
                              </div>
                              <Button
                                onClick={() =>
                                  selectRepo(repo)
                                }
                                disabled={isLoading}
                                className="ml-4"
                              >
                                Select & Deploy
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Pagination */}
                    <div className="flex justify-between items-center pt-6">
                      <Button
                        variant="outline"
                        onClick={prevPage}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-muted-foreground">
                        Page {page}
                      </span>
                      <Button
                        variant="outline"
                        onClick={nextPage}
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CreateTheme;