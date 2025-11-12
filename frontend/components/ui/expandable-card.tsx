"use client";

import {
  CheckCircle2,
  Clock,
  GitBranch,
  Github,
  MessageSquare,
  Star,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef } from "react";
import { useExpandable } from "@/components/hooks/use-expandable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ProjectStatusCardProps = {
  title: string;
  progress: number;
  dueDate: string;
  contributors: Array<{ name: string; image?: string }>;
  tasks: Array<{ title: string; completed: boolean }>;
  githubStars: number;
  openIssues: number;
};

export function ProjectStatusCard({
  title,
  progress,
  dueDate,
  contributors,
  tasks,
  githubStars,
  openIssues,
}: ProjectStatusCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  return (
    <Card
      className="w-full max-w-md cursor-pointer transition-all duration-300"
      onClick={toggleExpand}
    >
      <CardHeader className="space-y-1">
        <div className="flex w-full items-start justify-between">
          <div className="space-y-2">
            <Badge
              className={
                progress === 100
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600"
              }
              variant="secondary"
            >
              {progress === 100 ? "Completed" : "In Progress"}
            </Badge>
            <h3 className="font-semibold text-2xl">{title}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="h-8 w-8" size="icon" variant="outline">
                  <Github className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <ProgressBar className="h-2" value={progress} />
          </div>

          <motion.div
            className="overflow-hidden"
            style={{ height: animatedHeight }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div ref={contentRef}>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    animate={{ opacity: 1 }}
                    className="space-y-4 pt-2"
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                  >
                    <div className="flex items-center justify-between text-gray-600 text-sm">
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        <span>Due {dueDate}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 text-yellow-400" />
                          <span>{githubStars}</span>
                        </div>
                        <div className="flex items-center">
                          <GitBranch className="mr-1 h-4 w-4" />
                          <span>{openIssues} issues</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center font-medium text-sm">
                        <Users className="mr-2 h-4 w-4" />
                        Contributors
                      </h4>
                      <div className="-space-x-2 flex">
                        {contributors.map((contributor) => (
                          <TooltipProvider key={contributor.name}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Avatar className="border-2 border-white">
                                  <AvatarImage
                                    alt={contributor.name}
                                    src={
                                      contributor.image ||
                                      `/placeholder.svg?height=32&width=32&text=${contributor.name[0]}`
                                    }
                                  />
                                  <AvatarFallback>
                                    {contributor.name[0]}
                                  </AvatarFallback>
                                </Avatar>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{contributor.name}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Recent Tasks</h4>
                      {tasks.map((task) => (
                        <div
                          className="flex items-center justify-between text-sm"
                          key={task.title}
                        >
                          <span className="text-gray-600">{task.title}</span>
                          {task.completed && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        View Discussion
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-center justify-between text-gray-600 text-sm">
          <span>Last updated: 2 hours ago</span>
          <span>{openIssues} open issues</span>
        </div>
      </CardFooter>
    </Card>
  );
}
