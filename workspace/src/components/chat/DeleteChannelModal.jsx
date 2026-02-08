import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

export default function DeleteChannelModal({ isOpen, onClose, onConfirm, channelName }) {
    if (!isOpen) return null;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-500/10 rounded-full mb-4">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>

                                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-white text-center">
                                    Delete Channel
                                </Dialog.Title>

                                <div className="mt-2 text-center">
                                    <p className="text-sm text-gray-400">
                                        Are you sure you want to delete <span className="text-white font-semibold">"{channelName}"</span>?
                                    </p>
                                    <p className="text-xs text-red-400 mt-2 bg-red-500/5 p-2 rounded border border-red-500/20">
                                        Warning: This action cannot be undone. All messages and files in this channel will be permanently deleted.
                                    </p>
                                </div>

                                <div className="mt-6 flex justify-center gap-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-xl px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 border border-red-500 shadow-lg shadow-red-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                                        onClick={onConfirm}
                                    >
                                        Delete Channel
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
