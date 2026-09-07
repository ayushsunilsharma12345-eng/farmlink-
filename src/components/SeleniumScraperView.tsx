import React, { useState } from 'react';
import { SeleniumScraperTask } from '../types';
import { Bot, RefreshCw, CheckCircle2, ShieldCheck, Terminal, Cpu, Globe, Zap, AlertCircle } from 'lucide-react';

interface SeleniumScraperViewProps {
  tasks: SeleniumScraperTask[];
  onTriggerScrape: () => void;
  isScraping: boolean;
}

export const SeleniumScraperView: React.FC<SeleniumScraperViewProps> = ({
  tasks,
  onTriggerScrape,
  isScraping,
}) => {
  const [selectedTask, setSelectedTask] = useState<SeleniumScraperTask>(tasks[0]);

  return (
    <div id="selenium-scraper-panel" className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600/20 border border-teal-500/40 flex items-center justify-center text-teal-400 shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
              <span>Selenium Web Automation & Dynamic Data Aggregation Farm</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
                Headless Chromium (0-Cost)
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Distributed asynchronous workers scraping live airfares, rail seat waitlists, and bus schedules
            </p>
          </div>
        </div>

        {/* Trigger Sweep Button */}
        <button
          id="btn-trigger-selenium-sweep"
          onClick={onTriggerScrape}
          disabled={isScraping}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
            isScraping
              ? 'bg-teal-500 text-slate-950 animate-pulse'
              : 'bg-teal-600 hover:bg-teal-500 text-white shadow-md shadow-teal-500/20'
          }`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
          <span>{isScraping ? 'Scraping Live Web Feeds...' : 'Trigger Immediate Scrape Sweep'}</span>
        </button>
      </div>

      {/* Scraper Task Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {tasks.map((task) => {
          const isSelected = selectedTask.id === task.id;
          return (
            <div
              key={task.id}
              onClick={() => setSelectedTask(task)}
              className={`cursor-pointer p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-950 border-teal-500 ring-1 ring-teal-500/40'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200 flex items-center space-x-2">
                    <Globe className="w-3.5 h-3.5 text-teal-400" />
                    <span>{task.targetProvider}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 capitalize">
                    Feed Type: {task.sourceType}
                  </div>
                </div>

                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    task.status === 'running' || isScraping
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60 animate-pulse'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {isScraping ? 'Active Scraping' : task.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-400">Chromium Workers</div>
                  <div className="font-mono text-teal-400 font-bold">{task.headlessWorkers} Headless</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Scraped Rate</div>
                  <div className="font-mono text-sky-400 font-bold">{task.recordsScrapedPerMin}/min</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Latency / Page</div>
                  <div className="font-mono text-slate-200 font-bold">{task.avgDurationSec}s</div>
                </div>
              </div>

              <div className="mt-3 text-[11px] text-slate-400 flex items-center justify-between">
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Bypass: {task.antiBotBypass}</span>
                </span>
                <span className="text-[10px] text-slate-500">{task.lastScrapedAt}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Scraper Deep-Dive Terminal */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-teal-400" />
            <span className="text-slate-200 font-semibold">{selectedTask.targetProvider} - Automation Config</span>
          </div>
          <span className="text-[10px] text-teal-400">Zero-Cost Resource Optimization Active</span>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
          <p className="text-slate-400"># Dockerized Selenium Container Command</p>
          <p className="text-teal-300 bg-slate-900 p-2 rounded border border-slate-800 overflow-x-auto">
            docker run -d -p 4444:4444 --shm-size="2g" selenium/standalone-chromium:latest --disable-gpu --blink-settings=imagesEnabled=false
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-bold text-slate-200 block mb-1">Zero-Cost Anti-Detection:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                <li>Headless Chrome navigator.webdriver override via CDP</li>
                <li>CSS, font, and image blocking (-94% egress data costs)</li>
                <li>Free rotating TLS residential headers & referrer spoofing</li>
              </ul>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span className="text-xs font-bold text-slate-200 block mb-1">Kafka Ingestion Pipeline:</span>
              <ul className="list-disc list-inside text-slate-400 space-y-1 text-[11px]">
                <li>Parsed DOM JSON streamed to topic: `travel.fare.updates`</li>
                <li>RabbitMQ worker queue regulates concurrency below server memory limits</li>
                <li>Redis TTL automatically invalidates stale fare entries</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
