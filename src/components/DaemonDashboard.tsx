import { useState, useEffect, Component } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  daemonData as generatedData,
  toolCount as generatedToolCount,
} from "../generated/daemon-data";
import type { Exploration, ContactLink } from "../types/daemon.types";
import {
  Target,
  Compass,
  BookOpen,
  Heart,
  Wrench,
  MessageSquare,
  Server,
  Loader2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Github,
  Linkedin,
  Rss,
  AtSign,
  User,
  Crosshair,
} from "lucide-react";

/**
 * Error Boundary for graceful error handling
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 border border-error/30 bg-error/10">
            <p className="text-sm text-error">Failed to render section</p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

function StatusBar({
  isConnected,
  toolCount,
  currentTime,
  lastUpdated,
}: {
  isConnected: boolean;
  toolCount: number;
  currentTime: Date;
  lastUpdated?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center justify-between gap-4 border border-border-default bg-bg-secondary px-4 py-3 mb-6"
    >
      <div className="flex items-center gap-4">
        <span className="font-mono font-bold text-sm text-brand">
          DAEMON://RUDY
        </span>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${isConnected ? "bg-success animate-pulse-slow" : "bg-error"}`}
          />
          <span className="font-mono text-xs text-text-secondary">
            {isConnected ? "CONNECTED" : "OFFLINE"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 text-text-tertiary font-mono text-xs">
        <span>{toolCount} endpoints</span>
        {lastUpdated && (
          <span>Updated: {new Date(lastUpdated).toLocaleDateString()}</span>
        )}
        <span>{currentTime.toISOString().slice(0, 10)}</span>
      </div>
    </motion.div>
  );
}

function ContactIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  if (p.includes("github")) return <Github className="w-4 h-4" />;
  if (p.includes("linkedin")) return <Linkedin className="w-4 h-4" />;
  if (p.includes("mastodon")) return <AtSign className="w-4 h-4" />;
  if (p.includes("substack") || p.includes("blog"))
    return <Rss className="w-4 h-4" />;
  return <ExternalLink className="w-4 h-4" />;
}

export function DaemonDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data from generated file
  const [about, setAbout] = useState("");
  const [mission, setMission] = useState("");
  const [telos, setTelos] = useState<string[]>([]);
  const [explorations, setExplorations] = useState<Exploration[]>([]);
  const [whatImBuilding, setWhatImBuilding] = useState<string[]>([]);
  const [favoriteBooks, setFavoriteBooks] = useState<string[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<string[]>([]);
  const [philosophy, setPhilosophy] = useState("");
  const [contact, setContact] = useState<ContactLink[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [toolCount, setToolCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    loadData();
    return () => clearInterval(timer);
  }, []);

  function loadData() {
    setToolCount(generatedToolCount);
    setAbout(generatedData.about);
    setMission(generatedData.mission);
    setTelos(generatedData.telos || []);
    setExplorations(generatedData.explorations || []);
    setWhatImBuilding(generatedData.whatImBuilding || []);
    setFavoriteBooks(generatedData.favoriteBooks || []);
    setFavoriteMovies(generatedData.favoriteMovies || []);
    setPhilosophy(generatedData.philosophy || "");
    setContact(generatedData.contact || []);
    setLastUpdated(generatedData.lastUpdated);
    setIsConnected(true);
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 text-brand animate-spin" />
          <p className="font-mono text-sm text-text-secondary">
            Establishing MCP connection...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <AlertCircle className="w-8 h-8 text-error" />
          <p className="font-mono text-sm text-error">{error}</p>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent hover:bg-accent/30 transition-colors font-mono text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 space-y-4">
      <StatusBar
        isConnected={isConnected}
        toolCount={toolCount}
        currentTime={currentTime}
        lastUpdated={lastUpdated}
      />

      {/* ROW 1: MISSION | TELOS - Primary/Hero Treatment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* MISSION */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="border border-border-default bg-bg-secondary p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-brand" />
              <span className="font-mono text-sm font-semibold tracking-wider text-brand uppercase">
                Mission
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {mission || "Not available"}
            </p>
          </motion.div>
        </ErrorBoundary>

        {/* TELOS */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="border border-border-default bg-bg-secondary p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-brand" />
                <span className="font-mono text-sm font-semibold tracking-wider text-brand uppercase">
                  Telos
                </span>
              </div>
              <a
                href="/telos"
                className="text-xs text-text-tertiary hover:text-brand transition-colors"
              >
                View all
              </a>
            </div>
            <div className="space-y-2">
              {telos.slice(0, 4).map((item, i) => {
                const match = item.match(/^([PMG]\d+):\s*(.+)$/);
                if (!match)
                  return (
                    <p key={i} className="text-xs text-text-secondary">
                      {item}
                    </p>
                  );
                const [, id, rest] = match;
                return (
                  <div key={i} className="flex gap-2">
                    <span className="font-mono text-xs font-bold text-accent shrink-0">
                      {id}
                    </span>
                    <span className="text-xs text-text-secondary">{rest}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </ErrorBoundary>
      </div>

      {/* ROW 2: EXPLORATIONS | WHAT I'M BUILDING - Secondary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* EXPLORATIONS */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="border border-border-subtle bg-bg-secondary/80 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-text-tertiary" />
              <span className="font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase">
                Explorations
              </span>
            </div>
            <div className="space-y-2">
              {explorations.length > 0 ? (
                explorations.slice(0, 4).map((exp, i) => (
                  <p key={i} className="text-xs text-text-secondary">
                    <span className="text-text-primary">{exp.title}</span>
                    <span className="text-text-tertiary"> — </span>
                    {exp.description}
                  </p>
                ))
              ) : (
                <p className="text-xs text-text-tertiary italic">
                  No explorations listed
                </p>
              )}
            </div>
          </motion.div>
        </ErrorBoundary>

        {/* WHAT I'M BUILDING */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="border border-border-subtle bg-bg-secondary/80 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-text-tertiary" />
              <span className="font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase">
                Building
              </span>
            </div>
            <div className="space-y-2">
              {whatImBuilding.length > 0 ? (
                whatImBuilding.map((item, i) => {
                  const match = item.match(/^(.+?)\s*—\s*(.+)$/);
                  if (!match)
                    return (
                      <p key={i} className="text-xs text-text-secondary">
                        {item}
                      </p>
                    );
                  const [, title, description] = match;
                  return (
                    <p key={i} className="text-xs text-text-secondary">
                      <span className="text-text-primary">{title}</span>
                      <span className="text-text-tertiary"> — </span>
                      {description}
                    </p>
                  );
                })
              ) : (
                <p className="text-xs text-text-tertiary italic">
                  No projects listed
                </p>
              )}
            </div>
          </motion.div>
        </ErrorBoundary>
      </div>

      {/* ROW 3: CURRENTLY READING | FAVORITES - Tertiary/Dimmer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 opacity-80">
        {/* CURRENTLY READING */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="border border-border-subtle bg-bg-secondary/60 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-text-tertiary" />
              <span className="font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase">
                Currently Reading
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-text-secondary">
                <span className="text-text-primary">
                  A Philosophy of Software Design
                </span>
                <span className="text-text-tertiary"> — </span>John Ousterhout
              </p>
              <p className="text-xs text-text-secondary">
                <span className="text-text-primary">Project Hail Mary</span>
                <span className="text-text-tertiary"> — </span>Andy Weir
              </p>
              <p className="text-xs text-text-secondary">
                <span className="text-text-primary">Oathbringer</span>
                <span className="text-text-tertiary"> — </span>Brandon Sanderson
              </p>
              <p className="text-xs text-text-secondary">
                <span className="text-text-primary">The Daily Stoic</span>
                <span className="text-text-tertiary"> — </span>Ryan Holiday
              </p>
              <p className="text-xs text-text-secondary">
                <span className="text-text-primary">Meditations</span>
                <span className="text-text-tertiary"> — </span>Marcus Aurelius
              </p>
            </div>
          </motion.div>
        </ErrorBoundary>

        {/* FAVORITES */}
        <ErrorBoundary>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="border border-border-subtle bg-bg-secondary/60 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-text-tertiary" />
              <span className="font-mono text-xs font-semibold tracking-wider text-text-tertiary uppercase">
                Favorites
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {favoriteBooks.slice(0, 5).map((book, i) => {
                  const match = book.match(/^(.+?)\s*—\s*(.+)$/);
                  if (!match)
                    return (
                      <p key={i} className="text-xs text-text-secondary">
                        {book}
                      </p>
                    );
                  const [, title, author] = match;
                  return (
                    <p key={i} className="text-xs text-text-secondary">
                      <span className="text-text-primary">{title}</span>
                      <span className="text-text-tertiary"> — </span>
                      {author}
                    </p>
                  );
                })}
              </div>
              <div className="space-y-2">
                {favoriteMovies.slice(0, 5).map((movie, i) => {
                  const match = movie.match(/^(.+?)\s*—\s*(.+)$/);
                  if (!match)
                    return (
                      <p key={i} className="text-xs text-text-secondary">
                        {movie}
                      </p>
                    );
                  const [, title, annotation] = match;
                  return (
                    <p key={i} className="text-xs text-text-secondary">
                      <span className="text-text-primary">{title}</span>
                      <span className="text-text-tertiary"> — </span>
                      {annotation}
                    </p>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </ErrorBoundary>
      </div>

      {/* FOOTER: Philosophy Quote + Contact + API */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="pt-4 border-t border-border-subtle space-y-4"
      >
        {/* Philosophy as subtle quote */}
        {philosophy && (
          <p className="text-xs text-text-tertiary italic text-center">
            "{philosophy}"
          </p>
        )}

        {/* Contact + API */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Contact Links */}
          <div className="flex items-center gap-4">
            {contact.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-tertiary hover:text-brand transition-colors"
                title={link.platform}
              >
                <ContactIcon platform={link.platform} />
              </a>
            ))}
          </div>

          {/* API Access */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-text-tertiary" />
              <code className="font-mono text-sm text-brand">
                daemon.voidwire.info
              </code>
            </div>
            <a
              href="/api/"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-bg-tertiary hover:bg-bg-elevated text-text-secondary hover:text-text-primary border border-border-subtle transition-colors text-xs font-mono"
            >
              API Docs <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
