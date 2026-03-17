import React from 'react';
import { Link } from 'react-router-dom';
import PageTransition from '../components/common/PageTransition';
import { Icons } from '../components/common/Icons';

// Vibrant & Alive Guide Page (Refined Dark Mode) - Performance Optimized
const Guide = () => {
    return (
        <PageTransition className="min-h-screen h-auto bg-transparent pb-24 relative">
            {/* Background Ambience - Simplified Light Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
                <div className="hidden md:block absolute top-[-10%] right-[-5%] w-[70%] h-[70%] bg-blue-100/30 blur-[150px] rounded-full mix-blend-multiply" />
                <div className="hidden md:block absolute bottom-[-10%] left-[-5%] w-[70%] h-[70%] bg-orange-50/40 blur-[150px] rounded-full mix-blend-multiply" />
                <div className="hidden md:block absolute top-[30%] left-[20%] w-[50%] h-[50%] bg-blue-50/50 blur-[120px] rounded-full mix-blend-multiply" />

                {/* Mobile Fallback Ambience (Lightweight) */}
                <div className="md:hidden absolute top-0 right-0 w-full h-full bg-gradient-to-b from-gray-50 via-transparent to-blue-50/20" />
            </div>

            <div className="max-w-6xl mx-auto space-y-16 px-6 md:px-8 animate-fade-in pt-32">
                {/* Welcome Header - Bright & Bold */}
                <div className="text-center space-y-6 pt-4 pb-8">
                    <h1 className="text-4xl md:text-6xl font-black text-[#1a2b4b] tracking-tight drop-shadow-sm">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1a2b4b] to-[#c0672a]">Associazione ARQtype</span>
                    </h1>

                    <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
                        Your journey begins here. Explore the ecosystem, <span className="text-[#1a2b4b] font-semibold border-b border-[#c0672a]/30">unlock your potential</span>, and build the future.
                    </p>
                </div>

                {/* Section 1: Core Navigation (Light Glass Cards) */}
                <div className="grid md:grid-cols-2 gap-8">
                    <GuideCard
                        title="Workflows"
                        icon={<Icons.Lightning className="w-10 h-10" />}
                        color="from-blue-50 to-blue-100"
                        iconColor="text-[#1a2b4b]"
                        accent="shadow-sm border-gray-200 hover:border-blue-300 hover:shadow-md"
                        link="/workflows"
                        description="Manage tasks and execute business processes with precision."
                    />
                    <GuideCard
                        title="Chat"
                        icon={<Icons.Chat className="w-10 h-10" />}
                        color="from-orange-50 to-orange-100"
                        iconColor="text-[#c0672a]"
                        accent="shadow-sm border-gray-200 hover:border-orange-300 hover:shadow-md"
                        link="/chat"
                        description="Real-time encrypted communication and collaboration hubs."
                    />
                </div>

                {/* Section 2: Resources & Knowledge */}
                <div className="space-y-8">
                    <SectionTitle title="Knowledge & Growth" icon={<Icons.Brain className="w-6 h-6 text-[#1a2b4b]" />} />

                    {/* Documents Link - Single Row */}
                    <Link to="/documents" className="block relative group p-8 rounded-3xl bg-white border border-gray-200 hover:border-[#1a2b4b]/30 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md">
                        <div className="absolute inset-0 bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="p-4 rounded-2xl bg-blue-50 text-4xl border border-blue-100 text-[#1a2b4b]">
                                <Icons.Folder className="w-10 h-10" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#1a2b4b] transition-colors mb-2">Web Source</h3>
                                <p className="text-gray-500 text-sm leading-relaxed group-hover:text-gray-700 transition-colors">Project docs & assets.</p>
                            </div>
                            <Icons.ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-[#1a2b4b] group-hover:translate-x-1 transition-all" />
                        </div>
                    </Link>
                </div>

                {/* NEW SECTION: INTERNAL WORKFLOW TRAINING */}
                <div className="mt-8 rounded-[2.5rem] bg-white border border-gray-200 shadow-sm overflow-hidden relative">
                    {/* Header */}
                    <div className="p-8 md:p-12 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-gray-50/50">
                        <div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
                                <Icons.Training className="w-8 h-8 text-[#c0672a]" />
                                SYSTEM TRAINING
                            </h2>
                            <p className="text-gray-600 max-w-xl text-lg">
                                <strong>Module 01:</strong> How to Launch and Manage a Workflow.
                            </p>
                        </div>
                    </div>

                    {/* Example Visual */}
                    <div className="px-6 md:px-12 pt-8 md:pt-12 pb-12 space-y-8 md:space-y-12">
                        {/* Video Placeholder - More compact on mobile */}
                        <div className="w-full aspect-[21/9] md:aspect-video bg-gray-100 rounded-2xl border border-gray-200 relative overflow-hidden group cursor-not-allowed shadow-inner">
                            {/* Placeholder Content */}
                            <div className="absolute inset-0 flex items-start pt-8 md:pt-0 md:items-center justify-center">
                                <div className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-white/80 backdrop-blur-md border border-gray-200 shadow-sm">
                                    <span className="text-gray-500 font-mono text-xs md:text-sm tracking-widest uppercase font-semibold">Video Coming Soon</span>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 bg-gradient-to-t from-gray-900/60 to-transparent">
                                <span className="text-[10px] md:text-xs font-mono text-white uppercase tracking-widest mb-1 block drop-shadow-sm shadow-black">Tutorial Video</span>
                                <h3 className="text-lg md:text-xl font-bold text-white leading-tight drop-shadow-sm shadow-black">Mastering the Workflow Engine</h3>
                            </div>

                            {/* Decorative Grid Background */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-50 pointer-events-none" />
                        </div>

                        {/* Step-by-Step Guide - Vertical Stack on Mobile */}
                        <div className="flex flex-col md:grid md:grid-cols-3 gap-8">
                            {/* Step 1 */}
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 md:bg-transparent md:border-none md:p-0">
                                <div className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-sm font-bold font-mono text-[#1a2b4b] border border-blue-100 shrink-0">1</span>
                                    Select Template
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Start by choosing a pre-configured workflow template (e.g., <em>Standard Task</em>, <em>Research Sprint</em>) that matches your objective.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 md:bg-transparent md:border-none md:p-0">
                                <div className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-sm font-bold font-mono text-[#1a2b4b] border border-blue-100 shrink-0">2</span>
                                    Assign Operators
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Define the execution team. Assign specific roles to each stage of the workflow to ensure accountability.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 md:bg-transparent md:border-none md:p-0">
                                <div className="text-lg font-bold text-gray-900 flex items-center gap-3 mb-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-sm font-bold font-mono text-[#1a2b4b] border border-blue-100 shrink-0">3</span>
                                    Verify & Complete
                                </div>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    Monitor progress in real-time. Once tasks are submitted and verified, the workflow closes and rewards are distributed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: Gamification */}
                <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-r from-[#1a2b4b]/20 to-[#c0672a]/20 shadow-md">
                    <div className="bg-white rounded-[2.4rem] p-8 md:p-12 overflow-hidden relative">
                        <div className="flex flex-col md:flex-row gap-12 items-center relative z-10">
                            <div className="flex-1 space-y-8">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                                        <Icons.Trophy className="w-8 h-8 text-[#c0672a]" /> Career & Gamification
                                    </h2>
                                    <p className="text-gray-600 leading-relaxed max-w-lg text-lg">
                                        Level up your role. Earn <strong>XP</strong> for every completed task and unlock exclusive perks in the store.
                                    </p>
                                </div>
                                <ul className="space-y-4">
                                    <li className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                        <div className="text-2xl"><Icons.Crown className="w-8 h-8 text-[#c0672a]" /></div>
                                        <div>
                                            <strong className="text-gray-900 block">Elite Roles</strong>
                                            <span className="text-gray-500 text-sm">Become a Coordinator or Counselor.</span>
                                        </div>
                                    </li>
                                    <li className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                        <div className="text-2xl"><Icons.Diamond className="w-8 h-8 text-[#1a2b4b]" /></div>
                                        <div>
                                            <strong className="text-gray-900 block">Impact Points</strong>
                                            <span className="text-gray-500 text-sm">Currency for the Internal Store.</span>
                                        </div>
                                    </li>
                                </ul>
                                <div className="pt-2">
                                    <Link to="/career" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#1a2b4b] text-white font-black text-lg hover:bg-[#c0672a] hover:shadow-lg transition-all">
                                        OPEN CAREER MAP
                                        <Icons.ArrowRight className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>

                            {/* Visual Element */}
                            <div className="w-full md:w-1/3 flex justify-center">
                                <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300">
                                    <div className="w-56 h-56 rounded-[2rem] bg-gradient-to-br from-blue-50 to-orange-50 border border-gray-200 flex flex-col items-center justify-center relative z-10 shadow-xl">
                                        <Icons.Rocket className="w-24 h-24 text-[#1a2b4b] drop-shadow-sm group-hover:text-[#c0672a] transition-colors" />
                                        <span className="text-xs font-bold text-gray-400 tracking-[0.3em] uppercase group-hover:text-[#1a2b4b] transition-colors mt-2">Initiate</span>
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

// Refined Glass Card (Light) - Simplified
const GuideCard = ({ title, icon, color, iconColor, accent, link, description }) => (
    <Link
        to={link}
        className={`block h-full p-8 rounded-[2rem] bg-white border border-gray-100 transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${accent}`}
    >
        <div className="flex items-start justify-between mb-8">
            <div className={`w-18 h-18 p-4 rounded-2xl bg-gradient-to-br ${color} ${iconColor} text-4xl shadow-sm border border-gray-100`}>
                {icon}
            </div>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#1a2b4b] transition-colors">
            {title}
        </h3>
        <p className="text-gray-500 text-base leading-relaxed font-normal group-hover:text-gray-700 transition-colors">
            {description}
        </p>
    </Link>
);

const SectionTitle = ({ title, icon }) => (
    <div className="flex items-center gap-4 mb-4 pl-2">
        <span className="text-2xl drop-shadow-sm">{icon}</span>
        <h2 className="text-2xl font-bold text-[#1a2b4b] tracking-tight">{title}</h2>
        <div className="h-px bg-gradient-to-r from-gray-200 to-transparent flex-1" />
    </div>
);

export default Guide;
