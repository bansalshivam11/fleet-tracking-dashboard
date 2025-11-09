import { Play, Pause, RotateCcw } from 'lucide-react';

const PlaybackControls = ({ isPlaying, speed, onTogglePlay, onReset, onSpeedChange }) => (
    <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
                <button onClick={onTogglePlay}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md font-semibold">
                    {isPlaying ? <><Pause className="w-5 h-5" />Pause</> : <><Play className="w-5 h-5" />Play</>}
                </button>

                <button onClick={onReset}
                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all shadow-md font-semibold">
                    <RotateCcw className="w-5 h-5" />Reset
                </button>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-gray-700 font-semibold">Speed:</span>
                <div className="flex gap-2">
                    {[1, 5, 10, 50, 100].map(s => (
                        <button key={s} onClick={() => onSpeedChange(s)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                    speed === s ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}>
                            {s}x
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

export default PlaybackControls;
