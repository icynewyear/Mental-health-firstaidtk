import React, { useState } from 'react';
import { Copy, Check, FileCode, Folder, FolderOpen, Terminal, BookOpen, AlertCircle } from 'lucide-react';
import { CodeFile } from '../types';

interface CodeViewerProps {
  files: CodeFile[];
  selectedFileIndex: number;
  setSelectedFileIndex: (idx: number) => void;
  recommendedFileIndex: number;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  files,
  selectedFileIndex,
  setSelectedFileIndex,
  recommendedFileIndex,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'setup'>('editor');
  
  // Highlighting regex for a standard IDE appearance
  const highlightCode = (code: string, lang: string) => {
    let escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    if (lang === 'kotlin') {
      // 1. Comments
      escaped = escaped.replace(/(\/\/.*)/g, '<span class="text-slate-500 italic">$1</span>');
      
      // 2. Annotations
      escaped = escaped.replace(/(@[A-Za-z0-9_]+)/g, '<span class="text-emerald-400 font-semibold">$1</span>');
      
      // 3. String literals
      escaped = escaped.replace(/(".*?")/g, '<span class="text-amber-300 font-medium">$1</span>');
      
      // 4. Numbers
      escaped = escaped.replace(/\b(\d+L|\d+f|\d+)\b/g, '<span class="text-orange-400 font-semibold">$1</span>');

      // 5. Types & Classes
      const types = [
        'Composable', 'Screen', 'MainActivity', 'Bundle', 'GuidedBreathingScreen', 'BreathingPhase',
        'GroundingExerciseScreen', 'GroundingStep', 'CopingReliefScreen', 'EmergencyContactsScreen',
        'Color', 'Modifier', 'Scaffold', 'Button', 'Text', 'Icon', 'IconButton', 'Card', 'Spacer',
        'State', 'MutableState', 'Uri', 'Intent', 'Context', 'LocalContext', 'NavHost', 'NavGraph',
        'Activity', 'ComponentActivity', 'IconButton', 'IconButton', 'SharedPrefs', 'LinearProgressIndicator',
        'Tab', 'TabRow', 'Float', 'Int', 'String', 'Boolean'
      ];
      types.forEach(t => {
        const regex = new RegExp(`\\b(${t})\\b`, 'g');
        escaped = escaped.replace(regex, '<span class="text-sky-300 font-medium">$1</span>');
      });

      // 6. Keywords
      const keywords = [
        'package', 'import', 'class', 'enum', 'sealed', 'object', 'fun', 'val', 'var', 'override',
        'if', 'else', 'when', 'return', 'is', 'as', 'null', 'true', 'false', 'private', 'public',
        'while', 'for', 'in', 'this', 'throw', 'try', 'catch', 'finally', 'by', 'repeat', 'remember', 'mutableStateOf'
      ];
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b(${kw})\\b`, 'g');
        escaped = escaped.replace(regex, '<span class="text-rose-400 font-bold">$1</span>');
      });
    } else if (lang === 'toml') {
      // Toml coloring
      escaped = escaped.replace(/(\s*=\s*)(.*)/g, '$1<span class="text-amber-300">$2</span>');
      escaped = escaped.replace(/(\[.*\])/g, '<span class="text-rose-400 font-bold">$1</span>');
      escaped = escaped.replace(/([a-zA-Z-_\.]+)(\s*=)/g, '<span class="text-sky-300 font-bold">$1</span>$2');
    }

    return escaped;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(files[selectedFileIndex].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[610px] bg-slate-900 rounded-[32px] border border-slate-800 shadow-2xl overflow-hidden text-slate-100 select-text">
      
      {/* Top Header Controls bar */}
      <div className="h-14 bg-slate-950 px-6 flex items-center justify-between border-b border-slate-800 select-none">
        <div className="flex items-center space-x-2.5">
          <div className="flex space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-400 ml-2">AndroidStudio — Kotlin Development Suite</span>
        </div>

        {/* Tab switch & ZIP Download buttons */}
        <div className="flex items-center space-x-3">
          <a
            href="/api/download-android-zip"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-[10.5px] font-bold bg-[#38563a] hover:bg-[#436746] hover:text-[#e4f3df] text-[#a8c69f] transition active:scale-95 border border-emerald-950/60 shadow-md"
            title="Download full ready-to-use Android Studio project as a .zip"
          >
            <FolderOpen size={11} className="stroke-[2.5]" />
            <span>Download ZIP</span>
          </a>

          <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center space-x-1 px-3 py-1 text-[11px] font-bold rounded-md transition ${
                activeTab === 'editor' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal size={12} />
              <span>Code Editor</span>
            </button>
            
            <button
              onClick={() => setActiveTab('setup')}
              className={`flex items-center space-x-1 px-3 py-1 text-[11px] font-bold rounded-md transition ${
                activeTab === 'setup' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen size={12} />
              <span>Android Setup Steps</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'setup' ? (
        /* Setup guidelines panel */
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-300 leading-relaxed text-left space-y-6 select-text">
          {/* CRITICAL WARNING CARD FOR IMPORT ERRORS */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-2xl p-4.5 space-y-2">
            <h4 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <AlertCircle size={16} />
              <span>Fixing "The project file specified already exists" Error</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you downloaded our complete project ZIP and got this error, it means you clicked <strong>"New Project"</strong> inside Android Studio instead of opening it. 
              Because the ZIP already contains a fully-configured Gradle workspace, Android Studio will throw this error if you try to "create" a new project over it.
            </p>
            <div className="text-xs text-slate-300 mt-2 pl-4 border-l-2 border-amber-500/50 py-0.5 space-y-1 font-medium">
              <p>1. Extract the downloaded <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 font-mono">MentalHealthToolkit_AndroidStudio_Project.zip</code> to a folder.</p>
              <p>2. In Android Studio, click <strong>File &gt; Open</strong> (DO NOT click "New Project").</p>
              <p>3. Browse to and select the folder you just extracted, and click <strong>OK</strong>.</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="bg-emerald-600 text-white rounded p-1"><FolderOpen size={15} /></span>
              <span>⚡ Method A: Download & Open Ready-to-Use ZIP (Recommended)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2 pl-7 leading-relaxed">
              Skip the manual configurations! We packaged a 100% complete, standard, compile-ready Android project for you.
            </p>
            <ol className="list-decimal pl-11 text-xs text-slate-400 space-y-2 mt-2">
              <li>Click the green <strong>Download ZIP</strong> button at the top right of this developer workspace.</li>
              <li>Extract the ZIP folder somewhere on your computer (e.g., your Desktop).</li>
              <li>Open Android Studio. On the welcome wizard or the top menu bar, go to <strong>File &gt; Open</strong>.</li>
              <li>Select the extracted folder containing <code className="bg-slate-950 text-slate-300 px-1 py-0.5 rounded font-mono">settings.gradle.kts</code>.</li>
              <li>Click <strong>OK</strong> and let Android Studio load, sync Gradle dependencies, and configure itself automatically!</li>
            </ol>
          </div>

          <hr className="border-slate-800" />

          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="bg-indigo-600 text-white rounded p-1"><BookOpen size={15} /></span>
              <span>🛠️ Method B: Manual Copy-Paste Setup (From Scratch)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-2 pl-7 leading-relaxed">
              If you prefer to start with a blank canvas and copy-paste the Kotlin files one-by-one, follow these guidelines:
            </p>
            
            <div className="mt-3 pl-7 space-y-4">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Step B1. Creating the Android Studio Project</span>
                <p className="text-xs text-slate-400 mt-1">
                  Launch Android Studio, click <strong>New Project</strong>, select <strong>Empty Activity</strong> (Jetpack Compose standard) and specify these inputs exactly:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1 mt-1.5">
                  <li><strong>Name:</strong> Mental Health Toolkit</li>
                  <li><strong>Package Name:</strong> <code className="bg-slate-950 px-1.5 py-0.5 rounded text-rose-400">com.mentalhealth.firstaid</code></li>
                  <li><strong>Language:</strong> Kotlin</li>
                  <li><strong>Minimum SDK:</strong> API 26 (Android 8.0 Oreo) or higher</li>
                  <li><strong>Build Configuration:</strong> Kotlin DSL (build.gradle.kts)</li>
                </ul>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-200 block">Step B2. Swap Gradle Configuration files</span>
                <p className="text-xs text-slate-400 mt-1">
                  Copy and replace the content of your local project's <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 text-[10px]">gradle/libs.versions.toml</code> and <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300 text-[10px]">app/build.gradle.kts</code> with the source files shown in the <strong>Code Editor</strong> tab. Click <strong>"Sync Project with Gradle Files"</strong> in the top yellow bar.
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-200 block">Step B3. Copy Kotlin Screens</span>
                <p className="text-xs text-slate-400 mt-1">
                  Inside your local project, right-click the <code className="bg-slate-950 px-1 py-0.5 rounded text-sky-400">com.mentalhealth.firstaid</code> package, select <strong>New &gt; Package</strong>, and name it <code className="bg-slate-950 px-1 py-0.5 rounded font-mono">ui.screens</code>.
                  Create empty Kotlin files for each screen inside this directory, and paste the code from our Code Editor:
                </p>
                <ul className="list-disc pl-5 text-xs text-slate-400 space-y-1 mt-1.5 font-mono">
                  <li>MainActivity.kt (Replaces your existing main activity wholly)</li>
                  <li>ui/screens/DashboardScreen.kt</li>
                  <li>ui/screens/GuidedBreathingScreen.kt</li>
                  <li>ui/screens/GroundingExerciseScreen.kt</li>
                  <li>ui/screens/EmergencyContactsScreen.kt</li>
                  <li>...and other screens matching our editor tree</li>
                </ul>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          <div>
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <span className="bg-emerald-600 text-white rounded p-1"><FileCode size={15} /></span>
              <span>4. Compiling Your Application (Local Offline or Free Actions)</span>
            </h3>
            
            <div className="text-xs text-slate-300 mt-3 pl-7 space-y-3">
              <p>
                You do <strong>not</strong> need GitHub Premium or any paid subscription! You can compile your APK using either of these quick directions:
              </p>
              
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-400 text-[11px] block">🔌 Option A: Fast Local & Offline Compilation (Recommended)</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Inside <strong>Android Studio</strong> on your computer, click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>. 
                  Alternatively, type <code className="bg-slate-900 text-slate-200 px-1 py-0.5 rounded font-mono">./gradlew assembleDebug</code> in your command line. 
                  This builds your APK locally instantly. You can locate the executable at:
                  <code className="block mt-1 font-mono text-[10px] text-indigo-300 bg-slate-900/50 p-1 rounded">app/build/outputs/apk/debug/app-debug.apk</code>
                </p>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400 text-[11px] block">☁️ Option B: Free Automation via GitHub Actions</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  GitHub Actions is 100% free with 2000+ build minutes monthly for every free account. 
                  Create a file named <code className="bg-slate-900 text-[#a8c69f] px-1 py-0.5 rounded font-mono">.github/workflows/build-apk.yml</code> and paste:
                </p>
                <pre className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[10.5px] font-mono text-emerald-300 overflow-x-auto max-h-36 select-all">
{`name: Compile Mental Health Toolkit Android APK
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        distribution: 'zulu'
        java-version: '17'
        cache: 'gradle'
    - run: chmod +x gradlew
    - run: ./gradlew assembleDebug
    - uses: actions/upload-artifact@v4
      with:
        name: safe-space-test-apk
        path: app/build/outputs/apk/debug/app-debug.apk`}
                </pre>
                <p className="text-slate-400 text-[11px]">
                  Push your repository to GitHub, go to the <strong>Actions</strong> tab, and download your compiled <strong>safe-space-test-apk</strong> ZIP!
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-800" />

          <div className="bg-emerald-950/20 rounded-2xl border border-emerald-800/40 p-4 flex items-start space-x-3">
            <AlertCircle className="text-emerald-400 shrink-0 mt-0.5" size={17} />
            <div className="text-xs">
              <h4 className="font-bold text-emerald-400">Architecture & Performance Tip</h4>
              <p className="text-slate-300 mt-1">
                Notice our simulation uses local persistence storage. In the native Android app, personal contacts are kept using Android <strong>SharedPreferences</strong> inside the Context wrapper. This guarantees total offline availability and immediate data safety, without requiring high-maintenance network resources.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Double Panel IDE (Left Folder tree, Right interactive code viewer) */
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left panel: File tree explorer */}
          <div className="w-[190px] bg-slate-950 border-r border-slate-800 flex flex-col pt-3 overflow-y-auto select-none shrink-0 text-left">
            <div className="px-3.5 mb-2 flex items-center space-x-1.5 text-slate-500 font-bold text-[10px]">
              <Folder size={11} />
              <span>PROJECT STRUCT</span>
            </div>

            <div className="space-y-1 px-1">
              {/* Virtual Project node */}
              <div className="text-slate-300 font-bold text-xs px-2.5 py-1 flex items-center space-x-1 bg-slate-900/50 rounded-md">
                <FolderOpen size={11} className="text-indigo-400 shrink-0" />
                <span className="truncate">MentalHealthAid</span>
              </div>

              {/* Sub items */}
              <div className="pl-3.5 space-y-0.5">
                {/* Gradle Node */}
                <div className="text-[10px] font-bold text-slate-500 py-1 pl-1 select-none">GRADLE CONFIG</div>
                
                {/* File TOML */}
                <button
                  onClick={() => setSelectedFileIndex(1)}
                  className={`w-full text-left font-mono text-[10px] py-1 px-2.5 rounded-lg flex items-center justify-between transition ${
                    selectedFileIndex === 1
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <span className="truncate">libs.versions.toml</span>
                </button>

                {/* Gradle script */}
                <button
                  onClick={() => setSelectedFileIndex(0)}
                  className={`w-full text-left font-mono text-[10px] py-1 px-2.5 rounded-lg flex items-center justify-between transition ${
                    selectedFileIndex === 0
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <span className="truncate">build.gradle.kts</span>
                </button>

                <div className="text-[10px] font-bold text-slate-500 py-1 pl-1 select-none">NATIVE SOURCE</div>

                {/* MainActivity */}
                <button
                  onClick={() => setSelectedFileIndex(2)}
                  className={`w-full text-left font-mono text-[10px] py-1 px-2.5 rounded-lg flex items-center justify-between transition ${
                    selectedFileIndex === 2
                      ? 'bg-slate-800 text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  <span className="truncate">MainActivity.kt</span>
                </button>

                <div className="pl-2 border-l border-slate-800 space-y-0.5 mt-1">
                  <div className="text-[9px] font-bold text-slate-600/90 tracking-wide uppercase px-1 pb-0.5 leading-none">Screens</div>
                  
                  {files.slice(3).map((file, offsetIdx) => {
                    const actualIdx = offsetIdx + 3;
                    const isSelected = selectedFileIndex === actualIdx;
                    const isRecommended = recommendedFileIndex === actualIdx;

                    return (
                      <button
                        key={file.path}
                        onClick={() => setSelectedFileIndex(actualIdx)}
                        className={`w-full text-left font-mono text-[10.5px] py-1 px-1.5 rounded-md flex items-center justify-between transition ${
                          isSelected
                            ? 'bg-slate-800 text-white font-bold'
                            : 'text-slate-400 hover:bg-slate-900'
                        } ${isRecommended && !isSelected ? 'border border-dashed border-emerald-500/40 text-emerald-400 font-bold bg-emerald-950/20' : ''}`}
                      >
                        <span className="truncate">{file.name}</span>
                        {isRecommended && (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-ping" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Smart Simulator sync tip bottom */}
            <div className="mt-auto m-2.5 p-3 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col space-y-1.5 text-[9px] leading-relaxed text-slate-400">
              <span className="font-bold text-emerald-400 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span>Sim-Logic Link Active</span>
              </span>
              <p>As you change modules inside the simulated mobile device, we'll highlight the corresponding Jetpack Compose file here!</p>
            </div>
          </div>

          {/* Right panel: Syntax Colored Code and information details */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden text-left relative">
            {/* Header info bar */}
            <div className="bg-slate-950/40 px-5 py-2.5 flex items-center justify-between border-b border-slate-950/80">
              <div className="flex-1 min-w-0 pr-4">
                <code className="text-[10px] font-mono text-slate-400 tracking-tight select-all block truncate">
                  {files[selectedFileIndex].path}
                </code>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {files[selectedFileIndex].description}
                </p>
              </div>

              {/* Copy Code Button */}
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-[10.5px] px-3.5 py-1.5 rounded-xl transition border border-slate-700 shadow-sm shrink-0 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check size={12} className="text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy Code</span>
                  </>
                )}
              </button>
            </div>

            {/* Code canvas viewport */}
            <div className="flex-1 overflow-auto p-5 font-mono text-[11.5px] leading-relaxed relative bg-slate-950 select-text">
              <pre className="relative z-10 m-0">
                <code
                  dangerouslySetInnerHTML={{
                    __html: highlightCode(files[selectedFileIndex].code, files[selectedFileIndex].language),
                  }}
                />
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
