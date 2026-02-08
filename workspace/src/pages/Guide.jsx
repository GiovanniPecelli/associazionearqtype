import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { Icons } from '../components/common/Icons';

// Vibrant & Alive Guide Page (Refined Dark Mode) - Performance Optimized
const Guide = () => {
    return (
        <PageTransition className="min-h-screen h-auto bg-transparent pb-24 relative">
            {/* Background Ambience - Simplified for Performance */}
            {/* Background Ambience - Simplified for Performance */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="hidden md:block absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-indigo-900/20 blur-[150px] rounded-full mix-blend-screen" />
                <div className="hidden md:block absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-fuchsia-900/20 blur-[150px] rounded-full mix-blend-screen" />
                <div className="hidden md:block absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-cyan-900/10 blur-[120px] rounded-full mix-blend-overlay" />

                {/* Mobile Fallback Ambience (Lightweight) */}
                <div className="md:hidden absolute top-0 right-0 w-full h-full bg-gradient-to-b from-indigo-900/10 via-transparent to-fuchsia-900/10" />
            </div>

            <div className="max-w-6xl mx-auto space-y-16 px-6 md:px-8 animate-fade-in pt-32">
                {/* Welcome Header - Bright & Bold */}
                <div className="text-center space-y-6 pt-4 pb-8">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-white">Associazione ARQtype</span>
                    </h1>

                    <p className="text-2xl text-indigo-200/60 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-sm">
                        Your journey begins here. Explore the ecosystem, <span className="text-white font-medium border-b border-indigo-500/50">unlock your potential</span>, and build the future.
                    </p>
                </div>

                {/* Section 1: Core Navigation (Dark Glass Cards) */}
                <div className="grid md:grid-cols-2 gap-8">
                    <GuideCard
                        title="Workflows"
                        icon={<Icons.Lightning className="w-10 h-10" />}
                        color="from-indigo-600 to-cyan-600"
                        accent="shadow-lg border-white/5 hover:border-indigo-500/30"
                        link="/workflows"
                        description="Manage tasks and execute business processes with precision."
                    />
                    <GuideCard
                        title="Chat"
                        icon={<Icons.Chat className="w-10 h-10" />}
                        color="from-fuchsia-600 to-pink-600"
                        accent="shadow-lg border-white/5 hover:border-fuchsia-500/30"
                        link="/chat"
                        description="Real-time encrypted communication and collaboration hubs."
                    />
                </div>

                {/* Section 2: Resources & Knowledge */}
                <div className="space-y-8">
                    <SectionTitle title="Knowledge & Growth" icon={<Icons.Brain className="w-6 h-6 text-emerald-400" />} />

                    {/* Documents Link - Single Row */}
                    <Link to="/documents" className="block relative group p-8 rounded-3xl bg-black/20 border border-white/5 hover:border-emerald-500/30 transition-all duration-200 overflow-hidden backdrop-blur-md shadow-md hover:shadow-emerald-500/10">
                        <div className="absolute inset-0 bg-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-emerald-900/20 text-4xl border border-emerald-500/10 text-emerald-100">
                                <Icons.Folder className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">Web Source</h3>
                                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-200 transition-colors">Project docs & assets.</p>
                            </div>
                            <Icons.ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>

                {/* NEW SECTION: INTERNAL WORKFLOW TRAINING */}
                <div className="mt-8 rounded-[2.5rem] bg-[#0a0a0a] border border-white/5 overflow-hidden relative">
                    {/* Header */}
                    <div className="p-8 md:p-12 border-b border-white/5 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white/[0.02]">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
                                <Icons.Training className="w-8 h-8 text-orange-500" />
                                SYSTEM TRAINING
                            </h2>
                            <p className="text-gray-400 max-w-xl text-lg">
                                <strong>Module 01:</strong> How to Launch and Manage a Workflow.
                            </p>
                        </div>
                    </div>

                    {/* Example Visual */}
                    <div className="px-6 md:px-12 pt-8 md:pt-12 pb-12 space-y-8 md:space-y-12">
                        {/* Video Placeholder - More compact on mobile */}
                        <div className="w-full aspect-[21/9] md:aspect-video bg-black/50 rounded-2xl border border-white/10 relative overflow-hidden group cursor-not-allowed">
                            {/* Placeholder Content */}
                            <div className="absolute inset-0 flex items-start pt-8 md:pt-0 md:items-center justify-center">
                                <div className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
                                    <span className="text-white/60 font-mono text-xs md:text-sm tracking-widest uppercase">Video Coming Soon</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent">
                                <span className="text-[10px] md:text-xs font-mono text-orange-400 uppercase tracking-widest mb-1 block">Tutorial Video</span>
                                <h3 className="text-lg md:text-xl font-bold text-white leading-tight">Mastering the Workflow Engine</h3>
                            </div>

                            {/* Decorative Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-20 pointer-events-none" />
                        </div>

                        {/* Step-by-Step Guide - Vertical Stack on Mobile */}
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 md:bg-transparent md:border-none md:p-0">
                                <div className="text-lg font-bold text-white flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-sm font-mono text-gray-400 border border-white/10 shrink-0">1</span>
                                    Select Template
                                </div>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Start by choosing a pre-configured workflow template (e.g., <em>Standard Task</em>, <em>Research Sprint</em>) that matches your objective.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 md:bg-transparent md:border-none md:p-0">
                                <div className="text-lg font-bold text-white flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-sm font-mono text-gray-400 border border-white/10 shrink-0">2</span>
                                    Assign Operators
                                </div>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Define the execution team. Assign specific roles to each stage of the workflow to ensure accountability.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 md:bg-transparent md:border-none md:p-0">
                                <div className="text-lg font-bold text-white flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-sm font-mono text-gray-400 border border-white/10 shrink-0">3</span>
                                    Verify & Complete
                                </div>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    Monitor progress in real-time. Once tasks are submitted and verified, the workflow closes and rewards are distributed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Gamification */}
                <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-pink-500/20 shadow-md">
                    <div className="bg-[#050505]/95 backdrop-blur-xl rounded-[2.4rem] p-8 md:p-12 overflow-hidden relative">
                        <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                            <div className="flex-1 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-4 flex items-center gap-3">
                                        <Icons.Trophy className="w-8 h-8 text-yellow-500" /> Career & Gamification
                                    </h2>
                                    <p className="text-indigo-200/60 leading-relaxed max-w-lg text-lg">
                                        Level up your role. Earn <strong>XP</strong> for every completed task and unlock exclusive perks in the store.
                                    </p>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="text-2xl"><Icons.Crown className="w-8 h-8 text-yellow-400" /></div>
                                        <div>
                                            <strong className="text-white block">Elite Roles</strong>
                                            <span className="text-gray-500 text-sm">Become a Coordinator or Counselor.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                        <div className="text-2xl"><Icons.Diamond className="w-8 h-8 text-cyan-400" /></div>
                                        <div>
                                            <strong className="text-white block">Impact Points</strong>
                                            <span className="text-gray-400 text-sm">Currency for the Internal Store.</span>
                                        </div>
                                    </li>
                                </ul>
                                <div className="pt-2">
                                    <Link to="/career" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-black text-lg hover:scale-105 hover:shadow-lg transition-all">
                                        OPEN CAREER MAP
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Element */}
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                                    <div className="w-56 h-56 rounded-[2rem] bg-gradient-to-br from-[#111] to-black border border-white/10 flex flex-col items-center justify-center relative z-10 shadow-2xl">
                                        <Icons.Rocket className="w-24 h-24 text-white drop-shadow-md" />
                                        <span className="text-xs font-bold text-white/30 tracking-[0.3em] uppercase group-hover:text-white transition-colors">Initiate</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </PageTransition >
    );
};

// Refined Glass Card (Darker) - Simplified
const GuideCard = ({ title, icon, color, accent, link, description }) => (
    <Link
        to={link}
        className={`block h-full p-8 rounded-[2rem] bg-[#080808]/50 backdrop-blur-md border border-white/5 transition-all duration-200 group hover:-translate-y-1 hover:bg-white/[0.05] ${accent}`}
    >
        <div className="flex items-start justify-between mb-8">
            <div className={`w-18 h-18 p-4 rounded-2xl bg-gradient-to-br ${color} text-4xl shadow-lg shadow-black/50 border border-white/10`}>
                {icon}
            </div>
        </div>

        <h3 className="text-3xl font-bold text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
            {title}
        </h3>
        <p className="text-gray-400 text-base leading-relaxed font-normal opacity-70 group-hover:opacity-100 transition-opacity">
            {description}
        </p>
    </Link>
);

const SectionTitle = ({ title, icon }) => (
    <div className="flex items-center gap-4 mb-4 pl-2 opacity-80">
        <span className="text-2xl drop-shadow-md grayscale group-hover:grayscale-0">{icon}</span>
        <h2 className="text-2xl font-bold text-white tracking-tight drop-shadow-md">{title}</h2>
        <div className="h-px bg-gradient-to-r from-white/10 to-transparent flex-1" />
    </div>
);

export default Guide;
